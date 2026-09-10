import uuid
from decimal import Decimal
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiTypes
from apps.core_bookings.models import Booking
from .models import HolidayDestination, HolidayPackage, PackageItineraryDay, HolidayBooking
from .serializers import (
    HolidayDestinationSerializer,
    HolidayPackageListSerializer,
    HolidayPackageDetailSerializer,
    HolidayBookingSerializer
)

def get_or_create_dynamic_holiday_packages(destination_query: str):
    if not destination_query or len(destination_query.strip()) < 2:
        return []
    
    clean_dest = destination_query.strip().title()

    dest_obj, _ = HolidayDestination.objects.get_or_create(
        name=clean_dest,
        defaults={
            'region': 'Global Escapes',
            'image_url': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
            'tagline': f'Experience the Magic & Culture of {clean_dest}'
        }
    )

    pkg_templates = [
        {
            'destination': dest_obj,
            'title': f"Grand Highlights of {clean_dest}: 6 Days Luxury Vacation",
            'duration_days': 6,
            'duration_nights': 5,
            'price_per_person': Decimal('850.00'),
            'original_price': Decimal('1150.00'),
            'main_image': 'https://images.unsplash.com/photo-1540541338287-41700207dee6',
            'gallery_images': [
                'https://images.unsplash.com/photo-1540541338287-41700207dee6',
                'https://images.unsplash.com/photo-1507525428034-b723cf961d3e'
            ],
            'overview': f"Immerse yourself in the breathtaking landscapes, heritage monuments, and gourmet cuisine of {clean_dest}. Complete with 5-star resort accommodations, private luxury chauffeur, and curated VIP experiences.",
            'inclusions': ['5-Star Luxury Resort Stay (5 Nights)', 'Daily Gourmet Breakfast & 3 Dinners', 'Private Airport Transfers', 'English-Speaking Expert Guide', 'All Attraction Entry Passes'],
            'exclusions': ['International Flights', 'Personal Laundry & Drinks', 'Travel Visa Processing'],
            'hotel_rating': 5,
            'meals_included': 'Breakfast & Select Dinners',
            'flights_included': False,
            'is_trending': True,
            'itinerary': [
                {'day': 1, 'title': f'Arrival in {clean_dest} & Sunset Welcome Cocktail', 'desc': f'VIP airport greeting and chauffeured transfer to your 5-star resort in {clean_dest}. Evening sunset cocktails and traditional welcome dinner.', 'meals': 'Dinner'},
                {'day': 2, 'title': f'{clean_dest} Iconic City Tour & Cultural Discovery', 'desc': 'Private guided morning excursion through heritage landmarks, artisan markets, and historic temples.', 'meals': 'Breakfast & Lunch'},
                {'day': 3, 'title': 'Scenic Mountain Panorama & Nature Safari', 'desc': 'Full day panoramic drive through scenic valleys, waterfalls, and scenic viewpoints with organic lunch.', 'meals': 'Breakfast & Lunch'},
                {'day': 4, 'title': 'Leisure Day & Luxury Spa Wellness', 'desc': 'Relax by the infinity pool or enjoy your complimentary 90-minute signature spa and wellness ritual.', 'meals': 'Breakfast'},
                {'day': 5, 'title': 'Catamaran Cruise & Farewell Gala Dinner', 'desc': 'Private yacht catamaran cruise along scenic coastlines followed by a farewell gourmet dinner.', 'meals': 'Breakfast & Dinner'},
                {'day': 6, 'title': f'Souvenir Shopping & Departure from {clean_dest}', 'desc': 'Free morning for boutique shopping before your chauffeured private transfer to the airport.', 'meals': 'Breakfast'}
            ]
        },
        {
            'destination': dest_obj,
            'title': f"{clean_dest} Romantic Getaway & Honeymoon Villa Special",
            'duration_days': 5,
            'duration_nights': 4,
            'price_per_person': Decimal('690.00'),
            'original_price': Decimal('920.00'),
            'main_image': 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a',
            'gallery_images': ['https://images.unsplash.com/photo-1499856871958-5b9627545d1a'],
            'overview': f"The ultimate romantic escape to {clean_dest} featuring private pool villa stay, candlelight beachfront dinner, and champagne sunset cruise.",
            'inclusions': ['Private Pool Villa (4 Nights)', 'Daily Champagne Breakfast', 'Couples Spa Ritual', 'Private Candlelight Dinner'],
            'exclusions': ['Flight Tickets', 'Personal Expenses'],
            'hotel_rating': 5,
            'meals_included': 'Breakfast & Candlelight Dinner',
            'flights_included': False,
            'is_trending': True,
            'itinerary': [
                {'day': 1, 'title': 'Arrival & Check-in to Private Pool Villa', 'desc': 'Welcome champagne and romantic flower decoration.', 'meals': 'Dinner'},
                {'day': 2, 'title': 'Couples Aromatherapy Spa & Sunset Point', 'desc': 'Rejuvenate with organic herbal therapies.', 'meals': 'Breakfast'},
                {'day': 3, 'title': 'Private Candlelight Dinner by the Beach', 'desc': '5-course chef tasting menu under the stars.', 'meals': 'Breakfast & Dinner'},
                {'day': 4, 'title': 'Island Cruise & Snorkeling', 'desc': 'Explore vibrant coral reefs and azure waters.', 'meals': 'Breakfast'},
                {'day': 5, 'title': 'Leisure & Airport Transfer', 'desc': 'Private limousine transfer to airport.', 'meals': 'Breakfast'}
            ]
        }
    ]

    created_pkgs = []
    for p in pkg_templates:
        itinerary_data = p.pop('itinerary')
        pkg, created = HolidayPackage.objects.get_or_create(
            destination=p['destination'],
            title=p['title'],
            defaults=p
        )
        if created or pkg.itinerary_days.count() == 0:
            for it in itinerary_data:
                PackageItineraryDay.objects.create(
                    package=pkg,
                    day_number=it['day'],
                    title=it['title'],
                    description=it['desc'],
                    meals_today=it['meals']
                )
        created_pkgs.append(pkg)

    return created_pkgs


