import uuid
from decimal import Decimal
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiTypes
from apps.core_bookings.models import Booking
from .models import BusOperator, BusTrip, BusSeat, BusBooking
from .serializers import BusTripSerializer, BusBookingSerializer
from .indian_cities_data import INDIAN_CITIES_MASTER


class BusSuggestionsView(APIView):
    permission_classes = (permissions.AllowAny,)

    @extend_schema(
        summary="Search city and boarding/dropping points autocomplete",
        parameters=[
            OpenApiParameter('q', OpenApiTypes.STR, description='Query text e.g. "solapur" or "mumbai" or "pune"')
        ]
    )
    def get(self, request):
        query = (request.query_params.get('q') or '').strip().lower()
        
        results = []
        if not query:
            # Return top popular cities
            for loc in INDIAN_CITIES_MASTER[:8]:
                results.append({
                    "id": f"city_{loc['city'].lower().replace(' ', '_')}",
                    "city": loc["city"],
                    "display_name": f"{loc['city']}, All Locations",
                    "landmark": f"All Boarding & Dropping Points across {loc['city']}",
                    "is_city": True,
                    "state": loc["state"],
                    "country": loc["country"]
                })
            return Response(results)

        for loc in INDIAN_CITIES_MASTER:
            city_name = loc["city"]
            state_name = loc.get("state", "")
            city_match = query in city_name.lower() or (state_name and query in state_name.lower())
            
            # If city matches, add city header item first
            if city_match:
                results.append({
                    "id": f"city_{city_name.lower().replace(' ', '_').replace(',', '')}",
                    "city": city_name,
                    "display_name": f"{city_name}, All Locations",
                    "landmark": f"Central Terminal & All Local Points in {city_name}",
                    "is_city": True,
                    "state": loc.get("state", "India"),
                    "country": loc.get("country", "India")
                })

            # Add matching boarding points
            for pt in loc.get("points", []):
                pt_match = query in pt["name"].lower() or query in pt.get("landmark", "").lower() or city_match
                if pt_match:
                    results.append({
                        "id": f"pt_{pt['name'].lower().replace(' ', '_').replace(',', '')}",
                        "city": city_name,
                        "display_name": pt["name"],
                        "landmark": pt.get("landmark", f"Boarding Point in {city_name}"),
                        "is_city": False,
                        "state": loc.get("state", "India"),
                        "country": loc.get("country", "India"),
                        "type": "both"
                    })

        # Universal Dynamic Fallback: If user types any city not already in curated master, dynamically construct points!
        if len(results) == 0 and len(query) >= 2:
            formatted_city = query.title()
            results = [
                {
                    "id": f"city_{query}",
                    "city": formatted_city,
                    "display_name": f"{formatted_city}, All Locations",
                    "landmark": f"Main Intercity Bus Terminals & Stops in {formatted_city}",
                    "is_city": True,
                    "state": "India",
                    "country": "India"
                },
                {
                    "id": f"pt_{query}_central",
                    "city": formatted_city,
                    "display_name": f"Central ST Bus Stand, {formatted_city}",
                    "landmark": f"Main MSRTC / RTC Terminal {formatted_city}",
                    "is_city": False,
                    "state": "India",
                    "country": "India",
                    "type": "both"
                },
                {
                    "id": f"pt_{query}_station",
                    "city": formatted_city,
                    "display_name": f"Railway Station Chowk, {formatted_city}",
                    "landmark": f"Station Main Circulating Road, {formatted_city}",
                    "is_city": False,
                    "state": "India",
                    "country": "India",
                    "type": "both"
                },
                {
                    "id": f"pt_{query}_bypass",
                    "city": formatted_city,
                    "display_name": f"{formatted_city} Highway Bypass",
                    "landmark": f"National Highway Toll Crossing, {formatted_city}",
                    "is_city": False,
                    "state": "India",
                    "country": "India",
                    "type": "both"
                }
            ]

        # Return unique and capped results
        seen_ids = set()
        unique_results = []
        for r in results:
            if r["id"] not in seen_ids:
                seen_ids.add(r["id"])
                unique_results.append(r)

        return Response(unique_results[:16])


