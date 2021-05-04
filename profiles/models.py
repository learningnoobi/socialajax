from django.db import models
from django.contrib.auth.models import User
from django.urls import reverse
from PIL import Image
from django.utils import timezone

class Profile(models.Model):
    first_name = models.CharField(max_length=200, blank = True)
    following = models.ManyToManyField(User,related_name="followed" ,blank=True)
    last_name = models.CharField(max_length=200, blank = True)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(blank=True ,default="Busy Thinking of awesome bio !")
    avatar = models.ImageField(default='zenitsu.jpg', upload_to='avatars')
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"profile of the user {self.user.username}"

    @property
    def ifollow(self):
        return self.following.all().count()

    @property
    def userfollow(self):
        return self.user.followed.all().count()
    @property 
    def followers(self):
        return self.user.followed.all()

    @property
    def totalpost(self):
        return self.post_set.all().count()
    
    def save(self,*args, **kwargs):
        super().save(*args, **kwargs)
        img = Image.open(self.avatar.path)

        if img.height > 300 or img.width > 300:
            output_size = (300,300)
            img.thumbnail(output_size)
            img.save(self.avatar.path)

class ThreadModel(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='+')
	receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='+')

class MessageModel(models.Model):
	thread = models.ForeignKey(ThreadModel, related_name='+', on_delete=models.CASCADE, blank=True, null=True)
	sender_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='+')
	receiver_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='+')
	body = models.CharField(max_length=1000)
	image = models.ImageField(upload_to='uploads/message_photos', blank=True, null=True)
	date = models.DateTimeField(default=timezone.now)
	is_read = models.BooleanField(default=False)