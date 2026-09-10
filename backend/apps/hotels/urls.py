from django.urls import path
from .views import (
    HotelSearchListView,
    HotelDetailView,
    HotelBookingCreateView
)

urlpatterns = [
    path('', HotelSearchListView.as_view(), name='hotel_list'),
    path('search/', HotelSearchListView.as_view(), name='hotel_search'),
    path('<int:pk>/', HotelDetailView.as_view(), name='hotel_detail'),
    path('book/', HotelBookingCreateView.as_view(), name='hotel_book'),
]
