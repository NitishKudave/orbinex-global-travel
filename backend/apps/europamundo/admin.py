from django.contrib import admin
from .models import EuropamundoTour, TourStop, TourDeparture

class TourStopInline(admin.TabularInline):
    model = TourStop
    extra = 1

class TourDepartureInline(admin.TabularInline):
    model = TourDeparture
    extra = 1

@admin.register(EuropamundoTour)
class EuropamundoTourAdmin(admin.ModelAdmin):
    list_display = ('tour_code', 'title', 'duration_days', 'price_usd', 'hotel_category', 'featured')
    search_fields = ('tour_code', 'title', 'cities_visited')
    inlines = [TourStopInline, TourDepartureInline]
