import uuid
from datetime import date
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiTypes
from apps.core_bookings.models import Booking
from .models import InsuranceProvider, InsurancePlan, InsurancePolicy
from .serializers import InsurancePlanSerializer, InsurancePolicySerializer

class InsurancePlanListView(generics.ListAPIView):
    serializer_class = InsurancePlanSerializer
    permission_classes = (permissions.AllowAny,)

    @extend_schema(
        summary="List insurance plans with region filter",
        parameters=[
            OpenApiParameter('region', OpenApiTypes.STR, description='worldwide, worldwide_ex_us, schengen, asia')
        ]
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        qs = InsurancePlan.objects.all().select_related('provider')
        region = self.request.query_params.get('region')
        if region:
            qs = qs.filter(region=region)
        return qs.order_by('-is_bestseller', 'flat_price')


class InsurancePlanDetailView(generics.RetrieveAPIView):
    queryset = InsurancePlan.objects.all().select_related('provider')
    serializer_class = InsurancePlanSerializer
    permission_classes = (permissions.AllowAny,)


class InsurancePolicyPurchaseView(APIView):
    permission_classes = (permissions.AllowAny,)

    @extend_schema(
        summary="Purchase travel insurance policy and generate certificate",
        responses={201: InsurancePolicySerializer}
    )
    def post(self, request):
        data = request.data
        plan_id = data.get('plan_id')
        destination_country = data.get('destination_country', 'Worldwide')
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        duration_days = int(data.get('duration_days', 7))
        insured_persons = data.get('insured_persons', [])
        contact_name = data.get('contact_name', 'Insured')
        contact_email = data.get('contact_email', 'traveler@example.com')
        contact_phone = data.get('contact_phone', '+1234567890')
        total_amount = float(data.get('total_amount', 45.00))
        currency = data.get('currency', 'USD')

        try:
            plan = InsurancePlan.objects.get(id=plan_id)
        except InsurancePlan.DoesNotExist:
            return Response({"error": "Insurance plan not found"}, status=status.HTTP_404_NOT_FOUND)

        user = request.user if request.user.is_authenticated else None

        booking = Booking.objects.create(
            user=user,
            booking_type='insurance',
            title=f"Travel Insurance: {plan.plan_name}",
            summary=f"Coverage: {plan.medical_coverage_amount} • Destination: {destination_country} • {duration_days} Days",
            total_amount=total_amount,
            final_amount=total_amount,
            currency=currency,
            contact_name=contact_name,
            contact_email=contact_email,
            contact_phone=contact_phone,
            travel_date=start_date,
            return_date=end_date,
            details_json={
                "plan_name": plan.plan_name,
                "provider": plan.provider.name,
                "destination": destination_country,
                "start_date": start_date,
                "end_date": end_date,
                "duration_days": duration_days,
                "medical_coverage": plan.medical_coverage_amount,
                "insured_persons": insured_persons,
                "emergency_phone": plan.provider.emergency_assistance_phone
            },
            status='confirmed',
            payment_status='paid'
        )

        policy = InsurancePolicy.objects.create(
            booking=booking,
            plan=plan,
            insured_persons=insured_persons,
            destination_country=destination_country,
            start_date=start_date,
            end_date=end_date,
            duration_days=duration_days,
            policy_number=f"POL-{uuid.uuid4().hex[:9].upper()}"
        )

        return Response({
            "message": "Insurance policy issued successfully!",
            "booking_reference": booking.booking_reference,
            "policy_number": policy.policy_number,
            "policy": InsurancePolicySerializer(policy).data
        }, status=status.HTTP_201_CREATED)
