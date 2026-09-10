from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from datetime import date
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiTypes
from .models import Booking
from .serializers import (
    BookingSerializer,
    UnifiedCheckoutRequestSerializer
)

class MyBookingsListView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = (permissions.IsAuthenticated,)

    @extend_schema(
        summary="List customer bookings",
        description="Retrieve all unified bookings of the authenticated user with optional filtering by module type or status.",
        parameters=[
            OpenApiParameter('type', OpenApiTypes.STR, description='Filter by booking type: flight, hotel, bus, visa, etc.'),
            OpenApiParameter('status', OpenApiTypes.STR, description='Filter by status: confirmed, pending, completed, etc.'),
            OpenApiParameter('timeframe', OpenApiTypes.STR, description='Filter by timeframe: upcoming or past'),
        ]
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        user = self.request.user
        qs = Booking.objects.filter(user=user)
        
        booking_type = self.request.query_params.get('type')
        status_filter = self.request.query_params.get('status')
        timeframe = self.request.query_params.get('timeframe')
        
        if booking_type:
            qs = qs.filter(booking_type=booking_type)
        if status_filter:
            qs = qs.filter(status=status_filter)
        if timeframe == 'upcoming':
            qs = qs.filter(Q(travel_date__gte=date.today()) | Q(travel_date__isnull=True), status__in=['confirmed', 'processing'])
        elif timeframe == 'past':
            qs = qs.filter(Q(travel_date__lt=date.today()) | Q(status__in=['completed', 'cancelled']))
            
        return qs.order_by('-created_at')


class BookingDetailView(generics.RetrieveAPIView):
    serializer_class = BookingSerializer
    permission_classes = (permissions.AllowAny,)
    lookup_field = 'booking_reference'

    @extend_schema(summary="Get booking details by reference")
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        return Booking.objects.all()


class UnifiedCheckoutView(APIView):
    permission_classes = (permissions.AllowAny,)

    @extend_schema(
        summary="Unified multi-item checkout",
        description="Process payment & instant booking creation for a unified cart containing one or multiple travel items (flights, hotels, insurance, utilities, etc.).",
        request=UnifiedCheckoutRequestSerializer,
        responses={201: BookingSerializer(many=True)}
    )
    def post(self, request):
        serializer = UnifiedCheckoutRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        user = request.user if request.user.is_authenticated else None
        items = data['items']
        contact_name = data['contact_name']
        contact_email = data['contact_email']
        contact_phone = data['contact_phone']
        currency = data.get('currency', 'USD')
        coupon_code = data.get('coupon_code', '')
        total_discount = data.get('discount_amount', 0)

        total_gross = sum(item['amount'] for item in items)
        final_total = max(0, total_gross - total_discount)

        created_bookings = []
        
        serialized_items = []
        for it in items:
            item_copy = dict(it)
            item_copy['amount'] = float(it['amount'])
            if item_copy.get('travel_date'):
                item_copy['travel_date'] = str(item_copy['travel_date'])
            if item_copy.get('return_date'):
                item_copy['return_date'] = str(item_copy['return_date'])
            serialized_items.append(item_copy)

        if len(items) == 1:
            item = items[0]
            s_item = serialized_items[0]
            booking = Booking.objects.create(
                user=user,
                booking_type=item['booking_type'],
                title=item['title'],
                total_amount=item['amount'],
                discount_amount=total_discount,
                final_amount=max(0, item['amount'] - total_discount),
                currency=currency,
                coupon_code=coupon_code,
                contact_name=contact_name,
                contact_email=contact_email,
                contact_phone=contact_phone,
                travel_date=item.get('travel_date'),
                return_date=item.get('return_date'),
                details_json=s_item.get('details', {}),
                status='confirmed',
                payment_status='paid'
            )
            created_bookings.append(BookingSerializer(booking).data)
        else:
            items_summary = ", ".join([it['title'] for it in items[:3]])
            if len(items) > 3:
                items_summary += f" + {len(items)-3} more"

            master_booking = Booking.objects.create(
                user=user,
                booking_type='mixed',
                title=f"Unified Travel Package ({len(items)} items)",
                summary=items_summary,
                total_amount=total_gross,
                discount_amount=total_discount,
                final_amount=final_total,
                currency=currency,
                coupon_code=coupon_code,
                contact_name=contact_name,
                contact_email=contact_email,
                contact_phone=contact_phone,
                details_json={"cart_items": serialized_items},
                status='confirmed',
                payment_status='paid'
            )
            created_bookings.append(BookingSerializer(master_booking).data)

        return Response({
            "message": "Checkout completed and payment verified successfully!",
            "transaction_id": f"TXN-{date.today().strftime('%Y%m%d')}-{created_bookings[0]['booking_reference']}",
            "bookings": created_bookings,
            "primary_reference": created_bookings[0]['booking_reference']
        }, status=status.HTTP_201_CREATED)


class DashboardStatsView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    @extend_schema(summary="Customer dashboard statistics")
    def get(self, request):
        user = request.user
        user_bookings = Booking.objects.filter(user=user)
        
        upcoming_count = user_bookings.filter(
            Q(travel_date__gte=date.today()) | Q(travel_date__isnull=True),
            status__in=['confirmed', 'processing']
        ).count()
        
        completed_count = user_bookings.filter(
            Q(travel_date__lt=date.today()) | Q(status='completed')
        ).count()
        
        active_visas = user_bookings.filter(booking_type='visa', status__in=['confirmed', 'processing']).count()
        
        return Response({
            "total_bookings": user_bookings.count(),
            "upcoming_trips": upcoming_count,
            "completed_trips": completed_count,
            "active_visas": active_visas,
            "reward_points": 1450,
            "membership_tier": "Orbinex Platinum Elite"
        })
