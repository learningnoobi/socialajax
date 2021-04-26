from django.shortcuts import render,get_object_or_404,redirect
from .models import Profile
from django.contrib.auth.models import User
from posts.models import Post
from .forms import ProfileForm
from django.http import HttpResponseRedirect,JsonResponse

def profile(request,username):
    profile = Profile.objects.get(user__username = username)
    posts = profile.post_set.all()
    profile_pk = request.POST.get('profile_pk')
    
    instance = Profile.objects.get(user=request.user) 
    following = profile.following.all()
    
    follow = False
    if profile.user in instance.following.all():
        follow = True
    
    form = ProfileForm(instance=instance)
    if request.method =='POST':
        
        user = request.user
        instance = get_object_or_404(Profile, user=user)
        if request.method == "POST":
            form = ProfileForm(request.POST, request.FILES,instance=instance)
            if form.is_valid():
                form.save()
                return redirect(request.META.get('HTTP_REFERER'))
    context = {
        "profile_pk":profile_pk,
        "profile":profile,
        "posts":posts,
        "form":form,
        "follow":follow,
        "instance":instance,
        "following":following
        }
    return render(request,'profiles/profile.html',context)

def follow_unfollow(request,username):

    if request.method == "POST":
        # profile_pk = request.POST.get('profile_pk')
        myprofile = Profile.objects.get(user=request.user)
        obj = Profile.objects.get(user__username = username)
        print(obj)
        if obj.user in myprofile.following.all():
            myprofile.following.remove(obj.user)
            return JsonResponse({'follow':False,'followers':obj.userfollow})
        else:
            myprofile.following.add(obj.user)
            return JsonResponse({'follow':True,'followers':obj.userfollow})
    return redirect(request.META.get('HTTP_REFERER'))

