from rest_framework import serializers
from .models import Booking

class BookingSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ('id', 'booking_reference', 'created_at', 'updated_at')


class UnifiedCheckoutItemSerializer(serializers.Serializer):
    booking_type = serializers.ChoiceField(choices=Booking.BOOKING_TYPE_CHOICES)
    title = serializers.CharField()
    amount = serializers.DecimalField(max_digits=12, decimal_places=2)
    details = serializers.DictField(default=dict)
    travel_date = serializers.DateField(required=False, allow_null=True)
    return_date = serializers.DateField(required=False, allow_null=True)


class UnifiedCheckoutRequestSerializer(serializers.Serializer):
    items = serializers.ListField(child=UnifiedCheckoutItemSerializer(), min_length=1)
    contact_name = serializers.CharField(max_length=150)
    contact_email = serializers.EmailField()
    contact_phone = serializers.CharField(max_length=30)
    currency = serializers.CharField(default='USD')
    coupon_code = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    discount_amount = serializers.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    payment_method = serializers.CharField(default='credit_card')
    payment_token = serializers.CharField(required=False, allow_blank=True, default='simulated_success')
