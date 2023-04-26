from django.shortcuts import render
from fuzzywuzzy import process
from knox.auth import AuthToken
from knox.settings import CONSTANTS
from rest_framework import generics, permissions
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.pagination import PageNumberPagination
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import decimal
import string
import random

from .models import *
from .recipe_crawler import getRecipes
from .serializers import *

# Create your views here.

def test(request):
    return Response({
        print("Hello World")
    })



### USERS ###
@api_view(['POST'])
def login(request):
    serializer = AuthTokenSerializer(data = request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.validated_data['user']

    # _, token = AuthToken.objects.create(user)
    return Response({
        "user": {
            "user_id": user.id,
            "user_name": user.username,
            "email": user.email,
        },
        "token": AuthToken.objects.create(user)[1]
    })


@api_view(['POST'])
def register_user(request):
    input_data = request.data
    serializer = RegisterSerializer(data={'username':input_data['username'],'first_name':input_data['first_name'],'last_name' :input_data['last_name'],'password' : input_data['password'],'email' : input_data['email'],'password2':input_data['password2']})
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    profile = UserProfileSerializer(data={'address':input_data['address'],'city':input_data['city'],'state':input_data['state'],'zipcode':input_data['zipcode'],'phone_number':input_data['phone_number'],'user_id':user.id})
    profile.is_valid(raise_exception=True)
    profile.save()

    tokenObject = AuthToken.objects.create(user)
    print({
        "user": {
            "success" : "user created",
            "user_id": user.id,
            "user_name": user.username,
            "email": user.email
        }, 
        "token": tokenObject[1]
    })
    return Response({
        "user": {
            "success" : "user created",
            "user_id": user.id,
            "user_name": user.username,
            "email": user.email
        }, 
        "token": tokenObject[1]
    })

#TEST
# @api_view(['POST'])
# def Test(request):
#     serializer = TestSerializer(data={'test_id':input_data['500'],'test_quantity':input_data['50.50']})
#     serializer.is_valid(raise_exception=True)
#     test = serializer.save()
#     print({
#         "test": {
#             "test_id" : test.test_id,
#             "test_quantity": test.test_quantity,
#         }
#     })
#     return Response({
#           "test": {
#             "test_id" : test.test_id,
#             "test_quantity": test.test_quantity,
#         }
#     })



@api_view(['GET'])
def get_user(request):
    token = request.headers.get('Authorization')
    # print("token", token)
    token = token.split()[1]
    key = token[:CONSTANTS.TOKEN_KEY_LENGTH]
    user_info = AuthToken.objects.filter(token_key=key)
    if len(user_info) == 0:
        return Response({
            "msg" : "Token Invalid",
            "error_code" : 404
        })
        
    user_id = user_info.first().user_id
    
    user = User.objects.filter(id=user_id).first()
    userProfile = UserProfile.objects.filter(user_id = user_id).first()
    
    return Response({
        'user': {
                "username": user.username,
                "email" : user.email,
                "first_name" : user.first_name,
                "last_name" : user.last_name,
                "address" : userProfile.address,
                "city" : userProfile.city,
                "state" : userProfile.state,
                "zipcode" : userProfile.zipcode,
                "phone_number" : userProfile.phone_number,
        }
    }
    )

@api_view(['POST'])
def search_query(request):
    query = request.data['query']
    # print(query)
    try:
        recipes = getRecipes(query)
        #Adding items to database if they don't already exist
        add_item_to_database(recipes)
        return Response({
            'success': True,
            'recipes': recipes
        })
    except Exception as e:
        print(e)
        return Response({
            'success': False,
            'status': 500,
            'message': 'Not found Exceptions'
        })

@api_view(['POST'])
def addItem(request):
    
    serializer = ItemSerializer(data=request.data)

    if serializer.is_valid():
        # name = serializer.data["name"]
        # unit = serializer.data["unit"]
        item = serializer.save()
    else:
        return Response({
            'success': False,
            'status': 200,
            'message': 'This Item already exists'
        })

    return Response({
        'success': True,
        'status': 200,
        'item': {
            'name': item.name,
            'unit': item.unit
        },
    })


def addItem(item):
    serializer = ItemSerializer(data=item)

    if serializer.is_valid():
        # name = serializer.data["name"]
        # unit = serializer.data["unit"]
        item = serializer.save()
    else:
        return Response({
            'success': False,
            'status': 403,
            'message': 'This Item already exists'
        })
    print('Item added successfully')
    return Response({
        'success': True,
        'status': 200,
        'item': {
            'name': item.name,
            'unit': item.unit
        },
    })


def add_item_to_database(recipes):
    ingredients = []
    for recipe in recipes:
        ingredients.extend(recipe['ingredients'])

    for ingredient in ingredients:
        item = {
            'name': ingredient['name'],
            'unit': ingredient['unit']
        }
        if not Item.objects.filter(name = ingredient['name']).exists():
            addItem(item)
        else:
            print("Item already exists")
            continue


@api_view(['GET', 'POST'])
def get_items(request):
    # search = request.data['query']
    search = request.GET.get('search')
    items = Item.objects.all()
    serializer = ItemSerializer(items, many=True)

    # print(serializer.data)
    items_mapper = {item['name']: item['item_id'] for item in serializer.data}

    choices = [item['name'] for item in serializer.data]

    results = process.extract(search, choices, limit=15)
    
    res = []
    for result in results:
        data = {'name': result[0], 'item_id': items_mapper[result[0]], 'confidence score': result[1]}
        res.append(data)

    return Response({
       'success': True,
        'results': res
    })



@api_view(['GET'])
def getAllUsers(request):
    if request.method =='GET':
        users = User.objects.all()
        serializer = userSerializer(users, many=True)

        res = {'users': serializer.data}
        return Response(res)

@api_view(['POST'])
def newUser(request):
    if request.method == 'POST':
        serializer = userSerializer(data=request.data)
        res = {}

        if serializer.is_valid():
            user = serializer.save()
            res['msg']= "added user"
            res['username'] = user.name
            res['email'] = user.email
        else:
            res = serializer.errors
        
        return Response(res)

class RegisterAPI(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
        "user": UserSerializer(user, context=self.get_serializer_context()).data,
        "token": AuthToken.objects.create(user)[1]
        })


