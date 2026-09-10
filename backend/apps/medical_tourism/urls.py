from django.urls import path
from .views import (
    MedicalSpecialtyListView,
    MedicalHospitalListView,
    MedicalPackageListView,
    MedicalEnquirySubmitView
)

urlpatterns = [
    path('specialties/', MedicalSpecialtyListView.as_view(), name='medical_specialties'),
    path('hospitals/', MedicalHospitalListView.as_view(), name='medical_hospitals'),
    path('packages/', MedicalPackageListView.as_view(), name='medical_packages'),
    path('enquire/', MedicalEnquirySubmitView.as_view(), name='medical_enquire'),
]