class HolidayDestinationListView(generics.ListAPIView):
    queryset = HolidayDestination.objects.all()
    serializer_class = HolidayDestinationSerializer
    permission_classes = (permissions.AllowAny,)


class HolidayPackageListView(generics.ListAPIView):
    serializer_class = HolidayPackageListSerializer
    permission_classes = (permissions.AllowAny,)

    @extend_schema(
        summary="Search holiday tour packages",
        parameters=[
            OpenApiParameter('destination', OpenApiTypes.STR, description='Destination name or country'),
            OpenApiParameter('max_price', OpenApiTypes.FLOAT, description='Maximum price per person'),
            OpenApiParameter('duration', OpenApiTypes.INT, description='Duration in days'),
            OpenApiParameter('trending', OpenApiTypes.BOOL, description='Trending packages only'),
        ]
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        destination_name = (self.request.query_params.get('destination') or '').strip()
        max_price = self.request.query_params.get('max_price')
        duration = self.request.query_params.get('duration')
        is_trending = self.request.query_params.get('trending')

        qs = HolidayPackage.objects.all().select_related('destination')

        if destination_name:
            qs = qs.filter(Q(destination__name__icontains=destination_name) | Q(title__icontains=destination_name))

        if destination_name and qs.count() == 0:
            get_or_create_dynamic_holiday_packages(destination_name)
            qs = HolidayPackage.objects.filter(
                Q(destination__name__icontains=destination_name) | Q(title__icontains=destination_name)
            ).select_related('destination')

        if max_price:
            qs = qs.filter(price_per_person__lte=float(max_price))
        if duration:
            qs = qs.filter(duration_days=int(duration))
        if is_trending == 'true':
            qs = qs.filter(is_trending=True)

        return qs.order_by('-is_trending', 'price_per_person')


class HolidayPackageDetailView(generics.RetrieveAPIView):
    queryset = HolidayPackage.objects.all().select_related('destination').prefetch_related('itinerary_days')
    serializer_class = HolidayPackageDetailSerializer
    permission_classes = (permissions.AllowAny,)


class HolidayBookingCreateView(APIView):
    permission_classes = (permissions.AllowAny,)

    @extend_schema(
        summary="Book a holiday package",
        responses={201: HolidayBookingSerializer}
    )
    def post(self, request):
        data = request.data
        package_id = data.get('package_id')
        travel_date = data.get('travel_date')
        travelers_count = int(data.get('travelers_count', 2))
        room_sharing = data.get('room_sharing', 'Twin Sharing')
        contact_name = data.get('contact_name', 'Lead Traveler')
        contact_email = data.get('contact_email', 'traveler@example.com')
        contact_phone = data.get('contact_phone', '+1234567890')
        currency = data.get('currency', 'USD')
        custom_requests = data.get('custom_requests', '')

        try:
            package = HolidayPackage.objects.get(id=package_id)
        except HolidayPackage.DoesNotExist:
            return Response({"error": "Package not found"}, status=status.HTTP_404_NOT_FOUND)

        total_amount = float(package.price_per_person) * travelers_count

        user = request.user if request.user.is_authenticated else None

        booking = Booking.objects.create(
            user=user,
            booking_type='holiday',
            title=f"Holiday Tour: {package.title}",
            summary=f"{package.duration_days} Days / {package.duration_nights} Nights • {travelers_count} Traveler(s) • {room_sharing}",
            total_amount=total_amount,
            final_amount=total_amount,
            currency=currency,
            contact_name=contact_name,
            contact_email=contact_email,
            contact_phone=contact_phone,
            travel_date=travel_date,
            details_json={
                "package_title": package.title,
                "destination": package.destination.name,
                "duration_days": package.duration_days,
                "duration_nights": package.duration_nights,
                "travelers_count": travelers_count,
                "room_sharing": room_sharing,
                "custom_requests": custom_requests,
                "inclusions": package.inclusions
            },
            status='confirmed',
            payment_status='paid'
        )

        holiday_booking = HolidayBooking.objects.create(
            booking=booking,
            package=package,
            travel_date=travel_date,
            travelers_count=travelers_count,
            room_sharing=room_sharing,
            custom_requests=custom_requests
        )

        return Response({
            "message": "Holiday package booked successfully!",
            "booking_reference": booking.booking_reference,
            "holiday_booking": HolidayBookingSerializer(holiday_booking).data
        }, status=status.HTTP_201_CREATED)
