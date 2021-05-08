from django.urls import path
from .import views
from .views import *


app_name = 'profiles'

urlpatterns = [
    path('<str:username>/', profile ,name="profile"),
    path('user/follow_unfollow/', follow_unfollow ,name="follow_unfollow"),
    path('auth/login', loginview , name="login"),
    path('list/people', list_people , name="list_people"),
    path('auth/register', registerview , name="register"),
    path('auth/logout/',logoutUser,name = 'logout'),
    path('auth/find-people/',findpeople,name = 'findpeople'),
    path('auth/validate_username', validate_username, name='validate_username'),
    path('msg/inbox/', ListThreads.as_view(), name='inbox'),
    path('inbox/create-thread/', CreateThread.as_view(), name='create-thread'),
    path('inbox/<int:pk>/', ThreadView.as_view(), name='thread'),
    path('inbox/<int:pk>/create-message/', CreateMessage.as_view(), name='create-message'),

] 