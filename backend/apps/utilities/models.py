import uuid
from django.db import models
from django.conf import settings
from apps.core_bookings.models import Booking

class ForexRate(models.Model):
    currency_code = models.CharField(max_length=5, unique=True) # e.g. "EUR", "GBP", "AED", "INR", "THB", "SGD", "JPY"
    currency_name = models.CharField(max_length=100)
    flag_emoji = models.CharField(max_length=10, default='💱')
    buy_rate_usd = models.DecimalField(max_digits=10, decimal_places=4) # Exchange rate relative to USD
    sell_rate_usd = models.DecimalField(max_digits=10, decimal_places=4)
    forex_card_available = models.BooleanField(default=True)
    currency_notes_available = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.flag_emoji} {self.currency_code} ({self.currency_name})"


class EsimPackage(models.Model):
    country_or_region = models.CharField(max_length=100) # e.g. "Europe (33 Countries)", "United States", "UAE", "Global (120+ Countries)"
    country_code = models.CharField(max_length=10, default='GLOBAL')
    data_allowance = models.CharField(max_length=50) # e.g. "5 GB", "10 GB", "Unlimited"
    validity_days = models.IntegerField(default=15) # e.g. 7, 15, 30
    price_usd = models.DecimalField(max_digits=8, decimal_places=2, default=14.99)
    network_speed = models.CharField(max_length=50, default='5G / 4G LTE')
    hotspot_tethering = models.BooleanField(default=True)
    instant_qr_delivery = models.BooleanField(default=True)

    def __str__(self):
        return f"eSIM {self.country_or_region} - {self.data_allowance} ({self.validity_days} Days) - ${self.price_usd}"


class AirportLounge(models.Model):
    airport_code = models.CharField(max_length=5) # e.g. "DXB", "LHR", "JFK", "SIN"
    airport_name = models.CharField(max_length=150)
    terminal = models.CharField(max_length=50, default='Terminal 3')
    lounge_name = models.CharField(max_length=150) # e.g. "Marhaba Lounge", "Plaza Premium Lounge"
    operating_hours = models.CharField(max_length=100, default='24 Hours Daily')
    price_usd = models.DecimalField(max_digits=8, decimal_places=2, default=38.00)
    amenities = models.JSONField(default=list) # ["Gourmet Buffet", "Shower Facilities", "High-Speed WiFi", "Comfortable Recliners", "Flight Monitors"]
    image_url = models.CharField(max_length=500, blank=True, null=True)

    def __str__(self):
        return f"{self.airport_code} ({self.terminal}) - {self.lounge_name} (${self.price_usd})"
