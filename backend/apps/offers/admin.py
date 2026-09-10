from django.contrib import admin
from .models import CouponCode, PromotionalDeal

@admin.register(CouponCode)
class CouponCodeAdmin(admin.ModelAdmin):
    list_display = ('code', 'title', 'discount_type', 'discount_value', 'min_booking_amount', 'is_active')
    list_filter = ('discount_type', 'is_active', 'applicable_module')
    search_fields = ('code', 'title')

@admin.register(PromotionalDeal)
class PromotionalDealAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'coupon_code', 'is_featured')
    list_filter = ('category', 'is_featured')
