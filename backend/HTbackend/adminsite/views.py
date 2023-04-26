from json import dumps
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.decorators import user_passes_test
from knox.auth import TokenAuthentication
from apis.models import *
from apis.views import get_userId


# @user_passes_test(lambda u: u.is_superuser)
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
@api_view(['GET'])
def get_orders(request):
    print(request.user)
    if request.user.is_superuser:
        orders = Order.objects.filter().order_by('total_cost')
        all_orders = {}
        for order in orders:
            if str(request.GET.get('status')).lower() in [str(order.status).lower(), "all"]:
                # user = User.objects.filter(id=order.user_id)
                all_orders[order.order_id] = {'username':str(order.user_id),'order_id': order.order_id, 'created_at': order.created_at, 'total_cost': order.total_cost, 'order_status': order.status, 'Ingredients': []}

                ingredients = Ingredient.objects.filter(order_id=order.order_id)

                for ing in ingredients:
                    item = Item.objects.filter(item_id=ing.item_id_id).first()
                    all_orders[order.order_id]['Ingredients'].append({
                        'item_id' : item.item_id,
                        'name' : item.name,
                        'unit' : item.unit,
                        'price' : item.price,
                        'quantity' : ing.item_quantity
                    })

        return Response({
            'total_count': len(all_orders),
            'orders' : all_orders,
            'msg' : "success"
        })
    else:
        return Response({"msg":"go away"})

#changedHere
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def update_order_status(request):
    print(request.user)
    if request.user:
        order = Order.objects.filter(order_id=request.data['order_id']).first()
        order.status = request.data['order_status'].lower()
        order.save(update_fields=["status"])

        return Response({
            "msg":"order status updated",
            "order_id": order.order_id,
            "order_status": request.data['order_status']
        })

    else:
        return Response({"msg":"go away"})

@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
@api_view(['GET'])
def is_admin(request):
    if request.user.is_superuser:
        return Response({"is_admin":True})
    return Response({"is_admin":False})