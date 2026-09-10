from django.contrib import admin
from .models import NewsletterSubscriber, NewsletterCampaign

@admin.register(NewsletterSubscriber)
class NewsletterSubscriberAdmin(admin.ModelAdmin):
    list_display = ('email', 'is_active', 'subscribed_at')
    search_fields = ('email',)

@admin.register(NewsletterCampaign)
class NewsletterCampaignAdmin(admin.ModelAdmin):
    list_display = ('subject', 'sent_to_count', 'sent_at', 'is_published')
