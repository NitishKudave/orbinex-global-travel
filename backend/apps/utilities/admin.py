from django.contrib import admin
from .models import ForexRate, EsimPackage, AirportLounge

@admin.register(ForexRate)
class ForexRateAdmin(admin.ModelAdmin):
    list_display = ('currency_code', 'currency_name', 'buy_rate_usd', 'sell_rate_usd')

@admin.register(EsimPackage)
class EsimPackageAdmin(admin.ModelAdmin):
    list_display = ('country_or_region', 'data_allowance', 'validity_days', 'price_usd')

@admin.register(AirportLounge)
class AirportLoungeAdmin(admin.ModelAdmin):
    list_display = ('airport_code', 'terminal', 'lounge_name', 'price_usd')
