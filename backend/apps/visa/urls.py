from django.urls import path
from .views import (
    VisaCountryListView,
    VisaCountryDetailView,
    VisaApplicationSubmitView,
    VisaApplicationTrackView
)

urlpatterns = [
    path('countries/', VisaCountryListView.as_view(), name='visa_countries'),
    path('countries/<str:country_code>/', VisaCountryDetailView.as_view(), name='visa_country_detail'),
    path('apply/', VisaApplicationSubmitView.as_view(), name='visa_apply'),
    path('track/<str:reference>/', VisaApplicationTrackView.as_view(), name='visa_track'),
]
