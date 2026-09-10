from django.contrib import admin
from .models import VisaCountry, VisaType, VisaApplication

class VisaTypeInline(admin.TabularInline):
    model = VisaType
    extra = 1

@admin.register(VisaCountry)
class VisaCountryAdmin(admin.ModelAdmin):
    list_display = ('country_name', 'country_code', 'flag_emoji', 'processing_time_days', 'starting_price', 'is_popular')
    search_fields = ('country_name', 'country_code')
    inlines = [VisaTypeInline]

@admin.register(VisaApplication)
class VisaApplicationAdmin(admin.ModelAdmin):
    list_display = ('application_reference', 'booking', 'applicant_full_name', 'visa_country', 'visa_type', 'status', 'created_at')
    list_filter = ('status', 'visa_country')
    search_fields = ('application_reference', 'applicant_full_name', 'passport_number', 'booking__booking_reference')
