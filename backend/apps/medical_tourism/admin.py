from django.contrib import admin
from .models import MedicalSpecialty, MedicalHospital, MedicalPackage, MedicalEnquiry

@admin.register(MedicalSpecialty)
class MedicalSpecialtyAdmin(admin.ModelAdmin):
    list_display = ('name', 'icon_name')

@admin.register(MedicalHospital)
class MedicalHospitalAdmin(admin.ModelAdmin):
    list_display = ('name', 'city', 'country', 'established_year', 'featured')
    list_filter = ('country', 'featured')
    search_fields = ('name', 'city', 'country')

@admin.register(MedicalPackage)
class MedicalPackageAdmin(admin.ModelAdmin):
    list_display = ('treatment_name', 'hospital', 'specialty', 'estimated_cost_usd', 'us_benchmark_cost_usd')
    list_filter = ('specialty', 'hospital__country')

@admin.register(MedicalEnquiry)
class MedicalEnquiryAdmin(admin.ModelAdmin):
    list_display = ('enquiry_reference', 'patient_name', 'treatment_name', 'country_preference', 'status', 'created_at')
    list_filter = ('status', 'country_preference')
