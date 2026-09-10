from django.contrib import admin
from .models import BusOperator, BusTrip, BusSeat, BusBooking

@admin.register(BusOperator)
class BusOperatorAdmin(admin.ModelAdmin):
    list_display = ('name', 'rating', 'total_reviews')

class BusSeatInline(admin.TabularInline):
    model = BusSeat
    extra = 2

@admin.register(BusTrip)
class BusTripAdmin(admin.ModelAdmin):
    list_display = ('bus_name', 'operator', 'origin', 'destination', 'departure_time', 'arrival_time', 'fare_seater', 'available_seats_count')
    list_filter = ('bus_type', 'operator', 'origin', 'destination')
    inlines = [BusSeatInline]

@admin.register(BusBooking)
class BusBookingAdmin(admin.ModelAdmin):
    list_display = ('m_ticket_number', 'booking', 'trip', 'boarding_point')
    search_fields = ('m_ticket_number', 'booking__booking_reference')
