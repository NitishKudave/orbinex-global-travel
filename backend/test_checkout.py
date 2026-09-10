import urllib.request
import json

# 1. Test JWT Auth
login_data = json.dumps({'username': 'demo_user', 'password': 'Demo@Orbinex2026!'}).encode('utf-8')
req = urllib.request.Request('http://127.0.0.1:8000/api/v1/auth/login/', data=login_data, headers={'Content-Type': 'application/json'})
res = urllib.request.urlopen(req)
tokens = json.loads(res.read().decode('utf-8'))
access_token = tokens['access']
print('JWT LOGIN SUCCESS! Access token obtained.')

# 2. Test Unified Checkout (Flight + Hotel + Insurance + eSIM mixed in 1 order)
checkout_data = json.dumps({
    'contact_name': 'Alex Morgan',
    'contact_email': 'alex.morgan@example.com',
    'contact_phone': '+1 555-0199',
    'currency': 'USD',
    'coupon_code': 'ORBINEX100',
    'discount_amount': 100,
    'payment_method': 'card',
    'items': [
        {
            'booking_type': 'flight',
            'title': 'Flight EK-201: DXB to LHR (Business)',
            'amount': 850.0,
            'travel_date': '2026-09-15',
            'details': {'flight_number': 'EK-201', 'origin': 'Dubai', 'destination': 'London', 'selected_seats': '10A'}
        },
        {
            'booking_type': 'hotel',
            'title': 'Burj Al Arab Jumeirah - Deluxe King',
            'amount': 1250.0,
            'travel_date': '2026-09-15',
            'return_date': '2026-09-18',
            'details': {'hotel_name': 'Burj Al Arab', 'city': 'Dubai', 'nights': 3}
        },
        {
            'booking_type': 'insurance',
            'title': 'Gold Voyager Medical Plan ($500K)',
            'amount': 45.0,
            'travel_date': '2026-09-15',
            'return_date': '2026-09-29',
            'details': {'plan_name': 'Gold Voyager', 'coverage': '$500,000'}
        },
        {
            'booking_type': 'utility',
            'title': 'eSIM Europe & Middle East 10GB',
            'amount': 25.0,
            'details': {'data': '10GB', 'validity': '30 Days'}
        }
    ]
}).encode('utf-8')

req_chk = urllib.request.Request(
    'http://127.0.0.1:8000/api/v1/bookings/checkout/',
    data=checkout_data,
    headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {access_token}'}
)
res_chk = urllib.request.urlopen(req_chk)
chk_result = json.loads(res_chk.read().decode('utf-8'))
print('UNIFIED CHECKOUT SUCCESS:', json.dumps(chk_result, indent=2))

# 3. Test My Bookings aggregation
req_my = urllib.request.Request(
    'http://127.0.0.1:8000/api/v1/bookings/my-bookings/',
    headers={'Authorization': f'Bearer {access_token}'}
)
res_my = urllib.request.urlopen(req_my)
my_bks = json.loads(res_my.read().decode('utf-8'))
items_list = my_bks.get('results', my_bks)
print(f'MY BOOKINGS COUNT FOR DEMO USER: {len(items_list)}')
for b in items_list:
    print(f" - [{b.get('booking_reference')}] {b.get('title')} ({b.get('status')}) -> ${b.get('final_amount')}")
