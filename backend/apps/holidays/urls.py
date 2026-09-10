from django.urls import path
from .views import (
    HolidayDestinationListView,
    HolidayPackageListView,
    HolidayPackageDetailView,
    HolidayBookingCreateView
)

urlpatterns = [
    path('destinations/', HolidayDestinationListView.as_view(), name='holiday_destinations'),
    path('packages/', HolidayPackageListView.as_view(), name='holiday_packages'),
    path('packages/<int:pk>/', HolidayPackageDetailView.as_view(), name='holiday_package_detail'),
    path('book/', HolidayBookingCreateView.as_view(), name='holiday_book'),
]
