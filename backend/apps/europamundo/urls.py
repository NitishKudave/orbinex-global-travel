from django.urls import path
from .views import (
    EuropamundoTourListView,
    EuropamundoTourDetailView,
    EuropamundoTourBookingView
)

urlpatterns = [
    path('tours/', EuropamundoTourListView.as_view(), name='europamundo_tours'),
    path('tours/<int:pk>/', EuropamundoTourDetailView.as_view(), name='europamundo_tour_detail'),
    path('book/', EuropamundoTourBookingView.as_view(), name='europamundo_book'),
]
