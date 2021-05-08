from django.shortcuts import render,get_object_or_404,redirect
from .models import *
from django.contrib.auth.models import User
from posts.models import Post
from .forms import *
from django.http import HttpResponseRedirect,JsonResponse
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.urls import reverse_lazy
from django.contrib.auth import login, authenticate,logout
import json
from django.views import View
from django.conf import settings
import urllib
from posts.models import Notification
from django.db.models import Q

@login_required(login_url='profiles:login')
def profile(request,username):
    profile = get_object_or_404(Profile,user__username = username)
    posts = profile.post_set.all()
    profile_pk = request.POST.get('profile_pk')
    
    instance = Profile.objects.get(user=request.user) 
    following = profile.following.all()
    followers = profile.followers
    
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
        "followers":followers,
        "instance":instance,
        "following":following
        }
    return render(request,'profiles/profile.html',context)

def follow_unfollow(request):

    if request.method == "POST":
        profile_pk = request.POST.get('profile_pk')
        myprofile = Profile.objects.get(user=request.user)
        obj = Profile.objects.get(user__username = profile_pk)
        print(obj)
        if obj.user in myprofile.following.all():
            myprofile.following.remove(obj.user)
            return JsonResponse({'follow':False,'followers':obj.userfollow})
        else:
            myprofile.following.add(obj.user)
            notification = Notification.objects.create(notification_type=3, from_user=request.user, to_user=obj.user)
            return JsonResponse({'follow':True,'followers':obj.userfollow})
    return redirect(request.META.get('HTTP_REFERER'))



def registerview(request):
    if request.user.is_authenticated:
        return redirect('posts:main-board')
    else:
        form = CreateUserForm()
        if request.method =='POST':
            form = CreateUserForm(request.POST)
            if form.is_valid():
                recaptcha_response = request.POST.get('g-recaptcha-response')
                url = 'https://www.google.com/recaptcha/api/siteverify'
                values = { 
                    'secret': settings.GOOGLE_RECAPTCHA_SECRET_KEY,
                     'response': recaptcha_response
                     }
                data = urllib.parse.urlencode(values).encode()
                req =  urllib.request.Request(url, data=data)
                response = urllib.request.urlopen(req)
                result = json.loads(response.read().decode())
                if result['success']:
                    form.save()
                    user = form.cleaned_data.get('username')
                    messages.success(request, 'Account was created for ' + user)
                else:
                    messages.error(request,'Invalid')
                return redirect('profiles:login')
                
        context = {'form':form}
        return render(request, 'profiles/register.html', context)

                





def validate_username(request):
    if request.method=="POST":
        data = json.loads(request.body)
        username = data['username']
        if not str(username).isalnum():
            return JsonResponse({'username_error': 'Only alphanumeric characters'}, status=400)
        if User.objects.filter(username=username).exists():
            return JsonResponse({'username_error': 'Sorry username in taken !'}, status=409)
        return JsonResponse({'username_valid': True})

def loginview(request):

	if request.user.is_authenticated:
		return redirect('posts:main-board')

	if request.method =='POST':
		username =request.POST.get('username')
		password = request.POST.get('password')

		user = authenticate(request,username=username,password=password)
		if user is not None:
			login(request,user)
			return redirect('posts:main-board')
		else:
			messages.warning(request,'Username or password is incorrect')

	context = {}
	return render(request,'profiles/login.html',context)


def logoutUser(request):
	logout(request)
	return redirect('profiles:login')
@login_required(login_url='profiles:login')
def findpeople(request):
    people_one = Profile.objects.exclude(user=request.user)
    people = people_one.exclude(user__followed = request.user.profile).order_by("?")
    context = {'people_to_follow':people}
    return render(request,'profiles/findpeople.html' ,context)

class ListThreads(View):
    def get(self, request, *args, **kwargs):
        threads = ThreadModel.objects.filter(Q(user=request.user) | Q(receiver=request.user))

        context = {
            'threads': threads
        }

        return render(request, 'profiles/inbox.html', context)
class CreateThread(View):
    def get(self, request, *args, **kwargs):
        form = ThreadForm()

        context = {
            'form': form
        }

        return render(request, 'profiles/create_thread.html', context)

    def post(self, request, *args, **kwargs):
        form = ThreadForm(request.POST)

        username = request.POST.get('username')

        try:
            receiver = User.objects.get(username=username)
            if ThreadModel.objects.filter(user=request.user, receiver=receiver).exists():
                thread = ThreadModel.objects.filter(user=request.user, receiver=receiver)[0]
                return redirect('profiles:thread', pk=thread.pk)
            elif ThreadModel.objects.filter(user=receiver, receiver=request.user).exists():
                thread = ThreadModel.objects.filter(user=receiver, receiver=request.user)[0]
                return redirect('profiles:thread', pk=thread.pk)

            if form.is_valid():
                thread = ThreadModel(
                    user=request.user,
                    receiver=receiver
                )
                thread.save()

                return redirect('profiles:thread', pk=thread.pk)
        except:
            messages.success(request, 'No user found with that username !')
            return redirect('profiles:create-thread')

class ThreadView(View):
    def get(self, request, pk, *args, **kwargs):
        form = MessageForm()
        thread = ThreadModel.objects.get(pk=pk)
        message_list = MessageModel.objects.filter(thread__pk__contains=pk)
        context = {
            'thread': thread,
            'form': form,
            'message_list': message_list
        }

        return render(request, 'profiles/thread.html', context)

class CreateMessage(View):
    def post(self, request, pk, *args, **kwargs):
        thread = ThreadModel.objects.get(pk=pk)
        if thread.receiver == request.user:
            receiver = thread.user
        else:
            receiver = thread.receiver

        message = MessageModel(
            thread=thread,
            sender_user=request.user,
            receiver_user=receiver,
            body=request.POST.get('message')
        )

        message.save()
        # notification = Notification.objects.create(notification_type=4, from_user=request.user, to_user=receiver)
        return redirect('profiles:thread', pk=pk)
