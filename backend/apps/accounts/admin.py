from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, SavedTraveler

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'phone_number', 'nationality', 'is_staff')
    fieldsets = UserAdmin.fieldsets + (
        ('Travel Profile', {'fields': ('phone_number', 'avatar', 'passport_number', 'passport_expiry', 'nationality', 'preferred_currency')}),
    )

@admin.register(SavedTraveler)
class SavedTravelerAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'user', 'gender', 'traveler_type', 'passport_number')
    search_fields = ('first_name', 'last_name', 'passport_number', 'user__username', 'user__email')