def clean_city_name(raw_name: str) -> str:
    """Extracts clean primary city name from strings like 'Borivali East, Mumbai' -> 'Mumbai' or 'Solapur, All Locations' -> 'Solapur'"""
    if not raw_name:
        return ""
    clean = raw_name.replace(", All Locations", "").strip()
    parts = [p.strip() for p in clean.split(',')]
    if len(parts) > 1:
        last_part = parts[-1]
        for loc in INDIAN_CITIES_MASTER:
            if loc["city"].lower() in last_part.lower():
                return loc["city"]
    for loc in INDIAN_CITIES_MASTER:
        if loc["city"].lower() in clean.lower():
            return loc["city"]
    return parts[0]


def get_or_create_dynamic_trips_for_route(origin_city: str, dest_city: str):
    """
    Dynamically generate 15+ realistic bus operators for any city pair,
    similar to redBus — AC Seater, Sleeper, Non-AC, Primo, Volvo, MSRTC, Private.
    """
    if not origin_city or not dest_city or origin_city.lower() == dest_city.lower():
        return []

    # Lookup boarding/dropping points from master
    origin_pts, dest_pts = [], []
    for loc in INDIAN_CITIES_MASTER:
        if loc["city"].lower() == origin_city.lower():
            origin_pts = loc.get("points", [])
        if loc["city"].lower() == dest_city.lower():
            dest_pts = loc.get("points", [])

    if not origin_pts:
        origin_pts = [
            {"name": f"Central Bus Stand, {origin_city}", "landmark": f"MSRTC Main Terminal {origin_city}"},
            {"name": f"Railway Station, {origin_city}", "landmark": f"Station Gate {origin_city}"},
            {"name": f"{origin_city} Highway Bypass", "landmark": "National Highway Junction"},
        ]
    if not dest_pts:
        dest_pts = [
            {"name": f"Central Bus Stand, {dest_city}", "landmark": f"MSRTC Main Terminal {dest_city}"},
            {"name": f"Railway Station, {dest_city}", "landmark": f"Station Circulating Area"},
            {"name": f"{dest_city} Bypass Toll", "landmark": "Highway Entry Point"},
        ]

    def op(name, rating, reviews):
        obj, _ = BusOperator.objects.get_or_create(
            name=name,
            defaults={'rating': Decimal(str(rating)), 'total_reviews': reviews}
        )
        return obj

    def bpts(times, pts):
        return [{'time': t, 'location': pts[i % len(pts)]['name'], 'address': pts[i % len(pts)].get('landmark', '')}
                for i, t in enumerate(times)]

    # 15 varied operators — AC Seater, Sleeper, Non-AC, MSRTC, Primo
    OPERATORS_CONFIGS = [
        {
            'operator': op('Gajraj Travals', 4.2, 83),
            'bus_type': 'ac_seater', 'bus_name': f'Gajraj Travals A/C Seater/Sleeper (2+1)',
            'departure_time': '11:30 PM', 'arrival_time': '05:05 AM', 'duration': '5h 35m',
            'fare_seater': Decimal('650'), 'fare_sleeper': Decimal('950'),
            'boarding_points': bpts(['11:00 PM', '11:30 PM'], origin_pts),
            'dropping_points': bpts(['04:50 AM', '05:05 AM'], dest_pts),
            'amenities': ['AC', 'Charging Point', 'Water Bottle', 'Blanket'],
        },
        {
            'operator': op('Shri Vishwa Tours & Travels', 3.8, 58),
            'bus_type': 'ac_sleeper', 'bus_name': f'Shri Vishwa AC Sleeper (2+1)',
            'departure_time': '11:22 PM', 'arrival_time': '05:36 AM', 'duration': '6h 14m',
            'fare_seater': Decimal('667'), 'fare_sleeper': Decimal('999'),
            'boarding_points': bpts(['10:50 PM', '11:22 PM'], origin_pts),
            'dropping_points': bpts(['05:20 AM', '05:36 AM'], dest_pts),
            'amenities': ['AC Sleeper', 'Free Date Change', 'Blanket', 'Pillow'],
        },
        {
            'operator': op('Ransamrat Travels', 4.0, 75),
            'bus_type': 'ac_sleeper', 'bus_name': f'Ransamrat AC Sleeper (2+1) Primo',
            'departure_time': '11:59 PM', 'arrival_time': '05:25 AM', 'duration': '5h 26m',
            'fare_seater': Decimal('899'), 'fare_sleeper': Decimal('1121'),
            'boarding_points': bpts(['11:30 PM', '11:59 PM'], origin_pts),
            'dropping_points': bpts(['05:10 AM', '05:25 AM'], dest_pts),
            'amenities': ['Primo Bus', 'Live Tracking', 'Sanitized Bedroll', 'Water'],
        },
        {
            'operator': op('MSRTC Shivneri AC Volvo', 4.6, 4200),
            'bus_type': 'volvo_multi_axle', 'bus_name': f'Shivneri Volvo AC Semi-Sleeper (Expressway Direct)',
            'departure_time': '05:30 PM', 'arrival_time': '09:30 PM', 'duration': '4h 00m',
            'fare_seater': Decimal('1014'), 'fare_sleeper': Decimal('1121'),
            'boarding_points': bpts(['05:00 PM', '05:30 PM'], origin_pts),
            'dropping_points': bpts(['09:15 PM', '09:30 PM'], dest_pts),
            'amenities': ['Push-Back Seats', 'Reading Light', 'Punctual', 'Fast Transit'],
        },
        {
            'operator': op('Neeta Travels', 4.8, 1840),
            'bus_type': 'volvo_multi_axle', 'bus_name': f'Neeta Volvo B11R Multi-Axle AC',
            'departure_time': '06:30 AM', 'arrival_time': '10:45 AM', 'duration': '4h 15m',
            'fare_seater': Decimal('850'), 'fare_sleeper': Decimal('1200'),
            'boarding_points': bpts(['06:00 AM', '06:30 AM'], origin_pts),
            'dropping_points': bpts(['10:30 AM', '10:45 AM'], dest_pts),
            'amenities': ['5G Wi-Fi', 'Charging Port', 'Water Bottle', 'Live GPS', 'CCTV'],
        },
        {
            'operator': op('Zingbus Electric Luxury', 4.9, 2450),
            'bus_type': 'volvo_multi_axle', 'bus_name': f'Zingbus Green Electric AC Semi-Sleeper (2+2)',
            'departure_time': '01:30 PM', 'arrival_time': '05:30 PM', 'duration': '4h 00m',
            'fare_seater': Decimal('750'), 'fare_sleeper': Decimal('980'),
            'boarding_points': bpts(['01:00 PM', '01:30 PM'], origin_pts),
            'dropping_points': bpts(['05:15 PM', '05:30 PM'], dest_pts),
            'amenities': ['Zero Emission', 'Leather Recliners', 'Water', 'Air Purifier'],
        },
        {
            'operator': op('IntrCity SmartBus', 4.8, 1670),
            'bus_type': 'ac_sleeper', 'bus_name': f'IntrCity SmartBus Volvo 9600 AC Sleeper (2+1)',
            'departure_time': '10:15 PM', 'arrival_time': '03:00 AM', 'duration': '4h 45m',
            'fare_seater': Decimal('799'), 'fare_sleeper': Decimal('1050'),
            'boarding_points': bpts(['09:45 PM', '10:15 PM'], origin_pts),
            'dropping_points': bpts(['02:45 AM', '03:00 AM'], dest_pts),
            'amenities': ['SmartBus Lounge', 'Sanitized Bedroll', 'Luggage Tag', 'Captain Support'],
        },
        {
            'operator': op('Patel Travels', 3.9, 310),
            'bus_type': 'non_ac_seater', 'bus_name': f'Patel Travels Non-AC Seater (2+2)',
            'departure_time': '07:00 AM', 'arrival_time': '11:30 AM', 'duration': '4h 30m',
            'fare_seater': Decimal('450'), 'fare_sleeper': Decimal('550'),
            'boarding_points': bpts(['06:30 AM', '07:00 AM'], origin_pts),
            'dropping_points': bpts(['11:15 AM', '11:30 AM'], dest_pts),
            'amenities': ['Non-AC', 'Push-Back Seats', 'Free Cancellation'],
        },
        {
            'operator': op('Raj National Express', 4.1, 540),
            'bus_type': 'ac_seater', 'bus_name': f'Raj National Express AC Seater (2+2)',
            'departure_time': '09:00 AM', 'arrival_time': '01:30 PM', 'duration': '4h 30m',
            'fare_seater': Decimal('580'), 'fare_sleeper': Decimal('720'),
            'boarding_points': bpts(['08:30 AM', '09:00 AM'], origin_pts),
            'dropping_points': bpts(['01:15 PM', '01:30 PM'], dest_pts),
            'amenities': ['AC', 'Charging Port', 'Water', '10% Offer 3+ seats'],
        },
        {
            'operator': op('Konduskar Travels', 4.4, 890),
            'bus_type': 'ac_sleeper', 'bus_name': f'Konduskar AC Sleeper (2+1) Overnight',
            'departure_time': '09:30 PM', 'arrival_time': '02:45 AM', 'duration': '5h 15m',
            'fare_seater': Decimal('720'), 'fare_sleeper': Decimal('980'),
            'boarding_points': bpts(['09:00 PM', '09:30 PM'], origin_pts),
            'dropping_points': bpts(['02:30 AM', '02:45 AM'], dest_pts),
            'amenities': ['AC Sleeper', 'Blanket', 'Pillow', 'Live Tracking'],
        },
        {
            'operator': op('Orange Travels', 4.3, 760),
            'bus_type': 'volvo_multi_axle', 'bus_name': f'Orange Travels Volvo AC Seater (2+2)',
            'departure_time': '02:30 PM', 'arrival_time': '06:45 PM', 'duration': '4h 15m',
            'fare_seater': Decimal('620'), 'fare_sleeper': Decimal('820'),
            'boarding_points': bpts(['02:00 PM', '02:30 PM'], origin_pts),
            'dropping_points': bpts(['06:30 PM', '06:45 PM'], dest_pts),
            'amenities': ['Volvo AC', 'USB Charging', 'Reading Light', 'Water'],
        },
        {
            'operator': op('Paulo Travels Primo', 4.7, 1250),
            'bus_type': 'ac_sleeper', 'bus_name': f'Paulo Travels Primo AC Sleeper (2+1)',
            'departure_time': '08:45 PM', 'arrival_time': '01:30 AM', 'duration': '4h 45m',
            'fare_seater': Decimal('950'), 'fare_sleeper': Decimal('1350'),
            'boarding_points': bpts(['08:15 PM', '08:45 PM'], origin_pts),
            'dropping_points': bpts(['01:15 AM', '01:30 AM'], dest_pts),
            'amenities': ['Primo', 'Sanitized Coach', 'Blanket', 'Pillow', 'Live Track'],
        },
        {
            'operator': op('VRL Travels', 4.5, 2100),
            'bus_type': 'ac_sleeper', 'bus_name': f'VRL Travels AC Sleeper (2+1) Express',
            'departure_time': '07:30 PM', 'arrival_time': '12:15 AM', 'duration': '4h 45m',
            'fare_seater': Decimal('810'), 'fare_sleeper': Decimal('1100'),
            'boarding_points': bpts(['07:00 PM', '07:30 PM'], origin_pts),
            'dropping_points': bpts(['12:00 AM', '12:15 AM'], dest_pts),
            'amenities': ['AC Sleeper', 'Curtain Privacy', 'Charging Port', 'Water'],
        },
        {
            'operator': op('SRS Travels', 4.2, 680),
            'bus_type': 'non_ac_seater', 'bus_name': f'SRS Travels Non-AC Sleeper (2+1)',
            'departure_time': '06:00 PM', 'arrival_time': '10:45 PM', 'duration': '4h 45m',
            'fare_seater': Decimal('520'), 'fare_sleeper': Decimal('680'),
            'boarding_points': bpts(['05:30 PM', '06:00 PM'], origin_pts),
            'dropping_points': bpts(['10:30 PM', '10:45 PM'], dest_pts),
            'amenities': ['Non-AC Sleeper', 'Blanket', 'Free Cancellation'],
        },
        {
            'operator': op('Shrinath Travel Agency', 4.0, 430),
            'bus_type': 'ac_seater', 'bus_name': f'Shrinath AC Seater (2+2) Single Seats',
            'departure_time': '11:00 AM', 'arrival_time': '03:30 PM', 'duration': '4h 30m',
            'fare_seater': Decimal('550'), 'fare_sleeper': Decimal('750'),
            'boarding_points': bpts(['10:30 AM', '11:00 AM'], origin_pts),
            'dropping_points': bpts(['03:15 PM', '03:30 PM'], dest_pts),
            'amenities': ['AC', 'Single Seats Available', 'Water', 'CCTV'],
        },
    ]

    created_trips = []
    for cfg in OPERATORS_CONFIGS:
        trip, created = BusTrip.objects.get_or_create(
            bus_name=cfg['bus_name'],
            origin=origin_city,
            destination=dest_city,
            departure_time=cfg['departure_time'],
            defaults={k: v for k, v in cfg.items() if k not in ('bus_name', 'origin', 'destination', 'departure_time')}
        )
        if created or trip.seats.count() == 0:
            bus_type = cfg.get('bus_type', 'ac_seater')
            is_sleeper = 'sleeper' in bus_type
            seats_to_create = []
            # Lower deck seats
            for i in range(1, 21):
                seats_to_create.append(
                    BusSeat(
                        trip=trip,
                        seat_number=f"L{i}",
                        deck='lower',
                        seat_type='sleeper' if (is_sleeper and i > 14) else 'seater',
                        price=cfg['fare_sleeper'] if (is_sleeper and i > 14) else cfg['fare_seater'],
                        is_ladies_only=(i in [1, 2]),
                        is_available=(i not in [3, 4, 7, 11])
                    )
                )
            # Upper deck (sleeper buses only)
            if is_sleeper:
                for i in range(1, 13):
                    seats_to_create.append(
                        BusSeat(
                            trip=trip,
                            seat_number=f"U{i}",
                            deck='upper',
                            seat_type='sleeper',
                            price=cfg['fare_sleeper'],
                            is_ladies_only=False,
                            is_available=(i not in [1, 5, 9])
                        )
                    )
            BusSeat.objects.bulk_create(seats_to_create, ignore_conflicts=True)
        created_trips.append(trip)

    return created_trips


