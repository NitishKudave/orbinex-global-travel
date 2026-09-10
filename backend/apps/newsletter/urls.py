from django.urls import path
from .views import NewsletterSubscribeView, NewsletterCampaignListView

urlpatterns = [
    path('subscribe/', NewsletterSubscribeView.as_view(), name='newsletter_subscribe'),
    path('campaigns/', NewsletterCampaignListView.as_view(), name='newsletter_campaigns'),
]
