from django.shortcuts import render,get_object_or_404,redirect
from .models import Profile
from django.contrib.auth.models import User
from posts.models import Post
from .forms import ProfileForm
from django.http import HttpResponseRedirect,JsonResponse

def profile(request,username):
    
    
    profile = Profile.objects.get(user__username__iexact = username)
    posts = profile.post_set.all()
    try:
        instance = Profile.objects.get(user=request.user) 
    except:
        pass
    form = ProfileForm(instance=instance)
    if request.method =='POST':
        user = request.user
        instance = get_object_or_404(Profile, user=user)
        if request.method == "POST":
            form = ProfileForm(request.POST, request.FILES,instance=instance)
            if form.is_valid():
                form.save()
                return HttpResponseRedirect("/"+request.user.username)
    context = {"profile":profile,"posts":posts,"form":form}
    return render(request,'profiles/profile.html',context)