class BusTripSearchListView(generics.ListAPIView):
    serializer_class = BusTripSerializer
    permission_classes = (permissions.AllowAny,)

    @extend_schema(
        summary="Search bus trips by origin and destination",
        parameters=[
            OpenApiParameter('origin', OpenApiTypes.STR, description='Origin city or boarding point'),
            OpenApiParameter('destination', OpenApiTypes.STR, description='Destination city or dropping point'),
            OpenApiParameter('bus_type', OpenApiTypes.STR, description='Bus type filter'),
            OpenApiParameter('operator', OpenApiTypes.STR, description='Operator name filter'),
        ]
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        raw_origin = self.request.query_params.get('origin', '').strip()
        raw_dest = self.request.query_params.get('destination', '').strip()
        bus_type = self.request.query_params.get('bus_type')
        operator_name = self.request.query_params.get('operator')

        clean_origin = clean_city_name(raw_origin)
        clean_dest = clean_city_name(raw_dest)

        qs = BusTrip.objects.all().select_related('operator').prefetch_related('seats')

        if clean_origin:
            qs = qs.filter(
                Q(origin__icontains=clean_origin) | 
                Q(origin__icontains=raw_origin) |
                Q(boarding_points__icontains=raw_origin)
            )

        if clean_dest:
            qs = qs.filter(
                Q(destination__icontains=clean_dest) | 
                Q(destination__icontains=raw_dest) |
                Q(dropping_points__icontains=raw_dest)
            )

        # If no trips exist for this requested city pair, dynamically generate realistic trips
        if qs.count() == 0 and clean_origin and clean_dest:
            get_or_create_dynamic_trips_for_route(clean_origin, clean_dest)
            qs = BusTrip.objects.filter(
                origin__icontains=clean_origin,
                destination__icontains=clean_dest
            ).select_related('operator').prefetch_related('seats')

        if bus_type:
            qs = qs.filter(bus_type=bus_type)
        if operator_name:
            qs = qs.filter(operator__name__icontains=operator_name)

        return qs.order_by('fare_seater')


class BusTripDetailView(generics.RetrieveAPIView):
    queryset = BusTrip.objects.all().select_related('operator').prefetch_related('seats')
    serializer_class = BusTripSerializer
    permission_classes = (permissions.AllowAny,)


class BusBookingCreateView(APIView):
    permission_classes = (permissions.AllowAny,)

    @extend_schema(
        summary="Book bus seats and generate m-ticket",
        responses={201: BusBookingSerializer}
    )
    def post(self, request):
        data = request.data
        trip_id = data.get('trip_id')
        selected_seats = data.get('selected_seats', [])
        passengers = data.get('passengers', [])
        boarding_point = data.get('boarding_point', 'Default Boarding Point')
        dropping_point = data.get('dropping_point', 'Default Dropping Point')
        contact_name = data.get('contact_name', 'Passenger')
        contact_email = data.get('contact_email', 'traveler@example.com')
        contact_phone = data.get('contact_phone', '+1234567890')
        total_amount = float(data.get('total_amount', 70.00))
        currency = data.get('currency', 'USD')
        travel_date = data.get('travel_date')

        try:
            trip = BusTrip.objects.get(id=trip_id)
        except BusTrip.DoesNotExist:
            return Response({"error": "Bus trip not found"}, status=status.HTTP_404_NOT_FOUND)

        user = request.user if request.user.is_authenticated else None

        booking = Booking.objects.create(
            user=user,
            booking_type='bus',
            title=f"Bus: {trip.origin} to {trip.destination} ({trip.operator.name})",
            summary=f"{len(selected_seats)} Seat(s) • Seats: {', '.join(selected_seats)} • {trip.bus_type}",
            total_amount=total_amount,
            final_amount=total_amount,
            currency=currency,
            contact_name=contact_name,
            contact_email=contact_email,
            contact_phone=contact_phone,
            travel_date=travel_date,
            details_json={
                "operator": trip.operator.name,
                "bus_type": trip.bus_type,
                "origin": trip.origin,
                "destination": trip.destination,
                "departure_time": trip.departure_time,
                "arrival_time": trip.arrival_time,
                "selected_seats": selected_seats,
                "boarding_point": boarding_point,
                "dropping_point": dropping_point,
                "passengers": passengers
            },
            status='confirmed',
            payment_status='paid'
        )

        bus_booking = BusBooking.objects.create(
            booking=booking,
            trip=trip,
            selected_seats=selected_seats,
            passengers=passengers,
            boarding_point=boarding_point,
            dropping_point=dropping_point,
            m_ticket_number=f"BUS-{uuid.uuid4().hex[:9].upper()}"
        )

        return Response({
            "message": "Bus ticket booked successfully!",
            "booking_reference": booking.booking_reference,
            "m_ticket_number": bus_booking.m_ticket_number,
            "bus_booking": BusBookingSerializer(bus_booking).data
        }, status=status.HTTP_201_CREATED)
