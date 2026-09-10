from django.contrib import admin
from .models import Hotel, HotelAmenity, HotelRoom, HotelBooking

@admin.register(HotelAmenity)
class HotelAmenityAdmin(admin.ModelAdmin):
    list_display = ('name', 'icon_name')

class HotelRoomInline(admin.TabularInline):
    model = HotelRoom
    extra = 1

@admin.register(Hotel)
class HotelAdmin(admin.ModelAdmin):
    list_display = ('name', 'city', 'country', 'star_rating', 'guest_rating', 'price_per_night_start', 'featured')
    list_filter = ('star_rating', 'city', 'country', 'featured', 'free_cancellation')
    search_fields = ('name', 'city', 'country')
    inlines = [HotelRoomInline]

@admin.register(HotelBooking)
class HotelBookingAdmin(admin.ModelAdmin):
    list_display = ('voucher_number', 'booking', 'hotel', 'room', 'check_in_date', 'check_out_date', 'nights')
    search_fields = ('voucher_number', 'booking__booking_reference', 'hotel__name')
