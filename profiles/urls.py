from django.urls import path
from .import views
from .views import *
    

app_name = 'profiles'

urlpatterns = [
    path('<str:username>/', profile ,name="profile"),
    path('<str:username>/follow_unfollow/', follow_unfollow ,name="follow_unfollow"),

]