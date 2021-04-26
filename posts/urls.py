from django.urls import path
from .views import (
    post_list_and_create,list_json,
    like_unlike_post,
    delete_all,
    post_detail,
    post_detail_data_view,
    delete_post,
    update_post,
    important_post,
    save_list,
    search,
    # image_upload_view
)

app_name = 'posts'

urlpatterns = [
    path('', post_list_and_create, name='main-board'),
    path('lists/<int:num_posts>/', list_json, name='list'),
    path('like-unlike/', like_unlike_post, name='like-unlike'),
    path('delete_all/', delete_all, name='delete_all'),
    path('savelist/', save_list, name='savelist'),
     path('search/', search, name='search'),
    # path('upload/', image_upload_view, name='image-upload'),
    path('<int:pk>/', post_detail, name='post-detail'),
    path('<pk>/update/', update_post, name='post-update'),
    path('<pk>/delete/', delete_post, name='post-delete'),
    path('<id>/save/', important_post, name='save'),
    path('<pk>/pk/', post_detail_data_view, name='post-detail-data'),
]

