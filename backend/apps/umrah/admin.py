from django.contrib import admin
from .models import UmrahHotel, UmrahPackage, UmrahBooking

@admin.register(UmrahHotel)
class UmrahHotelAdmin(admin.ModelAdmin):
    list_display = ('name', 'city', 'star_rating', 'distance_from_haram')
    list_filter = ('city', 'star_rating')

@admin.register(UmrahPackage)
class UmrahPackageAdmin(admin.ModelAdmin):
    list_display = ('title', 'tier', 'duration_days', 'price_double', 'featured')
    list_filter = ('tier', 'featured')

@admin.register(UmrahBooking)
class UmrahBookingAdmin(admin.ModelAdmin):
    list_display = ('booking', 'package', 'departure_date', 'pilgrims_count', 'room_type')
