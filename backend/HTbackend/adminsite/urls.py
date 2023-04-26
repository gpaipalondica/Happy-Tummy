from django.urls import path
from . import views

urlpatterns = [
    path('get/orders', views.get_orders),
    path('update/order_status', views.update_order_status),
    path('get/is_admin', views.is_admin)
]