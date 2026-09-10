from django.urls import path
from .views import (
    AirportListView,
    FlightSearchListView,
    FlightScheduleDetailView,
    FlightBookingCreateView
)

urlpatterns = [
    path('', FlightSearchListView.as_view(), name='flight_list'),
    path('airports/', AirportListView.as_view(), name='airport_list'),
    path('search/', FlightSearchListView.as_view(), name='flight_search'),
    path('schedules/', FlightSearchListView.as_view(), name='flight_schedules'),
    path('schedules/<int:pk>/', FlightScheduleDetailView.as_view(), name='flight_schedule_detail'),
    path('book/', FlightBookingCreateView.as_view(), name='flight_book'),
]
