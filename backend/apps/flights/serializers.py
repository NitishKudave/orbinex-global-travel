from rest_framework import serializers
from .models import Airline, Airport, FlightSchedule, FlightSeat, FlightBooking

class AirlineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Airline
        fields = '__all__'


class AirportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Airport
        fields = '__all__'


class FlightSeatSerializer(serializers.ModelSerializer):
    class Meta:
        model = FlightSeat
        fields = '__all__'


class FlightScheduleSerializer(serializers.ModelSerializer):
    airline = AirlineSerializer(read_only=True)
    origin = AirportSerializer(read_only=True)
    destination = AirportSerializer(read_only=True)
    seats = FlightSeatSerializer(many=True, read_only=True)

    class Meta:
        model = FlightSchedule
        fields = '__all__'


class FlightBookingSerializer(serializers.ModelSerializer):
    flight_schedule = FlightScheduleSerializer(read_only=True)

    class Meta:
        model = FlightBooking
        fields = '__all__'
