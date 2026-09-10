from rest_framework import serializers
from .models import HolidayDestination, HolidayPackage, PackageItineraryDay, HolidayBooking

class PackageItineraryDaySerializer(serializers.ModelSerializer):
    class Meta:
        model = PackageItineraryDay
        fields = '__all__'


class HolidayDestinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = HolidayDestination
        fields = '__all__'


class HolidayPackageListSerializer(serializers.ModelSerializer):
    destination = HolidayDestinationSerializer(read_only=True)

    class Meta:
        model = HolidayPackage
        fields = '__all__'


class HolidayPackageDetailSerializer(serializers.ModelSerializer):
    destination = HolidayDestinationSerializer(read_only=True)
    itinerary_days = PackageItineraryDaySerializer(many=True, read_only=True)

    class Meta:
        model = HolidayPackage
        fields = '__all__'


class HolidayBookingSerializer(serializers.ModelSerializer):
    package = HolidayPackageListSerializer(read_only=True)

    class Meta:
        model = HolidayBooking
        fields = '__all__'
