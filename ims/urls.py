from django.urls import path
from . import views
from .views import get_staff_list

from .views import get_member_data
from .views import get_offices

urlpatterns = [
    path('login/', views.login, name='login'),
    path('register/', views.register, name='register'),
    path('get_member_data/<str:employment_id>/', get_member_data, name='get_member_data'),
    path('update_member/<str:employment_id>/', views.update_member, name='update_member'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('logout/', views.logout, name='logout'),
    path('delete-member/', views.delete_member, name='delete_member'),
    path('get-staff/', get_staff_list, name='get_staff_list'),
    path('get-offices/', get_offices, name='get_offices'),
]