### ORDER AND INGREDIENTS ###
@api_view(['POST'])
def order(request):
    data = request.data
    token = request.headers.get('Authorization')
    token = token.split()[1]
    ingredients = data['Ingredients']

    info = AuthToken.objects.filter(token_key=token[:CONSTANTS.TOKEN_KEY_LENGTH])
    if len(info) == 0:
        return Response({
            "msg" : "user token not found",
            "error_code" : 404
        })
    user_id = info.first().user_id

    ing_details = {'items': []}
    res = {}
    tot_cost = 0
    for ing in ingredients:
        ing_details["items"].append({'name' : ing['name'], 'quantity': decimal.Decimal(ing["quantity"])})
        try:
            item = Item.objects.filter(name = ing["name"])
        except Exception:
            res["item_not_found"] = ing["name"]+"was not found"
            print("exception")
        
        price = item.first().price
        tot_cost = tot_cost + price * decimal.Decimal(ing["quantity"])
        tot_cost = round(tot_cost, 2)


    order_data = {"user_id": user_id, "total_cost": tot_cost}
    serializer = OrderSerializer(data = order_data)
    serializer.is_valid(raise_exception=True)
    order = serializer.save()

    ing_details['order_id'] = order.order_id
    ing_details['user_id'] = user_id
    # print(ing_details)

    add_ingredients(ing_details)

    res["user_id"] = user_id
    res["order_id"] = order.order_id
    res["ingredient_details"] = ing_details,
    res["msg"] = "order is successfully placed"

    return Response(res, 200)


@api_view(['POST'])
def get_total_cost(request):
    data = request.data
    tot_cost = 0
    ing_details = {}
    for ing in data:
        item = Item.objects.filter(name = ing['name']).first()
        ing_details[item.item_id] = {
            'name' : ing['name'],
            'price' : round(item.price * decimal.Decimal(ing['quantity']), 2),
            'quantity' : ing['quantity'],
            'unit': item.unit
        }
        tot_cost = tot_cost + item.price * decimal.Decimal(ing["quantity"])

    return Response({
        'total_cost' : tot_cost,
        'brake_up' : ing_details
    })


def add_ingredients(ingredients):
    order = Order.objects.filter(order_id=ingredients['order_id'])
    # order = ingredients['order_id']
    items = ingredients['items']

    res = []

    for item in items:
        # item_id = item['item_id']
        _item = Item.objects.filter(name=item['name'])
        quantity = item['quantity']

        ingredient = Ingredient.objects.create(order_id=order.first(), item_id=_item.first(), item_quantity=quantity)
        res.append(ingredient)

    return ({
        'status': 200,
        'ingredient': res
    })


