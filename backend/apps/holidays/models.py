import uuid
from django.db import models
from django.conf import settings
from apps.core_bookings.models import Booking

class HolidayDestination(models.Model):
    name = models.CharField(max_length=100) # e.g. "Bali, Indonesia", "Switzerland", "Dubai, UAE"
    region = models.CharField(max_length=100, default='Asia')
    image_url = models.CharField(max_length=500)
    tagline = models.CharField(max_length=200, default='Tropical Paradise & Ancient Temples')

    def __str__(self):
        return self.name


class HolidayPackage(models.Model):
    destination = models.ForeignKey(HolidayDestination, on_delete=models.CASCADE, related_name='packages')
    title = models.CharField(max_length=200) # e.g. "Enchanting Bali: 6 Days 5 Nights All-Inclusive"
    duration_days = models.IntegerField(default=6)
    duration_nights = models.IntegerField(default=5)
    
    price_per_person = models.DecimalField(max_digits=10, decimal_places=2, default=799.00)
    original_price = models.DecimalField(max_digits=10, decimal_places=2, default=1099.00)
    
    main_image = models.CharField(max_length=500)
    gallery_images = models.JSONField(default=list)
    overview = models.TextField()
    
    inclusions = models.JSONField(default=list) # ["4-Star Hotel Accommodation", "Daily Breakfast & 3 Dinners", "Airport Transfers", "English Speaking Guide", "All Entry Tickets"]
    exclusions = models.JSONField(default=list) # ["International Airfare", "Personal Expenses", "Visa Fees"]
    
    hotel_rating = models.IntegerField(default=4)
    meals_included = models.CharField(max_length=100, default='Breakfast Included')
    flights_included = models.BooleanField(default=False)
    is_trending = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.title} (${self.price_per_person})"


class PackageItineraryDay(models.Model):
    package = models.ForeignKey(HolidayPackage, on_delete=models.CASCADE, related_name='itinerary_days')
    day_number = models.IntegerField(default=1)
    title = models.CharField(max_length=200) # e.g. "Arrival in Denpasar & Sunset at Uluwatu"
    description = models.TextField()
    meals_today = models.CharField(max_length=100, default='Dinner')
    activities = models.JSONField(default=list) # ["Airport pickup", "Check-in to Resort", "Kecak Dance Show", "Seafood Dinner on Jimbaran Beach"]

    class Meta:
        ordering = ['day_number']

    def __str__(self):
        return f"Day {self.day_number}: {self.title}"


class HolidayBooking(models.Model):
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name='holiday_detail')
    package = models.ForeignKey(HolidayPackage, on_delete=models.CASCADE, related_name='bookings')
    travel_date = models.DateField()
    travelers_count = models.IntegerField(default=2)
    room_sharing = models.CharField(max_length=50, default='Twin Sharing')
    custom_requests = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Holiday Booking: {self.package.title} ({self.booking.booking_reference})"
