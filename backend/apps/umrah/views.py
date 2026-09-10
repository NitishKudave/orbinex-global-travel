import uuid
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiTypes
from apps.core_bookings.models import Booking
from .models import UmrahPackage, UmrahHotel, UmrahBooking
from .serializers import UmrahPackageSerializer, UmrahBookingSerializer

class UmrahPackageListView(generics.ListAPIView):
    serializer_class = UmrahPackageSerializer
    permission_classes = (permissions.AllowAny,)

    @extend_schema(
        summary="List Umrah pilgrimage packages",
        parameters=[
            OpenApiParameter('tier', OpenApiTypes.STR, description='vip_luxury, classic_premium, economy_saver, ramadan_special')
        ]
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        qs = UmrahPackage.objects.all().select_related('makkah_hotel', 'madinah_hotel')
        tier = self.request.query_params.get('tier')
        if tier:
            qs = qs.filter(tier=tier)
        return qs.order_by('price_double')


class UmrahPackageDetailView(generics.RetrieveAPIView):
    queryset = UmrahPackage.objects.all().select_related('makkah_hotel', 'madinah_hotel')
    serializer_class = UmrahPackageSerializer
    permission_classes = (permissions.AllowAny,)


class UmrahPackageBookingView(APIView):
    permission_classes = (permissions.AllowAny,)

    @extend_schema(
        summary="Book an Umrah pilgrimage package",
        responses={201: UmrahBookingSerializer}
    )
    def post(self, request):
        data = request.data
        package_id = data.get('package_id')
        departure_date = data.get('departure_date')
        pilgrims_count = int(data.get('pilgrims_count', 2))
        room_type = data.get('room_type', 'Double Sharing')
        need_visa = data.get('need_visa_assistance', True)
        contact_name = data.get('contact_name', 'Pilgrim Lead')
        contact_email = data.get('contact_email', 'pilgrim@example.com')
        contact_phone = data.get('contact_phone', '+1234567890')
        special_requests = data.get('special_requirements', '')
        currency = data.get('currency', 'USD')

        try:
            package = UmrahPackage.objects.get(id=package_id)
        except UmrahPackage.DoesNotExist:
            return Response({"error": "Umrah package not found"}, status=status.HTTP_404_NOT_FOUND)

        unit_price = package.price_double if room_type == 'Double Sharing' else (package.price_triple if room_type == 'Triple Sharing' else package.price_quad)
        total_amount = unit_price * pilgrims_count

        user = request.user if request.user.is_authenticated else None

        booking = Booking.objects.create(
            user=user,
            booking_type='umrah',
            title=f"Umrah: {package.title}",
            summary=f"{package.duration_days} Days ({package.makkah_nights}N Makkah + {package.madinah_nights}N Madinah) • {pilgrims_count} Pilgrim(s)",
            total_amount=total_amount,
            final_amount=total_amount,
            currency=currency,
            contact_name=contact_name,
            contact_email=contact_email,
            contact_phone=contact_phone,
            travel_date=departure_date,
            details_json={
                "package_title": package.title,
                "tier": package.get_tier_display(),
                "makkah_hotel": package.makkah_hotel.name,
                "makkah_distance": package.makkah_hotel.distance_from_haram,
                "madinah_hotel": package.madinah_hotel.name,
                "madinah_distance": package.madinah_hotel.distance_from_haram,
                "pilgrims_count": pilgrims_count,
                "room_type": room_type,
                "visa_assistance": need_visa,
                "special_requests": special_requests
            },
            status='confirmed',
            payment_status='paid'
        )

        umrah_booking = UmrahBooking.objects.create(
            booking=booking,
            package=package,
            departure_date=departure_date,
            pilgrims_count=pilgrims_count,
            room_type=room_type,
            need_visa_assistance=need_visa,
            special_requirements=special_requests
        )

        return Response({
            "message": "Umrah package booked successfully!",
            "booking_reference": booking.booking_reference,
            "umrah_booking": UmrahBookingSerializer(umrah_booking).data
        }, status=status.HTTP_201_CREATED)
