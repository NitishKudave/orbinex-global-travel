from django.db import models
from django.conf import settings
from apps.core_bookings.models import Booking

class HotelAmenity(models.Model):
    name = models.CharField(max_length=100)
    icon_name = models.CharField(max_length=50, default='wifi') # e.g. wifi, pool, spa, restaurant, gym, parking

    def __str__(self):
        return self.name


class Hotel(models.Model):
    name = models.CharField(max_length=200)
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    address = models.CharField(max_length=255)
    star_rating = models.IntegerField(default=5) # 1 to 5
    guest_rating = models.DecimalField(max_digits=3, decimal_places=1, default=4.8) # e.g. 4.8 / 5
    reviews_count = models.IntegerField(default=340)
    
    price_per_night_start = models.DecimalField(max_digits=10, decimal_places=2, default=180.00)
    main_image = models.CharField(max_length=500, blank=True, null=True)
    images_gallery = models.JSONField(default=list, blank=True)
    description = models.TextField()
    
    free_cancellation = models.BooleanField(default=True)
    breakfast_included = models.BooleanField(default=True)
    amenities = models.ManyToManyField(HotelAmenity, blank=True, related_name='hotels')
    featured = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} - {self.city}, {self.country} ({self.star_rating}★)"


class HotelRoom(models.Model):
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE, related_name='rooms')
    room_name = models.CharField(max_length=150) # e.g. "Deluxe King Room", "Executive Suite"
    bed_type = models.CharField(max_length=100, default='1 Extra-large double bed')
    max_guests = models.IntegerField(default=2)
    room_size_sqm = models.IntegerField(default=38)
    price_per_night = models.DecimalField(max_digits=10, decimal_places=2, default=180.00)
    image_url = models.CharField(max_length=500, blank=True, null=True)
    features_json = models.JSONField(default=list) # ["City View", "Free Minibar", "Bathtub", "Balcony"]
    available_units = models.IntegerField(default=5)

    def __str__(self):
        return f"{self.hotel.name} - {self.room_name} (${self.price_per_night}/night)"


class HotelBooking(models.Model):
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name='hotel_detail')
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE, related_name='bookings')
    room = models.ForeignKey(HotelRoom, on_delete=models.CASCADE, related_name='room_bookings')
    check_in_date = models.DateField()
    check_out_date = models.DateField()
    nights = models.IntegerField(default=1)
    rooms_count = models.IntegerField(default=1)
    guests_count = models.IntegerField(default=2)
    guest_names = models.JSONField(default=list)
    special_requests = models.TextField(blank=True, null=True)
    voucher_number = models.CharField(max_length=50, unique=True, blank=True, null=True)

    def __str__(self):
        return f"Hotel Voucher {self.voucher_number} for {self.hotel.name}"
