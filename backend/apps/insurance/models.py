import uuid
from django.db import models
from django.conf import settings
from apps.core_bookings.models import Booking

class InsuranceProvider(models.Model):
    name = models.CharField(max_length=150) # e.g. "Allianz Global Assistance", "AIG Travel Guard"
    logo_url = models.CharField(max_length=255, blank=True, null=True)
    claim_settlement_ratio = models.CharField(max_length=20, default='98.7%')
    emergency_assistance_phone = models.CharField(max_length=50, default='+1 (800) 555-0199')

    def __str__(self):
        return self.name


class InsurancePlan(models.Model):
    REGION_CHOICES = (
        ('worldwide', 'Worldwide (Including USA & Canada)'),
        ('worldwide_ex_us', 'Worldwide (Excluding USA & Canada)'),
        ('schengen', 'Schengen Countries Only'),
        ('asia', 'Asia Pacific'),
    )

    provider = models.ForeignKey(InsuranceProvider, on_delete=models.CASCADE, related_name='plans')
    plan_name = models.CharField(max_length=150) # e.g. "Orbinex Platinum Shield", "Gold Voyager", "Schengen Essential"
    region = models.CharField(max_length=50, choices=REGION_CHOICES, default='worldwide')
    
    medical_coverage_amount = models.CharField(max_length=50, default='$500,000')
    trip_cancellation_amount = models.CharField(max_length=50, default='$10,000')
    baggage_loss_amount = models.CharField(max_length=50, default='$2,500')
    flight_delay_amount = models.CharField(max_length=50, default='$1,000')
    covid19_covered = models.BooleanField(default=True)
    cashless_hospitalization = models.BooleanField(default=True)
    
    price_per_day = models.DecimalField(max_digits=8, decimal_places=2, default=4.50)
    flat_price = models.DecimalField(max_digits=8, decimal_places=2, default=39.00)
    benefits_list = models.JSONField(default=list) # ["Emergency Medical Evacuation", "Trip Curtailment", "Passport Loss Assitance", "Personal Liability"]
    policy_wording_url = models.CharField(max_length=500, blank=True, null=True)
    is_bestseller = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.plan_name} by {self.provider.name} (${self.flat_price})"


class InsurancePolicy(models.Model):
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name='insurance_detail')
    plan = models.ForeignKey(InsurancePlan, on_delete=models.CASCADE, related_name='policies')
    
    policy_number = models.CharField(max_length=50, unique=True, db_index=True)
    insured_persons = models.JSONField(default=list) # [{"name": "John Doe", "dob": "1990-05-12", "passport": "P123"}]
    destination_country = models.CharField(max_length=100, default='Worldwide')
    start_date = models.DateField()
    end_date = models.DateField()
    duration_days = models.IntegerField(default=7)
    policy_pdf_url = models.CharField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Policy {self.policy_number} - {self.plan.plan_name}"

    def save(self, *args, **kwargs):
        if not self.policy_number:
            self.policy_number = f"POL-{uuid.uuid4().hex[:9].upper()}"
        super().save(*args, **kwargs)
