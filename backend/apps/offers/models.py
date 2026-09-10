from django.db import models

class CouponCode(models.Model):
    DISCOUNT_TYPE_CHOICES = (
        ('percentage', 'Percentage Off (%)'),
        ('flat', 'Flat Amount Off ($)'),
    )
    MODULE_CHOICES = (
        ('all', 'All Travel Modules'),
        ('flight', 'Flights Only'),
        ('hotel', 'Hotels Only'),
        ('holiday', 'Holiday Packages Only'),
        ('visa', 'Visa Only'),
        ('insurance', 'Insurance Only'),
    )

    code = models.CharField(max_length=50, unique=True, db_index=True)
    title = models.CharField(max_length=150) # e.g. "FLAT $50 OFF on International Flights"
    description = models.TextField()
    discount_type = models.CharField(max_length=20, choices=DISCOUNT_TYPE_CHOICES, default='percentage')
    discount_value = models.DecimalField(max_digits=8, decimal_places=2, default=15.00)
    
    max_discount_amount = models.DecimalField(max_digits=8, decimal_places=2, default=100.00)
    min_booking_amount = models.DecimalField(max_digits=8, decimal_places=2, default=200.00)
    applicable_module = models.CharField(max_length=20, choices=MODULE_CHOICES, default='all')
    
    bank_partner = models.CharField(max_length=100, blank=True, null=True, help_text="e.g. HDFC, Chase, Amex, Citi")
    badge_text = models.CharField(max_length=50, default='INSTANT DISCOUNT')
    is_active = models.BooleanField(default=True)
    expires_at = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.code} - {self.title}"


class PromotionalDeal(models.Model):
    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=255)
    category = models.CharField(max_length=50, default='flight') # flight, hotel, holiday, bank
    coupon_code = models.ForeignKey(CouponCode, on_delete=models.SET_NULL, null=True, blank=True, related_name='deals')
    image_url = models.CharField(max_length=500)
    cta_link = models.CharField(max_length=100, default='/flights')
    is_featured = models.BooleanField(default=True)

    def __str__(self):
        return self.title
