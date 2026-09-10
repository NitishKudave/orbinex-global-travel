from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema
from .models import NewsletterSubscriber, NewsletterCampaign
from .serializers import NewsletterSubscriberSerializer, NewsletterCampaignSerializer

class NewsletterSubscribeView(APIView):
    permission_classes = (permissions.AllowAny,)

    @extend_schema(summary="Subscribe to newsletter and VIP deal alerts")
    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        if not email or '@' not in email:
            return Response({"error": "Please provide a valid email address."}, status=status.HTTP_400_BAD_REQUEST)

        subscriber, created = NewsletterSubscriber.objects.get_or_create(email=email)
        if not created and not subscriber.is_active:
            subscriber.is_active = True
            subscriber.save()

        return Response({
            "message": "Thank you for subscribing to OrbinexGlobal Travel VIP alerts!",
            "email": email,
            "created": created
        }, status=status.HTTP_201_CREATED)


class NewsletterCampaignListView(generics.ListAPIView):
    queryset = NewsletterCampaign.objects.filter(is_published=True).order_by('-sent_at')
    serializer_class = NewsletterCampaignSerializer
    permission_classes = (permissions.AllowAny,)
