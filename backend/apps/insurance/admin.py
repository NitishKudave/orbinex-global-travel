from django.contrib import admin
from .models import InsuranceProvider, InsurancePlan, InsurancePolicy

@admin.register(InsuranceProvider)
class InsuranceProviderAdmin(admin.ModelAdmin):
    list_display = ('name', 'claim_settlement_ratio', 'emergency_assistance_phone')

@admin.register(InsurancePlan)
class InsurancePlanAdmin(admin.ModelAdmin):
    list_display = ('plan_name', 'provider', 'region', 'medical_coverage_amount', 'flat_price', 'is_bestseller')
    list_filter = ('region', 'provider', 'is_bestseller')

@admin.register(InsurancePolicy)
class InsurancePolicyAdmin(admin.ModelAdmin):
    list_display = ('policy_number', 'booking', 'plan', 'destination_country', 'start_date', 'end_date')
    search_fields = ('policy_number', 'booking__booking_reference')
