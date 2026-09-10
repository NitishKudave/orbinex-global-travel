from decimal import Decimal
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiTypes
from .models import CouponCode, PromotionalDeal
from .serializers import CouponCodeSerializer, PromotionalDealSerializer

class OffersListView(generics.ListAPIView):
    serializer_class = PromotionalDealSerializer
    permission_classes = (permissions.AllowAny,)

    @extend_schema(
        summary="List promotional deals and bank offers",
        parameters=[
            OpenApiParameter('category', OpenApiTypes.STR, description='flight, hotel, holiday, bank')
        ]
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        qs = PromotionalDeal.objects.filter(is_featured=True).select_related('coupon_code')
        category = self.request.query_params.get('category')
        if category and category != 'all':
            qs = qs.filter(category=category)
        return qs


class CouponValidateView(APIView):
    permission_classes = (permissions.AllowAny,)

    @extend_schema(
        summary="Validate coupon code and calculate discount amount"
    )
    def post(self, request):
        code_str = request.data.get('code', '').strip().upper()
        cart_total = Decimal(str(request.data.get('amount', '0.00')))
        module = request.data.get('module', 'all')

        try:
            coupon = CouponCode.objects.get(code__iexact=code_str, is_active=True)
        except CouponCode.DoesNotExist:
            return Response({
                "valid": False,
                "message": "Invalid or expired coupon code."
            }, status=status.HTTP_400_BAD_REQUEST)

        if cart_total < coupon.min_booking_amount:
            return Response({
                "valid": False,
                "message": f"Minimum booking amount of ${coupon.min_booking_amount} required to use {coupon.code}."
            }, status=status.HTTP_400_BAD_REQUEST)

        if coupon.applicable_module != 'all' and coupon.applicable_module != module:
            return Response({
                "valid": False,
                "message": f"This coupon is only valid for {coupon.get_applicable_module_display()}."
            }, status=status.HTTP_400_BAD_REQUEST)

        if coupon.discount_type == 'percentage':
            calculated = (cart_total * coupon.discount_value) / Decimal('100.00')
            discount = min(calculated, coupon.max_discount_amount)
        else:
            discount = min(coupon.discount_value, cart_total)

        new_total = max(Decimal('0.00'), cart_total - discount)

        return Response({
            "valid": True,
            "code": coupon.code,
            "title": coupon.title,
            "discount_amount": float(discount),
            "original_total": float(cart_total),
            "new_total": float(new_total),
            "message": f"Coupon applied! You saved ${discount:.2f}"
        })
