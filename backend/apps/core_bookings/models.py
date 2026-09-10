import uuid
from django.db import models
from django.conf import settings

class Booking(models.Model):
    BOOKING_TYPE_CHOICES = (
        ('flight', 'Flight Booking'),
        ('hotel', 'Hotel Booking'),
        ('bus', 'Bus Booking'),
        ('visa', 'Visa Application'),
        ('insurance', 'Travel Insurance Policy'),
        ('holiday', 'Holiday Package Tour'),
        ('umrah', 'Umrah Pilgrimage Package'),
        ('medical_tourism', 'Medical Tourism Package'),
        ('europamundo', 'Europamundo Tour Circuit'),
        ('utility', 'Travel Utility (eSIM/Forex/Lounge)'),
        ('mixed', 'Unified Multi-Item Booking'),
    )

    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('processing', 'Processing / Under Review'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('refunded', 'Refunded'),
    )

    PAYMENT_STATUS_CHOICES = (
        ('unpaid', 'Unpaid'),
        ('paid', 'Paid'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    )

    booking_reference = models.CharField(max_length=50, unique=True, db_index=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='all_bookings', null=True, blank=True)
    booking_type = models.CharField(max_length=30, choices=BOOKING_TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='confirmed')
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='paid')
    
    # Financial details
    currency = models.CharField(max_length=5, default='USD')
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    discount_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    final_amount = models.DecimalField(max_digits=12, decimal_places=2)
    coupon_code = models.CharField(max_length=50, blank=True, null=True)
    
    # Primary contact
    contact_name = models.CharField(max_length=150)
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=30)
    
    # Polymorphic metadata payload (stored for aggregated display in dashboard)
    title = models.CharField(max_length=255, default='Travel Booking')
    summary = models.TextField(blank=True, null=True)
    details_json = models.JSONField(default=dict, blank=True)
    
    # Timestamps
    travel_date = models.DateField(null=True, blank=True)
    return_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"[{self.booking_type.upper()}] {self.booking_reference} - {self.contact_name} ({self.status})"

    def save(self, *args, **kwargs):
        if not self.booking_reference:
            self.booking_reference = f"ORB-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)
