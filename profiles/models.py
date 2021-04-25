from django.db import models
from django.contrib.auth.models import User
from django.urls import reverse

class Profile(models.Model):
    first_name = models.CharField(max_length=200, blank = True)
    last_name = models.CharField(max_length=200, blank = True)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(blank=True ,default="Busy Thinking of awesome bio !")
    avatar = models.ImageField(default='zenitsu.jpg', upload_to='avatars')
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"profile of the user {self.user.username}"
    
