import uuid
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiTypes
from apps.core_bookings.models import Booking
from .models import ForexRate, EsimPackage, AirportLounge
from .serializers import ForexRateSerializer, EsimPackageSerializer, AirportLoungeSerializer

class ForexRateListView(generics.ListAPIView):
    queryset = ForexRate.objects.all()
    serializer_class = ForexRateSerializer
    permission_classes = (permissions.AllowAny,)


class EsimPackageListView(generics.ListAPIView):
    serializer_class = EsimPackageSerializer
    permission_classes = (permissions.AllowAny,)

    @extend_schema(
        summary="List eSIM data packages",
        parameters=[
            OpenApiParameter('country', OpenApiTypes.STR, description='Country or region name')
        ]
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        qs = EsimPackage.objects.all()
        country = self.request.query_params.get('country')
        if country:
            qs = qs.filter(country_or_region__icontains=country)
        return qs.order_by('price_usd')


class AirportLoungeListView(generics.ListAPIView):
    serializer_class = AirportLoungeSerializer
    permission_classes = (permissions.AllowAny,)

    @extend_schema(
        summary="List airport lounges",
        parameters=[
            OpenApiParameter('airport', OpenApiTypes.STR, description='Airport IATA code (e.g. DXB, LHR, JFK)')
        ]
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        qs = AirportLounge.objects.all()
        airport = self.request.query_params.get('airport')
        if airport:
            qs = qs.filter(airport_code__iexact=airport)
        return qs.order_by('airport_code')


class UtilityBookingView(APIView):
    permission_classes = (permissions.AllowAny,)

    @extend_schema(summary="Book travel utility (eSIM, Forex Card, Lounge Pass)")
    def post(self, request):
        data = request.data
        utility_type = data.get('utility_type', 'esim')
        title = data.get('title', 'Travel Utility Service')
        contact_name = data.get('contact_name', 'Customer')
        contact_email = data.get('contact_email', 'customer@example.com')
        contact_phone = data.get('contact_phone', '+1234567890')
        total_amount = float(data.get('total_amount', 25.00))
        details = data.get('details', {})
        currency = data.get('currency', 'USD')

        user = request.user if request.user.is_authenticated else None

        booking = Booking.objects.create(
            user=user,
            booking_type='utility',
            title=f"Travel Utility: {title}",
            summary=f"Type: {utility_type.upper()} • Status: Active / Instant Delivery",
            total_amount=total_amount,
            final_amount=total_amount,
            currency=currency,
            contact_name=contact_name,
            contact_email=contact_email,
            contact_phone=contact_phone,
            details_json=details,
            status='confirmed',
            payment_status='paid'
        )

        return Response({
            "message": "Utility service processed successfully!",
            "booking_reference": booking.booking_reference,
            "qr_code_demo": f"https://api.qrserver.com/v1/create-qr-code/?size=250x250&data={booking.booking_reference}"
        }, status=status.HTTP_201_CREATED)
