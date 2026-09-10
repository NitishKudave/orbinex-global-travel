import uuid
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiTypes
from apps.core_bookings.models import Booking
from .models import MedicalSpecialty, MedicalHospital, MedicalPackage, MedicalEnquiry
from .serializers import (
    MedicalSpecialtySerializer,
    MedicalHospitalSerializer,
    MedicalPackageSerializer,
    MedicalEnquirySerializer
)

class MedicalSpecialtyListView(generics.ListAPIView):
    queryset = MedicalSpecialty.objects.all()
    serializer_class = MedicalSpecialtySerializer
    permission_classes = (permissions.AllowAny,)


class MedicalHospitalListView(generics.ListAPIView):
    serializer_class = MedicalHospitalSerializer
    permission_classes = (permissions.AllowAny,)

    @extend_schema(
        summary="List hospitals with country filter",
        parameters=[
            OpenApiParameter('country', OpenApiTypes.STR, description='Country filter (e.g. India, Thailand, Turkey)')
        ]
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        qs = MedicalHospital.objects.all().prefetch_related('specialties')
        country = self.request.query_params.get('country')
        specialty_id = self.request.query_params.get('specialty')

        if country:
            qs = qs.filter(country__icontains=country)
        if specialty_id:
            qs = qs.filter(specialties__id=specialty_id)

        return qs.order_by('-featured', 'name')


class MedicalPackageListView(generics.ListAPIView):
    serializer_class = MedicalPackageSerializer
    permission_classes = (permissions.AllowAny,)

    @extend_schema(
        summary="List treatment packages",
        parameters=[
            OpenApiParameter('country', OpenApiTypes.STR, description='Hospital country'),
            OpenApiParameter('specialty', OpenApiTypes.INT, description='Specialty ID')
        ]
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        qs = MedicalPackage.objects.all().select_related('hospital', 'specialty')
        country = self.request.query_params.get('country')
        specialty_id = self.request.query_params.get('specialty')

        if country:
            qs = qs.filter(hospital__country__icontains=country)
        if specialty_id:
            qs = qs.filter(specialty__id=specialty_id)

        return qs.order_by('estimated_cost_usd')


class MedicalEnquirySubmitView(APIView):
    permission_classes = (permissions.AllowAny,)

    @extend_schema(
        summary="Submit a medical tourism enquiry with report uploads",
        responses={201: MedicalEnquirySerializer}
    )
    def post(self, request):
        data = request.data
        hospital_id = data.get('hospital_id')
        treatment_name = data.get('treatment_name', 'General Medical Consultation')
        country_preference = data.get('country_preference', 'India')
        patient_name = data.get('patient_name', 'Patient')
        patient_age = int(data.get('patient_age', 40))
        patient_gender = data.get('patient_gender', 'male')
        contact_email = data.get('contact_email', 'patient@example.com')
        contact_phone = data.get('contact_phone', '+1234567890')
        medical_condition = data.get('medical_condition_summary', 'Seeking second opinion and quotation')
        reports = data.get('medical_reports', [])

        hospital = None
        if hospital_id:
            try:
                hospital = MedicalHospital.objects.get(id=hospital_id)
            except MedicalHospital.DoesNotExist:
                pass

        user = request.user if request.user.is_authenticated else None

        booking = Booking.objects.create(
            user=user,
            booking_type='medical_tourism',
            title=f"Medical Tourism: {treatment_name}",
            summary=f"Patient: {patient_name} ({patient_age} yrs) • Preferred: {country_preference} • Status: Under Review",
            total_amount=0.00,
            final_amount=0.00,
            currency='USD',
            contact_name=patient_name,
            contact_email=contact_email,
            contact_phone=contact_phone,
            details_json={
                "treatment_name": treatment_name,
                "hospital": hospital.name if hospital else "Multi-Hospital Concierge Request",
                "country": country_preference,
                "patient_name": patient_name,
                "patient_age": patient_age,
                "patient_gender": patient_gender,
                "condition_summary": medical_condition,
                "reports_count": len(reports)
            },
            status='processing',
            payment_status='paid'
        )

        enquiry = MedicalEnquiry.objects.create(
            booking=booking,
            hospital=hospital,
            treatment_name=treatment_name,
            country_preference=country_preference,
            patient_name=patient_name,
            patient_age=patient_age,
            patient_gender=patient_gender,
            contact_email=contact_email,
            contact_phone=contact_phone,
            medical_condition_summary=medical_condition,
            medical_reports_json=reports,
            status='enquiry_received',
            doctor_opinion_notes='Medical records received. Senior doctor panel is evaluating treatment options and tailored quote.'
        )

        return Response({
            "message": "Medical inquiry submitted successfully! A medical travel coordinator will contact you within 24 hours.",
            "booking_reference": booking.booking_reference,
            "enquiry_reference": enquiry.enquiry_reference,
            "enquiry": MedicalEnquirySerializer(enquiry).data
        }, status=status.HTTP_201_CREATED)
