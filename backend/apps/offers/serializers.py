from rest_framework import serializers
from .models import CouponCode, PromotionalDeal

class CouponCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CouponCode
        fields = '__all__'


class PromotionalDealSerializer(serializers.ModelSerializer):
    coupon_code = CouponCodeSerializer(read_only=True)

    class Meta:
        model = PromotionalDeal
        fields = '__all__'
