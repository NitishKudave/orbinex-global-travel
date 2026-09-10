from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    passport_number = models.CharField(max_length=50, blank=True, null=True)
    passport_expiry = models.DateField(blank=True, null=True)
    nationality = models.CharField(max_length=100, blank=True, null=True, default='United States')
    preferred_currency = models.CharField(max_length=5, default='USD')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.username} ({self.email})"


class SavedTraveler(models.Model):
    GENDER_CHOICES = (
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
    )
    TRAVELER_TYPE_CHOICES = (
        ('adult', 'Adult (12+ yrs)'),
        ('child', 'Child (2-11 yrs)'),
        ('infant', 'Infant (under 2 yrs)'),
    )

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='saved_travelers')
    title = models.CharField(max_length=10, default='Mr')
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    date_of_birth = models.DateField(blank=True, null=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, default='male')
    traveler_type = models.CharField(max_length=10, choices=TRAVELER_TYPE_CHOICES, default='adult')
    passport_number = models.CharField(max_length=50, blank=True, null=True)
    passport_expiry = models.DateField(blank=True, null=True)
    passport_country = models.CharField(max_length=100, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    frequent_flyer_number = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.traveler_type})"
