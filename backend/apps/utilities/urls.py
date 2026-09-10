from django.urls import path
from .views import (
    ForexRateListView,
    EsimPackageListView,
    AirportLoungeListView,
    UtilityBookingView
)

urlpatterns = [
    path('forex/', ForexRateListView.as_view(), name='forex_rates'),
    path('esim/', EsimPackageListView.as_view(), name='esim_packages'),
    path('lounges/', AirportLoungeListView.as_view(), name='airport_lounges'),
    path('book/', UtilityBookingView.as_view(), name='utility_book'),
]
