"""
OrbinexGlobal Travel URL Configuration
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView
)

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # OpenAPI Schema & Interactive Documentation
    path('api/v1/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/v1/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/v1/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

    # Modular API v1 Routes
    path('api/v1/auth/', include('apps.accounts.urls')),
    path('api/v1/bookings/', include('apps.core_bookings.urls')),
    path('api/v1/flights/', include('apps.flights.urls')),
    path('api/v1/hotels/', include('apps.hotels.urls')),
    path('api/v1/buses/', include('apps.buses.urls')),
    path('api/v1/visa/', include('apps.visa.urls')),
    path('api/v1/insurance/', include('apps.insurance.urls')),
    path('api/v1/holidays/', include('apps.holidays.urls')),
    path('api/v1/umrah/', include('apps.umrah.urls')),
    path('api/v1/medical/', include('apps.medical_tourism.urls')),
    path('api/v1/europamundo/', include('apps.europamundo.urls')),
    path('api/v1/utilities/', include('apps.utilities.urls')),
    path('api/v1/offers/', include('apps.offers.urls')),
    path('api/v1/newsletter/', include('apps.newsletter.urls')),
    path('api/v1/payments/', include('apps.payments.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

admin.site.site_header = "OrbinexGlobal Travel Administration"
admin.site.site_title = "OrbinexGlobal Admin Portal"
admin.site.index_title = "Global Travel Operations & Inventory Management"
