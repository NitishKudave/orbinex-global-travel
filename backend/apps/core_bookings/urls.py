from django.urls import path
from .views import (
    MyBookingsListView,
    BookingDetailView,
    UnifiedCheckoutView,
    DashboardStatsView
)

urlpatterns = [
    path('my-bookings/', MyBookingsListView.as_view(), name='my_bookings_list'),
    path('checkout/', UnifiedCheckoutView.as_view(), name='unified_checkout'),
    path('stats/', DashboardStatsView.as_view(), name='dashboard_stats'),
    path('<str:booking_reference>/', BookingDetailView.as_view(), name='booking_detail'),
]