@api_view(['GET'])
def get_user_orders(request):
    key = request.headers.get('Authorization')
    token = key.split()[1]

    user_id = AuthToken.objects.filter(token_key=token[:CONSTANTS.TOKEN_KEY_LENGTH]).first().user_id

    # user = User.objects.filter(user_id=user_id)
    orders = Order.objects.filter(user_id=user_id).order_by('created_at')
    user_orders = {}
    for order in orders:
        user_orders[order.order_id] = {'order_id': order.order_id, 'created_at': order.created_at, 'total_cost': order.total_cost, 'order_status': order.status, 'Ingredients': []}

        ingredients = Ingredient.objects.filter(order_id=order.order_id)

        for ing in ingredients:
            item = Item.objects.filter(item_id=ing.item_id_id).first()
            user_orders[order.order_id]['Ingredients'].append({
                'item_id' : item.item_id,
                'name' : item.name,
                'unit' : item.unit,
                'price' : item.price,
                'quantity' : ing.item_quantity
            })

    return Response({
        'user_id' : user_id,
        'orders' : user_orders,
        'msg' : "success"
    })


    

### POSTS ###
def calculate_likes(post_id):
    try:
        likes = Likes.objects.filter(post_id=post_id)
    except Exception as e:
        return Response({
            'error': e
        }, status=status.HTTP_400_BAD_REQUEST)
    return 0 if likes is None else likes.count()
    

def format_post(data): 
    instructions = ""
    for counter, _ in enumerate(data['instructions'], start=1):
        if ":" in _['heading']:
            instructions += f"_{counter}. {_['heading']}"
        else:
            instructions += f"_{counter}. {_['heading']}:"
        instructions += f"{_['text']}"
    ingredients = "_" + "_".join(f"{_['name']} [{_['quantity']} {_['unit']}] \n" for _ in data['ingredients'])

    return {'recipe_name': data['name'], 'time_required': data['timeRequired'], 'link_only': data['link_only'], 'image_url': data['image_url'], 'instructions': instructions, 'ingredients': ingredients,}
    


def get_userId(token):
    if (len(token) == 0):
        raise "Invalid token or unauthorized user"
    
    token = token.split()[1]
    return AuthToken.objects.filter(token_key=token[:CONSTANTS.TOKEN_KEY_LENGTH]).first().user_id    


@api_view(['POST'])
def create_post(request):
    characters = string.ascii_lowercase + string.digits + string.ascii_uppercase
    slug = "".join(random.choice(characters) for _ in range(10))
    formated_data = format_post(request.data)
    token = request.headers.get('Authorization')

    posts = Post.objects.all()
    posts = posts.order_by('-post_id').first()

    post_id = 1 if posts is None else posts.post_id + 1
    if len(token) == 0:
        return Response({
            'status': 403,
            'message': 'User not authorized or invalid token'
        })

    if get_userId(token) is None:
        return Response({
            'status': 403,
            'message': 'Token Invalid or expired'
        })

    formated_data['user_id'] = get_userId(token)
    formated_data['slug'] = slug + str(post_id)
    formated_data['link_only'] = request.data['link_only']
    formated_data['likes'] = 0
    serializer = PostSerializer(data = formated_data)

    if (serializer.is_valid()):
        serializer.save()
    else:
        return Response({
            'status': 400,
            'message': serializer.errors
        })

    return Response({
        'status': 200,
        'post': serializer.data
    })
    

@api_view(['GET'])
def has_liked_post(request):
    post_id = request.GET.get('post')
    token = request.headers.get('Authorization')
    user_id = get_userId(token)
    try:
        has_liked = Likes.objects.filter(post_id = post_id).filter(user_id=user_id).exists()
    except Exception as e:
        return Response({
            'message': e
            }, status=status.HTTP_400_BAD_REQUEST)
    return Response({
        'has_liked': has_liked
    }, status=status.HTTP_200_OK)
    
@api_view(['GET'])
def link_handler(request):
    slug = request.GET.get('slug')
    # print(request.data)
    try:
        post = Post.objects.filter(slug=slug)
    except Exception as e:
        return Response({
            'message': e
        }, 500)
        
    serializer = PostSerializer(post, many=True)
    data = format_feed(serializer.data)
    return Response({
        'post': data
    }, 200)


@api_view(['GET'])
def get_one_post_details(request):
    post_id = request.data['post_id']
    try:
        post = Post.objects.filter(post_id=post_id)
    except Exception as e:
        return Response({'message': e}, 404)
    serializer = PostSerializer(post, many=True)
    return Response({'post': serializer.data}, 200)



