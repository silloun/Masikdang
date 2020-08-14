from .models import Store,User,Review,Review_img, Tag, Menu, Bhour, Like_store, Profile_img
from rest_framework import serializers


class StoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields='__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'

class ReviewImgSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review_img
        fields = '__all__'

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'

class MenuSerializer(serializers.ModelSerializer):
    class Meta:
        model = Menu
        fields = '__all__'

class BhourSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bhour
        fields = '__all__'

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like_store
        fields = '__all__'

class Profile_imgSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like_store
        fields = '__all__'