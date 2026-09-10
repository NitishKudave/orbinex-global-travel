import uuid
from django.db import models
from django.conf import settings
from apps.core_bookings.models import Booking

class VisaCountry(models.Model):
    country_name = models.CharField(max_length=100, unique=True)
    country_code = models.CharField(max_length=5, unique=True) # e.g. "AE", "US", "GB", "SCH"
    flag_emoji = models.CharField(max_length=10, default='🌍')
    processing_time_days = models.CharField(max_length=50, default='3 to 5 business days')
    starting_price = models.DecimalField(max_digits=8, decimal_places=2, default=99.00)
    image_url = models.CharField(max_length=500, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    requirements_checklist = models.JSONField(default=list) # ["Passport copy with 6 months validity", "Passport size photo", "Bank statement 3 months", "Confirmed flight itinerary"]
    is_popular = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.flag_emoji} {self.country_name} ({self.country_code})"


class VisaType(models.Model):
    country = models.ForeignKey(VisaCountry, on_delete=models.CASCADE, related_name='visa_types')
    title = models.CharField(max_length=150) # e.g. "30 Days Tourist Visa", "90 Days Multi-Entry", "Express 24H Visa"
    validity_duration = models.CharField(max_length=50, default='60 days from issuance')
    stay_duration = models.CharField(max_length=50, default='30 days')
    entry_type = models.CharField(max_length=50, default='Single Entry') # Single Entry, Multiple Entry
    government_fee = models.DecimalField(max_digits=8, decimal_places=2, default=65.00)
    service_fee = models.DecimalField(max_digits=8, decimal_places=2, default=34.00)
    total_fee = models.DecimalField(max_digits=8, decimal_places=2, default=99.00)
    express_available = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.country.country_name} - {self.title} (${self.total_fee})"


class VisaApplication(models.Model):
    STATUS_CHOICES = (
        ('submitted', 'Application Submitted'),
        ('documents_verified', 'Documents Verified'),
        ('embassy_processing', 'Under Processing at Embassy'),
        ('approved', 'Visa Approved / Issued'),
        ('rejected', 'Action Required / Rejected'),
    )

    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name='visa_detail')
    visa_country = models.ForeignKey(VisaCountry, on_delete=models.CASCADE, related_name='applications')
    visa_type = models.ForeignKey(VisaType, on_delete=models.CASCADE, related_name='applications')
    
    application_reference = models.CharField(max_length=50, unique=True, db_index=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='submitted')
    applicant_full_name = models.CharField(max_length=150)
    passport_number = models.CharField(max_length=50)
    passport_expiry = models.DateField(null=True, blank=True)
    nationality = models.CharField(max_length=100, default='United States')
    travel_date = models.DateField(null=True, blank=True)
    
    # Uploaded docs metadata
    passport_copy_url = models.CharField(max_length=500, blank=True, null=True)
    photo_url = models.CharField(max_length=500, blank=True, null=True)
    supporting_docs_json = models.JSONField(default=list)
    embassy_remarks = models.TextField(blank=True, null=True)
    issued_visa_doc_url = models.CharField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Visa App {self.application_reference} - {self.applicant_full_name} ({self.visa_country.country_name})"

    def save(self, *args, **kwargs):
        if not self.application_reference:
            self.application_reference = f"VISA-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)
