from django.contrib import admin
from .models import PaymentTransaction

@admin.register(PaymentTransaction)
class PaymentTransactionAdmin(admin.ModelAdmin):
    list_display = ('transaction_id', 'booking', 'gateway', 'amount', 'currency', 'status', 'created_at')
    list_filter = ('gateway', 'status', 'currency')
    search_fields = ('transaction_id', 'booking__booking_reference', 'gateway_reference')
