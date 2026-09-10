import os
import requests
from datetime import datetime

class ForexRateService:
    """
    Live Forex Currency Converter using ExchangeRate-API.
    Free Tier: 1,500 requests/month.
    Sign up at: https://www.exchangerate-api.com/
    """

    def __init__(self):
        self.api_key = os.getenv('EXCHANGERATE_API_KEY', '')
        self._rates_cache = {}
        self._last_fetched = 0

    def is_configured(self) -> bool:
        return bool(self.api_key and self.api_key != 'your_exchangerate_key_here')

    def get_latest_rates(self, base_currency: str = 'USD'):
        """Fetches latest conversion rates with 1-hour in-memory cache."""
        now = datetime.now().timestamp()
        if self._rates_cache and (now - self._last_fetched) < 3600:
            return self._rates_cache

        # Default fallback standard rates if API key is not configured
        fallback_rates = {
            'USD': 1.0,
            'EUR': 0.92,
            'GBP': 0.79,
            'AED': 3.67,
            'INR': 83.50,
            'SAR': 3.75,
            'JPY': 155.20,
            'SGD': 1.34
        }

        if not self.is_configured():
            return fallback_rates

        try:
            url = f"https://v6.exchangerate-api.com/v6/{self.api_key}/latest/{base_currency}"
            response = requests.get(url, timeout=6)
            response.raise_for_status()
            data = response.json()
            if data.get('result') == 'success':
                self._rates_cache = data.get('conversion_rates', fallback_rates)
                self._last_fetched = now
                return self._rates_cache
        except Exception:
            pass

        return fallback_rates


forex_service = ForexRateService()
