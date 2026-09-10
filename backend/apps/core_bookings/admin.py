from django.contrib import admin
from .models import Booking

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('booking_reference', 'booking_type', 'title', 'contact_name', 'final_amount', 'currency', 'status', 'payment_status', 'created_at')
    list_filter = ('booking_type', 'status', 'payment_status', 'currency', 'created_at')
    search_fields = ('booking_reference', 'contact_name', 'contact_email', 'contact_phone', 'title')
    readonly_fields = ('booking_reference', 'created_at', 'updated_at')
