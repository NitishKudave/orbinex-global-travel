from rest_framework import serializers
from .models import VisaCountry, VisaType, VisaApplication

class VisaTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = VisaType
        fields = '__all__'


class VisaCountrySerializer(serializers.ModelSerializer):
    visa_types = VisaTypeSerializer(many=True, read_only=True)

    class Meta:
        model = VisaCountry
        fields = '__all__'


class VisaApplicationSerializer(serializers.ModelSerializer):
    visa_country = VisaCountrySerializer(read_only=True)
    visa_type = VisaTypeSerializer(read_only=True)

    class Meta:
        model = VisaApplication
        fields = '__all__'
