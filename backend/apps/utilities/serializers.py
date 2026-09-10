from rest_framework import serializers
from .models import ForexRate, EsimPackage, AirportLounge

class ForexRateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ForexRate
        fields = '__all__'


class EsimPackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = EsimPackage
        fields = '__all__'


class AirportLoungeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AirportLounge
        fields = '__all__'
