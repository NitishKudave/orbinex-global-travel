import uuid
from django.db import models
from django.conf import settings
from apps.core_bookings.models import Booking

class MedicalSpecialty(models.Model):
    name = models.CharField(max_length=100) # e.g. "Cardiology & Heart Surgery", "Orthopedics & Joint Replacement", "Cosmetic & Plastic Surgery", "Oncology & Cancer Care", "Fertility & IVF", "Ayurvedic Wellness & Rehab"
    icon_name = models.CharField(max_length=50, default='activity')
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name


class MedicalHospital(models.Model):
    name = models.CharField(max_length=200) # e.g. "Apollo Hospitals International", "Bumrungrad International Hospital", "Acibadem Healthcare"
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100) # India, Thailand, Turkey, Germany, UAE
    accreditations = models.JSONField(default=list) # ["JCI Accredited", "NABH Certified", "ISO 9001"]
    established_year = models.IntegerField(default=1995)
    beds_count = models.IntegerField(default=1200)
    image_url = models.CharField(max_length=500)
    overview = models.TextField()
    specialties = models.ManyToManyField(MedicalSpecialty, related_name='hospitals')
    featured = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} - {self.city}, {self.country}"


class MedicalPackage(models.Model):
    hospital = models.ForeignKey(MedicalHospital, on_delete=models.CASCADE, related_name='packages')
    specialty = models.ForeignKey(MedicalSpecialty, on_delete=models.CASCADE, related_name='packages')
    treatment_name = models.CharField(max_length=200) # e.g. "Knee Replacement (Single / Bilateral)", "Coronary Angioplasty", "Smile Makeover / Dental Implants"
    
    estimated_cost_usd = models.DecimalField(max_digits=10, decimal_places=2, default=4500.00)
    us_benchmark_cost_usd = models.DecimalField(max_digits=10, decimal_places=2, default=35000.00)
    hospital_stay_days = models.IntegerField(default=4)
    total_stay_days = models.IntegerField(default=10) # in country recovery
    success_rate = models.CharField(max_length=20, default='99.2%')
    
    inclusions = models.JSONField(default=list) # ["Pre-op investigations", "Surgeon & Anesthetist fees", "Hospital room stay", "Post-op medication", "Airport pickup & Concierge"]
    overview = models.TextField()

    def __str__(self):
        return f"{self.treatment_name} at {self.hospital.name} (${self.estimated_cost_usd})"


class MedicalEnquiry(models.Model):
    STATUS_CHOICES = (
        ('enquiry_received', 'Enquiry Received'),
        ('doctor_reviewing', 'Doctor Reviewing Medical Records'),
        ('quote_issued', 'Treatment Plan & Quote Issued'),
        ('consultation_scheduled', 'Video Consultation Scheduled'),
        ('visa_travel_arranged', 'Medical Visa & Travel Arranged'),
    )

    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name='medical_detail', null=True, blank=True)
    enquiry_reference = models.CharField(max_length=50, unique=True, db_index=True)
    hospital = models.ForeignKey(MedicalHospital, on_delete=models.CASCADE, related_name='enquiries', null=True, blank=True)
    treatment_name = models.CharField(max_length=200)
    country_preference = models.CharField(max_length=100, default='India')
    
    patient_name = models.CharField(max_length=150)
    patient_age = models.IntegerField(default=45)
    patient_gender = models.CharField(max_length=10, default='male')
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=30)
    
    medical_condition_summary = models.TextField()
    medical_reports_json = models.JSONField(default=list) # URLs of uploaded scans / discharge summaries
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='enquiry_received')
    doctor_opinion_notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Medical Case {self.enquiry_reference} - {self.patient_name} ({self.treatment_name})"

    def save(self, *args, **kwargs):
        if not self.enquiry_reference:
            self.enquiry_reference = f"MED-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)
