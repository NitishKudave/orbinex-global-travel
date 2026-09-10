import uuid
from decimal import Decimal
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiTypes
from apps.core_bookings.models import Booking
from .models import Airline, Airport, FlightSchedule, FlightSeat, FlightBooking
from .serializers import (
    AirlineSerializer,
    AirportSerializer,
    FlightScheduleSerializer,
    FlightSeatSerializer,
    FlightBookingSerializer
)

AIRPORT_CITY_LOOKUP = {
    'DXB': ('Dubai International Airport', 'Dubai', 'United Arab Emirates'),
    'LHR': ('London Heathrow Airport', 'London', 'United Kingdom'),
    'JFK': ('John F. Kennedy International Airport', 'New York', 'United States'),
    'BOM': ('Chhatrapati Shivaji Maharaj International Airport', 'Mumbai', 'India'),
    'DEL': ('Indira Gandhi International Airport', 'Delhi', 'India'),
    'PNQ': ('Pune International Airport', 'Pune', 'India'),
    'BLR': ('Kempegowda International Airport', 'Bangalore', 'India'),
    'HYD': ('Rajiv Gandhi International Airport', 'Hyderabad', 'India'),
    'MAA': ('Chennai International Airport', 'Chennai', 'India'),
    'GOI': ('Goa International Airport (Dabolim/Mopa)', 'Goa', 'India'),
    'SIN': ('Singapore Changi Airport', 'Singapore', 'Singapore'),
    'CDG': ('Paris Charles de Gaulle Airport', 'Paris', 'France'),
    'JED': ('King Abdulaziz International Airport', 'Jeddah', 'Saudi Arabia'),
    'FRA': ('Frankfurt International Airport', 'Frankfurt', 'Germany'),
    'HND': ('Tokyo Haneda Airport', 'Tokyo', 'Japan'),
    'SYD': ('Sydney Kingsford Smith Airport', 'Sydney', 'Australia'),
}

def resolve_airport(query_str: str) -> Airport:
    """Finds or creates an Airport instance for any given IATA code or city name."""
    if not query_str:
        return None
    code = query_str.strip().upper()
    
    # 1. Direct IATA match in DB
    existing = Airport.objects.filter(iata_code__iexact=code).first()
    if existing:
        return existing
    
    # 2. City name match in DB
    city_match = Airport.objects.filter(city__icontains=query_str.strip()).first()
    if city_match:
        return city_match

    # 3. Known dictionary lookup
    if code in AIRPORT_CITY_LOOKUP:
        name, city, country = AIRPORT_CITY_LOOKUP[code]
        ap, _ = Airport.objects.get_or_create(iata_code=code, defaults={'name': name, 'city': city, 'country': country})
        return ap

    # Check if query matches a city name in lookup
    for iata, (name, city, country) in AIRPORT_CITY_LOOKUP.items():
        if city.lower() == query_str.strip().lower() or query_str.strip().lower() in name.lower():
            ap, _ = Airport.objects.get_or_create(iata_code=iata, defaults={'name': name, 'city': city, 'country': country})
            return ap

    # 4. Fallback: dynamically create airport
    ap_code = code[:3] if len(code) >= 3 else f"{code}X"[:3]
    city_name = query_str.strip().title()
    ap, _ = Airport.objects.get_or_create(
        iata_code=ap_code,
        defaults={
            'name': f"{city_name} International Airport",
            'city': city_name,
            'country': 'Global'
        }
    )
    return ap


