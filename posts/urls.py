from django.urls import path
from .views import (
    post_list_and_create,list_json,
    like_unlike_post,
    post_detail,
    post_detail_data_view,
    delete_post,
    update_post,
    important_post,
    save_list,
    search,
    like_unlike_comment,
    # comment_data_view
)

app_name = 'posts'

urlpatterns = [
    path('', post_list_and_create, name='main-board'),
    path('lists/<int:num_posts>/', list_json, name='list'),
    path('like-unlike/', like_unlike_post, name='like-unlike'),
    path('like-unlike-comment/', like_unlike_comment, name='like-unlike-comment'),
    path('save/', important_post, name='save'),

    #list of the saved posts
    path('savelist/', save_list, name='savelist'),
     path('search/', search, name='search'),
  
    path('<int:pk>/', post_detail, name='post-detail'),
    # path('<int:pk>/comments/', comment_data_view, name='post-comment-detail'),
    path('<pk>/update/', update_post, name='post-update'),
    path('<pk>/delete/', delete_post, name='post-delete'),
    path('<pk>/pk/', post_detail_data_view, name='post-detail-data'),
]

