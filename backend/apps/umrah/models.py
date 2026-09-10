import uuid
from django.db import models
from django.conf import settings
from apps.core_bookings.models import Booking

class UmrahHotel(models.Model):
    CITY_CHOICES = (
        ('makkah', 'Makkah'),
        ('madinah', 'Madinah'),
    )

    name = models.CharField(max_length=150) # e.g. "Fairmont Makkah Clock Royal Tower", "Pullman Zamzam Madinah"
    city = models.CharField(max_length=20, choices=CITY_CHOICES)
    star_rating = models.IntegerField(default=5)
    distance_from_haram = models.CharField(max_length=100, default='0 meters (Facing Haram)') # e.g. "50m", "150m walking"
    image_url = models.CharField(max_length=500, blank=True, null=True)

    def __str__(self):
        return f"{self.name} - {self.city.title()} ({self.distance_from_haram})"


class UmrahPackage(models.Model):
    PACKAGE_TIER_CHOICES = (
        ('vip_luxury', 'VIP 5-Star Luxury (Haram Front)'),
        ('classic_premium', 'Classic 4-Star Premium'),
        ('economy_saver', 'Economy Saver'),
        ('ramadan_special', 'Ramadan Special Package'),
    )

    title = models.CharField(max_length=200) # e.g. "14 Days Executive VIP Umrah Package"
    tier = models.CharField(max_length=50, choices=PACKAGE_TIER_CHOICES, default='vip_luxury')
    duration_days = models.IntegerField(default=14)
    makkah_nights = models.IntegerField(default=7)
    madinah_nights = models.IntegerField(default=7)
    
    price_quad = models.DecimalField(max_digits=10, decimal_places=2, default=1499.00)
    price_triple = models.DecimalField(max_digits=10, decimal_places=2, default=1699.00)
    price_double = models.DecimalField(max_digits=10, decimal_places=2, default=1999.00)
    
    makkah_hotel = models.ForeignKey(UmrahHotel, on_delete=models.CASCADE, related_name='makkah_packages')
    madinah_hotel = models.ForeignKey(UmrahHotel, on_delete=models.CASCADE, related_name='madinah_packages')
    
    main_image = models.CharField(max_length=500)
    gallery_images = models.JSONField(default=list)
    overview = models.TextField()
    
    visa_included = models.BooleanField(default=True)
    flights_included = models.BooleanField(default=True)
    transfers_included = models.BooleanField(default=True) # Luxury private / AC coach transfers
    ziyarat_included = models.BooleanField(default=True) # Historical holy sites tours
    
    inclusions = models.JSONField(default=list)
    exclusions = models.JSONField(default=list)
    itinerary_summary = models.JSONField(default=list)
    featured = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.title} (${self.price_double})"


class UmrahBooking(models.Model):
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name='umrah_detail')
    package = models.ForeignKey(UmrahPackage, on_delete=models.CASCADE, related_name='bookings')
    departure_date = models.DateField()
    pilgrims_count = models.IntegerField(default=2)
    room_type = models.CharField(max_length=50, default='Double Sharing')
    need_visa_assistance = models.BooleanField(default=True)
    special_requirements = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Umrah Pilgrimage: {self.package.title} ({self.booking.booking_reference})"
