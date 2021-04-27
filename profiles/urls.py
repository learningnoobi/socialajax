from django.urls import path
from .import views
from .views import *


app_name = 'profiles'

urlpatterns = [
    path('<str:username>/', profile ,name="profile"),
    path('<str:username>/follow_unfollow/', follow_unfollow ,name="follow_unfollow"),
    path('auth/login', loginview , name="login"),
    path('auth/register', registerview , name="register"),
    path('auth/logout/',logoutUser,name = 'logout'),
    path('auth/validate_username', validate_username, name='validate_username'),

] 