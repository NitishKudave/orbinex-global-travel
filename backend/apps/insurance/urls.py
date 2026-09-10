from django.urls import path
from .views import (
    InsurancePlanListView,
    InsurancePlanDetailView,
    InsurancePolicyPurchaseView
)

urlpatterns = [
    path('plans/', InsurancePlanListView.as_view(), name='insurance_plans'),
    path('plans/<int:pk>/', InsurancePlanDetailView.as_view(), name='insurance_plan_detail'),
    path('purchase/', InsurancePolicyPurchaseView.as_view(), name='insurance_purchase'),
]
