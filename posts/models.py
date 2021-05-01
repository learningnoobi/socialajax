from django.db import models
from django.contrib.auth.models import User
from profiles.models import Profile

class Post(models.Model):
    title = models.CharField(max_length=200)
    body = models.TextField()
    liked = models.ManyToManyField(User, blank=True)
    important = models.ManyToManyField(User,related_name="important",blank=True,default=None)
    author = models.ForeignKey(Profile, on_delete=models.CASCADE)
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.title)

    @property
    def like_count(self):
        return self.liked.all().count()

    class Meta:
        ordering = ("-created",)


class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    body = models.TextField(max_length=300)
    created = models.DateTimeField(auto_now_add=True)
    liked = models.ManyToManyField(User, blank=True,related_name="comment_likes")
    parent = models.ForeignKey('self', on_delete=models.CASCADE, blank=True, null=True, related_name='parentchild')

    def __str__(self):
        return str(self.body[:15])

    @property
    def like_comment(self):
        return self.liked.all().count()
    @property
    def like_all(self):
        return self.liked.all()
    @property
    def children(self):
        return Comment.objects.filter(parent=self).order_by('-created').all()
        
    @property
    def is_parent(self):
        if self.parent is None:
            return True
        return False
    
    @property
    def is_child(self):
        return self.parentchild.all()