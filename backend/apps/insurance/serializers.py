from rest_framework import serializers
from .models import InsuranceProvider, InsurancePlan, InsurancePolicy

class InsuranceProviderSerializer(serializers.ModelSerializer):
    class Meta:
        model = InsuranceProvider
        fields = '__all__'


class InsurancePlanSerializer(serializers.ModelSerializer):
    provider = InsuranceProviderSerializer(read_only=True)

    class Meta:
        model = InsurancePlan
        fields = '__all__'


class InsurancePolicySerializer(serializers.ModelSerializer):
    plan = InsurancePlanSerializer(read_only=True)

    class Meta:
        model = InsurancePolicy
        fields = '__all__'
