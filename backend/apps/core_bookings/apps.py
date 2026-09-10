from django.apps import AppConfig

class CoreBookingsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.core_bookings'
    verbose_name = 'Unified Bookings Engine'

    def ready(self):
        import apps.core_bookings.signals
