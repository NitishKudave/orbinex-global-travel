import uuid
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiTypes
from apps.core_bookings.models import Booking
from .models import VisaCountry, VisaType, VisaApplication
from .serializers import VisaCountrySerializer, VisaTypeSerializer, VisaApplicationSerializer

class VisaCountryListView(generics.ListAPIView):
    serializer_class = VisaCountrySerializer
    permission_classes = (permissions.AllowAny,)

    @extend_schema(summary="List all supported visa countries")
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        qs = VisaCountry.objects.all().prefetch_related('visa_types')
        search = self.request.query_params.get('q')
        if search:
            qs = qs.filter(Q(country_name__icontains=search) | Q(country_code__icontains=search))
        return qs.order_by('country_name')


class VisaCountryDetailView(generics.RetrieveAPIView):
    queryset = VisaCountry.objects.all().prefetch_related('visa_types')
    serializer_class = VisaCountrySerializer
    permission_classes = (permissions.AllowAny,)
    lookup_field = 'country_code'


class VisaApplicationSubmitView(APIView):
    permission_classes = (permissions.AllowAny,)

    @extend_schema(
        summary="Submit a visa application with documents",
        responses={201: VisaApplicationSerializer}
    )
    def post(self, request):
        data = request.data
        country_id = data.get('country_id')
        visa_type_id = data.get('visa_type_id')
        applicant_name = data.get('applicant_full_name', 'Applicant')
        passport_number = data.get('passport_number', 'P1234567')
        passport_expiry = data.get('passport_expiry')
        nationality = data.get('nationality', 'United States')
        travel_date = data.get('travel_date')
        contact_email = data.get('contact_email', 'applicant@example.com')
        contact_phone = data.get('contact_phone', '+1234567890')
        passport_copy = data.get('passport_copy_url', 'https://images.unsplash.com/photo-1544717305-2782549b5136')
        photo_url = data.get('photo_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb')
        supporting_docs = data.get('supporting_docs', [])
        currency = data.get('currency', 'USD')

        try:
            country = VisaCountry.objects.get(id=country_id)
            v_type = VisaType.objects.get(id=visa_type_id, country=country)
        except (VisaCountry.DoesNotExist, VisaType.DoesNotExist):
            return Response({"error": "Visa country or type not found"}, status=status.HTTP_404_NOT_FOUND)

        user = request.user if request.user.is_authenticated else None

        booking = Booking.objects.create(
            user=user,
            booking_type='visa',
            title=f"Visa Assistance: {country.country_name} ({v_type.title})",
            summary=f"{country.flag_emoji} {country.country_name} • {v_type.entry_type} • Processing: {country.processing_time_days}",
            total_amount=v_type.total_fee,
            final_amount=v_type.total_fee,
            currency=currency,
            contact_name=applicant_name,
            contact_email=contact_email,
            contact_phone=contact_phone,
            travel_date=travel_date,
            details_json={
                "country": country.country_name,
                "visa_type": v_type.title,
                "applicant_name": applicant_name,
                "passport_number": passport_number,
                "nationality": nationality,
                "processing_time": country.processing_time_days,
                "entry_type": v_type.entry_type
            },
            status='confirmed',
            payment_status='paid'
        )

        visa_app = VisaApplication.objects.create(
            booking=booking,
            visa_country=country,
            visa_type=v_type,
            applicant_full_name=applicant_name,
            passport_number=passport_number,
            passport_expiry=passport_expiry,
            nationality=nationality,
            travel_date=travel_date,
            passport_copy_url=passport_copy,
            photo_url=photo_url,
            supporting_docs_json=supporting_docs,
            status='submitted',
            embassy_remarks='Application received and assigned to visa specialist for document verification.'
        )

        return Response({
            "message": "Visa application submitted successfully!",
            "booking_reference": booking.booking_reference,
            "application_reference": visa_app.application_reference,
            "application": VisaApplicationSerializer(visa_app).data
        }, status=status.HTTP_201_CREATED)


class VisaApplicationTrackView(APIView):
    permission_classes = (permissions.AllowAny,)

    @extend_schema(
        summary="Track status of a visa application by reference ID",
        responses={200: VisaApplicationSerializer}
    )
    def get(self, request, reference):
        try:
            app = VisaApplication.objects.select_related('visa_country', 'visa_type', 'booking').get(
                Q(application_reference__iexact=reference) | Q(booking__booking_reference__iexact=reference)
            )
            return Response(VisaApplicationSerializer(app).data)
        except VisaApplication.DoesNotExist:
            return Response({"error": "Visa application not found with given reference"}, status=status.HTTP_404_NOT_FOUND)
