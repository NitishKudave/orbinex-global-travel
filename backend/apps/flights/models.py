from django.db import models
from django.conf import settings
from apps.core_bookings.models import Booking

class Airline(models.Model):
    name = models.CharField(max_length=100)
    iata_code = models.CharField(max_length=5, unique=True)
    logo_url = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.iata_code})"


class Airport(models.Model):
    name = models.CharField(max_length=150)
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    iata_code = models.CharField(max_length=5, unique=True)

    def __str__(self):
        return f"{self.city} - {self.name} ({self.iata_code})"


class FlightSchedule(models.Model):
    CABIN_CHOICES = (
        ('economy', 'Economy'),
        ('premium_economy', 'Premium Economy'),
        ('business', 'Business Class'),
        ('first', 'First Class'),
    )

    flight_number = models.CharField(max_length=20)
    airline = models.ForeignKey(Airline, on_delete=models.CASCADE, related_name='schedules')
    origin = models.ForeignKey(Airport, on_delete=models.CASCADE, related_name='departing_flights')
    destination = models.ForeignKey(Airport, on_delete=models.CASCADE, related_name='arriving_flights')
    
    departure_time = models.CharField(max_length=10, help_text="e.g. 08:30 AM")
    arrival_time = models.CharField(max_length=10, help_text="e.g. 02:45 PM")
    duration = models.CharField(max_length=50, help_text="e.g. 6h 15m")
    stops = models.IntegerField(default=0, help_text="0 for Direct/Non-stop, 1, 2")
    stop_details = models.CharField(max_length=255, blank=True, null=True, help_text="e.g. 1h 45m in Doha (DOH)")
    
    price_economy = models.DecimalField(max_digits=10, decimal_places=2, default=350.00)
    price_premium = models.DecimalField(max_digits=10, decimal_places=2, default=580.00)
    price_business = models.DecimalField(max_digits=10, decimal_places=2, default=1250.00)
    price_first = models.DecimalField(max_digits=10, decimal_places=2, default=2400.00)
    
    baggage_checkin = models.CharField(max_length=50, default='30 kg')
    baggage_cabin = models.CharField(max_length=50, default='7 kg')
    refundable = models.BooleanField(default=True)
    aircraft_type = models.CharField(max_length=100, default='Boeing 777-300ER')

    # Amenities
    has_meals = models.BooleanField(default=True)
    has_wifi = models.BooleanField(default=False)
    has_usb = models.BooleanField(default=True)
    has_entertainment = models.BooleanField(default=False)
    seat_layout = models.CharField(max_length=20, default='3-3', help_text="e.g. 3-3, 2-4-2, 3-3-3")
    wifi_type = models.CharField(max_length=50, default='', blank=True)  # e.g. 'Complimentary', 'Chargeable'

    def __str__(self):
        return f"{self.airline.iata_code} {self.flight_number}: {self.origin.iata_code} -> {self.destination.iata_code}"

class FlightSeat(models.Model):
    SEAT_CLASS_CHOICES = (
        ('economy', 'Economy'),
        ('extra_legroom', 'Extra Legroom'),
        ('business', 'Business'),
    )

    flight_schedule = models.ForeignKey(FlightSchedule, on_delete=models.CASCADE, related_name='seats')
    seat_number = models.CharField(max_length=10) # e.g. 12A, 14F
    seat_class = models.CharField(max_length=20, choices=SEAT_CLASS_CHOICES, default='economy')
    extra_price = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    is_available = models.BooleanField(default=True)
    is_window = models.BooleanField(default=False)
    is_aisle = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.flight_schedule.flight_number} - Seat {self.seat_number} ({self.seat_class})"


class FlightBooking(models.Model):
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name='flight_detail')
    flight_schedule = models.ForeignKey(FlightSchedule, on_delete=models.CASCADE, related_name='bookings')
    cabin_class = models.CharField(max_length=30, default='economy')
    passengers_json = models.JSONField(default=list) # [{name, age, gender, seat, passport}]
    selected_seats = models.CharField(max_length=100, blank=True, null=True)
    e_ticket_number = models.CharField(max_length=50, unique=True, blank=True, null=True)
    meal_preference = models.CharField(max_length=100, default='Standard')
    
    def __str__(self):
        return f"Flight E-Ticket {self.e_ticket_number} for {self.booking.booking_reference}"
