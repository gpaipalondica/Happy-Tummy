from django.contrib.auth.models import User
from rest_framework import serializers

from .models import *


# User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta: 
        model = User
        fields = ('id', 'username', 'email')

# Register Serializer
class RegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type':'password'}, write_only=True)
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'first_name', 'last_name', 'password2')
        extra_kwargs = {'password': {'write_only': True}}

    def save(self):
        user = User(
            username = self.validated_data['username'],
            email = self.validated_data['email'],
            first_name = self.validated_data['first_name'],
            last_name = self.validated_data['last_name'],
            # password = self.validated_data['password']
        )

        password = self.validated_data['password']
        password2 = self.validated_data['password']

        if password != password2:
            raise serializers.ValidationError({"password must match"})
        user.set_password(password)
        user.save()

        return user


    def create(self, validated_data):
        return User.objects.create_user(validated_data['username'], validated_data['email'], validated_data['password'])

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'

    def save(self):
        return UserProfile.objects.create(user_id=self.validated_data['user_id'], address=self.validated_data['address'], city=self.validated_data['city'], state=self.validated_data['state'], zipcode=self.validated_data['zipcode'], phone_number=self.validated_data['phone_number'],)
class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'
        extra_kwargs = {
            'name': {'required': True, 'allow_null': False},
        }



class userSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        extra_kwargs = {
            "password" : {"write_only":True}
        }

    def save(self):
        user = User(
                email = self.validated_data['email'],
                zipcode = self.validated_data['zipcode']
                )
        # password = self.validated_data['password']
        # user.set_password(password)
        user.save()

        return user

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'
        
class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Likes
        fields = '__all__'

