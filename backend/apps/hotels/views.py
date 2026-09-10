import uuid
from decimal import Decimal
from datetime import datetime, date
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiTypes
from apps.core_bookings.models import Booking
from .models import Hotel, HotelRoom, HotelBooking, HotelAmenity
from .serializers import (
    HotelListSerializer,
    HotelDetailSerializer,
    HotelBookingSerializer,
    HotelAmenitySerializer
)

def get_or_create_dynamic_hotels(city_name: str):
    """
    Dynamically generates 4 luxury 5-star and 4-star properties with rooms and amenities
    for any searched city (e.g., Pune, Mumbai, Delhi, Jaipur, London, Dubai, Paris, etc.)
    so search queries always return rich, bookable stays.
    """
    if not city_name or len(city_name.strip()) < 2:
        return []

    clean_city = city_name.strip().title()
    
    # Common default amenities
    spa, _ = HotelAmenity.objects.get_or_create(name='Full-Service Spa & Wellness', defaults={'icon_name': 'sparkles'})
    dining, _ = HotelAmenity.objects.get_or_create(name='Michelin Star Dining', defaults={'icon_name': 'utensils'})
    gym, _ = HotelAmenity.objects.get_or_create(name='Fitness Center & Gym', defaults={'icon_name': 'dumbbell'})
    pool, _ = HotelAmenity.objects.get_or_create(name='Infinity Heated Pool', defaults={'icon_name': 'waves'})
    valet, _ = HotelAmenity.objects.get_or_create(name='Valet Parking', defaults={'icon_name': 'car'})
    concierge, _ = HotelAmenity.objects.get_or_create(name='24/7 Room Service & Concierge', defaults={'icon_name': 'bell'})

    hotel_templates = [
        {
            'name': f"The Ritz-Carlton Palace, {clean_city}",
            'city': clean_city,
            'country': 'India' if clean_city in ['Pune', 'Mumbai', 'Delhi', 'Goa', 'Jaipur', 'Bangalore', 'Solapur', 'Kolhapur', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad', 'Surat'] else 'International',
            'address': f"100 Heritage Boulevard, Central Business District, {clean_city}",
            'star_rating': 5,
            'guest_rating': Decimal('4.9'),
            'reviews_count': 1420,
            'price_per_night_start': Decimal('220.00'),
            'main_image': 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
            'images_gallery': [
                'https://images.unsplash.com/photo-1566073771259-6a8506099945',
                'https://images.unsplash.com/photo-1582719508461-905c673771fd',
                'https://images.unsplash.com/photo-1571896349842-33c89424de2d'
            ],
            'description': f"Ultra-luxury 5-star haven in the prestigious district of {clean_city}. Features panoramic skyline views, private butler service, Michelin-caliber gastronomy, and tranquil wellness sanctuary.",
            'free_cancellation': True,
            'breakfast_included': True,
            'featured': True,
            'rooms': [
                {'name': 'Deluxe Skyline King', 'desc': 'Spacious 55 sqm room with floor-to-ceiling glass, Italian marble bath, and king bed.', 'price': Decimal('220.00'), 'capacity': 2, 'bed': '1 King Bed', 'size': '55 sqm', 'avail': 5},
                {'name': 'Executive Club Suite', 'desc': 'Separate living lounge, complimentary club lounge access, high tea, and evening cocktails.', 'price': Decimal('380.00'), 'capacity': 3, 'bed': '1 King Bed + 1 Rollaway', 'size': '85 sqm', 'avail': 3},
                {'name': 'Presidential Penthouse', 'desc': 'Grand duplex with private jacuzzi, dining room for 8, and dedicated 24/7 personal butler.', 'price': Decimal('750.00'), 'capacity': 4, 'bed': '2 King Beds', 'size': '160 sqm', 'avail': 1},
            ]
        },
        {
            'name': f"JW Marriott Grand Luxury Resort, {clean_city}",
            'city': clean_city,
            'country': 'India' if clean_city in ['Pune', 'Mumbai', 'Delhi', 'Goa', 'Jaipur', 'Bangalore', 'Solapur', 'Kolhapur', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad', 'Surat'] else 'International',
            'address': f"Senapati Bapat Expressway Circle, {clean_city}",
            'star_rating': 5,
            'guest_rating': Decimal('4.8'),
            'reviews_count': 1850,
            'price_per_night_start': Decimal('160.00'),
            'main_image': 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb',
            'images_gallery': [
                'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb',
                'https://images.unsplash.com/photo-1578683010236-d716f9a3f461'
            ],
            'description': f"Modern oasis designed for discerning global travelers visiting {clean_city}. Boasts award-winning rooftop dining, outdoor heated infinity pool, and state-of-the-art wellness club.",
            'free_cancellation': True,
            'breakfast_included': True,
            'featured': True,
            'rooms': [
                {'name': 'Superior Garden View Room', 'desc': 'Overlooking manicured tropical gardens with bespoke linens and soaking tub.', 'price': Decimal('160.00'), 'capacity': 2, 'bed': '1 King or 2 Twins', 'size': '48 sqm', 'avail': 8},
                {'name': 'Grand Luxury Suite', 'desc': 'Panoramic terrace with private balcony, walk-in rain shower, and espresso bar.', 'price': Decimal('290.00'), 'capacity': 3, 'bed': '1 King Bed', 'size': '72 sqm', 'avail': 4},
            ]
        },
        {
            'name': f"Taj Gateway Heritage & Spa, {clean_city}",
            'city': clean_city,
            'country': 'India' if clean_city in ['Pune', 'Mumbai', 'Delhi', 'Goa', 'Jaipur', 'Bangalore', 'Solapur', 'Kolhapur', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad', 'Surat'] else 'International',
            'address': f"Royal Residency Avenue, {clean_city}",
            'star_rating': 5,
            'guest_rating': Decimal('4.9'),
            'reviews_count': 940,
            'price_per_night_start': Decimal('190.00'),
            'main_image': 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4',
            'images_gallery': ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4'],
            'description': f"Quintessential royal hospitality meets contemporary elegance. Renowned for Jiva Ayurvedic spa, authentic royal recipes, and serene poolside courtyards.",
            'free_cancellation': True,
            'breakfast_included': False,
            'featured': False,
            'rooms': [
                {'name': 'Heritage Deluxe Room', 'desc': 'Handcrafted teak furnishings, plush bedding, and artisanal bath essentials.', 'price': Decimal('190.00'), 'capacity': 2, 'bed': '1 King Bed', 'size': '50 sqm', 'avail': 6},
                {'name': 'Taj Royal Suite', 'desc': 'Lavish heritage suite with royal living salon, private balcony, and personal butler.', 'price': Decimal('420.00'), 'capacity': 4, 'bed': '1 King Bed + 2 Twin', 'size': '110 sqm', 'avail': 2},
            ]
        },
        {
            'name': f"Radisson Blu Executive Suites, {clean_city}",
            'city': clean_city,
            'country': 'India' if clean_city in ['Pune', 'Mumbai', 'Delhi', 'Goa', 'Jaipur', 'Bangalore', 'Solapur', 'Kolhapur', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad', 'Surat'] else 'International',
            'address': f"Airport Tech Park Junction, {clean_city}",
            'star_rating': 4,
            'guest_rating': Decimal('4.6'),
            'reviews_count': 760,
            'price_per_night_start': Decimal('95.00'),
            'main_image': 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa',
            'images_gallery': ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa'],
            'description': f"Modern executive hotel close to business hubs and airport in {clean_city}. Perfect for business travelers and weekend leisure stays.",
            'free_cancellation': True,
            'breakfast_included': True,
            'featured': False,
            'rooms': [
                {'name': 'Standard Business Room', 'desc': 'Ergonomic workspace, high-speed Wi-Fi, power rain shower, and comfortable queen bed.', 'price': Decimal('95.00'), 'capacity': 2, 'bed': '1 Queen Bed', 'size': '38 sqm', 'avail': 12},
                {'name': 'Junior Executive Suite', 'desc': 'Cozy sitting room with sofa bed, mini bar, and complimentary breakfast buffet.', 'price': Decimal('145.00'), 'capacity': 3, 'bed': '1 King Bed', 'size': '52 sqm', 'avail': 5},
            ]
        },
        {
            'name': f"Four Seasons Luxury Bay Resort, {clean_city}",
            'city': clean_city,
            'country': 'India' if clean_city in ['Pune', 'Mumbai', 'Delhi', 'Goa', 'Jaipur', 'Bangalore', 'Solapur', 'Kolhapur', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad', 'Surat'] else 'International',
            'address': f"Corniche Waterfront Promenade, {clean_city}",
            'star_rating': 5,
            'guest_rating': Decimal('4.9'),
            'reviews_count': 2200,
            'price_per_night_start': Decimal('310.00'),
            'main_image': 'https://images.unsplash.com/photo-1582719508461-905c673771fd',
            'images_gallery': ['https://images.unsplash.com/photo-1582719508461-905c673771fd', 'https://images.unsplash.com/photo-1566073771259-6a8506099945'],
            'description': f"Iconic waterfront property with private beach cabanas, 3 Michelin-starred dining venues, and world-class spa.",
            'free_cancellation': True,
            'breakfast_included': True,
            'featured': True,
            'rooms': [
                {'name': 'Oceanview Deluxe King', 'desc': 'Private balcony with sea views and soaking tub.', 'price': Decimal('310.00'), 'capacity': 2, 'bed': '1 King Bed', 'size': '65 sqm', 'avail': 4},
                {'name': 'Royal Bay Villa', 'desc': 'Private plunge pool, personal chef, and direct beach access.', 'price': Decimal('890.00'), 'capacity': 4, 'bed': '2 King Beds', 'size': '200 sqm', 'avail': 1},
            ]
        },
        {
            'name': f"Hyatt Regency City Center, {clean_city}",
            'city': clean_city,
            'country': 'India' if clean_city in ['Pune', 'Mumbai', 'Delhi', 'Goa', 'Jaipur', 'Bangalore', 'Solapur', 'Kolhapur', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad', 'Surat'] else 'International',
            'address': f"Central Mall Boulevard, {clean_city}",
            'star_rating': 5,
            'guest_rating': Decimal('4.7'),
            'reviews_count': 1340,
            'price_per_night_start': Decimal('140.00'),
            'main_image': 'https://images.unsplash.com/photo-1571896349842-33c89424de2d',
            'images_gallery': ['https://images.unsplash.com/photo-1571896349842-33c89424de2d'],
            'description': f"Premium 5-star hotel in the heart of {clean_city} with seamless access to luxury shopping, fine dining, and convention centers.",
            'free_cancellation': True,
            'breakfast_included': False,
            'featured': False,
            'rooms': [
                {'name': 'Regency King Room', 'desc': 'Spacious room with modern amenities and club lounge access.', 'price': Decimal('140.00'), 'capacity': 2, 'bed': '1 King Bed', 'size': '45 sqm', 'avail': 8},
                {'name': 'Regency Executive Suite', 'desc': 'Panoramic corner suite with living room and jacuzzi.', 'price': Decimal('260.00'), 'capacity': 3, 'bed': '1 King Bed', 'size': '75 sqm', 'avail': 3},
            ]
        },
        {
            'name': f"Novotel Grand Business Hotel, {clean_city}",
            'city': clean_city,
            'country': 'India' if clean_city in ['Pune', 'Mumbai', 'Delhi', 'Goa', 'Jaipur', 'Bangalore', 'Solapur', 'Kolhapur', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad', 'Surat'] else 'International',
            'address': f"Financial District Tower 3, {clean_city}",
            'star_rating': 4,
            'guest_rating': Decimal('4.5'),
            'reviews_count': 820,
            'price_per_night_start': Decimal('85.00'),
            'main_image': 'https://images.unsplash.com/photo-1590490360182-c33d57733427',
            'images_gallery': ['https://images.unsplash.com/photo-1590490360182-c33d57733427'],
            'description': f"Smart, contemporary hotel offering all-day dining, 24-hour fitness center, and fast check-in for modern global nomads.",
            'free_cancellation': True,
            'breakfast_included': True,
            'featured': False,
            'rooms': [
                {'name': 'Superior Queen Room', 'desc': 'Quiet room with soundproof windows and comfortable work desk.', 'price': Decimal('85.00'), 'capacity': 2, 'bed': '1 Queen Bed', 'size': '32 sqm', 'avail': 15},
            ]
        },
        {
            'name': f"Le Meridien Boutique & Spa Retreat, {clean_city}",
            'city': clean_city,
            'country': 'India' if clean_city in ['Pune', 'Mumbai', 'Delhi', 'Goa', 'Jaipur', 'Bangalore', 'Solapur', 'Kolhapur', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad', 'Surat'] else 'International',
            'address': f"Art District Circle, {clean_city}",
            'star_rating': 5,
            'guest_rating': Decimal('4.8'),
            'reviews_count': 1150,
            'price_per_night_start': Decimal('175.00'),
            'main_image': 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461',
            'images_gallery': ['https://images.unsplash.com/photo-1578683010236-d716f9a3f461'],
            'description': f"Chic artistic retreat blending European elegance with local culture. Features rooftop cocktail lounge, art gallery, and heated rooftop pool.",
            'free_cancellation': True,
            'breakfast_included': True,
            'featured': True,
            'rooms': [
                {'name': 'Chic King Suite', 'desc': 'Custom artworks, Illy espresso machine, and rain shower.', 'price': Decimal('175.00'), 'capacity': 2, 'bed': '1 King Bed', 'size': '50 sqm', 'avail': 6},
                {'name': 'Artist Terrace Suite', 'desc': 'Private rooftop terrace with sun loungers and outdoor soaking tub.', 'price': Decimal('340.00'), 'capacity': 2, 'bed': '1 King Bed', 'size': '80 sqm', 'avail': 2},
            ]
        },
    ]

    created_hotels = []
    for h in hotel_templates:
        rooms_data = h.pop('rooms')
        hotel, created = Hotel.objects.get_or_create(
            name=h['name'],
            city=h['city'],
            defaults=h
        )
        hotel.amenities.add(spa, dining, gym, pool, valet, concierge)
        if created or hotel.rooms.count() == 0:
            for r in rooms_data:
                HotelRoom.objects.create(
                    hotel=hotel,
                    room_name=r['name'],
                    price_per_night=r['price'],
                    max_guests=r['capacity'],
                    bed_type=r['bed'],
                    room_size_sqm=45,
                    available_units=r['avail'],
                    image_url=hotel.main_image
                )
        created_hotels.append(hotel)

    return created_hotels


class HotelSearchListView(generics.ListAPIView):
    serializer_class = HotelListSerializer
    permission_classes = (permissions.AllowAny,)

    @extend_schema(
        summary="Search hotels by city, rating, and amenities",
        parameters=[
            OpenApiParameter('city', OpenApiTypes.STR, description='City name or destination'),
            OpenApiParameter('star_rating', OpenApiTypes.INT, description='Minimum star rating (1-5)'),
            OpenApiParameter('max_price', OpenApiTypes.FLOAT, description='Maximum price per night'),
            OpenApiParameter('free_cancellation', OpenApiTypes.BOOL, description='Free cancellation filter'),
            OpenApiParameter('breakfast_included', OpenApiTypes.BOOL, description='Breakfast included filter'),
        ]
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        city = (self.request.query_params.get('city') or '').strip()
        min_star = self.request.query_params.get('star_rating')
        max_price = self.request.query_params.get('max_price')
        amenities = self.request.query_params.getlist('amenity')
        free_cancellation = self.request.query_params.get('free_cancellation')
        breakfast = self.request.query_params.get('breakfast_included')

        qs = Hotel.objects.all().prefetch_related('amenities')

        if city:
            qs = qs.filter(Q(city__icontains=city) | Q(country__icontains=city) | Q(name__icontains=city))

        # Dynamically generate hotels if city has few or no hotels
        target_city = city or 'Dubai'
        if qs.count() < 4:
            get_or_create_dynamic_hotels(target_city)
            if not city:
                get_or_create_dynamic_hotels('Mumbai')
                get_or_create_dynamic_hotels('Pune')
                get_or_create_dynamic_hotels('London')
                get_or_create_dynamic_hotels('Bali')
            qs = Hotel.objects.all().prefetch_related('amenities')
            if city:
                qs = qs.filter(Q(city__icontains=city) | Q(country__icontains=city) | Q(name__icontains=city))

        if min_star:
            try:
                qs = qs.filter(star_rating__gte=int(min_star))
            except (ValueError, TypeError):
                pass
        if max_price:
            try:
                qs = qs.filter(price_per_night_start__lte=float(max_price))
            except (ValueError, TypeError):
                pass
        if free_cancellation == 'true':
            qs = qs.filter(free_cancellation=True)
        if breakfast == 'true':
            qs = qs.filter(breakfast_included=True)
        if amenities:
            qs = qs.filter(amenities__name__in=amenities).distinct()

        return qs.order_by('-guest_rating', 'price_per_night_start')


class HotelDetailView(generics.RetrieveAPIView):
    queryset = Hotel.objects.all().prefetch_related('amenities', 'rooms')
    serializer_class = HotelDetailSerializer
    permission_classes = (permissions.AllowAny,)


class HotelBookingCreateView(APIView):
    permission_classes = (permissions.AllowAny,)

    @extend_schema(
        summary="Book a hotel room directly",
        responses={201: HotelBookingSerializer}
    )
    def post(self, request):
        data = request.data
        hotel_id = data.get('hotel_id')
        room_id = data.get('room_id')
        check_in = data.get('check_in_date')
        check_out = data.get('check_out_date')
        nights = int(data.get('nights', 1))
        rooms_count = int(data.get('rooms_count', 1))
        guests_count = int(data.get('guests_count', 2))
        guest_names = data.get('guest_names', [])
        contact_name = data.get('contact_name', 'Guest')
        contact_email = data.get('contact_email', 'guest@example.com')
        contact_phone = data.get('contact_phone', '+1234567890')
        total_amount = float(data.get('total_amount', 250.00))
        currency = data.get('currency', 'USD')
        special_requests = data.get('special_requests', '')

        try:
            hotel = Hotel.objects.get(id=hotel_id)
            room = HotelRoom.objects.get(id=room_id, hotel=hotel)
        except (Hotel.DoesNotExist, HotelRoom.DoesNotExist):
            return Response({"error": "Hotel or room not found"}, status=status.HTTP_404_NOT_FOUND)

        user = request.user if request.user.is_authenticated else None

        booking = Booking.objects.create(
            user=user,
            booking_type='hotel',
            title=f"Hotel Stay: {hotel.name} ({room.room_name})",
            summary=f"{nights} Night(s) in {hotel.city} • {rooms_count} Room(s) • {guests_count} Guest(s)",
            total_amount=total_amount,
            final_amount=total_amount,
            currency=currency,
            contact_name=contact_name,
            contact_email=contact_email,
            contact_phone=contact_phone,
            travel_date=check_in,
            return_date=check_out,
            details_json={
                "hotel_name": hotel.name,
                "city": hotel.city,
                "country": hotel.country,
                "address": hotel.address,
                "room_name": room.room_name,
                "nights": nights,
                "rooms_count": rooms_count,
                "check_in": check_in,
                "check_out": check_out,
                "special_requests": special_requests,
                "guest_names": guest_names
            },
            status='confirmed',
            payment_status='paid'
        )

        hotel_booking = HotelBooking.objects.create(
            booking=booking,
            hotel=hotel,
            room=room,
            check_in_date=check_in,
            check_out_date=check_out,
            nights=nights,
            rooms_count=rooms_count,
            guests_count=guests_count,
            guest_names=guest_names,
            special_requests=special_requests,
            voucher_number=f"HTL-{uuid.uuid4().hex[:9].upper()}"
        )

        return Response({
            "message": "Hotel booked successfully!",
            "booking_reference": booking.booking_reference,
            "voucher_number": hotel_booking.voucher_number,
            "hotel_booking": HotelBookingSerializer(hotel_booking).data
        }, status=status.HTTP_201_CREATED)
