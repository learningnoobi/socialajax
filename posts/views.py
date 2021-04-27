from django.shortcuts import render,redirect,get_object_or_404
from .models import Post,Comment
from django.http import JsonResponse
from .forms import PostForm,CommentForm
from profiles.models import Profile
from django.contrib.auth.decorators import login_required


def post_list_and_create(request):
    qs = Post.objects.all()
    form = PostForm(request.POST or None)
    
    if request.is_ajax():
        
        if form.is_valid():
            author = Profile.objects.get(user=request.user)
            instance = form.save(commit=False)
            instance.author = author
            instance.save()
            return JsonResponse({
                'title':instance.title,
                'body':instance.body,
                'author':instance.author.user.username,
                'id':instance.id,
                'avatar':instance.author.avatar.url,
            })
    context = {"qs":qs,"form":form}
    return render (request, 'posts/main.html',context)

# list of all the posts
def list_json(request,num_posts):
    visible = 3
    upper = num_posts
    lower = upper-visible
    size = Post.objects.all().count()
    lists = Post.objects.all()
    data = []
    for obj in lists:
        posts={
         "title":obj.title,
        "id":obj.id,
        "liked":True if request.user in obj.liked.all() else False,
        "author":obj.author.user.username,
        "body":obj.body,
        'important':True if obj.important.filter(id=request.user.pk).exists() else False,
        "count":obj.like_count,
        "avatar":obj.author.avatar.url,
        }
        data.append(posts)

    return JsonResponse({'data':data[lower:upper], 'size': size})

def like_unlike_post(request):
    if request.is_ajax():
        pk = request.POST.get('pk')
        obj = get_object_or_404(Post,pk=pk)
        if request.user in obj.liked.all():
            liked = False
            obj.liked.remove(request.user)
        else:
            liked = True
            obj.liked.add(request.user)
        return JsonResponse({'liked': liked, 'count': obj.like_count})
    return redirect('posts:main-board')


def important_post(request):
    if request.is_ajax():
        pk = request.POST.get('pk')
        post = get_object_or_404(Post,pk=pk)
        if post.important.filter(id=request.user.id).exists():
            post.important.remove(request.user)
        else:
            post.important.add(request.user)
        return JsonResponse({'important':True if post.important.filter(id=request.user.pk).exists() else False})
    return redirect('posts:main-board')

def post_detail(request, pk):
    obj = get_object_or_404(Post,id=pk)
    comments = Comment.objects.filter(post=obj).order_by("-created")
    comment_count = Comment.objects.filter(post=obj).count()
    form = PostForm()
    commentform = CommentForm()
    is_important= False
    if obj.important.filter(id=request.user.pk).exists():
        is_important= True
    if request.method=="POST":
        commentform = CommentForm(request.POST or None)
        if commentform.is_valid():
            user = request.user
            instance = commentform.save(commit=False)
            instance.user = user
            instance.post = obj
            instance.save()
            return JsonResponse({
                'body':instance.body,
                'user':instance.user.username,
                'id':instance.id,
                'avatar':instance.user.profile.avatar.url,
            })
    context = {
        'obj': obj,
        'form': form,
        'commentform':commentform,
         
         'comment_count': comment_count,
        "is_important":is_important,
        'comments': comments,
    }

    return render(request, 'posts/detail.html', context)

def post_detail_data_view(request, pk):


    if request.is_ajax():
        obj = Post.objects.get(pk=pk)
        data = {
            'id': obj.id,
            'title': obj.title,
            'body': obj.body,
            "liked":True if request.user in obj.liked.all() else False,
            
            'author': obj.author.user.username,
            'avatar': obj.author.avatar.url,
            'logged_in': request.user.username,
             "count":obj.like_count,
             'important':True if obj.important.filter(id=request.user.pk).exists() else False
        }
        return JsonResponse({'data': data},)
    return redirect('posts:main-board')

def update_post(request, pk): 
    obj = Post.objects.get(pk=pk)
    if request.user == obj.author.user:
        if request.is_ajax():
            new_title = request.POST.get('title')
            new_body = request.POST.get('body')
            obj.title = new_title
            obj.body = new_body
            obj.save()
            return JsonResponse({
                'title': new_title,
                'body': new_body,
            })
        else:
            return redirect('posts:main-board')
    else:
        return redirect('posts:main-board')

def delete_post(request, pk):
    obj = Post.objects.get(pk=pk)
    if request.is_ajax():
        obj.delete()
        return JsonResponse({'msg':'some message'})
    return redirect('posts:main-board')


@login_required(login_url='profiles:login')
def save_list(request):
	user = request.user
	imp_list = user.important.all()
	context = {
		'imp_list':imp_list
	}
	return render (request,'posts/save.html',context)

def search(request):
    if request.is_ajax():
        search = request.POST.get('search')
        res = None
        qs = Post.objects.filter(title__icontains =search)
        if len(qs) > 0 and len(search) > 0:
            data = []
            for pos in qs:
                item ={
                    'id':pos.id,
                    'title':pos.title,
                    'body':pos.body,
                    'author':pos.author.user.username,
                    'avatar':pos.author.avatar.url,

                }
                data.append(item)
            res = data
        else:
            res = 'No posts Found ....'
        print(qs)
        return JsonResponse({'search':res})
    return JsonResponse({'error':'something is wrong'})