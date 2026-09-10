from django.db import models

class NewsletterSubscriber(models.Model):
    email = models.EmailField(unique=True)
    preferred_interests = models.CharField(max_length=255, default='All Deals, Luxury Travel, Umrah, Flight Flash Sales')
    is_active = models.BooleanField(default=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email


class NewsletterCampaign(models.Model):
    subject = models.CharField(max_length=200) # e.g. "Exclusive: 40% Off Swiss Alps Tours & Free eSIM on Flights!"
    preview_text = models.CharField(max_length=255, default='Unwrap our weekly exclusive global travel privileges.')
    content_html = models.TextField()
    sent_to_count = models.IntegerField(default=12400)
    sent_at = models.DateTimeField(auto_now_add=True)
    is_published = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.subject} ({self.sent_at.strftime('%Y-%m-%d')})"