### FEEDS ###

def format_feed(feeds):

    formated_result = []
    for feed in feeds:
        # if int(feed['link_only']) in {0}:
        list_of_instructions = []
        # print(feed['instructions'])
        instructions_list = feed['instructions'].split("_")
        for instruction in instructions_list:
            instructions = {}
            if len(instruction) > 0:
                splitted = instruction.split(":")
                instructions['heading'] = splitted[0].split(".")[1]
                instructions['text'] = splitted[1]
                list_of_instructions.append(instructions)

        ingredients_list = feed['ingredients'].split("_")

        list_of_ingredients = []

        for ingredient in ingredients_list:
            ingredients = {}
            if len(ingredient) > 0:
                splitted = ingredient.split("[")
                ingredients['name'] = "".join(splitted[0].split())
                ingredients['unit'] = (splitted[1].split()[-1])[:-1]
                ingredients['quantity'] = "".join(splitted[1].split()[:-1])
                list_of_ingredients.append(ingredients)

        # get user object
        user = User.objects.filter(id=feed['user_id'])[0]
        # get user profile to extract location
        userprofile = UserProfile.objects.filter(user_id=feed['user_id'])[0]

        result = {
                'post_id': feed['post_id'],
                'recipe_name': feed['recipe_name'],
                'cuisine': feed['cuisine'], #new
                'time_required': feed['time_required'],
                'likes': feed['likes'],
                'user_id': feed['user_id'],
                'username': user.username, #new
                'location': userprofile.state, #new
                "image_url": feed["image_url"],
                "slug": feed["slug"],
                'instructions': list_of_instructions,
                'ingredients': list_of_ingredients,
                'created_at': feed['created_at'],
                'link_only': feed['link_only'],
            }

        formated_result.append(result)

    return formated_result
    

@api_view(['GET'])
def get_all_feeds(request):
    paginator = PageNumberPagination()
    paginator.page_size = 10
    feeds = Post.objects.filter(link_only=False)
    formated_feed = format_feed(feeds = PostSerializer(feeds, many=True).data)
    results = paginator.paginate_queryset(formated_feed, request)
    
    return paginator.get_paginated_response(results)

#new
#provides feed by filter(cuisine, location, time_required)
@api_view(['GET'])
def get_feeds_filter(request):
    cuisine = request.GET.get('cuisine')
    location = request.GET.get('location')
    time_required = request.GET.get('time_required')

    paginator = PageNumberPagination()
    paginator.page_size = 10
    feeds = Post.objects.filter(link_only=False)
    formated_feed = format_feed(feeds = PostSerializer(feeds, many=True).data)

    filtered_feed = filter_feed(formated_feed, {"cuisine":cuisine,"location":location,"time_required":time_required})
    results = paginator.paginate_queryset(filtered_feed, request)
    
    return paginator.get_paginated_response(results)

#new
def filter_feed( formated_feed, parameters):
    cuisine = parameters['cuisine']
    location = parameters['location']
    time_required = parameters['time_required']

    filtered_feed = []

    #filters by cuisine,location,time_required
    for post in formated_feed:
        if post['cuisine'].lower() == cuisine.lower() or cuisine.lower() == "all":
            if post['location'].lower() == location.lower() or location.lower()=="all":
                if time_required.lower()=="all":
                    filtered_feed.append(post)
                elif time_required == "MoreThanHour":
                    if int(post['time_required'].split()[0]) > 60:
                        filtered_feed.append(post)
                elif int(post['time_required'].split()[0]) <= int(time_required):
                    filtered_feed.append(post)

    return filtered_feed