def get_or_create_dynamic_flights(origin_ap: Airport, dest_ap: Airport):
    """Dynamically generates 42 realistic scheduled flights with full amenity data."""
    if not origin_ap or not dest_ap or origin_ap == dest_ap:
        return []

    # All major Indian & global carriers
    indigo, _ = Airline.objects.get_or_create(iata_code='6E', defaults={'name': 'IndiGo', 'logo_url': 'indigo'})
    spicejet, _ = Airline.objects.get_or_create(iata_code='SG', defaults={'name': 'SpiceJet', 'logo_url': 'spicejet'})
    airindia, _ = Airline.objects.get_or_create(iata_code='AI', defaults={'name': 'Air India', 'logo_url': 'airindia'})
    akasa, _ = Airline.objects.get_or_create(iata_code='QP', defaults={'name': 'Akasa Air', 'logo_url': 'akasa'})
    aix, _ = Airline.objects.get_or_create(iata_code='IX', defaults={'name': 'Air India Express', 'logo_url': 'aix'})
    vistara, _ = Airline.objects.get_or_create(iata_code='UK', defaults={'name': 'Vistara', 'logo_url': 'vistara'})
    ek, _ = Airline.objects.get_or_create(iata_code='EK', defaults={'name': 'Emirates', 'logo_url': 'emirates'})
    qr, _ = Airline.objects.get_or_create(iata_code='QR', defaults={'name': 'Qatar Airways', 'logo_url': 'qatar'})
    sq, _ = Airline.objects.get_or_create(iata_code='SQ', defaults={'name': 'Singapore Airlines', 'logo_url': 'singapore'})
    ba, _ = Airline.objects.get_or_create(iata_code='BA', defaults={'name': 'British Airways', 'logo_url': 'british'})
    ey, _ = Airline.objects.get_or_create(iata_code='EY', defaults={'name': 'Etihad Airways', 'logo_url': 'etihad'})

    D = Decimal
    O, X = origin_ap, dest_ap

    flight_templates = [
        # ── IndiGo 6E (6 flights, budget Indian carrier) ──
        {'flight_number': '6E-5301', 'airline': indigo, 'origin': O, 'destination': X,
         'departure_time': '05:05 AM', 'arrival_time': '07:15 AM', 'duration': '2h 10m', 'stops': 0, 'stop_details': 'Non-stop',
         'price_economy': D('5154'), 'price_premium': D('7200'), 'price_business': D('14050'), 'price_first': D('22000'),
         'aircraft_type': 'Airbus A320neo', 'baggage_checkin': '15 kg', 'baggage_cabin': '7 kg', 'refundable': False,
         'has_meals': False, 'has_wifi': False, 'has_usb': True, 'has_entertainment': False, 'seat_layout': '3-3', 'wifi_type': ''},
        {'flight_number': '6E-728', 'airline': indigo, 'origin': O, 'destination': X,
         'departure_time': '07:30 AM', 'arrival_time': '09:45 AM', 'duration': '2h 15m', 'stops': 0, 'stop_details': 'Non-stop',
         'price_economy': D('5364'), 'price_premium': D('7100'), 'price_business': D('14200'), 'price_first': D('22500'),
         'aircraft_type': 'Airbus A320neo', 'baggage_checkin': '15 kg', 'baggage_cabin': '7 kg', 'refundable': False,
         'has_meals': False, 'has_wifi': False, 'has_usb': True, 'has_entertainment': False, 'seat_layout': '3-3', 'wifi_type': ''},
        {'flight_number': '6E-192', 'airline': indigo, 'origin': O, 'destination': X,
         'departure_time': '10:15 AM', 'arrival_time': '12:30 PM', 'duration': '2h 15m', 'stops': 0, 'stop_details': 'Non-stop',
         'price_economy': D('5490'), 'price_premium': D('7350'), 'price_business': D('14500'), 'price_first': D('23000'),
         'aircraft_type': 'Airbus A321neo', 'baggage_checkin': '15 kg', 'baggage_cabin': '7 kg', 'refundable': False,
         'has_meals': False, 'has_wifi': False, 'has_usb': True, 'has_entertainment': False, 'seat_layout': '3-3', 'wifi_type': ''},
        {'flight_number': '6E-554', 'airline': indigo, 'origin': O, 'destination': X,
         'departure_time': '01:40 PM', 'arrival_time': '03:55 PM', 'duration': '2h 15m', 'stops': 0, 'stop_details': 'Non-stop',
         'price_economy': D('5600'), 'price_premium': D('7600'), 'price_business': D('15000'), 'price_first': D('24000'),
         'aircraft_type': 'Airbus A320neo', 'baggage_checkin': '15 kg', 'baggage_cabin': '7 kg', 'refundable': False,
         'has_meals': False, 'has_wifi': False, 'has_usb': True, 'has_entertainment': False, 'seat_layout': '3-3', 'wifi_type': ''},
        {'flight_number': '6E-904', 'airline': indigo, 'origin': O, 'destination': X,
         'departure_time': '06:15 PM', 'arrival_time': '08:30 PM', 'duration': '2h 15m', 'stops': 0, 'stop_details': 'Non-stop',
         'price_economy': D('5154'), 'price_premium': D('6950'), 'price_business': D('13900'), 'price_first': D('21500'),
         'aircraft_type': 'Airbus A321neo', 'baggage_checkin': '15 kg', 'baggage_cabin': '7 kg', 'refundable': False,
         'has_meals': False, 'has_wifi': False, 'has_usb': True, 'has_entertainment': False, 'seat_layout': '3-3', 'wifi_type': ''},
        {'flight_number': '6E-376', 'airline': indigo, 'origin': O, 'destination': X,
         'departure_time': '09:50 PM', 'arrival_time': '12:05 AM', 'duration': '2h 15m', 'stops': 0, 'stop_details': 'Non-stop',
         'price_economy': D('5200'), 'price_premium': D('7000'), 'price_business': D('14100'), 'price_first': D('22000'),
         'aircraft_type': 'Airbus A320neo', 'baggage_checkin': '15 kg', 'baggage_cabin': '7 kg', 'refundable': False,
         'has_meals': False, 'has_wifi': False, 'has_usb': True, 'has_entertainment': False, 'seat_layout': '3-3', 'wifi_type': ''},

        # ── SpiceJet SG (5 flights) ──
        {'flight_number': 'SG-814', 'airline': spicejet, 'origin': O, 'destination': X,
         'departure_time': '05:55 AM', 'arrival_time': '08:30 AM', 'duration': '2h 35m', 'stops': 0, 'stop_details': 'Non-stop',
         'price_economy': D('5289'), 'price_premium': D('6990'), 'price_business': D('13500'), 'price_first': D('21000'),
         'aircraft_type': 'Boeing 737 MAX 8', 'baggage_checkin': '15 kg', 'baggage_cabin': '7 kg', 'refundable': False,
         'has_meals': True, 'has_wifi': False, 'has_usb': True, 'has_entertainment': False, 'seat_layout': '3-3', 'wifi_type': ''},
        {'flight_number': 'SG-304', 'airline': spicejet, 'origin': O, 'destination': X,
         'departure_time': '09:00 AM', 'arrival_time': '11:10 AM', 'duration': '2h 10m', 'stops': 0, 'stop_details': 'Non-stop',
         'price_economy': D('5400'), 'price_premium': D('7200'), 'price_business': D('14000'), 'price_first': D('21800'),
         'aircraft_type': 'Boeing 737-800', 'baggage_checkin': '15 kg', 'baggage_cabin': '7 kg', 'refundable': False,
         'has_meals': True, 'has_wifi': False, 'has_usb': True, 'has_entertainment': False, 'seat_layout': '3-3', 'wifi_type': ''},
        {'flight_number': 'SG-418', 'airline': spicejet, 'origin': O, 'destination': X,
         'departure_time': '12:30 PM', 'arrival_time': '02:40 PM', 'duration': '2h 10m', 'stops': 0, 'stop_details': 'Non-stop',
         'price_economy': D('5350'), 'price_premium': D('7100'), 'price_business': D('13700'), 'price_first': D('21200'),
         'aircraft_type': 'Boeing 737 MAX 8', 'baggage_checkin': '15 kg', 'baggage_cabin': '7 kg', 'refundable': False,
         'has_meals': True, 'has_wifi': False, 'has_usb': True, 'has_entertainment': False, 'seat_layout': '3-3', 'wifi_type': ''},
        {'flight_number': 'SG-108', 'airline': spicejet, 'origin': O, 'destination': X,
         'departure_time': '05:45 PM', 'arrival_time': '07:55 PM', 'duration': '2h 10m', 'stops': 0, 'stop_details': 'Non-stop',
         'price_economy': D('5289'), 'price_premium': D('7100'), 'price_business': D('13800'), 'price_first': D('21000'),
         'aircraft_type': 'Boeing 737-800', 'baggage_checkin': '15 kg', 'baggage_cabin': '7 kg', 'refundable': False,
         'has_meals': True, 'has_wifi': False, 'has_usb': True, 'has_entertainment': False, 'seat_layout': '3-3', 'wifi_type': ''},
        {'flight_number': 'SG-722', 'airline': spicejet, 'origin': O, 'destination': X,
         'departure_time': '09:30 PM', 'arrival_time': '11:40 PM', 'duration': '2h 10m', 'stops': 0, 'stop_details': 'Non-stop',
         'price_economy': D('5100'), 'price_premium': D('6800'), 'price_business': D('13200'), 'price_first': D('20500'),
         'aircraft_type': 'Boeing 737 MAX 8', 'baggage_checkin': '15 kg', 'baggage_cabin': '7 kg', 'refundable': False,
         'has_meals': True, 'has_wifi': False, 'has_usb': True, 'has_entertainment': False, 'seat_layout': '3-3', 'wifi_type': ''},

        # ── Air India AI (5 flights, full service) ──
        {'flight_number': 'AI-834', 'airline': airindia, 'origin': O, 'destination': X,
         'departure_time': '06:00 AM', 'arrival_time': '08:15 AM', 'duration': '2h 15m', 'stops': 0, 'stop_details': 'Non-stop',
         'price_economy': D('6506'), 'price_premium': D('8500'), 'price_business': D('18200'), 'price_first': D('32000'),
         'aircraft_type': 'Airbus A321neo', 'baggage_checkin': '25 kg', 'baggage_cabin': '8 kg', 'refundable': True,
         'has_meals': True, 'has_wifi': True, 'has_usb': True, 'has_entertainment': True, 'seat_layout': '3-3', 'wifi_type': 'Complimentary'},
        {'flight_number': 'AI-202', 'airline': airindia, 'origin': O, 'destination': X,
         'departure_time': '09:30 AM', 'arrival_time': '11:50 AM', 'duration': '2h 20m', 'stops': 0, 'stop_details': 'Non-stop',
         'price_economy': D('6800'), 'price_premium': D('9000'), 'price_business': D('19500'), 'price_first': D('34000'),
         'aircraft_type': 'Airbus A350-900', 'baggage_checkin': '25 kg', 'baggage_cabin': '8 kg', 'refundable': True,
         'has_meals': True, 'has_wifi': True, 'has_usb': True, 'has_entertainment': True, 'seat_layout': '2-4-2', 'wifi_type': 'Complimentary'},
        {'flight_number': 'AI-618', 'airline': airindia, 'origin': O, 'destination': X,
         'departure_time': '01:30 PM', 'arrival_time': '03:50 PM', 'duration': '2h 20m', 'stops': 0, 'stop_details': 'Non-stop',
         'price_economy': D('6506'), 'price_premium': D('8700'), 'price_business': D('18800'), 'price_first': D('33000'),
         'aircraft_type': 'Airbus A321neo', 'baggage_checkin': '25 kg', 'baggage_cabin': '8 kg', 'refundable': True,
         'has_meals': True, 'has_wifi': True, 'has_usb': True, 'has_entertainment': True, 'seat_layout': '3-3', 'wifi_type': 'Complimentary'},
        {'flight_number': 'AI-116', 'airline': airindia, 'origin': O, 'destination': X,
         'departure_time': '07:00 PM', 'arrival_time': '09:25 PM', 'duration': '2h 25m', 'stops': 0, 'stop_details': 'Non-stop',
         'price_economy': D('7100'), 'price_premium': D('9500'), 'price_business': D('21000'), 'price_first': D('38000'),
         'aircraft_type': 'Airbus A350-900', 'baggage_checkin': '25 kg', 'baggage_cabin': '8 kg', 'refundable': True,
         'has_meals': True, 'has_wifi': True, 'has_usb': True, 'has_entertainment': True, 'seat_layout': '2-4-2', 'wifi_type': 'Complimentary'},
        {'flight_number': 'AI-988', 'airline': airindia, 'origin': O, 'destination': X,
         'departure_time': '11:15 PM', 'arrival_time': '01:40 AM', 'duration': '2h 25m', 'stops': 0, 'stop_details': 'Non-stop',
         'price_economy': D('6200'), 'price_premium': D('8200'), 'price_business': D('17500'), 'price_first': D('30000'),
         'aircraft_type': 'Airbus A321neo', 'baggage_checkin': '25 kg', 'baggage_cabin': '8 kg', 'refundable': True,
         'has_meals': True, 'has_wifi': True, 'has_usb': True, 'has_entertainment': True, 'seat_layout': '3-3', 'wifi_type': 'Complimentary'},

        # ── Akasa Air QP (3 flights) ──
        {'flight_number': 'QP-1102', 'airline': akasa, 'origin': O, 'destination': X,
         'departure_time': '06:30 AM', 'arrival_time': '08:45 AM', 'duration': '2h 15m', 'stops': 0, 'stop_details': 'Non-stop',
         'price_economy': D('5154'), 'price_premium': D('6800'), 'price_business': D('12900'), 'price_first': D('19800'),
         'aircraft_type': 'Boeing 737 MAX', 'baggage_checkin': '15 kg', 'baggage_cabin': '7 kg', 'refundable': False,
         'has_meals': False, 'has_wifi': False, 'has_usb': True, 'has_entertainment': False, 'seat_layout': '3-3', 'wifi_type': ''},
        {'flight_number': 'QP-214', 'airline': akasa, 'origin': O, 'destination': X,
         'departure_time': '11:20 AM', 'arrival_time': '01:35 PM', 'duration': '2h 15m', 'stops': 0, 'stop_details': 'Non-stop',
         'price_economy': D('5300'), 'price_premium': D('7000'), 'price_business': D('13400'), 'price_first': D('20500'),
         'aircraft_type': 'Boeing 737 MAX', 'baggage_checkin': '15 kg', 'baggage_cabin': '7 kg', 'refundable': False,
         'has_meals': False, 'has_wifi': False, 'has_usb': True, 'has_entertainment': False, 'seat_layout': '3-3', 'wifi_type': ''},
        {'flight_number': 'QP-508', 'airline': akasa, 'origin': O, 'destination': X,
         'departure_time': '08:00 PM', 'arrival_time': '10:15 PM', 'duration': '2h 15m', 'stops': 0, 'stop_details': 'Non-stop',
         'price_economy': D('5050'), 'price_premium': D('6700'), 'price_business': D('12800'), 'price_first': D('19500'),
         'aircraft_type': 'Boeing 737 MAX', 'baggage_checkin': '15 kg', 'baggage_cabin': '7 kg', 'refundable': False,
         'has_meals': False, 'has_wifi': False, 'has_usb': True, 'has_entertainment': False, 'seat_layout': '3-3', 'wifi_type': ''},

        # ── Air India Express IX (3 flights) ──
        {'flight_number': 'IX-241', 'airline': aix, 'origin': O, 'destination': X,
         'departure_time': '05:30 AM', 'arrival_time': '07:45 AM', 'duration': '2h 15m', 'stops': 0, 'stop_details': 'Non-stop',
         'price_economy': D('5034'), 'price_premium': D('6500'), 'price_business': D('12100'), 'price_first': D('18500'),
         'aircraft_type': 'Boeing 737-800', 'baggage_checkin': '15 kg', 'baggage_cabin': '7 kg', 'refundable': False,
         'has_meals': True, 'has_wifi': False, 'has_usb': True, 'has_entertainment': False, 'seat_layout': '3-3', 'wifi_type': ''},
        {'flight_number': 'IX-519', 'airline': aix, 'origin': O, 'destination': X,
         'departure_time': '02:30 PM', 'arrival_time': '04:45 PM', 'duration': '2h 15m', 'stops': 0, 'stop_details': 'Non-stop',
         'price_economy': D('5150'), 'price_premium': D('6700'), 'price_business': D('12500'), 'price_first': D('19000'),
         'aircraft_type': 'Boeing 737-800', 'baggage_checkin': '15 kg', 'baggage_cabin': '7 kg', 'refundable': False,
         'has_meals': True, 'has_wifi': False, 'has_usb': True, 'has_entertainment': False, 'seat_layout': '3-3', 'wifi_type': ''},
        {'flight_number': 'IX-763', 'airline': aix, 'origin': O, 'destination': X,
         'departure_time': '08:45 PM', 'arrival_time': '11:00 PM', 'duration': '2h 15m', 'stops': 0, 'stop_details': 'Non-stop',
         'price_economy': D('4990'), 'price_premium': D('6400'), 'price_business': D('11900'), 'price_first': D('18200'),
         'aircraft_type': 'Boeing 737-800', 'baggage_checkin': '15 kg', 'baggage_cabin': '7 kg', 'refundable': False,
         'has_meals': True, 'has_wifi': False, 'has_usb': True, 'has_entertainment': False, 'seat_layout': '3-3', 'wifi_type': ''},

        # ── Vistara UK (4 flights, premium Indian) ──
        {'flight_number': 'UK-942', 'airline': vistara, 'origin': O, 'destination': X,
         'departure_time': '07:15 AM', 'arrival_time': '09:30 AM', 'duration': '2h 15m', 'stops': 0, 'stop_details': 'Non-stop',
         'price_economy': D('7200'), 'price_premium': D('10500'), 'price_business': D('22000'), 'price_first': D('40000'),
         'aircraft_type': 'Airbus A321neo Premium', 'baggage_checkin': '20 kg', 'baggage_cabin': '7 kg', 'refundable': True,
         'has_meals': True, 'has_wifi': True, 'has_usb': True, 'has_entertainment': True, 'seat_layout': '3-3', 'wifi_type': 'Complimentary'},
        {'flight_number': 'UK-182', 'airline': vistara, 'origin': O, 'destination': X,
         'departure_time': '11:00 AM', 'arrival_time': '01:15 PM', 'duration': '2h 15m', 'stops': 0, 'stop_details': 'Non-stop',
         'price_economy': D('7500'), 'price_premium': D('11000'), 'price_business': D('23500'), 'price_first': D('42000'),
         'aircraft_type': 'Boeing 787-9 Dreamliner', 'baggage_checkin': '20 kg', 'baggage_cabin': '7 kg', 'refundable': True,
         'has_meals': True, 'has_wifi': True, 'has_usb': True, 'has_entertainment': True, 'seat_layout': '2-3-2', 'wifi_type': 'Complimentary'},
        {'flight_number': 'UK-650', 'airline': vistara, 'origin': O, 'destination': X,
         'departure_time': '04:00 PM', 'arrival_time': '06:15 PM', 'duration': '2h 15m', 'stops': 0, 'stop_details': 'Non-stop',
         'price_economy': D('7800'), 'price_premium': D('11500'), 'price_business': D('25000'), 'price_first': D('45000'),
         'aircraft_type': 'Airbus A321neo Premium', 'baggage_checkin': '20 kg', 'baggage_cabin': '7 kg', 'refundable': True,
         'has_meals': True, 'has_wifi': True, 'has_usb': True, 'has_entertainment': True, 'seat_layout': '3-3', 'wifi_type': 'Complimentary'},
        {'flight_number': 'UK-310', 'airline': vistara, 'origin': O, 'destination': X,
         'departure_time': '10:45 PM', 'arrival_time': '01:00 AM', 'duration': '2h 15m', 'stops': 0, 'stop_details': 'Non-stop',
         'price_economy': D('6900'), 'price_premium': D('10000'), 'price_business': D('21000'), 'price_first': D('38000'),
         'aircraft_type': 'Airbus A321neo Premium', 'baggage_checkin': '20 kg', 'baggage_cabin': '7 kg', 'refundable': True,
         'has_meals': True, 'has_wifi': True, 'has_usb': True, 'has_entertainment': True, 'seat_layout': '3-3', 'wifi_type': 'Complimentary'},

        # ── Emirates EK (4 flights via Dubai) ──
        {'flight_number': 'EK-512', 'airline': ek, 'origin': O, 'destination': X,
         'departure_time': '02:30 AM', 'arrival_time': '08:00 AM', 'duration': '5h 30m', 'stops': 1, 'stop_details': '1h 30m via Dubai (DXB)',
         'price_economy': D('18500'), 'price_premium': D('28500'), 'price_business': D('65000'), 'price_first': D('125000'),
         'aircraft_type': 'Boeing 777-300ER', 'baggage_checkin': '30 kg', 'baggage_cabin': '7 kg', 'refundable': True,
         'has_meals': True, 'has_wifi': True, 'has_usb': True, 'has_entertainment': True, 'seat_layout': '3-4-3', 'wifi_type': 'Chargeable'},
        {'flight_number': 'EK-208', 'airline': ek, 'origin': O, 'destination': X,
         'departure_time': '06:45 AM', 'arrival_time': '12:20 PM', 'duration': '5h 35m', 'stops': 1, 'stop_details': '1h 15m via Dubai (DXB)',
         'price_economy': D('19200'), 'price_premium': D('29800'), 'price_business': D('68000'), 'price_first': D('132000'),
         'aircraft_type': 'Airbus A380-800', 'baggage_checkin': '30 kg', 'baggage_cabin': '7 kg', 'refundable': True,
         'has_meals': True, 'has_wifi': True, 'has_usb': True, 'has_entertainment': True, 'seat_layout': '3-4-3', 'wifi_type': 'Complimentary'},
        {'flight_number': 'EK-416', 'airline': ek, 'origin': O, 'destination': X,
         'departure_time': '02:15 PM', 'arrival_time': '07:50 PM', 'duration': '5h 35m', 'stops': 1, 'stop_details': '1h 20m via Dubai (DXB)',
         'price_economy': D('20100'), 'price_premium': D('31000'), 'price_business': D('72000'), 'price_first': D('145000'),
         'aircraft_type': 'Boeing 777-300ER', 'baggage_checkin': '30 kg', 'baggage_cabin': '7 kg', 'refundable': True,
         'has_meals': True, 'has_wifi': True, 'has_usb': True, 'has_entertainment': True, 'seat_layout': '3-4-3', 'wifi_type': 'Chargeable'},
        {'flight_number': 'EK-714', 'airline': ek, 'origin': O, 'destination': X,
         'departure_time': '11:30 PM', 'arrival_time': '05:10 AM', 'duration': '5h 40m', 'stops': 1, 'stop_details': '1h 25m via Dubai (DXB)',
         'price_economy': D('17800'), 'price_premium': D('27500'), 'price_business': D('62000'), 'price_first': D('119000'),
         'aircraft_type': 'Airbus A380-800', 'baggage_checkin': '30 kg', 'baggage_cabin': '7 kg', 'refundable': True,
         'has_meals': True, 'has_wifi': True, 'has_usb': True, 'has_entertainment': True, 'seat_layout': '3-4-3', 'wifi_type': 'Complimentary'},

        # ── Qatar Airways QR (4 flights via Doha) ──
        {'flight_number': 'QR-208', 'airline': qr, 'origin': O, 'destination': X,
         'departure_time': '01:30 AM', 'arrival_time': '07:20 AM', 'duration': '5h 50m', 'stops': 1, 'stop_details': '1h 45m via Doha (DOH)',
         'price_economy': D('19200'), 'price_premium': D('29800'), 'price_business': D('68000'), 'price_first': D('135000'),
         'aircraft_type': 'Airbus A350-900', 'baggage_checkin': '35 kg', 'baggage_cabin': '7 kg', 'refundable': True,
         'has_meals': True, 'has_wifi': True, 'has_usb': True, 'has_entertainment': True, 'seat_layout': '3-3-3', 'wifi_type': 'Complimentary'},
        {'flight_number': 'QR-602', 'airline': qr, 'origin': O, 'destination': X,
         'departure_time': '08:15 AM', 'arrival_time': '02:05 PM', 'duration': '5h 50m', 'stops': 1, 'stop_details': '1h 35m via Doha (DOH)',
         'price_economy': D('20100'), 'price_premium': D('31000'), 'price_business': D('71000'), 'price_first': D('142000'),
         'aircraft_type': 'Boeing 787-9 Dreamliner', 'baggage_checkin': '35 kg', 'baggage_cabin': '7 kg', 'refundable': True,
         'has_meals': True, 'has_wifi': True, 'has_usb': True, 'has_entertainment': True, 'seat_layout': '2-4-2', 'wifi_type': 'Complimentary'},
        {'flight_number': 'QR-814', 'airline': qr, 'origin': O, 'destination': X,
         'departure_time': '03:45 PM', 'arrival_time': '09:35 PM', 'duration': '5h 50m', 'stops': 1, 'stop_details': '1h 45m via Doha (DOH)',
         'price_economy': D('21500'), 'price_premium': D('33000'), 'price_business': D('75000'), 'price_first': D('150000'),
         'aircraft_type': 'Airbus A350-900 XWB', 'baggage_checkin': '35 kg', 'baggage_cabin': '7 kg', 'refundable': True,
         'has_meals': True, 'has_wifi': True, 'has_usb': True, 'has_entertainment': True, 'seat_layout': '3-3-3', 'wifi_type': 'Complimentary'},
        {'flight_number': 'QR-112', 'airline': qr, 'origin': O, 'destination': X,
         'departure_time': '10:00 PM', 'arrival_time': '03:55 AM', 'duration': '5h 55m', 'stops': 1, 'stop_details': '1h 50m via Doha (DOH)',
         'price_economy': D('18500'), 'price_premium': D('28500'), 'price_business': D('65000'), 'price_first': D('128000'),
         'aircraft_type': 'Airbus A350-900', 'baggage_checkin': '35 kg', 'baggage_cabin': '7 kg', 'refundable': True,
         'has_meals': True, 'has_wifi': True, 'has_usb': True, 'has_entertainment': True, 'seat_layout': '3-3-3', 'wifi_type': 'Complimentary'},

        # ── Singapore Airlines SQ (3 flights via Singapore) ──
        {'flight_number': 'SQ-416', 'airline': sq, 'origin': O, 'destination': X,
         'departure_time': '12:30 AM', 'arrival_time': '09:00 AM', 'duration': '8h 30m', 'stops': 1, 'stop_details': '2h 10m via Singapore (SIN)',
         'price_economy': D('22400'), 'price_premium': D('34500'), 'price_business': D('78000'), 'price_first': D('148000'),
         'aircraft_type': 'Boeing 787-10 Dreamliner', 'baggage_checkin': '30 kg', 'baggage_cabin': '7 kg', 'refundable': True,
         'has_meals': True, 'has_wifi': True, 'has_usb': True, 'has_entertainment': True, 'seat_layout': '3-3-3', 'wifi_type': 'Complimentary'},
        {'flight_number': 'SQ-848', 'airline': sq, 'origin': O, 'destination': X,
         'departure_time': '10:00 AM', 'arrival_time': '06:30 PM', 'duration': '8h 30m', 'stops': 1, 'stop_details': '2h 00m via Singapore (SIN)',
         'price_economy': D('23800'), 'price_premium': D('36500'), 'price_business': D('82000'), 'price_first': D('158000'),
         'aircraft_type': 'Airbus A350-900 ULR', 'baggage_checkin': '30 kg', 'baggage_cabin': '7 kg', 'refundable': True,
         'has_meals': True, 'has_wifi': True, 'has_usb': True, 'has_entertainment': True, 'seat_layout': '2-4-2', 'wifi_type': 'Complimentary'},
        {'flight_number': 'SQ-124', 'airline': sq, 'origin': O, 'destination': X,
         'departure_time': '08:45 PM', 'arrival_time': '05:15 AM', 'duration': '8h 30m', 'stops': 1, 'stop_details': '2h 20m via Singapore (SIN)',
         'price_economy': D('21500'), 'price_premium': D('33000'), 'price_business': D('76000'), 'price_first': D('144000'),
         'aircraft_type': 'Boeing 777-300ER', 'baggage_checkin': '30 kg', 'baggage_cabin': '7 kg', 'refundable': True,
         'has_meals': True, 'has_wifi': True, 'has_usb': True, 'has_entertainment': True, 'seat_layout': '3-4-3', 'wifi_type': 'Complimentary'},

        # ── British Airways BA (4 flights via London) ──
        {'flight_number': 'BA-118', 'airline': ba, 'origin': O, 'destination': X,
         'departure_time': '03:00 AM', 'arrival_time': '11:30 AM', 'duration': '8h 30m', 'stops': 1, 'stop_details': '1h 50m via Delhi (DEL)',
         'price_economy': D('42000'), 'price_premium': D('68000'), 'price_business': D('145000'), 'price_first': D('285000'),
         'aircraft_type': 'Boeing 777-200ER', 'baggage_checkin': '23 kg', 'baggage_cabin': '7 kg', 'refundable': True,
         'has_meals': True, 'has_wifi': True, 'has_usb': True, 'has_entertainment': True, 'seat_layout': '3-4-3', 'wifi_type': 'Chargeable'},
        {'flight_number': 'BA-256', 'airline': ba, 'origin': O, 'destination': X,
         'departure_time': '09:00 AM', 'arrival_time': '05:30 PM', 'duration': '8h 30m', 'stops': 1, 'stop_details': '2h 00m via Delhi (DEL)',
         'price_economy': D('45000'), 'price_premium': D('72000'), 'price_business': D('155000'), 'price_first': D('310000'),
         'aircraft_type': 'Boeing 787-9 Dreamliner', 'baggage_checkin': '23 kg', 'baggage_cabin': '7 kg', 'refundable': True,
         'has_meals': True, 'has_wifi': True, 'has_usb': True, 'has_entertainment': True, 'seat_layout': '2-4-2', 'wifi_type': 'Chargeable'},
        {'flight_number': 'BA-404', 'airline': ba, 'origin': O, 'destination': X,
         'departure_time': '04:30 PM', 'arrival_time': '01:00 AM', 'duration': '8h 30m', 'stops': 1, 'stop_details': '1h 55m via Delhi (DEL)',
         'price_economy': D('48000'), 'price_premium': D('76000'), 'price_business': D('165000'), 'price_first': D('330000'),
         'aircraft_type': 'Airbus A380-800', 'baggage_checkin': '23 kg', 'baggage_cabin': '7 kg', 'refundable': True,
         'has_meals': True, 'has_wifi': True, 'has_usb': True, 'has_entertainment': True, 'seat_layout': '3-4-3', 'wifi_type': 'Complimentary'},
        {'flight_number': 'BA-614', 'airline': ba, 'origin': O, 'destination': X,
         'departure_time': '11:00 PM', 'arrival_time': '07:30 AM', 'duration': '8h 30m', 'stops': 1, 'stop_details': '1h 45m via Delhi (DEL)',
         'price_economy': D('40000'), 'price_premium': D('65000'), 'price_business': D('138000'), 'price_first': D('275000'),
         'aircraft_type': 'Boeing 777-200ER', 'baggage_checkin': '23 kg', 'baggage_cabin': '7 kg', 'refundable': True,
         'has_meals': True, 'has_wifi': True, 'has_usb': True, 'has_entertainment': True, 'seat_layout': '3-4-3', 'wifi_type': 'Chargeable'},

        # ── Etihad Airways EY (4 flights via Abu Dhabi) ──
        {'flight_number': 'EY-204', 'airline': ey, 'origin': O, 'destination': X,
         'departure_time': '04:00 AM', 'arrival_time': '10:40 AM', 'duration': '6h 40m', 'stops': 1, 'stop_details': '2h 00m via Abu Dhabi (AUH)',
         'price_economy': D('16800'), 'price_premium': D('26000'), 'price_business': D('59000'), 'price_first': D('112000'),
         'aircraft_type': 'Boeing 787-9 Dreamliner', 'baggage_checkin': '30 kg', 'baggage_cabin': '7 kg', 'refundable': True,
         'has_meals': True, 'has_wifi': True, 'has_usb': True, 'has_entertainment': True, 'seat_layout': '2-4-2', 'wifi_type': 'Complimentary'},
        {'flight_number': 'EY-418', 'airline': ey, 'origin': O, 'destination': X,
         'departure_time': '10:30 AM', 'arrival_time': '05:10 PM', 'duration': '6h 40m', 'stops': 1, 'stop_details': '2h 10m via Abu Dhabi (AUH)',
         'price_economy': D('17500'), 'price_premium': D('27000'), 'price_business': D('62000'), 'price_first': D('120000'),
         'aircraft_type': 'Airbus A380-800', 'baggage_checkin': '30 kg', 'baggage_cabin': '7 kg', 'refundable': True,
         'has_meals': True, 'has_wifi': True, 'has_usb': True, 'has_entertainment': True, 'seat_layout': '3-4-3', 'wifi_type': 'Complimentary'},
        {'flight_number': 'EY-626', 'airline': ey, 'origin': O, 'destination': X,
         'departure_time': '05:30 PM', 'arrival_time': '12:10 AM', 'duration': '6h 40m', 'stops': 1, 'stop_details': '1h 55m via Abu Dhabi (AUH)',
         'price_economy': D('18200'), 'price_premium': D('28000'), 'price_business': D('64000'), 'price_first': D('125000'),
         'aircraft_type': 'Boeing 787-9 Dreamliner', 'baggage_checkin': '30 kg', 'baggage_cabin': '7 kg', 'refundable': True,
         'has_meals': True, 'has_wifi': True, 'has_usb': True, 'has_entertainment': True, 'seat_layout': '2-4-2', 'wifi_type': 'Complimentary'},
        {'flight_number': 'EY-834', 'airline': ey, 'origin': O, 'destination': X,
         'departure_time': '09:00 PM', 'arrival_time': '03:40 AM', 'duration': '6h 40m', 'stops': 1, 'stop_details': '2h 05m via Abu Dhabi (AUH)',
         'price_economy': D('15800'), 'price_premium': D('24500'), 'price_business': D('55000'), 'price_first': D('105000'),
         'aircraft_type': 'Airbus A380-800', 'baggage_checkin': '30 kg', 'baggage_cabin': '7 kg', 'refundable': True,
         'has_meals': True, 'has_wifi': True, 'has_usb': True, 'has_entertainment': True, 'seat_layout': '3-4-3', 'wifi_type': 'Complimentary'},
    ]

    created_flights = []
    for f in flight_templates:
        flight, created = FlightSchedule.objects.get_or_create(
            flight_number=f['flight_number'],
            airline=f['airline'],
            origin=f['origin'],
            destination=f['destination'],
            defaults=f
        )
        if not created:
            # Update amenity fields on existing records
            for field in ['has_meals', 'has_wifi', 'has_usb', 'has_entertainment', 'seat_layout', 'wifi_type', 'stop_details', 'aircraft_type']:
                if field in f:
                    setattr(flight, field, f[field])
            flight.save(update_fields=['has_meals', 'has_wifi', 'has_usb', 'has_entertainment', 'seat_layout', 'wifi_type', 'stop_details', 'aircraft_type'])

        if created or flight.seats.count() == 0:
            seats_to_create = []
            for row in range(10, 19):
                for col in ['A', 'B', 'C', 'D', 'E', 'F']:
                    seat_num = f"{row}{col}"
                    is_window = col in ['A', 'F']
                    is_aisle = col in ['C', 'D']
                    is_extra_legroom = row in [10, 14]
                    seat_class = 'business' if row <= 12 else 'economy'
                    extra_price = Decimal('45.00') if is_extra_legroom else (Decimal('15.00') if is_window else Decimal('0.00'))

                    seats_to_create.append(
                        FlightSeat(
                            flight_schedule=flight,
                            seat_number=seat_num,
                            seat_class=seat_class,
                            is_window=is_window,
                            is_aisle=is_aisle,
                            extra_price=extra_price,
                            is_available=(seat_num not in ['10B', '11C', '14A', '16E'])
                        )
                    )
            FlightSeat.objects.bulk_create(seats_to_create, ignore_conflicts=True)
        created_flights.append(flight)

    return created_flights


