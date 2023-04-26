from django.db import models
from django.conf import settings
from django.contrib.auth.models import User


class UserProfile(models.Model):
    def __str__(self):
        return self.phone_number

    user_id = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=50)
    address = models.CharField(max_length=300)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zipcode = models.CharField(max_length=100)
    
class Item(models.Model):

    def __str__(self):
        return self.name

    item_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length = 200, unique=True)
    unit = models.CharField(max_length = 100)
    price = models.DecimalField(max_digits=7, decimal_places=2, default=25)

class Order(models.Model):
    
    def __str__(self):
        return str(self.order_id)
    
    order_id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    total_cost = models.DecimalField(max_digits=7, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=100, default="order_placed")

class Ingredient(models.Model):
    order_id = models.ForeignKey("Order", related_name="orderID", on_delete=models.CASCADE)
    item_id = models.ForeignKey("Item", related_name="itemID", on_delete=models.CASCADE)
    item_quantity = models.DecimalField(max_digits=7, decimal_places=2)


class Post(models.Model):
    
    def __str__(self):
        return self.recipe_name
    
    post_id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    image_url = models.TextField()
    slug = models.CharField(max_length=200)
    likes = models.IntegerField(default=0)
    link_only = models.BooleanField(default=False)
    cuisine = models.CharField(max_length=200, default="Italian")
    recipe_name = models.CharField(max_length=500)
    time_required = models.CharField(max_length=200)
    instructions = models.TextField()
    ingredients = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class Likes(models.Model):
    post_id = models.ForeignKey("Post", related_name="postID", on_delete=models.CASCADE)
    user_id = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="userID", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)


#TEST
class Test(models.Model):
    test_id = models.AutoField(primary_key=True)
    test_quantity = models.DecimalField(decimal_places=2, max_digits=7)


class RecipeTable(models.Model):
    recipeName = models.CharField(max_length=255)
    count = models.IntegerField()