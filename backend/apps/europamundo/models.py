import uuid
from django.db import models
from django.conf import settings
from apps.core_bookings.models import Booking

class EuropamundoTour(models.Model):
    tour_code = models.CharField(max_length=50, unique=True) # e.g. "EUR-MAD-PAR-01"
    title = models.CharField(max_length=200) # e.g. "Classic Iberian Circuit: Spain & Portugal"
    countries_covered = models.JSONField(default=list) # ["Spain", "Portugal", "Andorra"]
    cities_visited = models.CharField(max_length=255, default='Madrid, Toledo, Lisbon, Porto, Salamanca')
    
    duration_days = models.IntegerField(default=10)
    duration_nights = models.IntegerField(default=9)
    price_eur = models.DecimalField(max_digits=10, decimal_places=2, default=1350.00)
    price_usd = models.DecimalField(max_digits=10, decimal_places=2, default=1480.00)
    
    bus_type = models.CharField(max_length=100, default='Luxury Panoramic Coach with Free Wi-Fi')
    hotel_category = models.CharField(max_length=50, default='4-Star Comfort Hotels')
    audio_languages = models.JSONField(default=list) # ["English", "Spanish", "French", "Arabic"]
    guaranteed_departures = models.BooleanField(default=True)
    
    main_image = models.CharField(max_length=500)
    gallery_images = models.JSONField(default=list)
    overview = models.TextField()
    inclusions = models.JSONField(default=list) # ["Daily Buffet Breakfast", "Arrival & Departure Transfers", "English Speaking Tour Director", "Ferry & Boat Rides where applicable"]
    
    featured = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.tour_code}: {self.title} ({self.duration_days} Days)"


class TourStop(models.Model):
    tour = models.ForeignKey(EuropamundoTour, on_delete=models.CASCADE, related_name='stops')
    day_number = models.IntegerField(default=1)
    city_name = models.CharField(max_length=100)
    country_name = models.CharField(max_length=100)
    highlight_title = models.CharField(max_length=200)
    description = models.TextField()
    km_distance = models.IntegerField(default=220)

    class Meta:
        ordering = ['day_number']

    def __str__(self):
        return f"Day {self.day_number}: {self.city_name} - {self.highlight_title}"


class TourDeparture(models.Model):
    tour = models.ForeignKey(EuropamundoTour, on_delete=models.CASCADE, related_name='departures')
    departure_date = models.DateField()
    available_seats = models.IntegerField(default=24)
    status = models.CharField(max_length=50, default='Guaranteed Departure')

    def __str__(self):
        return f"{self.tour.tour_code} on {self.departure_date} ({self.available_seats} seats)"
