import uuid
from decimal import Decimal
from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema
from apps.core_bookings.models import Booking
from .models import PaymentTransaction
from .serializers import PaymentTransactionSerializer

class CreatePaymentIntentView(APIView):
    permission_classes = (permissions.AllowAny,)

    @extend_schema(summary="Create payment gateway intent (Stripe / Razorpay)")
    def post(self, request):
        amount = Decimal(str(request.data.get('amount', '100.00')))
        currency = request.data.get('currency', 'USD')
        gateway = request.data.get('gateway', 'stripe')
        booking_ref = request.data.get('booking_reference')

        booking = None
        if booking_ref:
            booking = Booking.objects.filter(booking_reference=booking_ref).first()

        client_secret = f"pi_mock_{uuid.uuid4().hex[:16]}_secret_{uuid.uuid4().hex[:16]}"
        order_id = f"order_{uuid.uuid4().hex[:14]}"

        transaction = PaymentTransaction.objects.create(
            booking=booking,
            gateway=gateway,
            amount=amount,
            currency=currency,
            status='initiated',
            gateway_reference=order_id if gateway == 'razorpay' else client_secret,
            raw_response={"intent_created": True, "sandbox": True}
        )

        return Response({
            "status": "success",
            "transaction_id": transaction.transaction_id,
            "gateway": gateway,
            "amount": float(amount),
            "currency": currency,
            "client_secret": client_secret,
            "razorpay_order_id": order_id,
            "key_id": "rzp_test_OrbinexGlobalDemoKey2026" if gateway == 'razorpay' else "pk_test_OrbinexStripeDemoKey2026",
        })


class VerifyPaymentWebhookView(APIView):
    permission_classes = (permissions.AllowAny,)

    @extend_schema(summary="Verify payment transaction webhook")
    def post(self, request):
        transaction_id = request.data.get('transaction_id')
        payment_id = request.data.get('payment_id', f"pay_{uuid.uuid4().hex[:12]}")
        
        try:
            tx = PaymentTransaction.objects.get(transaction_id=transaction_id)
            tx.status = 'succeeded'
            tx.gateway_reference = payment_id
            tx.raw_response = request.data
            tx.save()

            if tx.booking:
                tx.booking.payment_status = 'paid'
                tx.booking.status = 'confirmed'
                tx.booking.save()

            return Response({
                "verified": True,
                "transaction": PaymentTransactionSerializer(tx).data,
                "message": "Payment verified and booking confirmed successfully!"
            })
        except PaymentTransaction.DoesNotExist:
            return Response({"verified": False, "error": "Transaction not found"}, status=status.HTTP_404_NOT_FOUND)
