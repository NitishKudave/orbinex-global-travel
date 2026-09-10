from rest_framework import serializers
from .models import BusOperator, BusTrip, BusSeat, BusBooking

class BusOperatorSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusOperator
        fields = '__all__'


class BusSeatSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusSeat
        fields = '__all__'


class BusTripSerializer(serializers.ModelSerializer):
    operator = BusOperatorSerializer(read_only=True)
    seats = BusSeatSerializer(many=True, read_only=True)

    class Meta:
        model = BusTrip
        fields = '__all__'


class BusBookingSerializer(serializers.ModelSerializer):
    trip = BusTripSerializer(read_only=True)

    class Meta:
        model = BusBooking
        fields = '__all__'
