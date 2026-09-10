import uuid
from django.db import models
from apps.core_bookings.models import Booking

class PaymentTransaction(models.Model):
    GATEWAY_CHOICES = (
        ('stripe', 'Stripe Payments'),
        ('razorpay', 'Razorpay Gateway'),
        ('apple_pay', 'Apple Pay / Google Pay'),
        ('netbanking', 'Direct Net Banking / Wire'),
    )
    STATUS_CHOICES = (
        ('initiated', 'Initiated'),
        ('succeeded', 'Succeeded'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    )

    transaction_id = models.CharField(max_length=100, unique=True, db_index=True)
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='payment_transactions', null=True, blank=True)
    gateway = models.CharField(max_length=30, choices=GATEWAY_CHOICES, default='stripe')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=5, default='USD')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='succeeded')
    gateway_reference = models.CharField(max_length=100, blank=True, null=True) # e.g. pi_3MtwBwLkdIwHu7ix28a3tqPa or pay_K4n8g7e9
    raw_response = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.transaction_id} ({self.gateway}) - {self.currency} {self.amount} [{self.status}]"

    def save(self, *args, **kwargs):
        if not self.transaction_id:
            self.transaction_id = f"TXN-{uuid.uuid4().hex[:12].upper()}"
        super().save(*args, **kwargs)
