from django.urls import path
from .views import (
    UmrahPackageListView,
    UmrahPackageDetailView,
    UmrahPackageBookingView
)

urlpatterns = [
    path('packages/', UmrahPackageListView.as_view(), name='umrah_packages'),
    path('packages/<int:pk>/', UmrahPackageDetailView.as_view(), name='umrah_package_detail'),
    path('book/', UmrahPackageBookingView.as_view(), name='umrah_book'),
]
