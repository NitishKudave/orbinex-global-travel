from django.urls import path
from .views import (
    BusTripSearchListView,
    BusTripDetailView,
    BusBookingCreateView,
    BusSuggestionsView
)

urlpatterns = [
    path('', BusTripSearchListView.as_view(), name='bus_list'),
    path('search/', BusTripSearchListView.as_view(), name='bus_search'),
    path('suggestions/', BusSuggestionsView.as_view(), name='bus_suggestions'),
    path('<int:pk>/', BusTripDetailView.as_view(), name='bus_detail'),
    path('book/', BusBookingCreateView.as_view(), name='bus_book'),
]
