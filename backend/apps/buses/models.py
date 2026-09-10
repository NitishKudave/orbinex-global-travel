from django.db import models
from django.conf import settings
from apps.core_bookings.models import Booking

class BusOperator(models.Model):
    name = models.CharField(max_length=150)
    logo_url = models.CharField(max_length=255, blank=True, null=True)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=4.6)
    total_reviews = models.IntegerField(default=120)

    def __str__(self):
        return f"{self.name} ({self.rating}★)"


class BusTrip(models.Model):
    BUS_TYPE_CHOICES = (
        ('ac_sleeper', 'AC Sleeper (2+1)'),
        ('volvo_multi_axle', 'Volvo Multi-Axle AC Semi-Sleeper (2+2)'),
        ('scania_ac', 'Scania AC Executive (2+2)'),
        ('non_ac_sleeper', 'Non-AC Sleeper (2+1)'),
    )

    operator = models.ForeignKey(BusOperator, on_delete=models.CASCADE, related_name='trips')
    bus_type = models.CharField(max_length=50, choices=BUS_TYPE_CHOICES, default='volvo_multi_axle')
    bus_name = models.CharField(max_length=150, default='Volvo Multi-Axle Luxury AC')
    
    origin = models.CharField(max_length=100) # e.g. "Dubai" or "New York" or "London"
    destination = models.CharField(max_length=100) # e.g. "Abu Dhabi" or "Boston" or "Manchester"
    
    departure_time = models.CharField(max_length=10, help_text="e.g. 09:00 PM")
    arrival_time = models.CharField(max_length=10, help_text="e.g. 06:30 AM")
    duration = models.CharField(max_length=50, help_text="e.g. 9h 30m")
    
    fare_seater = models.DecimalField(max_digits=8, decimal_places=2, default=35.00)
    fare_sleeper = models.DecimalField(max_digits=8, decimal_places=2, default=55.00)
    
    boarding_points = models.JSONField(default=list) # [{"time": "08:30 PM", "location": "Central Bus Station", "address": "Bay 4"}]
    dropping_points = models.JSONField(default=list) # [{"time": "06:00 AM", "location": "City Terminal", "address": "Platform 2"}]
    
    total_seats = models.IntegerField(default=36)
    available_seats_count = models.IntegerField(default=22)
    amenities = models.JSONField(default=list) # ["WiFi", "Water Bottle", "Charging Point", "Blanket", "Live Tracking"]

    def __str__(self):
        return f"{self.operator.name}: {self.origin} -> {self.destination} ({self.departure_time})"


class BusSeat(models.Model):
    DECK_CHOICES = (
        ('lower', 'Lower Deck'),
        ('upper', 'Upper Deck'),
    )
    SEAT_TYPE_CHOICES = (
        ('seater', 'Seater'),
        ('sleeper', 'Sleeper Bed'),
    )

    trip = models.ForeignKey(BusTrip, on_delete=models.CASCADE, related_name='seats')
    seat_number = models.CharField(max_length=10) # e.g. "L1", "U4", "12A"
    deck = models.CharField(max_length=10, choices=DECK_CHOICES, default='lower')
    seat_type = models.CharField(max_length=10, choices=SEAT_TYPE_CHOICES, default='seater')
    price = models.DecimalField(max_digits=8, decimal_places=2, default=35.00)
    is_available = models.BooleanField(default=True)
    is_ladies_only = models.BooleanField(default=False)
    is_booked = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.trip.bus_name} - Seat {self.seat_number} ({self.deck}/{self.seat_type})"


class BusBooking(models.Model):
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name='bus_detail')
    trip = models.ForeignKey(BusTrip, on_delete=models.CASCADE, related_name='bookings')
    selected_seats = models.JSONField(default=list) # ["L1", "L2"]
    passengers = models.JSONField(default=list) # [{"name": "John Doe", "seat": "L1", "gender": "male", "age": 28}]
    boarding_point = models.CharField(max_length=255)
    dropping_point = models.CharField(max_length=255)
    m_ticket_number = models.CharField(max_length=50, unique=True, blank=True, null=True)

    def __str__(self):
        return f"Bus Ticket {self.m_ticket_number} for {self.trip.bus_name}"
