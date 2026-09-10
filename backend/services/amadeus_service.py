import os
import requests
from datetime import datetime, date

class AmadeusFlightService:
    """
    Client for Amadeus Self-Service Travel APIs.
    Free Tier: 2,000 requests/month in Sandbox environment.
    Sign up & get API keys at: https://developers.amadeus.com/
    """

    def __init__(self):
        self.client_id = os.getenv('AMADEUS_CLIENT_ID', '')
        self.client_secret = os.getenv('AMADEUS_CLIENT_SECRET', '')
        self.env = os.getenv('AMADEUS_ENV', 'test') # 'test' or 'production'
        self.base_url = (
            'https://test.api.amadeus.com' if self.env == 'test'
            else 'https://api.amadeus.com'
        )
        self._access_token = None
        self._token_expires_at = 0

    def is_configured(self) -> bool:
        return bool(self.client_id and self.client_secret and self.client_id != 'your_amadeus_api_key')

    def _get_access_token(self) -> str:
        """Authenticates with Amadeus OAuth2 to obtain a Bearer access token."""
        if self._access_token and datetime.now().timestamp() < self._token_expires_at:
            return self._access_token

        auth_url = f"{self.base_url}/v1/security/oauth2/token"
        response = requests.post(
            auth_url,
            data={
                'grant_type': 'client_credentials',
                'client_id': self.client_id,
                'client_secret': self.client_secret
            },
            headers={'Content-Type': 'application/x-www-form-urlencoded'},
            timeout=10
        )
        response.raise_for_status()
        data = response.json()
        self._access_token = data['access_token']
        # Set expiry with a 60s buffer
        self._token_expires_at = datetime.now().timestamp() + data.get('expires_in', 1799) - 60
        return self._access_token

    def search_flight_offers(self, origin: str, destination: str, departure_date: str, adults: int = 1, travel_class: str = 'ECONOMY', max_results: int = 5):
        """
        Searches real-time multi-airline flight schedules and fares.
        Endpoint: /v2/shopping/flight-offers
        """
        if not self.is_configured():
            return None

        token = self._get_access_token()
        url = f"{self.base_url}/v2/shopping/flight-offers"
        params = {
            'originLocationCode': origin.upper(),
            'destinationLocationCode': destination.upper(),
            'departureDate': departure_date,
            'adults': adults,
            'travelClass': travel_class.upper(),
            'max': max_results,
            'currencyCode': 'USD'
        }
        headers = {'Authorization': f'Bearer {token}'}
        
        response = requests.get(url, params=params, headers=headers, timeout=12)
        response.raise_for_status()
        return response.json()

    def get_seatmaps(self, flight_offer_id: str = None):
        """
        Fetches interactive aircraft seat maps for a selected flight.
        Endpoint: /v1/shopping/seatmaps
        """
        if not self.is_configured():
            return None

        token = self._get_access_token()
        url = f"{self.base_url}/v1/shopping/seatmaps"
        headers = {'Authorization': f'Bearer {token}'}
        
        response = requests.get(url, headers=headers, timeout=12)
        response.raise_for_status()
        return response.json()


# Singleton instance
amadeus_client = AmadeusFlightService()
