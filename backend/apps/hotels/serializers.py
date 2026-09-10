from rest_framework import serializers
from .models import Hotel, HotelAmenity, HotelRoom, HotelBooking

class HotelAmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = HotelAmenity
        fields = '__all__'


class HotelRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = HotelRoom
        fields = '__all__'


class HotelListSerializer(serializers.ModelSerializer):
    amenities = HotelAmenitySerializer(many=True, read_only=True)

    class Meta:
        model = Hotel
        fields = '__all__'


class HotelDetailSerializer(serializers.ModelSerializer):
    amenities = HotelAmenitySerializer(many=True, read_only=True)
    rooms = HotelRoomSerializer(many=True, read_only=True)

    class Meta:
        model = Hotel
        fields = '__all__'


class HotelBookingSerializer(serializers.ModelSerializer):
    hotel = HotelListSerializer(read_only=True)
    room = HotelRoomSerializer(read_only=True)

    class Meta:
        model = HotelBooking
        fields = '__all__'
