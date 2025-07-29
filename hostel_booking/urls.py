# hostel_booking/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),  # Admin interface
    path('api/', include('core.urls')),  # Include core app URLs with 'api/' prefix
    path('', include('core.urls')),  # Include core URLs for root (optional, for homepage)
]