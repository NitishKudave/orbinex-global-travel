from django.core.management.base import BaseCommand
from decimal import Decimal
from apps.buses.models import BusOperator, BusTrip, BusSeat

class Command(BaseCommand):
    help = "Seed rich bus operators and multi-city trips with redBus style boarding points"

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding comprehensive bus operators and trips...")

        # 1. Bus Operators
        operators_data = [
            {'name': 'Neeta Travels (Volvo & Scania)', 'rating': Decimal('4.8'), 'total_reviews': 1840},
            {'name': 'Zingbus Electric Luxury', 'rating': Decimal('4.9'), 'total_reviews': 2450},
            {'name': 'VRL Travels Multi-Axle', 'rating': Decimal('4.7'), 'total_reviews': 3100},
            {'name': 'IntrCity SmartBus Premium', 'rating': Decimal('4.8'), 'total_reviews': 1670},
            {'name': 'MSRTC Shivneri AC Volvo', 'rating': Decimal('4.6'), 'total_reviews': 4200},
            {'name': 'Paulo Travels Mercedes AC', 'rating': Decimal('4.7'), 'total_reviews': 920},
            {'name': 'Orange Tours and Travels', 'rating': Decimal('4.8'), 'total_reviews': 1580},
            {'name': 'SRS Travels Volvo 9600', 'rating': Decimal('4.6'), 'total_reviews': 2100},
            {'name': 'Orbinex Luxury Express', 'rating': Decimal('4.9'), 'total_reviews': 880},
            {'name': 'National Express Intercity', 'rating': Decimal('4.7'), 'total_reviews': 3400},
        ]

        op_map = {}
        for op in operators_data:
            obj, _ = BusOperator.objects.get_or_create(name=op['name'], defaults=op)
            op_map[op['name']] = obj

        # 2. Comprehensive Trips
        trips_seed = [
            # Mumbai -> Pune (Morning)
            {
                'operator': op_map['Neeta Travels (Volvo & Scania)'],
                'bus_type': 'volvo_multi_axle',
                'bus_name': 'Neeta Volvo B11R Multi-Axle AC Sleeper / Seater',
                'origin': 'Mumbai',
                'destination': 'Pune',
                'departure_time': '06:00 AM',
                'arrival_time': '09:30 AM',
                'duration': '3h 30m',
                'fare_seater': Decimal('12.00'), # in USD equivalent (~₹450)
                'fare_sleeper': Decimal('18.00'),
                'boarding_points': [
                    {'time': '05:30 AM', 'location': 'Borivali East, Mumbai', 'address': 'Opp. National Park Bridge'},
                    {'time': '05:50 AM', 'location': 'Andheri East, Mumbai', 'address': 'Bisleri Compound Highway'},
                    {'time': '06:15 AM', 'location': 'Sion, Mumbai', 'address': 'Sion Circle Highway Jn'},
                    {'time': '06:45 AM', 'location': 'Vashi, Mumbai', 'address': 'Vashi Plaza Old Toll Plaza'},
                ],
                'dropping_points': [
                    {'time': '08:45 AM', 'location': 'Wakad, Pune', 'address': 'Ginger Hotel Flyover'},
                    {'time': '09:10 AM', 'location': 'Swargate, Pune', 'address': 'Swargate Bus Stand'},
                    {'time': '09:30 AM', 'location': 'Pune Railway Station, Pune', 'address': 'Station Main Gate 1'},
                ],
                'amenities': ['High-Speed 5G Wi-Fi', 'Personal Charging Port', 'Water Bottle', 'Live GPS Tracking', 'CCTV Security', 'Blanket & Pillow']
            },
            # Mumbai -> Pune (Afternoon Executive)
            {
                'operator': op_map['Zingbus Electric Luxury'],
                'bus_type': 'volvo_multi_axle',
                'bus_name': 'Zingbus Green Electric AC Semi-Sleeper (2+2)',
                'origin': 'Mumbai',
                'destination': 'Pune',
                'departure_time': '02:00 PM',
                'arrival_time': '05:15 PM',
                'duration': '3h 15m',
                'fare_seater': Decimal('14.00'),
                'fare_sleeper': Decimal('20.00'),
                'boarding_points': [
                    {'time': '01:30 PM', 'location': 'Thane West, Mumbai', 'address': 'Teen Hath Naka Cadbury Junction'},
                    {'time': '02:00 PM', 'location': 'Dadar Central, Mumbai', 'address': 'Asiad Bus Stand Swami Narayan'},
                    {'time': '02:30 PM', 'location': 'Vashi, Mumbai', 'address': 'Highway Old Toll Plaza'},
                ],
                'dropping_points': [
                    {'time': '04:45 PM', 'location': 'Hinjewadi Phase 1, Pune', 'address': 'Wipro Circle Bridge'},
                    {'time': '05:00 PM', 'location': 'Wakad, Pune', 'address': 'Hinjewadi Flyover'},
                    {'time': '05:15 PM', 'location': 'Swargate, Pune', 'address': 'Laxmi Narayan Chowk'},
                ],
                'amenities': ['Zero Emission Electric Ride', 'Premium Leather Recliners', 'Complimentary Water & Snack', 'Live Tracking', 'Air Purifier']
            },
            # Mumbai -> Pune (Evening Rush)
            {
                'operator': op_map['MSRTC Shivneri AC Volvo'],
                'bus_type': 'volvo_multi_axle',
                'bus_name': 'Shivneri Volvo AC Semi-Sleeper (Expressway Direct)',
                'origin': 'Mumbai',
                'destination': 'Pune',
                'departure_time': '06:30 PM',
                'arrival_time': '09:45 PM',
                'duration': '3h 15m',
                'fare_seater': Decimal('10.00'),
                'fare_sleeper': Decimal('15.00'),
                'boarding_points': [
                    {'time': '06:00 PM', 'location': 'Dadar Central, Mumbai', 'address': 'Pritam Hotel Asiad Stand'},
                    {'time': '06:30 PM', 'location': 'Maitri Park Chembur, Mumbai', 'address': 'Sion Panvel Highway'},
                    {'time': '07:00 PM', 'location': 'Vashi, Mumbai', 'address': 'Vashi Plaza Bus Bay'},
                ],
                'dropping_points': [
                    {'time': '09:15 PM', 'location': 'Wakad, Pune', 'address': 'Expressway Exit Toll'},
                    {'time': '09:35 PM', 'location': 'Pune Railway Station, Pune', 'address': 'Platform 1 Circulating Area'},
                    {'time': '09:45 PM', 'location': 'Swargate, Pune', 'address': 'Swargate Central Stand'},
                ],
                'amenities': ['Push-Back Seats', 'Reading Light', 'Emergency Hammer', 'Fastest Expressway Transit']
            },
            # Mumbai -> Pune (Night Sleeper)
            {
                'operator': op_map['IntrCity SmartBus Premium'],
                'bus_type': 'ac_sleeper',
                'bus_name': 'IntrCity SmartBus Volvo 9600 AC Sleeper (2+1)',
                'origin': 'Mumbai',
                'destination': 'Pune',
                'departure_time': '10:30 PM',
                'arrival_time': '02:00 AM',
                'duration': '3h 30m',
                'fare_seater': Decimal('15.00'),
                'fare_sleeper': Decimal('24.00'),
                'boarding_points': [
                    {'time': '09:45 PM', 'location': 'Borivali East, Mumbai', 'address': 'National Park Flyover'},
                    {'time': '10:15 PM', 'location': 'Andheri East, Mumbai', 'address': 'Pump House Western Express'},
                    {'time': '10:45 PM', 'location': 'Sion, Mumbai', 'address': 'Chuna Bhatti Highway'},
                    {'time': '11:15 PM', 'location': 'Vashi, Mumbai', 'address': 'Vashi Plaza Toll'},
                    {'time': '11:45 PM', 'location': 'Panvel, Mumbai', 'address': 'Kalamboli McDonald Circle'},
                ],
                'dropping_points': [
                    {'time': '01:30 AM', 'location': 'Wakad, Pune', 'address': 'Hinjewadi Flyover Bridge'},
                    {'time': '01:45 AM', 'location': 'Chandani Chowk, Pune', 'address': 'Bavdhan Flyover'},
                    {'time': '02:00 AM', 'location': 'Swargate, Pune', 'address': 'Swargate Bus Terminal'},
                ],
                'amenities': ['Smart Bus Lounge Access', 'Infotainment Screen', 'Sanitized Bedrolls', 'Luggage Tag Tracking', 'Captain Assistance']
            },
            # Pune -> Mumbai (Return)
            {
                'operator': op_map['Neeta Travels (Volvo & Scania)'],
                'bus_type': 'volvo_multi_axle',
                'bus_name': 'Neeta Scania Multi-Axle AC Semi-Sleeper',
                'origin': 'Pune',
                'destination': 'Mumbai',
                'departure_time': '07:00 AM',
                'arrival_time': '10:30 AM',
                'duration': '3h 30m',
                'fare_seater': Decimal('12.00'),
                'fare_sleeper': Decimal('18.00'),
                'boarding_points': [
                    {'time': '06:30 AM', 'location': 'Swargate, Pune', 'address': 'Swargate Neeta Travels Office'},
                    {'time': '07:00 AM', 'location': 'Pune Railway Station, Pune', 'address': 'Station Gate 1'},
                    {'time': '07:30 AM', 'location': 'Wakad, Pune', 'address': 'Hinjewadi Flyover Ginger Hotel'},
                ],
                'dropping_points': [
                    {'time': '09:45 AM', 'location': 'Vashi, Mumbai', 'address': 'Vashi Plaza Highway'},
                    {'time': '10:05 AM', 'location': 'Sion, Mumbai', 'address': 'Sion Circle Flyover'},
                    {'time': '10:20 AM', 'location': 'Andheri East, Mumbai', 'address': 'Bisleri Compound WEH'},
                    {'time': '10:30 AM', 'location': 'Borivali East, Mumbai', 'address': 'National Park Bridge'},
                ],
                'amenities': ['Wi-Fi 5G', 'USB Charging Port', 'Water Bottle', 'Live GPS Tracking']
            },
            # Mumbai -> Goa (Overnight Sleeper)
            {
                'operator': op_map['Paulo Travels Mercedes AC'],
                'bus_type': 'ac_sleeper',
                'bus_name': 'Paulo Mercedes Benz Multi-Axle AC Sleeper (2+1)',
                'origin': 'Mumbai',
                'destination': 'Goa',
                'departure_time': '07:30 PM',
                'arrival_time': '08:00 AM',
                'duration': '12h 30m',
                'fare_seater': Decimal('28.00'),
                'fare_sleeper': Decimal('45.00'),
                'boarding_points': [
                    {'time': '06:45 PM', 'location': 'Borivali East, Mumbai', 'address': 'National Park Main Gate'},
                    {'time': '07:15 PM', 'location': 'Andheri East, Mumbai', 'address': 'Gundavali Metro / WEH'},
                    {'time': '07:45 PM', 'location': 'Sion, Mumbai', 'address': 'Chuna Bhatti Highway'},
                    {'time': '08:30 PM', 'location': 'Vashi, Mumbai', 'address': 'Vashi Plaza Old Toll Naka'},
                    {'time': '09:00 PM', 'location': 'Panvel, Mumbai', 'address': 'Kalamboli McDonald Circle'},
                ],
                'dropping_points': [
                    {'time': '06:45 AM', 'location': 'Mapusa, Goa', 'address': 'Mapusa KTC Bus Stand'},
                    {'time': '07:30 AM', 'location': 'Panaji, Goa', 'address': 'Panjim KTC Central Stand'},
                    {'time': '08:00 AM', 'location': 'Margao (Madgaon), Goa', 'address': 'Margao KTC Bus Terminal'},
                ],
                'amenities': ['Individual Privacy Curtains', 'Snack Pack & Mineral Water', 'Clean Bedding & Blanket', 'Movie Entertainment', 'Luggage Protection']
            },
            # Mumbai -> Goa (VRL AC Sleeper)
            {
                'operator': op_map['VRL Travels Multi-Axle'],
                'bus_type': 'ac_sleeper',
                'bus_name': 'VRL I-Shift Volvo Multi-Axle AC Sleeper',
                'origin': 'Mumbai',
                'destination': 'Goa',
                'departure_time': '08:30 PM',
                'arrival_time': '09:00 AM',
                'duration': '12h 30m',
                'fare_seater': Decimal('26.00'),
                'fare_sleeper': Decimal('42.00'),
                'boarding_points': [
                    {'time': '07:45 PM', 'location': 'Borivali East, Mumbai', 'address': 'Kasturba Police Stn'},
                    {'time': '08:30 PM', 'location': 'Dadar Central, Mumbai', 'address': 'Swami Narayan Asiad'},
                    {'time': '09:15 PM', 'location': 'Vashi, Mumbai', 'address': 'Vashi Plaza'},
                ],
                'dropping_points': [
                    {'time': '07:45 AM', 'location': 'Mapusa, Goa', 'address': 'Mapusa KTC Stand'},
                    {'time': '08:30 AM', 'location': 'Panaji, Goa', 'address': 'Panaji KTC Stand'},
                ],
                'amenities': ['Individual AC Vents', 'Charging Sockets', 'Blanket', 'Punctual Dispatch']
            },
            # Bangalore -> Hyderabad
            {
                'operator': op_map['Orange Tours and Travels'],
                'bus_type': 'ac_sleeper',
                'bus_name': 'Orange Scania Multi-Axle AC Sleeper (2+1)',
                'origin': 'Bangalore',
                'destination': 'Hyderabad',
                'departure_time': '09:30 PM',
                'arrival_time': '06:30 AM',
                'duration': '9h 00m',
                'fare_seater': Decimal('22.00'),
                'fare_sleeper': Decimal('36.00'),
                'boarding_points': [
                    {'time': '08:30 PM', 'location': 'Majestic, Bangalore', 'address': 'Kempegowda Bus Station'},
                    {'time': '09:00 PM', 'location': 'Silk Board, Bangalore', 'address': 'Hosur Road Flyover'},
                    {'time': '09:30 PM', 'location': 'Electronic City, Bangalore', 'address': 'Toll Plaza Phase 1'},
                ],
                'dropping_points': [
                    {'time': '05:30 AM', 'location': 'Ameerpet, Hyderabad', 'address': 'Big Bazaar Metro Pillar 1042'},
                    {'time': '06:00 AM', 'location': 'Gachibowli, Hyderabad', 'address': 'ORR Junction DLF'},
                    {'time': '06:30 AM', 'location': 'Mahatma Gandhi Bus Station (MGBS), Hyderabad', 'address': 'Central Bus Bay 18'},
                ],
                'amenities': ['Free Wi-Fi', 'Power Sockets', 'Mineral Water', 'Blanket', 'Emergency Hammer']
            },
            # Bangalore -> Chennai
            {
                'operator': op_map['SRS Travels Volvo 9600'],
                'bus_type': 'volvo_multi_axle',
                'bus_name': 'SRS Volvo Multi-Axle Luxury AC (2+2)',
                'origin': 'Bangalore',
                'destination': 'Chennai',
                'departure_time': '10:00 PM',
                'arrival_time': '05:00 AM',
                'duration': '7h 00m',
                'fare_seater': Decimal('16.00'),
                'fare_sleeper': Decimal('25.00'),
                'boarding_points': [
                    {'time': '09:15 PM', 'location': 'Majestic, Bangalore', 'address': 'Platform 2 Kempegowda'},
                    {'time': '09:45 PM', 'location': 'Indiranagar, Bangalore', 'address': '100 Ft Road CMH Hospital'},
                    {'time': '10:00 PM', 'location': 'Silk Board, Bangalore', 'address': 'Hosur Flyover'},
                ],
                'dropping_points': [
                    {'time': '04:30 AM', 'location': 'Koyambedu (CMBT), Chennai', 'address': 'Omni Bus Stand Platform 4'},
                    {'time': '05:00 AM', 'location': 'Guindy, Chennai', 'address': 'Kathipara Bridge Junction'},
                ],
                'amenities': ['Push-Back Seats', 'USB Port', 'Live GPS Tracking', 'Air Suspension']
            },
            # Delhi -> Jaipur
            {
                'operator': op_map['Zingbus Electric Luxury'],
                'bus_type': 'volvo_multi_axle',
                'bus_name': 'Zingbus Electric Executive AC',
                'origin': 'Delhi',
                'destination': 'Jaipur',
                'departure_time': '07:00 AM',
                'arrival_time': '12:15 PM',
                'duration': '5h 15m',
                'fare_seater': Decimal('14.00'),
                'fare_sleeper': Decimal('22.00'),
                'boarding_points': [
                    {'time': '06:30 AM', 'location': 'Kashmere Gate (ISBT), Delhi', 'address': 'Platform 12 ISBT'},
                    {'time': '07:00 AM', 'location': 'Dhaula Kuan, Delhi', 'address': 'Metro Station Flyover'},
                ],
                'dropping_points': [
                    {'time': '11:45 AM', 'location': 'Transport Nagar, Jaipur', 'address': 'Delhi Jaipur Highway'},
                    {'time': '12:15 PM', 'location': 'Sindhi Camp, Jaipur', 'address': 'Central Bus Stand Bay 1'},
                ],
                'amenities': ['Zero Emission Bus', 'Wi-Fi 5G', 'Snack Box', 'Reclining Seats']
            },
            # Dubai -> Abu Dhabi
            {
                'operator': op_map['Orbinex Luxury Express'],
                'bus_type': 'volvo_multi_axle',
                'bus_name': 'Orbinex Volvo B11R Luxury Multi-Axle AC Coach',
                'origin': 'Dubai',
                'destination': 'Abu Dhabi',
                'departure_time': '08:30 AM',
                'arrival_time': '10:15 AM',
                'duration': '1h 45m',
                'fare_seater': Decimal('25.00'),
                'fare_sleeper': Decimal('35.00'),
                'boarding_points': [
                    {'time': '08:00 AM', 'location': 'Al Ghubaiba, Dubai', 'address': 'Al Ghubaiba Central Bus Station Bay 12'},
                    {'time': '08:30 AM', 'location': 'Ibn Battuta Mall, Dubai', 'address': 'Metro Station Bus Terminal'},
                ],
                'dropping_points': [
                    {'time': '10:15 AM', 'location': 'Abu Dhabi Central Bus Station', 'address': 'Sultan Bin Zayed St'},
                    {'time': '10:45 AM', 'location': 'Yas Island, Abu Dhabi', 'address': 'Yas Mall Bus Bay'},
                ],
                'amenities': ['Wi-Fi 5G', 'USB Charging Port', 'Water Bottle', 'Live GPS Tracking', 'Reclining Push-Back Seats']
            },
            # London -> Manchester
            {
                'operator': op_map['National Express Intercity'],
                'bus_type': 'scania_ac',
                'bus_name': 'National Express Scania Metrolink HD Coach',
                'origin': 'London',
                'destination': 'Manchester',
                'departure_time': '09:00 PM',
                'arrival_time': '01:30 AM',
                'duration': '4h 30m',
                'fare_seater': Decimal('38.00'),
                'fare_sleeper': Decimal('58.00'),
                'boarding_points': [
                    {'time': '08:45 PM', 'location': 'Victoria Coach Station, London', 'address': '164 Buckingham Palace Rd Gate 6'},
                    {'time': '09:15 PM', 'location': 'Stratford, London', 'address': 'Stratford City Bus Station'},
                ],
                'dropping_points': [
                    {'time': '01:30 AM', 'location': 'Chorlton Street Coach Station, Manchester', 'address': 'Manchester Coach Bay 2'},
                ],
                'amenities': ['Free Wi-Fi', 'Power Sockets', 'Blanket & Pillow', 'Reading Light', 'Restroom on Board']
            },
        ]

        for b in trips_seed:
            btrip, created = BusTrip.objects.get_or_create(
                bus_name=b['bus_name'],
                origin=b['origin'],
                destination=b['destination'],
                departure_time=b['departure_time'],
                defaults=b
            )
            # Update fields if trip already exists
            if not created:
                for k, v in b.items():
                    setattr(btrip, k, v)
                btrip.save()

            # Ensure seats exist
            if btrip.seats.count() == 0:
                # Lower deck seats
                for i in range(1, 13):
                    BusSeat.objects.create(
                        trip=btrip,
                        seat_number=f"L{i}",
                        deck='lower',
                        seat_type='seater' if i <= 8 else 'sleeper',
                        price=b['fare_seater'] if i <= 8 else b['fare_sleeper'],
                        is_ladies_only=(i in [1, 2]), # Ladies only seats
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

        self.stdout.write(self.style.SUCCESS(f"Successfully seeded {len(trips_seed)} bus routes across Mumbai, Pune, Goa, Bangalore, Delhi, Dubai, London!"))
