import uuid
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiTypes
from apps.core_bookings.models import Booking
from .models import EuropamundoTour, TourDeparture
from .serializers import (
    EuropamundoTourListSerializer,
    EuropamundoTourDetailSerializer,
    TourDepartureSerializer
)

class EuropamundoTourListView(generics.ListAPIView):
    serializer_class = EuropamundoTourListSerializer
    permission_classes = (permissions.AllowAny,)

    @extend_schema(
        summary="List Europamundo guided tours",
        parameters=[
            OpenApiParameter('country', OpenApiTypes.STR, description='Country filter'),
            OpenApiParameter('max_price', OpenApiTypes.FLOAT, description='Maximum price USD')
        ]
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        qs = EuropamundoTour.objects.all()
        country = self.request.query_params.get('country')
        max_price = self.request.query_params.get('max_price')

        if country:
            qs = qs.filter(cities_visited__icontains=country)
        if max_price:
            qs = qs.filter(price_usd__lte=float(max_price))

        return qs.order_by('price_usd')


class EuropamundoTourDetailView(generics.RetrieveAPIView):
    queryset = EuropamundoTour.objects.all().prefetch_related('stops', 'departures')
    serializer_class = EuropamundoTourDetailSerializer
    permission_classes = (permissions.AllowAny,)


class EuropamundoTourBookingView(APIView):
    permission_classes = (permissions.AllowAny,)

    @extend_schema(
        summary="Book a Europamundo circuit tour",
        responses={201: EuropamundoTourDetailSerializer}
    )
    def post(self, request):
        data = request.data
        tour_id = data.get('tour_id')
        departure_date = data.get('departure_date')
        travelers_count = int(data.get('travelers_count', 2))
        contact_name = data.get('contact_name', 'Tour Leader')
        contact_email = data.get('contact_email', 'traveler@example.com')
        contact_phone = data.get('contact_phone', '+1234567890')
        audio_language = data.get('audio_language', 'English')
        currency = data.get('currency', 'USD')

        try:
            tour = EuropamundoTour.objects.get(id=tour_id)
        except EuropamundoTour.DoesNotExist:
            return Response({"error": "Europamundo tour not found"}, status=status.HTTP_404_NOT_FOUND)

        total_amount = tour.price_usd * travelers_count

        user = request.user if request.user.is_authenticated else None

        booking = Booking.objects.create(
            user=user,
            booking_type='europamundo',
            title=f"Europamundo Circuit: {tour.title}",
            summary=f"{tour.duration_days} Days Circuit • {travelers_count} Passenger(s) • Cities: {tour.cities_visited}",
            total_amount=total_amount,
            final_amount=total_amount,
            currency=currency,
            contact_name=contact_name,
            contact_email=contact_email,
            contact_phone=contact_phone,
            travel_date=departure_date,
            details_json={
                "tour_code": tour.tour_code,
                "tour_title": tour.title,
                "duration": f"{tour.duration_days} Days / {tour.duration_nights} Nights",
                "cities_visited": tour.cities_visited,
                "bus_type": tour.bus_type,
                "hotel_category": tour.hotel_category,
                "audio_language": audio_language,
                "travelers_count": travelers_count
            },
            status='confirmed',
            payment_status='paid'
        )

        return Response({
            "message": "Europamundo tour circuit booked successfully!",
            "booking_reference": booking.booking_reference,
            "tour_details": EuropamundoTourDetailSerializer(tour).data
        }, status=status.HTTP_201_CREATED)
