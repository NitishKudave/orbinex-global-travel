from datetime import date, timedelta
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

from apps.accounts.models import SavedTraveler
from apps.core_bookings.models import Booking
from apps.flights.models import Airline, Airport, FlightSchedule, FlightSeat, FlightBooking
from apps.hotels.models import Hotel, HotelAmenity, HotelRoom, HotelBooking
from apps.buses.models import BusOperator, BusTrip, BusSeat, BusBooking
from apps.visa.models import VisaCountry, VisaType, VisaApplication
from apps.insurance.models import InsuranceProvider, InsurancePlan, InsurancePolicy
from apps.holidays.models import HolidayDestination, HolidayPackage, PackageItineraryDay, HolidayBooking
from apps.umrah.models import UmrahHotel, UmrahPackage, UmrahBooking
from apps.medical_tourism.models import MedicalSpecialty, MedicalHospital, MedicalPackage, MedicalEnquiry
from apps.europamundo.models import EuropamundoTour, TourStop, TourDeparture
from apps.utilities.models import ForexRate, EsimPackage, AirportLounge
from apps.offers.models import CouponCode, PromotionalDeal
from apps.newsletter.models import NewsletterSubscriber, NewsletterCampaign
from apps.payments.models import PaymentTransaction

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds complete realistic inventory and demo data across all 12 travel modules for OrbinexGlobal Travel'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("==> Seeding OrbinexGlobal Travel Database..."))

        # 1. Accounts & Superuser
        admin_user, _ = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@orbinexglobal.com',
                'first_name': 'Global',
                'last_name': 'Admin',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        admin_user.set_password('Admin@Orbinex2026!')
        admin_user.save()

        demo_user, _ = User.objects.get_or_create(
            username='demo_user',
            defaults={
                'email': 'alex.morgan@example.com',
                'first_name': 'Alex',
                'last_name': 'Morgan',
                'phone_number': '+1 (555) 234-5678',
                'passport_number': 'USA98421004',
                'passport_expiry': date(2031, 10, 15),
                'nationality': 'United States',
                'preferred_currency': 'USD',
            }
        )
        demo_user.set_password('Demo@Orbinex2026!')
        demo_user.save()

        SavedTraveler.objects.get_or_create(
            user=demo_user,
            first_name='Alex',
            last_name='Morgan',
            defaults={
                'title': 'Mr',
                'date_of_birth': date(1988, 4, 12),
                'gender': 'male',
                'traveler_type': 'adult',
                'passport_number': 'USA98421004',
                'passport_expiry': date(2031, 10, 15),
                'passport_country': 'United States',
                'email': 'alex.morgan@example.com',
                'phone_number': '+1 (555) 234-5678',
                'frequent_flyer_number': 'EK-9082341'
            }
        )

        SavedTraveler.objects.get_or_create(
            user=demo_user,
            first_name='Sophia',
            last_name='Morgan',
            defaults={
                'title': 'Mrs',
                'date_of_birth': date(1991, 8, 24),
                'gender': 'female',
                'traveler_type': 'adult',
                'passport_number': 'USA98421005',
                'passport_expiry': date(2032, 5, 20),
                'passport_country': 'United States',
                'email': 'sophia.morgan@example.com',
                'phone_number': '+1 (555) 234-5679'
            }
        )

        # 2. Airports & Airlines
        airports_data = [
            {'name': 'Dubai International Airport', 'city': 'Dubai', 'country': 'United Arab Emirates', 'iata_code': 'DXB'},
            {'name': 'London Heathrow Airport', 'city': 'London', 'country': 'United Kingdom', 'iata_code': 'LHR'},
            {'name': 'John F. Kennedy International Airport', 'city': 'New York', 'country': 'United States', 'iata_code': 'JFK'},
            {'name': 'Singapore Changi Airport', 'city': 'Singapore', 'country': 'Singapore', 'iata_code': 'SIN'},
            {'name': 'Indira Gandhi International Airport', 'city': 'New Delhi', 'country': 'India', 'iata_code': 'DEL'},
            {'name': 'Charles de Gaulle Airport', 'city': 'Paris', 'country': 'France', 'iata_code': 'CDG'},
            {'name': 'Chhatrapati Shivaji Maharaj International', 'city': 'Mumbai', 'country': 'India', 'iata_code': 'BOM'},
            {'name': 'Tokyo Haneda Airport', 'city': 'Tokyo', 'country': 'Japan', 'iata_code': 'HND'},
            {'name': 'King Abdulaziz International Airport', 'city': 'Jeddah', 'country': 'Saudi Arabia', 'iata_code': 'JED'},
        ]
        airport_map = {}
        for ap in airports_data:
            obj, _ = Airport.objects.get_or_create(iata_code=ap['iata_code'], defaults=ap)
            airport_map[ap['iata_code']] = obj

        airlines_data = [
            {'name': 'Emirates', 'iata_code': 'EK', 'logo_url': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf'},
            {'name': 'Qatar Airways', 'iata_code': 'QR', 'logo_url': 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1'},
            {'name': 'British Airways', 'iata_code': 'BA', 'logo_url': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05'},
            {'name': 'Singapore Airlines', 'iata_code': 'SQ', 'logo_url': 'https://images.unsplash.com/photo-1520437358207-323b43b50729'},
            {'name': 'Air France', 'iata_code': 'AF', 'logo_url': 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e'},
        ]
        airline_map = {}
        for al in airlines_data:
            obj, _ = Airline.objects.get_or_create(iata_code=al['iata_code'], defaults=al)
            airline_map[al['iata_code']] = obj

        # Flight Schedules
        schedules_seed = [
            {
                'flight_number': '201', 'airline': airline_map['EK'], 'origin': airport_map['DXB'], 'destination': airport_map['LHR'],
                'departure_time': '07:45 AM', 'arrival_time': '12:15 PM', 'duration': '7h 30m', 'stops': 0, 'stop_details': 'Non-stop Direct',
                'price_economy': Decimal('480.00'), 'price_premium': Decimal('790.00'), 'price_business': Decimal('1650.00'), 'price_first': Decimal('3200.00'),
                'aircraft_type': 'Airbus A380-800'
            },
            {
                'flight_number': '007', 'airline': airline_map['QR'], 'origin': airport_map['DXB'], 'destination': airport_map['LHR'],
                'departure_time': '09:30 AM', 'arrival_time': '03:45 PM', 'duration': '9h 15m', 'stops': 1, 'stop_details': '1h 45m in Doha (DOH)',
                'price_economy': Decimal('390.00'), 'price_premium': Decimal('680.00'), 'price_business': Decimal('1420.00'), 'price_first': Decimal('2900.00'),
                'aircraft_type': 'Boeing 787-9 Dreamliner'
            },
            {
                'flight_number': '108', 'airline': airline_map['BA'], 'origin': airport_map['LHR'], 'destination': airport_map['JFK'],
                'departure_time': '11:15 AM', 'arrival_time': '02:25 PM', 'duration': '8h 10m', 'stops': 0, 'stop_details': 'Non-stop Direct',
                'price_economy': Decimal('520.00'), 'price_premium': Decimal('890.00'), 'price_business': Decimal('1850.00'), 'price_first': Decimal('3600.00'),
                'aircraft_type': 'Boeing 777-300ER'
            },
            {
                'flight_number': '318', 'airline': airline_map['SQ'], 'origin': airport_map['SIN'], 'destination': airport_map['LHR'],
                'departure_time': '12:45 AM', 'arrival_time': '07:10 AM', 'duration': '13h 25m', 'stops': 0, 'stop_details': 'Non-stop Direct',
                'price_economy': Decimal('640.00'), 'price_premium': Decimal('1050.00'), 'price_business': Decimal('2200.00'), 'price_first': Decimal('4400.00'),
                'aircraft_type': 'Airbus A350-900'
            },
            {
                'flight_number': '142', 'airline': airline_map['AF'], 'origin': airport_map['CDG'], 'destination': airport_map['DXB'],
                'departure_time': '01:30 PM', 'arrival_time': '11:00 PM', 'duration': '6h 30m', 'stops': 0, 'stop_details': 'Non-stop Direct',
                'price_economy': Decimal('450.00'), 'price_premium': Decimal('740.00'), 'price_business': Decimal('1580.00'), 'price_first': Decimal('3100.00'),
                'aircraft_type': 'Boeing 777-300ER'
            },
            {
                'flight_number': '505', 'airline': airline_map['EK'], 'origin': airport_map['BOM'], 'destination': airport_map['DXB'],
                'departure_time': '04:15 AM', 'arrival_time': '06:05 AM', 'duration': '3h 20m', 'stops': 0, 'stop_details': 'Non-stop Direct',
                'price_economy': Decimal('240.00'), 'price_premium': Decimal('390.00'), 'price_business': Decimal('750.00'), 'price_first': Decimal('1400.00'),
                'aircraft_type': 'Boeing 777-300ER'
            },
            {
                'flight_number': '702', 'airline': airline_map['EK'], 'origin': airport_map['DXB'], 'destination': airport_map['JED'],
                'departure_time': '08:00 AM', 'arrival_time': '10:15 AM', 'duration': '3h 15m', 'stops': 0, 'stop_details': 'Direct Pilgrimage Route',
                'price_economy': Decimal('280.00'), 'price_premium': Decimal('460.00'), 'price_business': Decimal('920.00'), 'price_first': Decimal('1800.00'),
                'aircraft_type': 'Airbus A380-800'
            },
        ]
        for s in schedules_seed:
            sch, created = FlightSchedule.objects.get_or_create(
                flight_number=s['flight_number'],
                airline=s['airline'],
                origin=s['origin'],
                destination=s['destination'],
                defaults=s
            )
            # Create sample seats if created
            if created:
                for row in range(10, 25):
                    for col in ['A', 'B', 'C', 'D', 'E', 'F']:
                        seat_no = f"{row}{col}"
                        seat_cls = 'business' if row < 12 else ('extra_legroom' if row in [12, 14] else 'economy')
                        is_win = col in ['A', 'F']
                        is_ais = col in ['C', 'D']
                        extra = Decimal('40.00') if seat_cls == 'extra_legroom' else (Decimal('120.00') if seat_cls == 'business' else Decimal('0.00'))
                        FlightSeat.objects.create(
                            flight_schedule=sch,
                            seat_number=seat_no,
                            seat_class=seat_cls,
                            extra_price=extra,
                            is_window=is_win,
                            is_aisle=is_ais,
                            is_available=(seat_no not in ['12A', '14C', '18D'])
                        )

        # 3. Hotels & Amenities
        amenities_data = [
            {'name': 'High-Speed Wi-Fi', 'icon_name': 'wifi'},
            {'name': 'Infinity Swimming Pool', 'icon_name': 'waves'},
            {'name': 'Full-Service Spa & Wellness', 'icon_name': 'sparkles'},
            {'name': 'Michelin Star Dining', 'icon_name': 'utensils'},
            {'name': 'Fitness Center & Gym', 'icon_name': 'dumbbell'},
            {'name': 'Valet Parking', 'icon_name': 'car'},
            {'name': 'Airport Shuttle Service', 'icon_name': 'bus'},
            {'name': '24/7 Room Service & Concierge', 'icon_name': 'bell'},
        ]
        amenity_objs = []
        for am in amenities_data:
            obj, _ = HotelAmenity.objects.get_or_create(name=am['name'], defaults=am)
            amenity_objs.append(obj)

        hotels_data = [
            {
                'name': 'Burj Al Arab Jumeirah',
                'city': 'Dubai',
                'country': 'United Arab Emirates',
                'address': 'Jumeirah St - Umm Suqeim 3, Dubai',
                'star_rating': 5,
                'guest_rating': Decimal('4.9'),
                'reviews_count': 1850,
                'price_per_night_start': Decimal('1250.00'),
                'main_image': 'https://images.unsplash.com/photo-1582719508461-905c673771fd',
                'images_gallery': [
                    'https://images.unsplash.com/photo-1582719508461-905c673771fd',
                    'https://images.unsplash.com/photo-1566073771259-6a8506099945',
                    'https://images.unsplash.com/photo-1571896349842-33c89424de2d'
                ],
                'description': 'The world’s most iconic ultra-luxury hotel, standing on its own private island with duplex suites, private butler service, and panoramic Arabian Gulf views.',
                'featured': True,
            },
            {
                'name': 'The Ritz-Carlton, Marina Bay',
                'city': 'Singapore',
                'country': 'Singapore',
                'address': '7 Raffles Ave, Marina Bay, Singapore 039797',
                'star_rating': 5,
                'guest_rating': Decimal('4.8'),
                'reviews_count': 1240,
                'price_per_night_start': Decimal('420.00'),
                'main_image': 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
                'images_gallery': [
                    'https://images.unsplash.com/photo-1566073771259-6a8506099945',
                    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4'
                ],
                'description': 'Luxury 5-star oasis in the heart of Marina Bay featuring iconic hexagonal bathroom windows, 4,200 piece art collection, and award-winning dining.',
                'featured': True,
            },
            {
                'name': 'Le Bristol Paris - Oetker Collection',
                'city': 'Paris',
                'country': 'France',
                'address': '112 Rue du Faubourg Saint-Honoré, 75008 Paris',
                'star_rating': 5,
                'guest_rating': Decimal('4.9'),
                'reviews_count': 980,
                'price_per_night_start': Decimal('1100.00'),
                'main_image': 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa',
                'images_gallery': ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa'],
                'description': 'An icon of French elegance located on prestige Rue du Faubourg Saint-Honoré with a rooftop yacht-style pool and triple Michelin-starred gastronomy.',
                'featured': True,
            },
            {
                'name': 'Four Seasons Resort Bali at Sayan',
                'city': 'Bali',
                'country': 'Indonesia',
                'address': 'Sayan, Ubud, Gianyar, Bali 80571',
                'star_rating': 5,
                'guest_rating': Decimal('4.9'),
                'reviews_count': 1520,
                'price_per_night_start': Decimal('680.00'),
                'main_image': 'https://images.unsplash.com/photo-1540541338287-41700207dee6',
                'images_gallery': ['https://images.unsplash.com/photo-1540541338287-41700207dee6'],
                'description': 'Hidden in the lush Ayung River valley in Ubud, accessible via an architectural suspension bridge over treetops into dramatic lotus ponds.',
                'featured': True,
            },
            {
                'name': 'The Savoy London',
                'city': 'London',
                'country': 'United Kingdom',
                'address': 'Strand, London WC2R 0EZ',
                'star_rating': 5,
                'guest_rating': Decimal('4.8'),
                'reviews_count': 2100,
                'price_per_night_start': Decimal('750.00'),
                'main_image': 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461',
                'images_gallery': ['https://images.unsplash.com/photo-1578683010236-d716f9a3f461'],
                'description': 'The UK’s most historic landmark hotel on the North Bank of the Thames, offering quintessential British hospitality and glamorous Art Deco suites.',
                'featured': True,
            }
        ]

        for hd in hotels_data:
            ht, created = Hotel.objects.get_or_create(name=hd['name'], defaults=hd)
            if created:
                ht.amenities.set(amenity_objs)
                # Add rooms
                HotelRoom.objects.create(
                    hotel=ht,
                    room_name='Deluxe King Room with City View',
                    bed_type='1 Extra-large King Bed',
                    max_guests=2,
                    room_size_sqm=42,
                    price_per_night=hd['price_per_night_start'],
                    image_url=hd['main_image'],
                    features_json=['City View', 'Marble Bathtub', 'Nespresso Machine', 'High-Speed Wi-Fi', 'Free Minibar Refill']
                )
                HotelRoom.objects.create(
                    hotel=ht,
                    room_name='Executive Panoramic Suite with Lounge Access',
                    bed_type='1 Master King Bed + 1 Sofa Bed',
                    max_guests=3,
                    room_size_sqm=78,
                    price_per_night=hd['price_per_night_start'] * Decimal('1.6'),
                    image_url=hd['images_gallery'][0] if hd['images_gallery'] else hd['main_image'],
                    features_json=['Panoramic View', 'Executive Club Lounge Access', 'Private Jacuzzi', 'Complimentary Evening Cocktails', 'Butler Service']
                )

        # 4. Buses
        op_dubai, _ = BusOperator.objects.get_or_create(
            name='Orbinex Luxury Express',
            defaults={'rating': Decimal('4.8'), 'total_reviews': 340}
        )
        op_intercity, _ = BusOperator.objects.get_or_create(
            name='National Express Intercity',
            defaults={'rating': Decimal('4.6'), 'total_reviews': 520}
        )

        buses_seed = [
            {
                'operator': op_dubai,
                'bus_type': 'volvo_multi_axle',
                'bus_name': 'Volvo B11R Luxury Multi-Axle AC',
                'origin': 'Dubai',
                'destination': 'Abu Dhabi',
                'departure_time': '08:30 AM',
                'arrival_time': '10:15 AM',
                'duration': '1h 45m',
                'fare_seater': Decimal('25.00'),
                'fare_sleeper': Decimal('35.00'),
                'boarding_points': [{'time': '08:00 AM', 'location': 'Al Ghubaiba Bus Station Bay 12'}, {'time': '08:30 AM', 'location': 'Ibn Battuta Mall Terminal'}],
                'dropping_points': [{'time': '10:15 AM', 'location': 'Abu Dhabi Central Bus Station'}, {'time': '10:45 AM', 'location': 'Yas Island Drop Point'}],
                'amenities': ['Wi-Fi 5G', 'USB Charging Port', 'Water Bottle', 'Live GPS Tracking', 'Reclining Push-Back Seats']
            },
            {
                'operator': op_intercity,
                'bus_type': 'scania_ac',
                'bus_name': 'Scania Metrolink HD Sleeper AC',
                'origin': 'London',
                'destination': 'Manchester',
                'departure_time': '09:00 PM',
                'arrival_time': '01:30 AM',
                'duration': '4h 30m',
                'fare_seater': Decimal('38.00'),
                'fare_sleeper': Decimal('58.00'),
                'boarding_points': [{'time': '08:45 PM', 'location': 'Victoria Coach Station Gate 6'}],
                'dropping_points': [{'time': '01:30 AM', 'location': 'Manchester Chorlton St Coach Station'}],
                'amenities': ['Free Wi-Fi', 'Power Sockets', 'Blanket & Pillow', 'Reading Light', 'Restroom on Board']
            },
            {
                'operator': op_dubai,
                'bus_type': 'ac_sleeper',
                'bus_name': 'Mercedes-Benz Multi-Axle AC Sleeper',
                'origin': 'New York',
                'destination': 'Boston',
                'departure_time': '07:00 AM',
                'arrival_time': '11:15 AM',
                'duration': '4h 15m',
                'fare_seater': Decimal('42.00'),
                'fare_sleeper': Decimal('65.00'),
                'boarding_points': [{'time': '06:45 AM', 'location': 'Port Authority Bus Terminal Bay 42'}],
                'dropping_points': [{'time': '11:15 AM', 'location': 'Boston South Station Terminal'}],
                'amenities': ['Wi-Fi', 'Snack Box', 'Individual Air Vents', 'Emergency SOS Button']
            }
        ]

        for b in buses_seed:
            btrip, created = BusTrip.objects.get_or_create(
                bus_name=b['bus_name'],
                origin=b['origin'],
                destination=b['destination'],
                defaults=b
            )
            if created:
                # Lower deck seats
                for i in range(1, 13):
                    BusSeat.objects.create(
                        trip=btrip,
                        seat_number=f"L{i}",
                        deck='lower',
                        seat_type='seater' if i <= 8 else 'sleeper',
                        price=b['fare_seater'] if i <= 8 else b['fare_sleeper'],
                        is_ladies_only=(i in [1, 2]),
                        is_available=(i not in [3, 4])
                    )
                # Upper deck sleeper beds
                for i in range(1, 9):
                    BusSeat.objects.create(
                        trip=btrip,
                        seat_number=f"U{i}",
                        deck='upper',
                        seat_type='sleeper',
                        price=b['fare_sleeper'],
                        is_available=(i not in [1, 5])
                    )

        # 5. Visa Countries & Types
        visas_seed = [
            {
                'country_name': 'United Arab Emirates', 'country_code': 'AE', 'flag_emoji': '🇦🇪',
                'processing_time_days': '24 to 48 Hours', 'starting_price': Decimal('89.00'), 'is_popular': True,
                'image_url': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c',
                'description': 'Quick electronic tourist visa for Dubai & Abu Dhabi with hassle-free online approval.',
                'requirements_checklist': ['Color passport copy (min 6 months validity)', 'Passport size photo with white background', 'Confirmed flight ticket return', 'Hotel booking voucher'],
                'types': [
                    {'title': '30 Days Tourist eVisa (Single Entry)', 'validity_duration': '60 days', 'stay_duration': '30 days', 'entry_type': 'Single Entry', 'government_fee': Decimal('60.00'), 'service_fee': Decimal('29.00'), 'total_fee': Decimal('89.00')},
                    {'title': '60 Days Tourist eVisa (Multiple Entry)', 'validity_duration': '60 days', 'stay_duration': '60 days', 'entry_type': 'Multiple Entry', 'government_fee': Decimal('140.00'), 'service_fee': Decimal('39.00'), 'total_fee': Decimal('179.00')},
                    {'title': 'Express 24-Hour VIP Visa', 'validity_duration': '60 days', 'stay_duration': '30 days', 'entry_type': 'Single Entry', 'government_fee': Decimal('95.00'), 'service_fee': Decimal('45.00'), 'total_fee': Decimal('140.00')},
                ]
            },
            {
                'country_name': 'Schengen (Europe 29 Countries)', 'country_code': 'SCH', 'flag_emoji': '🇪🇺',
                'processing_time_days': '10 to 15 Working Days', 'starting_price': Decimal('129.00'), 'is_popular': True,
                'image_url': 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a',
                'description': 'Comprehensive Schengen visa assistance including appointment booking, document audit, and itinerary preparation.',
                'requirements_checklist': ['Passport with at least 2 blank pages', '6 Months bank statement certified by bank', 'Cover letter & Day-wise travel itinerary', 'Mandatory €30,000 Travel Insurance', 'Flight & Hotel reservations', 'Employment proof / NOC'],
                'types': [
                    {'title': 'Short Stay Tourist Visa (Type C)', 'validity_duration': 'Up to 90 days', 'stay_duration': '90 days', 'entry_type': 'Single / Multiple', 'government_fee': Decimal('90.00'), 'service_fee': Decimal('39.00'), 'total_fee': Decimal('129.00')},
                    {'title': 'Business Conference & Trade Visa', 'validity_duration': 'Up to 180 days', 'stay_duration': '90 days', 'entry_type': 'Multiple Entry', 'government_fee': Decimal('90.00'), 'service_fee': Decimal('59.00'), 'total_fee': Decimal('149.00')},
                ]
            },
            {
                'country_name': 'United Kingdom', 'country_code': 'GB', 'flag_emoji': '🇬🇧',
                'processing_time_days': '15 Working Days', 'starting_price': Decimal('165.00'), 'is_popular': True,
                'image_url': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad',
                'description': 'Standard Visitor Visa assistance for England, Scotland, Wales, and Northern Ireland.',
                'requirements_checklist': ['Current passport', '6 Months bank statements', 'Proof of accommodation & travel itinerary', 'Income tax returns (past 2 years)'],
                'types': [
                    {'title': 'Standard Visitor Visa (6 Months)', 'validity_duration': '6 Months', 'stay_duration': '180 days', 'entry_type': 'Multiple Entry', 'government_fee': Decimal('130.00'), 'service_fee': Decimal('35.00'), 'total_fee': Decimal('165.00')},
                    {'title': 'Long-term Visitor Visa (2 Years)', 'validity_duration': '2 Years', 'stay_duration': '180 days per visit', 'entry_type': 'Multiple Entry', 'government_fee': Decimal('490.00'), 'service_fee': Decimal('60.00'), 'total_fee': Decimal('550.00')},
                ]
            },
            {
                'country_name': 'Saudi Arabia (Tourist & Umrah eVisa)', 'country_code': 'SA', 'flag_emoji': '🇸🇦',
                'processing_time_days': '12 to 24 Hours', 'starting_price': Decimal('145.00'), 'is_popular': True,
                'image_url': 'https://images.unsplash.com/photo-1564769625905-50e93615e769',
                'description': 'Instant 1-year multiple entry eVisa for tourism, leisure, and performing Umrah.',
                'requirements_checklist': ['Passport copy valid for 6 months', 'Digital passport photo', 'Mandatory medical insurance (included in visa)'],
                'types': [
                    {'title': '1-Year Multiple Entry Tourist & Umrah eVisa', 'validity_duration': '365 days', 'stay_duration': '90 days per visit', 'entry_type': 'Multiple Entry', 'government_fee': Decimal('115.00'), 'service_fee': Decimal('30.00'), 'total_fee': Decimal('145.00')},
                ]
            },
            {
                'country_name': 'Singapore', 'country_code': 'SG', 'flag_emoji': '🇸🇬',
                'processing_time_days': '3 to 4 Working Days', 'starting_price': Decimal('65.00'), 'is_popular': True,
                'image_url': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd',
                'description': 'Singapore electronic visa (eVisa) application support with fast processing.',
                'requirements_checklist': ['Passport bio page copy', 'Passport size photo on matte paper', 'Flight booking itinerary', 'Form 14A completed'],
                'types': [
                    {'title': 'Singapore Tourist eVisa (30 Days)', 'validity_duration': '30 to 60 days', 'stay_duration': '30 days', 'entry_type': 'Multiple Entry', 'government_fee': Decimal('35.00'), 'service_fee': Decimal('30.00'), 'total_fee': Decimal('65.00')},
                ]
            }
        ]

        for v in visas_seed:
            types = v.pop('types')
            vc, created = VisaCountry.objects.get_or_create(country_code=v['country_code'], defaults=v)
            if created:
                for vt in types:
                    VisaType.objects.create(country=vc, **vt)

        # 6. Travel Insurance
        allianz, _ = InsuranceProvider.objects.get_or_create(
            name='Allianz Global Assistance',
            defaults={'claim_settlement_ratio': '99.1%', 'emergency_assistance_phone': '+1 (800) 284-8300'}
        )
        aig, _ = InsuranceProvider.objects.get_or_create(
            name='AIG Travel Guard',
            defaults={'claim_settlement_ratio': '98.5%', 'emergency_assistance_phone': '+1 (800) 826-1300'}
        )

        plans_seed = [
            {
                'provider': allianz,
                'plan_name': 'Orbinex Platinum World Shield',
                'region': 'worldwide',
                'medical_coverage_amount': '$1,000,000',
                'trip_cancellation_amount': '$25,000',
                'baggage_loss_amount': '$3,500',
                'flight_delay_amount': '$1,500',
                'price_per_day': Decimal('5.50'),
                'flat_price': Decimal('49.00'),
                'benefits_list': ['Zero Deductible Medical Expenses', 'Emergency Medical Evacuation', 'Adventure Sports Coverage', 'Loss of Passport Assistance', '24/7 Concierge & Telemedicine'],
                'is_bestseller': True
            },
            {
                'provider': aig,
                'plan_name': 'AIG Gold Voyager International',
                'region': 'worldwide_ex_us',
                'medical_coverage_amount': '$500,000',
                'trip_cancellation_amount': '$10,000',
                'baggage_loss_amount': '$2,000',
                'flight_delay_amount': '$800',
                'price_per_day': Decimal('3.80'),
                'flat_price': Decimal('35.00'),
                'benefits_list': ['Cashless Hospitalization Worldwide', 'Trip Interruption & Delay', 'Baggage Delay Compensation', 'Accidental Death & Dismemberment'],
                'is_bestseller': False
            },
            {
                'provider': allianz,
                'plan_name': 'Schengen Essential Travel Pass',
                'region': 'schengen',
                'medical_coverage_amount': '€50,000 (Exceeds Embassy Req)',
                'trip_cancellation_amount': '$5,000',
                'baggage_loss_amount': '$1,500',
                'flight_delay_amount': '$500',
                'price_per_day': Decimal('2.90'),
                'flat_price': Decimal('24.00'),
                'benefits_list': ['100% Embassy Approved for Schengen Visa', 'Emergency Repatriation', 'Direct Hospital Billing in Europe', '24/7 Multilingual Support'],
                'is_bestseller': True
            }
        ]

        for p in plans_seed:
            InsurancePlan.objects.get_or_create(plan_name=p['plan_name'], provider=p['provider'], defaults=p)

        # 7. Holidays & Tour Packages
        dest_bali, _ = HolidayDestination.objects.get_or_create(
            name='Bali, Indonesia',
            defaults={'region': 'Asia', 'image_url': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4', 'tagline': 'Island of the Gods, Waterfalls & Spiritual Retreats'}
        )
        dest_swiss, _ = HolidayDestination.objects.get_or_create(
            name='Switzerland & Paris',
            defaults={'region': 'Europe', 'image_url': 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99', 'tagline': 'Alpine Glaciers, Lake Geneva & Romance of Paris'}
        )
        dest_dubai, _ = HolidayDestination.objects.get_or_create(
            name='Dubai & Abu Dhabi',
            defaults={'region': 'Middle East', 'image_url': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c', 'tagline': 'Futuristic Skylines, Golden Dunes & Luxury Shopping'}
        )

        packages_seed = [
            {
                'destination': dest_bali,
                'title': 'Enchanting Bali: 6 Days Tropical Paradise & Private Pool Villa',
                'duration_days': 6,
                'duration_nights': 5,
                'price_per_person': Decimal('699.00'),
                'original_price': Decimal('999.00'),
                'main_image': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
                'gallery_images': [
                    'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
                    'https://images.unsplash.com/photo-1540541338287-41700207dee6'
                ],
                'overview': 'Experience the best of Bali with private pool villas in Seminyak, cultural temples in Ubud, Tanah Lot sunset, and a scenic Nusa Penida island speedboat tour.',
                'inclusions': ['5 Nights in 4-Star Private Pool Villa', 'Daily Floating Breakfast & 3 Candlelight Dinners', 'Speedboat Excursion to Nusa Penida Island', 'Private AC Vehicle with English Chauffeur', 'All Temple Entry Tickets & Balinese Massage'],
                'exclusions': ['International Flights (Available as Add-on)', 'Personal Souvenirs & Tips', 'Visa On Arrival'],
                'hotel_rating': 5,
                'meals_included': 'Breakfast & Dinner',
                'is_trending': True,
                'itinerary': [
                    {'day_number': 1, 'title': 'Arrival in Bali & Romantic Jimbaran Bay Dinner', 'description': 'Chauffeur airport pickup, check-in to private pool villa in Seminyak, sunset seafood dinner on Jimbaran Beach.', 'meals_today': 'Dinner', 'activities': ['Airport VIP Pickup', 'Villa Check-in', 'Jimbaran Seafood Dinner']},
                    {'day_number': 2, 'title': 'Ubud Arts, Tegenungan Waterfall & Sacred Monkey Forest', 'description': 'Explore Ubud handicraft villages, visit the lush Tegenungan waterfall, and walk through the Monkey Forest Sanctuary.', 'meals_today': 'Breakfast & Lunch', 'activities': ['Ubud Palace', 'Tegenungan Waterfall', 'Tegalalang Rice Terraces']},
                    {'day_number': 3, 'title': 'Nusa Penida Island Tour: Kelingking T-Rex & Angel’s Billabong', 'description': 'Fast boat transfer to Nusa Penida island to photograph the world-famous Kelingking Cliff and swim at Crystal Bay.', 'meals_today': 'Breakfast & Lunch', 'activities': ['Fast Boat Ride', 'Kelingking T-Rex Beach', 'Broken Beach Snorkeling']},
                    {'day_number': 4, 'title': 'Bali Jungle Swing & Historic Tanah Lot Sunset Temple', 'description': 'Experience the viral jungle swing overlooking palm valleys, followed by coffee tasting and spiritual sunset at Tanah Lot.', 'meals_today': 'Breakfast', 'activities': ['Bali Swing Adventure', 'Luwak Coffee Tasting', 'Tanah Lot Sunset Temple']},
                    {'day_number': 5, 'title': 'Leisure Day, Traditional Balinese Spa & Beach Clubs', 'description': 'Relax with a 90-minute authentic Balinese herbal massage and enjoy sunset drinks at Potato Head Beach Club.', 'meals_today': 'Breakfast & Dinner', 'activities': ['90-min Aromatherapy Spa', 'Seminyak Shopping', 'Beach Club Sunset']},
                    {'day_number': 6, 'title': 'Souvenir Shopping & Farewell Bali', 'description': 'Breakfast at the villa, check-out, visit Krisna Oleh Oleh market for souvenirs, and private transfer to airport.', 'meals_today': 'Breakfast', 'activities': ['Check-out', 'Souvenir Market', 'Airport Drop-off']},
                ]
            },
            {
                'destination': dest_swiss,
                'title': 'Grand Swiss Alps & Paris Romance: 8 Days Glacier Express Tour',
                'duration_days': 8,
                'duration_nights': 7,
                'price_per_person': Decimal('1499.00'),
                'original_price': Decimal('1899.00'),
                'main_image': 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99',
                'gallery_images': ['https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99'],
                'overview': 'Breathtaking journey through Zurich, Lucerne, Mt. Titlis Cable Car, Interlaken, and the high-speed TGV train to the City of Light, Paris.',
                'inclusions': ['7 Nights in 4-Star Premium City Center Hotels', 'Swiss Travel Pass (Unlimited Trains/Boats/Buses)', 'Mt. Titlis Rotating Rotair Cable Car & Ice Cave', 'TGV High-Speed Rail Switzerland to Paris', 'Seine River Cruise & Eiffel Tower 2nd Floor Tickets'],
                'exclusions': ['International Flights', 'Travel Visa', 'Lunches'],
                'hotel_rating': 4,
                'meals_included': 'Daily Buffet Breakfast',
                'is_trending': True,
                'itinerary': [
                    {'day_number': 1, 'title': 'Arrival in Zurich & Lake Promenade Walk', 'description': 'Arrive in Zurich, train transfer to hotel, explore old town Altstadt and Limmat river promenade.', 'meals_today': 'Welcome Dinner', 'activities': ['Zurich Old Town', 'Lake Zurich Walk']},
                    {'day_number': 2, 'title': 'Lucerne Chapel Bridge & Lake Lucerne Cruise', 'description': 'Scenic train to Lucerne, visit Lion Monument, wooden Chapel Bridge, and panoramic steamboat cruise on Lake Lucerne.', 'meals_today': 'Breakfast', 'activities': ['Chapel Bridge', 'Lucerne Steamboat Cruise']},
                    {'day_number': 3, 'title': 'Mt. Titlis Eternal Snow & Glacier Suspension Bridge', 'description': 'Ascend into snowfields on the world’s first rotating cable car, walk across the highest suspension bridge in Europe.', 'meals_today': 'Breakfast', 'activities': ['Mt. Titlis Cable Car', 'Cliff Walk Bridge', 'Ice Flyer']},
                    {'day_number': 4, 'title': 'Interlaken & Lauterbrunnen Valley of 72 Waterfalls', 'description': 'Explore fairytale Lauterbrunnen with Staubbach Falls falling off sheer alpine cliffs, train to Grindelwald.', 'meals_today': 'Breakfast', 'activities': ['Lauterbrunnen Valley', 'Grindelwald First']},
                    {'day_number': 5, 'title': 'TGV High-Speed Train to Paris & Evening Seine River Cruise', 'description': 'Board 300km/h TGV Lyria train to Paris Gare de Lyon. Check-in to Paris hotel, evening glass-canopy boat cruise on the River Seine.', 'meals_today': 'Breakfast', 'activities': ['TGV High Speed Train', 'Seine River Cruise']},
                    {'day_number': 6, 'title': 'Eiffel Tower Summit, Louvre Museum & Champs-Élysées', 'description': 'Priority elevator access to the Eiffel Tower, guided Louvre exterior, and stroll down Avenue des Champs-Élysées to Arc de Triomphe.', 'meals_today': 'Breakfast', 'activities': ['Eiffel Tower 2nd Floor', 'Champs-Élysées Walk', 'Arc de Triomphe']},
                    {'day_number': 7, 'title': 'Palace of Versailles & Montmartre Artists Village', 'description': 'Excursion to the opulent Sun King Palace of Versailles Hall of Mirrors, afternoon at Sacré-Cœur basilica in Montmartre.', 'meals_today': 'Breakfast & Farewell Dinner', 'activities': ['Versailles Palace', 'Sacré-Cœur Basilica', 'Montmartre']},
                    {'day_number': 8, 'title': 'Au Revoir Paris - Airport Departure', 'description': 'Buffet breakfast, Parisian boutique shopping, private transfer to Charles de Gaulle (CDG) Airport.', 'meals_today': 'Breakfast', 'activities': ['Souvenir Shopping', 'Airport Transfer']},
                ]
            }
        ]

        for pkg in packages_seed:
            itin = pkg.pop('itinerary')
            pobj, created = HolidayPackage.objects.get_or_create(title=pkg['title'], destination=pkg['destination'], defaults=pkg)
            if created:
                for day in itin:
                    PackageItineraryDay.objects.create(package=pobj, **day)

        # 8. Umrah Packages
        hotel_makkah_vip, _ = UmrahHotel.objects.get_or_create(
            name='Fairmont Makkah Clock Royal Tower',
            defaults={'city': 'makkah', 'star_rating': 5, 'distance_from_haram': '0 meters (Direct Haram Courtyard Access)', 'image_url': 'https://images.unsplash.com/photo-1564769625905-50e93615e769'}
        )
        hotel_madinah_vip, _ = UmrahHotel.objects.get_or_create(
            name='Dar Al Taqwa Hotel Madinah',
            defaults={'city': 'madinah', 'star_rating': 5, 'distance_from_haram': '50 meters (Facing Prophet’s Mosque Women Gate)', 'image_url': 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa'}
        )
        hotel_makkah_classic, _ = UmrahHotel.objects.get_or_create(
            name='Swissôtel Al Maqam Makkah',
            defaults={'city': 'makkah', 'star_rating': 5, 'distance_from_haram': 'Abraj Al Bait Complex (Direct Elevator to Haram)', 'image_url': 'https://images.unsplash.com/photo-1564769625905-50e93615e769'}
        )
        hotel_madinah_classic, _ = UmrahHotel.objects.get_or_create(
            name='Pullman Zamzam Madinah',
            defaults={'city': 'madinah', 'star_rating': 5, 'distance_from_haram': '150 meters walking to Al-Masjid an-Nabawi', 'image_url': 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa'}
        )

        umrah_packages_seed = [
            {
                'title': '14 Days Executive VIP Umrah Package: Clock Tower Haram Front',
                'tier': 'vip_luxury',
                'duration_days': 14,
                'makkah_nights': 7,
                'madinah_nights': 7,
                'price_quad': Decimal('1650.00'),
                'price_triple': Decimal('1850.00'),
                'price_double': Decimal('2150.00'),
                'makkah_hotel': hotel_makkah_vip,
                'madinah_hotel': hotel_madinah_vip,
                'main_image': 'https://images.unsplash.com/photo-1564769625905-50e93615e769',
                'gallery_images': ['https://images.unsplash.com/photo-1564769625905-50e93615e769', 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa'],
                'overview': 'Unmatched spiritual comfort with 5-star Haram facing suites, private GMC Yukon VIP transfers between Jeddah, Makkah, and Madinah, scholar-guided Umrah, and historical Ziyarat.',
                'inclusions': [
                    '7 Nights in Fairmont Makkah Clock Tower (Kaaba / Haram View)',
                    '7 Nights in Dar Al Taqwa Madinah (50m from Rawdah)',
                    '1-Year Saudi Multiple Entry Tourist / Umrah eVisa with Insurance',
                    'Private VIP GMC Yukon Transfers (Jeddah -> Makkah -> Madinah -> Airport)',
                    'Comprehensive Guided Ziyarat (Jabal Al Noor, Cave Hira, Mount Uhud, Masjid Quba)',
                    'Daily Gourmet Buffet Breakfast',
                    'Complimentary 5L Zamzam Water Container & Pilgrim Kit'
                ],
                'exclusions': ['International Flights (Can be bundled upon request)', 'Personal Expenses & Laundry'],
                'itinerary_summary': [
                    'Day 1-7: Arrival in Jeddah, transfer in Ihram to Makkah, perform guided Umrah, stay at Fairmont Clock Tower, Makkah Ziyarat.',
                    'Day 8: High-speed Haramain High-Speed Train VIP Class transfer from Makkah to Madinah Al-Munawwarah.',
                    'Day 8-14: Stay facing Prophet’s Mosque, prayer in Riyad Al-Jannah (Rawdah), Madinah historical Ziyarat tour, departure from Madinah (MED) Airport.'
                ],
                'featured': True
            },
            {
                'title': '10 Days Classic Comfort Umrah: Abraj Al Bait & Zamzam Madinah',
                'tier': 'classic_premium',
                'duration_days': 10,
                'makkah_nights': 5,
                'madinah_nights': 5,
                'price_quad': Decimal('1150.00'),
                'price_triple': Decimal('1350.00'),
                'price_double': Decimal('1550.00'),
                'makkah_hotel': hotel_makkah_classic,
                'madinah_hotel': hotel_madinah_classic,
                'main_image': 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa',
                'gallery_images': ['https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa'],
                'overview': 'Perfect balance of luxury and affordability with Swissôtel Makkah and Pullman Zamzam Madinah with all group transfers and visa included.',
                'inclusions': [
                    '5 Nights in Swissôtel Al Maqam Makkah',
                    '5 Nights in Pullman Zamzam Madinah',
                    'Saudi Tourist / Umrah eVisa included',
                    'Air-Conditioned Coach / Private Car transfers',
                    'Daily Breakfast included',
                    'Free 5L Zamzam container'
                ],
                'exclusions': ['International Flights'],
                'itinerary_summary': ['5 Days spiritual immersion in Makkah', '5 Days peaceful prayers in Madinah with Masjid Quba Ziyarat'],
                'featured': True
            }
        ]

        for up in umrah_packages_seed:
            UmrahPackage.objects.get_or_create(title=up['title'], defaults=up)

        # 9. Medical Tourism
        spec_cardio, _ = MedicalSpecialty.objects.get_or_create(
            name='Cardiology & Heart Surgery',
            defaults={'icon_name': 'heart', 'description': 'Minimally invasive bypass, valve repair, and coronary angioplasty by world-renowned cardiac surgeons.'}
        )
        spec_ortho, _ = MedicalSpecialty.objects.get_or_create(
            name='Orthopedics & Joint Replacement',
            defaults={'icon_name': 'bone', 'description': 'Robotic single and bilateral total knee and hip replacements with rapid recovery protocols.'}
        )
        spec_cosmetic, _ = MedicalSpecialty.objects.get_or_create(
            name='Cosmetic & Dental Surgery',
            defaults={'icon_name': 'sparkles', 'description': 'State-of-the-art Hollywood smile, dental implants, rhinoplasty, and body sculpting.'}
        )
        spec_ayurveda, _ = MedicalSpecialty.objects.get_or_create(
            name='Ayurvedic Wellness & Chronic Care',
            defaults={'icon_name': 'leaf', 'description': 'Holistic Panchakarma therapies, stress detox, and arthritis rejuvenation in Kerala retreats.'}
        )

        hosp_apollo, _ = MedicalHospital.objects.get_or_create(
            name='Apollo Hospitals International',
            city='New Delhi',
            country='India',
            defaults={
                'accreditations': ['JCI USA Accredited', 'NABH India', 'ISO 9001:2015'],
                'established_year': 1983,
                'beds_count': 1500,
                'image_url': 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3',
                'overview': 'Asia’s foremost integrated healthcare enterprise with over 10,000 beds, treating international patients from 140+ countries with world-class clinical outcomes.',
                'featured': True
            }
        )
        hosp_apollo.specialties.set([spec_cardio, spec_ortho, spec_cosmetic, spec_ayurveda])

        hosp_bumrungrad, _ = MedicalHospital.objects.get_or_create(
            name='Bumrungrad International Hospital',
            city='Bangkok',
            country='Thailand',
            defaults={
                'accreditations': ['JCI Accredited since 2002', 'Global Healthcare Accreditation'],
                'established_year': 1980,
                'beds_count': 580,
                'image_url': 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d',
                'overview': 'One of the largest private hospitals in Southeast Asia with 1,200+ doctors and 520,000+ international patients treated per year in luxury hospital suites.',
                'featured': True
            }
        )
        hosp_bumrungrad.specialties.set([spec_cardio, spec_ortho, spec_cosmetic])

        MedicalPackage.objects.get_or_create(
            hospital=hosp_apollo,
            specialty=spec_ortho,
            treatment_name='Robotic Total Knee Replacement (Single / Bilateral)',
            defaults={
                'estimated_cost_usd': Decimal('4800.00'),
                'us_benchmark_cost_usd': Decimal('35000.00'),
                'hospital_stay_days': 4,
                'total_stay_days': 10,
                'success_rate': '99.4%',
                'inclusions': ['Stryker Mako Robotic Surgery', 'Imported FDA-approved implant (Zimmer/Stryker)', 'Surgeon & Anesthesia fees', 'Private Deluxe Room stay (4 nights)', 'Daily Physiotherapy sessions', 'Airport VIP pickup & Medical Visa assistance'],
                'overview': 'Save up to 85% on world-class robotic precision knee replacement with zero waiting time and rapid post-op rehabilitation.'
            }
        )

        MedicalPackage.objects.get_or_create(
            hospital=hosp_bumrungrad,
            specialty=spec_cardio,
            treatment_name='Minimally Invasive Coronary Bypass Surgery (CABG)',
            defaults={
                'estimated_cost_usd': Decimal('9500.00'),
                'us_benchmark_cost_usd': Decimal('85000.00'),
                'hospital_stay_days': 6,
                'total_stay_days': 14,
                'success_rate': '99.1%',
                'inclusions': ['Comprehensive pre-op cardiac catheterization & diagnostics', 'Senior Cardiothoracic Surgeon team', 'ICU + Luxury Private Suite stay', 'All medications & post-op monitoring', 'Dedicated International Concierge'],
                'overview': 'Advanced beating-heart cardiac bypass surgery performed by US-board certified surgeons at Bumrungrad International.'
            }
        )

        # 10. Europamundo Guided Circuits
        tour_iberian, _ = EuropamundoTour.objects.get_or_create(
            tour_code='EUR-ESP-POR-01',
            defaults={
                'title': 'Classic Iberian Circuit: Spain, Portugal & Andalusia',
                'countries_covered': ['Spain', 'Portugal', 'Gibraltar'],
                'cities_visited': 'Madrid, Toledo, Granada, Seville, Lisbon, Fatima, Porto, Salamanca',
                'duration_days': 10,
                'duration_nights': 9,
                'price_eur': Decimal('1320.00'),
                'price_usd': Decimal('1450.00'),
                'bus_type': 'Modern Luxury Panoramic Coach with Free Wi-Fi & USB',
                'hotel_category': '4-Star Superior City Hotels',
                'audio_languages': ['English', 'Spanish', 'French', 'Arabic'],
                'guaranteed_departures': True,
                'main_image': 'https://images.unsplash.com/photo-1543783207-ec64e4d95325',
                'gallery_images': ['https://images.unsplash.com/photo-1543783207-ec64e4d95325', 'https://images.unsplash.com/photo-1509840841025-9088ba78a826'],
                'overview': 'Official Europamundo flagship circuit across the heart of the Iberian Peninsula featuring Alhambra Palace in Granada, Flamenco in Seville, and Fado in Lisbon.',
                'inclusions': ['9 Nights in 4-Star Hotels with Daily Buffet Breakfast', 'Arrival & Departure Airport Transfers', 'Official English-Speaking Tour Leader throughout', 'Alhambra Palace Entry in Granada', 'Boat ride on Douro River in Porto'],
                'featured': True
            }
        )
        TourStop.objects.get_or_create(tour=tour_iberian, day_number=1, defaults={'city_name': 'Madrid', 'country_name': 'Spain', 'highlight_title': 'Welcome to Madrid & Plaza Mayor Walk', 'description': 'Arrival in Madrid, hotel transfer, evening walking tour through Puerta del Sol and Plaza Mayor.', 'km_distance': 30})
        TourStop.objects.get_or_create(tour=tour_iberian, day_number=2, defaults={'city_name': 'Madrid to Granada via Toledo', 'country_name': 'Spain', 'highlight_title': 'Imperial City of Toledo & Arrival in Granada', 'description': 'Explore medieval Toledo, cathedral, sword-making workshops, and travel south to Andalusia.', 'km_distance': 420})
        TourStop.objects.get_or_create(tour=tour_iberian, day_number=3, defaults={'city_name': 'Granada to Seville', 'country_name': 'Spain', 'highlight_title': 'Alhambra Palaces & Generalife Gardens', 'description': 'Guided tour of the Moorish jewel Alhambra and Generalife gardens, evening arrival in Seville.', 'km_distance': 250})
        TourStop.objects.get_or_create(tour=tour_iberian, day_number=4, defaults={'city_name': 'Seville to Lisbon', 'country_name': 'Portugal', 'highlight_title': 'Giralda Tower & Cross border into Portugal', 'description': 'Plaza de España in Seville, cross scenic Algarve border to capital Lisbon.', 'km_distance': 460})

        TourDeparture.objects.get_or_create(tour=tour_iberian, departure_date=date.today() + timedelta(days=14), defaults={'available_seats': 18, 'status': 'Guaranteed Departure'})
        TourDeparture.objects.get_or_create(tour=tour_iberian, departure_date=date.today() + timedelta(days=28), defaults={'available_seats': 22, 'status': 'Guaranteed Departure'})

        # 11. Utilities (Forex, eSIMs, Lounges)
        forex_seed = [
            {'currency_code': 'EUR', 'currency_name': 'Euro (European Union)', 'flag_emoji': '🇪🇺', 'buy_rate_usd': Decimal('1.0850'), 'sell_rate_usd': Decimal('1.0950')},
            {'currency_code': 'GBP', 'currency_name': 'British Pound Sterling (UK)', 'flag_emoji': '🇬🇧', 'buy_rate_usd': Decimal('1.2750'), 'sell_rate_usd': Decimal('1.2900')},
            {'currency_code': 'AED', 'currency_name': 'UAE Dirham (Dubai/UAE)', 'flag_emoji': '🇦🇪', 'buy_rate_usd': Decimal('0.2723'), 'sell_rate_usd': Decimal('0.2745')},
            {'currency_code': 'INR', 'currency_name': 'Indian Rupee (India)', 'flag_emoji': '🇮🇳', 'buy_rate_usd': Decimal('0.0118'), 'sell_rate_usd': Decimal('0.0121')},
            {'currency_code': 'THB', 'currency_name': 'Thai Baht (Thailand)', 'flag_emoji': '🇹🇭', 'buy_rate_usd': Decimal('0.0275'), 'sell_rate_usd': Decimal('0.0285')},
            {'currency_code': 'SGD', 'currency_name': 'Singapore Dollar (Singapore)', 'flag_emoji': '🇸🇬', 'buy_rate_usd': Decimal('0.7450'), 'sell_rate_usd': Decimal('0.7550')},
            {'currency_code': 'SAR', 'currency_name': 'Saudi Riyal (Saudi Arabia)', 'flag_emoji': '🇸🇦', 'buy_rate_usd': Decimal('0.2665'), 'sell_rate_usd': Decimal('0.2685')},
        ]
        for fx in forex_seed:
            ForexRate.objects.get_or_create(currency_code=fx['currency_code'], defaults=fx)

        esim_seed = [
            {'country_or_region': 'Europe (33 Countries)', 'country_code': 'EU', 'data_allowance': '10 GB High-Speed 5G', 'validity_days': 30, 'price_usd': Decimal('18.99')},
            {'country_or_region': 'Global Explorer (120+ Countries)', 'country_code': 'GLOBAL', 'data_allowance': '5 GB Worldwide', 'validity_days': 15, 'price_usd': Decimal('24.99')},
            {'country_or_region': 'United Arab Emirates & Gulf', 'country_code': 'AE', 'data_allowance': '5 GB 5G Data', 'validity_days': 14, 'price_usd': Decimal('12.99')},
            {'country_or_region': 'United States & Canada', 'country_code': 'US', 'data_allowance': 'Unlimited 5G Data', 'validity_days': 15, 'price_usd': Decimal('28.50')},
            {'country_or_region': 'Saudi Arabia (Umrah / Pilgrim Pass)', 'country_code': 'SA', 'data_allowance': '15 GB 5G + 50 Mins Calls', 'validity_days': 30, 'price_usd': Decimal('19.99')},
        ]
        for es in esim_seed:
            EsimPackage.objects.get_or_create(country_or_region=es['country_or_region'], data_allowance=es['data_allowance'], defaults=es)

        lounges_seed = [
            {'airport_code': 'DXB', 'airport_name': 'Dubai International Airport', 'terminal': 'Terminal 3 Concourse B', 'lounge_name': 'Marhaba VIP Lounge', 'price_usd': Decimal('45.00'), 'amenities': ['Open International Buffet', 'Shower Suites', 'Quiet Resting Pods', 'High-Speed Wi-Fi', 'Bar Service'], 'image_url': 'https://images.unsplash.com/photo-1540541338287-41700207dee6'},
            {'airport_code': 'LHR', 'airport_name': 'London Heathrow Airport', 'terminal': 'Terminal 2 Queen’s Terminal', 'lounge_name': 'Plaza Premium Lounge', 'price_usd': Decimal('48.00'), 'amenities': ['British Afternoon Tea', 'Private Working Booths', 'Flight departure screens', 'Shower facilities'], 'image_url': 'https://images.unsplash.com/photo-1540541338287-41700207dee6'},
            {'airport_code': 'SIN', 'airport_name': 'Singapore Changi Airport', 'terminal': 'Terminal 3 Departure Transit', 'lounge_name': 'SATS Premier Lounge', 'price_usd': Decimal('38.00'), 'amenities': ['Singapore Laksa Live Station', 'Massage Chairs', 'Free Beer & Beverages', 'Shower rooms'], 'image_url': 'https://images.unsplash.com/photo-1540541338287-41700207dee6'},
        ]
        for lg in lounges_seed:
            AirportLounge.objects.get_or_create(airport_code=lg['airport_code'], terminal=lg['terminal'], lounge_name=lg['lounge_name'], defaults=lg)

        # 12. Offers & Coupons
        coupons_seed = [
            {'code': 'ORBINEX100', 'title': 'FLAT $100 OFF on Orders Above $500', 'description': 'Use code ORBINEX100 on checkout to get an instant $100 discount across flights, hotels, or packages.', 'discount_type': 'flat', 'discount_value': Decimal('100.00'), 'min_booking_amount': Decimal('500.00'), 'applicable_module': 'all', 'badge_text': 'GLOBAL SPECIAL', 'is_active': True},
            {'code': 'FLYGLOBAL', 'title': '15% OFF on International Flights (Up to $150)', 'description': 'Book any international flight and save 15% instantly with code FLYGLOBAL.', 'discount_type': 'percentage', 'discount_value': Decimal('15.00'), 'max_discount_amount': Decimal('150.00'), 'min_booking_amount': Decimal('250.00'), 'applicable_module': 'flight', 'badge_text': 'AIRLINE SALE', 'is_active': True},
            {'code': 'LUXURYHOTEL', 'title': '20% OFF on 5-Star Hotel Stays', 'description': 'Enjoy 20% discount on luxury resort and 5-star hotel bookings.', 'discount_type': 'percentage', 'discount_value': Decimal('20.00'), 'max_discount_amount': Decimal('200.00'), 'min_booking_amount': Decimal('300.00'), 'applicable_module': 'hotel', 'badge_text': 'HOTEL PRIVILEGE', 'is_active': True},
            {'code': 'HOLIDAY200', 'title': 'FLAT $200 OFF on Curated Holiday Packages', 'description': 'Book Bali, Switzerland, or Dubai packages with code HOLIDAY200.', 'discount_type': 'flat', 'discount_value': Decimal('200.00'), 'min_booking_amount': Decimal('1000.00'), 'applicable_module': 'holiday', 'badge_text': 'TOUR SPECIAL', 'is_active': True},
            {'code': 'VISAPASS', 'title': 'FLAT $20 OFF on Visa Assistance', 'description': 'Apply for UAE, Schengen, or UK visa with $20 fee waiver.', 'discount_type': 'flat', 'discount_value': Decimal('20.00'), 'min_booking_amount': Decimal('80.00'), 'applicable_module': 'visa', 'badge_text': 'VISA SAVER', 'is_active': True},
            {'code': 'HDFCTRAVEL', 'title': '10% Extra Discount on HDFC Bank Cards', 'description': 'Exclusive cardholder instant discount on all international bookings.', 'discount_type': 'percentage', 'discount_value': Decimal('10.00'), 'max_discount_amount': Decimal('120.00'), 'min_booking_amount': Decimal('200.00'), 'applicable_module': 'all', 'bank_partner': 'HDFC Bank', 'badge_text': 'BANK PARTNER', 'is_active': True},
        ]
        coupon_objs = {}
        for cp in coupons_seed:
            obj, _ = CouponCode.objects.get_or_create(code=cp['code'], defaults=cp)
            coupon_objs[cp['code']] = obj

        deals_seed = [
            {'title': 'Spring Flight Flash Sale: Save Up to $150 on Emirates & Qatar', 'subtitle': 'Fly to Europe & Asia in comfort with special discounted airfares.', 'category': 'flight', 'coupon_code': coupon_objs['FLYGLOBAL'], 'image_url': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05', 'cta_link': '/flights'},
            {'title': 'Luxury Beach Villas in Bali & Maldives with 20% Privilege Off', 'subtitle': 'Complimentary floating breakfasts and private pool upgrades included.', 'category': 'hotel', 'coupon_code': coupon_objs['LUXURYHOTEL'], 'image_url': 'https://images.unsplash.com/photo-1540541338287-41700207dee6', 'cta_link': '/hotels'},
            {'title': 'Swiss Alps & Paris Tour Package: Flat $200 Off for Couples', 'subtitle': 'Includes Glacier cable cars, 4-star hotels, and TGV high-speed rail.', 'category': 'holiday', 'coupon_code': coupon_objs['HOLIDAY200'], 'image_url': 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99', 'cta_link': '/holidays'},
            {'title': 'HDFC Cardholder Travel Mega Fest: Instant 10% Cash Savings', 'subtitle': 'Valid on mixed cart checkouts across flights, hotels, and utilities.', 'category': 'bank', 'coupon_code': coupon_objs['HDFCTRAVEL'], 'image_url': 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44', 'cta_link': '/offers'},
        ]
        for dl in deals_seed:
            PromotionalDeal.objects.get_or_create(title=dl['title'], defaults=dl)

        # 13. Newsletter
        NewsletterSubscriber.objects.get_or_create(email='vip.traveler@example.com')
        NewsletterSubscriber.objects.get_or_create(email='globetrotter@example.com')
        NewsletterCampaign.objects.get_or_create(
            subject='✈️ Exclusive: 40% Off Swiss Alps Tours & Free 5GB eSIM on Flights!',
            defaults={
                'preview_text': 'Unwrap your weekly curated travel privileges with OrbinexGlobal Travel.',
                'content_html': '<h1>Exclusive Global Travel Perks</h1><p>Enjoy seasonal reductions on luxury holiday circuits, instant eVisa approvals, and double loyalty points this month.</p>',
                'sent_to_count': 14850,
                'is_published': True
            }
        )

        # 14. Demo User Seed Bookings (Populate Dashboard immediately!)
        # Flight Booking
        flight_bk = Booking.objects.create(
            booking_reference='ORB-FLT-882194',
            user=demo_user,
            booking_type='flight',
            title='Flight EK-201: Dubai (DXB) to London (LHR)',
            summary='Emirates • Business Class • Seat 11A, 11B • Non-stop Direct',
            total_amount=Decimal('3300.00'),
            discount_amount=Decimal('100.00'),
            final_amount=Decimal('3200.00'),
            currency='USD',
            coupon_code='ORBINEX100',
            contact_name='Alex Morgan',
            contact_email='alex.morgan@example.com',
            contact_phone='+1 (555) 234-5678',
            travel_date=date.today() + timedelta(days=12),
            details_json={
                'flight_number': 'EK-201',
                'airline': 'Emirates',
                'origin': 'Dubai (DXB)',
                'destination': 'London (LHR)',
                'departure_time': '07:45 AM',
                'arrival_time': '12:15 PM',
                'cabin_class': 'Business Class',
                'selected_seats': '11A, 11B',
                'passengers': [
                    {'name': 'Alex Morgan', 'seat': '11A', 'passport': 'USA98421004'},
                    {'name': 'Sophia Morgan', 'seat': '11B', 'passport': 'USA98421005'}
                ]
            },
            status='confirmed',
            payment_status='paid'
        )
        FlightBooking.objects.create(
            booking=flight_bk,
            flight_schedule=FlightSchedule.objects.first(),
            cabin_class='business',
            passengers_json=[{'name': 'Alex Morgan', 'seat': '11A'}, {'name': 'Sophia Morgan', 'seat': '11B'}],
            selected_seats='11A, 11B',
            e_ticket_number='ETK-176-90823412',
            meal_preference='Gourmet Halal / Vegetarian'
        )

        # Hotel Booking
        hotel_bk = Booking.objects.create(
            booking_reference='ORB-HTL-551029',
            user=demo_user,
            booking_type='hotel',
            title='Hotel Stay: The Savoy London (Executive Suite)',
            summary='4 Night(s) in London • 1 Room • 2 Guest(s) • Breakfast Included',
            total_amount=Decimal('3000.00'),
            discount_amount=Decimal('0.00'),
            final_amount=Decimal('3000.00'),
            currency='USD',
            contact_name='Alex Morgan',
            contact_email='alex.morgan@example.com',
            contact_phone='+1 (555) 234-5678',
            travel_date=date.today() + timedelta(days=12),
            return_date=date.today() + timedelta(days=16),
            details_json={
                'hotel_name': 'The Savoy London',
                'city': 'London',
                'country': 'United Kingdom',
                'address': 'Strand, London WC2R 0EZ',
                'room_name': 'Executive Panoramic Suite with Lounge Access',
                'nights': 4,
                'rooms_count': 1,
                'check_in': str(date.today() + timedelta(days=12)),
                'check_out': str(date.today() + timedelta(days=16)),
                'guest_names': ['Alex Morgan', 'Sophia Morgan']
            },
            status='confirmed',
            payment_status='paid'
        )
        HotelBooking.objects.create(
            booking=hotel_bk,
            hotel=Hotel.objects.filter(city='London').first() or Hotel.objects.first(),
            room=HotelRoom.objects.first(),
            check_in_date=date.today() + timedelta(days=12),
            check_out_date=date.today() + timedelta(days=16),
            nights=4,
            rooms_count=1,
            guests_count=2,
            guest_names=['Alex Morgan', 'Sophia Morgan'],
            voucher_number='HTL-LON-SAVOY-8812'
        )

        # Visa Application
        visa_bk = Booking.objects.create(
            booking_reference='ORB-VIS-410982',
            user=demo_user,
            booking_type='visa',
            title='Visa Assistance: United Arab Emirates (30 Days Tourist eVisa)',
            summary='🇦🇪 United Arab Emirates • Single Entry • Status: Documents Verified / Under Embassy Processing',
            total_amount=Decimal('89.00'),
            discount_amount=Decimal('0.00'),
            final_amount=Decimal('89.00'),
            currency='USD',
            contact_name='Alex Morgan',
            contact_email='alex.morgan@example.com',
            contact_phone='+1 (555) 234-5678',
            travel_date=date.today() + timedelta(days=10),
            details_json={
                'country': 'United Arab Emirates',
                'visa_type': '30 Days Tourist eVisa (Single Entry)',
                'applicant_name': 'Alex Morgan',
                'passport_number': 'USA98421004',
                'nationality': 'United States'
            },
            status='processing',
            payment_status='paid'
        )
        VisaApplication.objects.create(
            booking=visa_bk,
            visa_country=VisaCountry.objects.filter(country_code='AE').first(),
            visa_type=VisaType.objects.first(),
            application_reference='VISA-AE-889124',
            status='documents_verified',
            applicant_full_name='Alex Morgan',
            passport_number='USA98421004',
            nationality='United States',
            travel_date=date.today() + timedelta(days=10),
            embassy_remarks='Documents successfully authenticated by Orbinex Visa Desk and dispatched to GDRFA Dubai.'
        )

        # Insurance Policy
        ins_bk = Booking.objects.create(
            booking_reference='ORB-INS-332910',
            user=demo_user,
            booking_type='insurance',
            title='Travel Insurance: Orbinex Platinum World Shield',
            summary='Coverage: $1,000,000 Medical • Worldwide Coverage • 14 Days Policy',
            total_amount=Decimal('49.00'),
            discount_amount=Decimal('0.00'),
            final_amount=Decimal('49.00'),
            currency='USD',
            contact_name='Alex Morgan',
            contact_email='alex.morgan@example.com',
            contact_phone='+1 (555) 234-5678',
            travel_date=date.today() + timedelta(days=10),
            return_date=date.today() + timedelta(days=24),
            details_json={
                'plan_name': 'Orbinex Platinum World Shield',
                'provider': 'Allianz Global Assistance',
                'destination': 'Worldwide (Including USA, Europe, UAE)',
                'medical_coverage': '$1,000,000',
                'emergency_phone': '+1 (800) 284-8300',
                'insured_persons': ['Alex Morgan', 'Sophia Morgan']
            },
            status='confirmed',
            payment_status='paid'
        )
        InsurancePolicy.objects.create(
            booking=ins_bk,
            plan=InsurancePlan.objects.first(),
            policy_number='POL-ALZ-99821045',
            insured_persons=[{'name': 'Alex Morgan', 'passport': 'USA98421004'}, {'name': 'Sophia Morgan', 'passport': 'USA98421005'}],
            destination_country='Worldwide',
            start_date=date.today() + timedelta(days=10),
            end_date=date.today() + timedelta(days=24),
            duration_days=14
        )

        self.stdout.write(self.style.SUCCESS("==> OrbinexGlobal Database successfully populated with realistic inventory and demo bookings!"))
