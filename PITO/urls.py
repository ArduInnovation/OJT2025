from django.contrib import admin
from django.urls import path, include
from ims.views import dashboard  # Import  view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('ims/', include('ims.urls')),
    path('', dashboard, name='home'),  # Redirect root to  page
]
