from django.urls import path
from .views import OffersListView, CouponValidateView

urlpatterns = [
    path('', OffersListView.as_view(), name='offers_list'),
    path('validate/', CouponValidateView.as_view(), name='coupon_validate'),
]
