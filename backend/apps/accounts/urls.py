from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    CustomTokenObtainPairView,
    RegisterView,
    UserProfileView,
    SavedTravelerListCreateView,
    SavedTravelerDetailView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='auth_login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', UserProfileView.as_view(), name='user_profile'),
    path('travelers/', SavedTravelerListCreateView.as_view(), name='saved_travelers_list'),
    path('travelers/<int:pk>/', SavedTravelerDetailView.as_view(), name='saved_traveler_detail'),
]
