from django.urls import path
from . import views
from knox import views as knox_views

urlpatterns = [
    path('get/allusers', views.getAllUsers),
    # path('register/user', views.newUser),
    # path('api/register', views.RegisterAPI.as_view(), name='register'),
    path('api/register', views.register_user, name='register_user'),
    path('api/login', views.login, name='login'),
    path('api/logout', knox_views.LogoutView.as_view(), name='logout'),
    path('api/logout-all', knox_views.LogoutAllView.as_view(),name='logout-all'),
    path('api/query-recipes', views.search_query, name='Query Recipes'),
    path('add/item', views.addItem, name='add item'),
    path('api/get-user', views.get_user, name='Get User'),
    path('api/get-items', views.get_items, name='Get Items'),
    path('api/order', views.order, name='place order'),
    path('api/post', views.create_post, name='Post Recipes'),
    path('api/feed', views.get_all_feeds, name='Get Feed'),
    path('api/get/user-orders-all', views.get_user_orders, name='Get user orders'),
    path('api/get/total-cost', views.get_total_cost),
    path('api/like-post', views.like_post),
    path('api/unlike-post', views.unlike_post),
    path('api/user-posts-all', views.get_post_by_user, name='Post by user'),
    path('happy-tummy/user-posts', views.link_handler, name='Get protected posts'),
    path('api/post/access-all', views.acess_to_all, name='Post by user'),
    path('api/post/access-link', views.access_with_link, name='Post by user'),
    path('api/post/liked', views.has_liked_post, name='Post liked by user'),
    path('api/update/profile', views.update_profile),
    path('api/get/user-posts', views.get_user_posts), #new
    path('api/get/feed/filter', views.get_feeds_filter), #new
    # path('api/post/likes', views.calculate_likes, name='Calculate likes'),

    path('api/recipetable', views.recipetable, name="Recipe Table"), #new
    path('api/update-recipetable', views.update_recipetable, name="Update Recipe Table"), #new
    
]