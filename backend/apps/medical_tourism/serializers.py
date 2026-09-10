from rest_framework import serializers
from .models import MedicalSpecialty, MedicalHospital, MedicalPackage, MedicalEnquiry

class MedicalSpecialtySerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalSpecialty
        fields = '__all__'


class MedicalHospitalSerializer(serializers.ModelSerializer):
    specialties = MedicalSpecialtySerializer(many=True, read_only=True)

    class Meta:
        model = MedicalHospital
        fields = '__all__'


class MedicalPackageSerializer(serializers.ModelSerializer):
    hospital = MedicalHospitalSerializer(read_only=True)
    specialty = MedicalSpecialtySerializer(read_only=True)

    class Meta:
        model = MedicalPackage
        fields = '__all__'


class MedicalEnquirySerializer(serializers.ModelSerializer):
    hospital = MedicalHospitalSerializer(read_only=True)

    class Meta:
        model = MedicalEnquiry
        fields = '__all__'
