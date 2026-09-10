from django.contrib import admin
from .models import HolidayDestination, HolidayPackage, PackageItineraryDay, HolidayBooking

class PackageItineraryDayInline(admin.StackedInline):
    model = PackageItineraryDay
    extra = 1

@admin.register(HolidayDestination)
class HolidayDestinationAdmin(admin.ModelAdmin):
    list_display = ('name', 'region', 'tagline')

@admin.register(HolidayPackage)
class HolidayPackageAdmin(admin.ModelAdmin):
    list_display = ('title', 'destination', 'duration_days', 'duration_nights', 'price_per_person', 'is_trending')
    list_filter = ('destination', 'is_trending', 'hotel_rating')
    search_fields = ('title', 'destination__name')
    inlines = [PackageItineraryDayInline]

@admin.register(HolidayBooking)
class HolidayBookingAdmin(admin.ModelAdmin):
    list_display = ('booking', 'package', 'travel_date', 'travelers_count', 'room_sharing')