@api_view(['POST'])
def like_post(request):
    user_id = get_userId(request.headers.get('Authorization'))
    post_id = request.data['post_id']
    post = Post.objects.filter(post_id = request.data['post_id']).first()
    # user = User.objects.filter(user_id = user_id).first()
    
    if Likes.objects.filter(post_id=post_id).filter(user_id=user_id).exists():
        return Response({
                'message': 'You have already liked this post'
            }, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    serializer = LikeSerializer(data = {'post_id':post.post_id, 'user_id':user_id})

    serializer.is_valid(raise_exception=True)
    try:
        serializer.save()
    except Exception as e:
        return Response({
            'message': e
        }, status=status.HTTP_400_BAD_REQUEST)
        
    try:
        Post.objects.filter(post_id=post_id).update(likes = calculate_likes(post_id))
    except Exception as e:
        return Response({'message': e}, status=status.HTTP_400_BAD_REQUEST)
        
    return Response(
        {
            'msg' : "liked successfully",
            'post_id' : post.post_id,
            'user_id' : user_id
        }
    )


@api_view(['POST'])
def unlike_post(request):
    user_id = get_userId(request.headers.get('Authorization'))

    post_id = request.data['post_id']
    post = Post.objects.filter(post_id = post_id).first()


    like = Likes.objects.filter(post_id = post.post_id, user_id = user_id).first()

    like.delete()
    
    try:
        Post.objects.filter(post_id=post_id).update(likes = calculate_likes(post_id))
    except Exception as e:
        return Response({'message': e}, status=status.HTTP_400_BAD_REQUEST)


    return Response(
        {
            'msg' : "like deleted",
            'post_id' : post.post_id,
            'user_id' : user_id
        }
    )


@api_view(['POST'])
def access_with_link(request):
    post_id = request.data['post_id']
    user_id = get_userId(request.headers.get('Authorization'))
    post = Post.objects.filter(post_id=post_id).first()

    if user_id == post.user_id:
        return Response({
            "msg" : "invalid token"
        }, 400)
        
    slug = post.slug
    try:
        Post.objects.filter(post_id=post_id).update(link_only=True)
        return Response({
            'status': 200,
            'message': 'Updated post successfully.',
            'url': f'localhost:8000/happy-tummy/user-posts?slug={slug}'
        })
    except Exception:
        return Response({
            # 'status': ,
            'message': "coudn't update"
        }, 400)


@api_view(['POST'])
def acess_to_all(request):
    post_id = request.data['post_id']
    user_id = get_userId(request.headers.get('Authorization'))
    post = Post.objects.filter(post_id=post_id).first()
    if user_id == post.user_id:
        return Response({
            "msg" : "invalid token"
        }, 400)
        
    try:
        Post.objects.filter(post_id=post_id).update(link_only=False)
        return Response({
            'status': 200,
            'message': 'Updated post successfully.'
        })
    except Exception:
        return Response({
            # 'status': ,
            'message': "couldn't update"
        }, 400)
        

@api_view(['GET'])
def get_post_by_user(request):
    token = request.headers.get('Authorization')
    user_id = get_userId(token)
    paginator = PageNumberPagination()
    paginator.page_size = 10
    try:
        posts = Post.objects.filter(user_id=user_id)
    except Exception as e:
        return Response({
            'message': e,
        }, 403)
    formated_feed = format_feed(feeds = PostSerializer(posts, many=True).data)
    results = paginator.paginate_queryset(formated_feed, request)
    
    return paginator.get_paginated_response(results)

#new
#gets user's post, takes user_id in request parameter
@api_view(['GET'])
def get_user_posts(request):
    user_id = request.query_params.get('user_id')
    # user_id = request.data['user_id']

    posts = Post.objects.filter(user_id_id=user_id, link_only=False)
    posts = format_feed(feeds = PostSerializer(posts, many=True).data)

    return Response(
        {
        'user_id': user_id,
        'total_posts': len(posts),
        'posts': posts
        }
    )


@api_view(['POST'])
def update_profile(request):
    user_id = get_userId(request.headers.get('Authorization'))
    data = request.data

    print(data)

    # user = User.objects.filter(id=user_id).update(
    #     first_name = data["first_name"],
    #     last_name = data['last_name']
    #     )
    user = User.objects.filter(id=user_id).first()
    user_profile = UserProfile.objects.filter(user_id=user_id).first()

    user.first_name = data["first_name"]
    user.last_name = data['last_name']
    user.save()

    user_profile.address = data['address']
    user_profile.phone_number = data['phone_number']
    user_profile.city = data['city']
    user_profile.state = data['state']
    user_profile.zipcode = data['zipcode']
    user_profile.save()

    return Response({
        "msg" : "profile updated",
        "user_id" : user_id,
        "profile_details" : data
    })


@api_view(['GET'])
def recipetable(request):
    data = RecipeTable.objects.all().values()

    # print(data)
    return Response({
        "msg" : "Recipe Table",
        "table" : data
    })


@api_view(['POST'])
def update_recipetable(request):
    data = request.data
    # print("UPDATE",data)
    rec_title=data["recipeName"]

    recipe_table = RecipeTable.objects.filter(recipeName=rec_title).first()

    # print("RT", recipe_table.count, recipe_table.count - 1)

    recipe_table.count = recipe_table.count - 1
    recipe_table.save()

    return Response({
            'status': 200,
            'message': 'Recipe count updated..'
        })