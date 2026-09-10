from rest_framework import serializers
from .models import UmrahHotel, UmrahPackage, UmrahBooking

class UmrahHotelSerializer(serializers.ModelSerializer):
    class Meta:
        model = UmrahHotel
        fields = '__all__'


class UmrahPackageSerializer(serializers.ModelSerializer):
    makkah_hotel = UmrahHotelSerializer(read_only=True)
    madinah_hotel = UmrahHotelSerializer(read_only=True)

    class Meta:
        model = UmrahPackage
        fields = '__all__'


class UmrahBookingSerializer(serializers.ModelSerializer):
    package = UmrahPackageSerializer(read_only=True)

    class Meta:
        model = UmrahBooking
        fields = '__all__'
