from rest_framework import serializers
from .models import EuropamundoTour, TourStop, TourDeparture

class TourStopSerializer(serializers.ModelSerializer):
    class Meta:
        model = TourStop
        fields = '__all__'


class TourDepartureSerializer(serializers.ModelSerializer):
    class Meta:
        model = TourDeparture
        fields = '__all__'


class EuropamundoTourListSerializer(serializers.ModelSerializer):
    class Meta:
        model = EuropamundoTour
        fields = '__all__'


class EuropamundoTourDetailSerializer(serializers.ModelSerializer):
    stops = TourStopSerializer(many=True, read_only=True)
    departures = TourDepartureSerializer(many=True, read_only=True)

    class Meta:
        model = EuropamundoTour
        fields = '__all__'
