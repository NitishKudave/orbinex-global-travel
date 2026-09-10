from django.contrib import admin
from .models import Airline, Airport, FlightSchedule, FlightSeat, FlightBooking

@admin.register(Airline)
class AirlineAdmin(admin.ModelAdmin):
    list_display = ('name', 'iata_code')

@admin.register(Airport)
class AirportAdmin(admin.ModelAdmin):
    list_display = ('iata_code', 'name', 'city', 'country')
    search_fields = ('iata_code', 'name', 'city', 'country')

class FlightSeatInline(admin.TabularInline):
    model = FlightSeat
    extra = 1

@admin.register(FlightSchedule)
class FlightScheduleAdmin(admin.ModelAdmin):
    list_display = ('flight_number', 'airline', 'origin', 'destination', 'departure_time', 'arrival_time', 'price_economy', 'stops')
    list_filter = ('airline', 'stops', 'aircraft_type')
    inlines = [FlightSeatInline]

@admin.register(FlightBooking)
class FlightBookingAdmin(admin.ModelAdmin):
    list_display = ('e_ticket_number', 'booking', 'flight_schedule', 'cabin_class')
    search_fields = ('e_ticket_number', 'booking__booking_reference')