class AirportListView(generics.ListAPIView):
    serializer_class = AirportSerializer
    permission_classes = (permissions.AllowAny,)

    @extend_schema(summary="List / Search airports for autocomplete")
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        query = (self.request.query_params.get('q') or '').strip()
        if query:
            return Airport.objects.filter(
                Q(name__icontains=query) | Q(city__icontains=query) | Q(iata_code__icontains=query) | Q(country__icontains=query)
            )
        return Airport.objects.all()[:20]


class FlightSearchListView(generics.ListAPIView):
    serializer_class = FlightScheduleSerializer
    permission_classes = (permissions.AllowAny,)

    @extend_schema(
        summary="Search flights with filters",
        parameters=[
            OpenApiParameter('origin', OpenApiTypes.STR, description='Origin airport IATA code or city name (e.g. DXB, Pune, Mumbai)'),
            OpenApiParameter('destination', OpenApiTypes.STR, description='Destination airport IATA code or city name (e.g. LHR, Delhi, London)'),
            OpenApiParameter('stops', OpenApiTypes.INT, description='0 for non-stop, 1, 2'),
            OpenApiParameter('airline', OpenApiTypes.STR, description='Airline IATA code (e.g. EK)'),
            OpenApiParameter('max_price', OpenApiTypes.FLOAT, description='Max price ceiling'),
        ]
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        origin_raw = (self.request.query_params.get('origin') or '').strip()
        dest_raw = (self.request.query_params.get('destination') or '').strip()
        stops = self.request.query_params.get('stops')
        airline_code = self.request.query_params.get('airline')
        max_price = self.request.query_params.get('max_price')

        qs = FlightSchedule.objects.all().select_related('airline', 'origin', 'destination').prefetch_related('seats')

        origin_ap = None
        dest_ap = None
        if origin_raw:
            origin_ap = resolve_airport(origin_raw)
            if origin_ap:
                qs = qs.filter(origin=origin_ap)
            else:
                qs = qs.filter(Q(origin__iata_code__iexact=origin_raw) | Q(origin__city__icontains=origin_raw))

        if dest_raw:
            dest_ap = resolve_airport(dest_raw)
            if dest_ap:
                qs = qs.filter(destination=dest_ap)
            else:
                qs = qs.filter(Q(destination__iata_code__iexact=dest_raw) | Q(destination__city__icontains=dest_raw))

        # Dynamic generation if no flights match the origin and destination pair
        if qs.count() == 0 and origin_ap and dest_ap and origin_ap != dest_ap:
            get_or_create_dynamic_flights(origin_ap, dest_ap)
            qs = FlightSchedule.objects.filter(origin=origin_ap, destination=dest_ap).select_related('airline', 'origin', 'destination').prefetch_related('seats')

        if stops is not None and stops != '' and stops != 'undefined':
            try:
                qs = qs.filter(stops=int(stops))
            except (ValueError, TypeError):
                pass
        if airline_code:
            qs = qs.filter(airline__iata_code__iexact=airline_code)
        if max_price and max_price != 'undefined':
            try:
                qs = qs.filter(price_economy__lte=float(max_price))
            except (ValueError, TypeError):
                pass

        return qs.order_by('price_economy')


class FlightScheduleDetailView(generics.RetrieveAPIView):
    queryset = FlightSchedule.objects.all()
    serializer_class = FlightScheduleSerializer
    permission_classes = (permissions.AllowAny,)


class FlightBookingCreateView(APIView):
    permission_classes = (permissions.AllowAny,)

    @extend_schema(
        summary="Book a flight directly",
        responses={201: FlightBookingSerializer}
    )
    def post(self, request):
        data = request.data
        schedule_id = data.get('flight_schedule_id')
        passengers = data.get('passengers', [])
        cabin_class = data.get('cabin_class', 'economy')
        selected_seats = data.get('selected_seats', '')
        contact_name = data.get('contact_name', 'Passenger')
        contact_email = data.get('contact_email', 'traveler@example.com')
        contact_phone = data.get('contact_phone', '+1234567890')
        currency = data.get('currency', 'USD')
        total_amount = data.get('total_amount', 450.00)
        travel_date = data.get('travel_date')

        try:
            schedule = FlightSchedule.objects.get(id=schedule_id)
        except FlightSchedule.DoesNotExist:
            return Response({"error": "Flight schedule not found"}, status=status.HTTP_404_NOT_FOUND)

        user = request.user if request.user.is_authenticated else None
        
        booking = Booking.objects.create(
            user=user,
            booking_type='flight',
            title=f"Flight {schedule.airline.iata_code}-{schedule.flight_number}: {schedule.origin.iata_code} to {schedule.destination.iata_code}",
            summary=f"{schedule.airline.name} • {cabin_class.title()} Class • {len(passengers) or 1} Passenger(s)",
            total_amount=total_amount,
            final_amount=total_amount,
            currency=currency,
            contact_name=contact_name,
            contact_email=contact_email,
            contact_phone=contact_phone,
            travel_date=travel_date,
            details_json={
                "flight_number": f"{schedule.airline.iata_code}-{schedule.flight_number}",
                "airline": schedule.airline.name,
                "origin": f"{schedule.origin.city} ({schedule.origin.iata_code})",
                "destination": f"{schedule.destination.city} ({schedule.destination.iata_code})",
                "departure_time": schedule.departure_time,
                "arrival_time": schedule.arrival_time,
                "cabin_class": cabin_class,
                "selected_seats": selected_seats,
                "passengers": passengers,
            },
            status='confirmed',
            payment_status='paid'
        )

        flight_booking = FlightBooking.objects.create(
            booking=booking,
            flight_schedule=schedule,
            cabin_class=cabin_class,
            passengers_json=passengers,
            selected_seats=selected_seats,
            e_ticket_number=f"ETK-{uuid.uuid4().hex[:9].upper()}",
            meal_preference=data.get('meal_preference', 'Standard')
        )

        return Response({
            "message": "Flight booked successfully!",
            "booking_reference": booking.booking_reference,
            "e_ticket_number": flight_booking.e_ticket_number,
            "flight_booking": FlightBookingSerializer(flight_booking).data
        }, status=status.HTTP_201_CREATED)
