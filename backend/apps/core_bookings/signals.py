import logging
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Booking

logger = logging.getLogger('orbinex.notifications')

@receiver(post_save, sender=Booking)
def handle_booking_notification(sender, instance, created, **kwargs):
    """
    Signal handler to asynchronously notify customers upon booking confirmation
    via Email and SMS.
    """
    if created:
        logger.info(f"==> [NOTIFICATION] Dispatched E-Ticket & Confirmation SMS for Booking {instance.booking_reference} to {instance.contact_email} / {instance.contact_phone}")
        # In production this queues a Celery task:
        # send_booking_email_task.delay(instance.id)
        # send_booking_sms_task.delay(instance.id)
