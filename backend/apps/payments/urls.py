from django.urls import path
from .views import CreatePaymentIntentView, VerifyPaymentWebhookView

urlpatterns = [
    path('create-intent/', CreatePaymentIntentView.as_view(), name='create_payment_intent'),
    path('verify/', VerifyPaymentWebhookView.as_view(), name='verify_payment'),
]
