import os
import requests

class BookingDotComService:
    """
    Client for Booking.com API via RapidAPI.
    Free Sandbox / Testing Quotas available.
    Get API key at: https://rapidapi.com/tipsters/api/booking-com
    """

    def __init__(self):
        self.api_key = os.getenv('RAPIDAPI_KEY', '')
        self.api_host = os.getenv('RAPIDAPI_HOST', 'booking-com.p.rapidapi.com')
        self.base_url = f"https://{self.api_host}"

    def is_configured(self) -> bool:
        return bool(self.api_key and self.api_key != 'your_rapidapi_key_here')

    def search_destination(self, query: str):
        """Finds Booking.com dest_id for any given city name."""
        if not self.is_configured():
            return None

        url = f"{self.base_url}/v1/hotels/locations"
        params = {'name': query, 'locale': 'en-gb'}
        headers = {
            'x-rapidapi-key': self.api_key,
            'x-rapidapi-host': self.api_host
        }
        response = requests.get(url, params=params, headers=headers, timeout=10)
        response.raise_for_status()
        return response.json()

    def search_hotels_by_city(self, dest_id: str, checkin_date: str, checkout_date: str, adults_number: int = 2, room_number: int = 1):
        """Fetches live hotel list with pricing, star ratings, and room availability."""
        if not self.is_configured():
            return None

        url = f"{self.base_url}/v1/hotels/search"
        params = {
            'dest_id': dest_id,
            'dest_type': 'city',
            'checkin_date': checkin_date,
            'checkout_date': checkout_date,
            'adults_number': adults_number,
            'room_number': room_number,
            'order_by': 'popularity',
            'units': 'metric',
            'currency': 'USD',
            'locale': 'en-gb'
        }
        headers = {
            'x-rapidapi-key': self.api_key,
            'x-rapidapi-host': self.api_host
        }
        response = requests.get(url, params=params, headers=headers, timeout=12)
        response.raise_for_status()
        return response.json()


booking_client = BookingDotComService()
