from django.contrib import admin
from .models import *

admin.site.register(Ingredient)
admin.site.register(Order)
admin.site.register(Item)
admin.site.register(Post)
admin.site.register(UserProfile)
admin.site.register(Likes)

admin.site.register(RecipeTable)

