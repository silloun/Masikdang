# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey has `on_delete` set to the desired behavior.
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models

class Store(models.Model):
    id = models.IntegerField(primary_key=True)
    store_name = models.CharField(max_length=50)
    branch = models.CharField(max_length=50, blank=True, null=True)
    area = models.CharField(max_length=50, blank=True, null=True)
    tel = models.CharField(max_length=20, blank=True, null=True)
    address = models.CharField(max_length=200, blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    category = models.CharField(max_length=200, blank=True, null=True)
    amentity = models.CharField(max_length=100, blank=True, null=True)
    total_score = models.FloatField(blank=True, null=True)
    taste_score = models.FloatField(blank=True, null=True)
    price_score = models.FloatField(blank=True, null=True)
    service_score = models.FloatField(blank=True, null=True)
    purpose = models.CharField(max_length=45, blank=True, null=True)
    mood = models.CharField(max_length=45, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'api_store'


class Bhour(models.Model):
    id = models.AutoField(primary_key=True)
    store_id = models.ForeignKey('Store', on_delete=models.CASCADE)
    type = models.IntegerField(blank=True, null=True)
    week_type = models.IntegerField(blank=True, null=True)
    mon = models.IntegerField(blank=True, null=True)
    tue = models.IntegerField(blank=True, null=True)
    wed = models.IntegerField(blank=True, null=True)
    thu = models.IntegerField(blank=True, null=True)
    fri = models.IntegerField(blank=True, null=True)
    sat = models.IntegerField(blank=True, null=True)
    sun = models.IntegerField(blank=True, null=True)
    start_time = models.TimeField(blank=True, null=True)
    end_time = models.TimeField(blank=True, null=True)
    etc = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'api_bhour'


class Favorite(models.Model):
    id = models.AutoField(primary_key=True)
    store_id = models.ForeignKey('Store', on_delete=models.CASCADE)
    user = models.ForeignKey('User', on_delete=models.CASCADE)

    class Meta:
        managed = False
        db_table = 'api_favorite'


class Like(models.Model):
    id = models.AutoField(primary_key=True)
    store_id = models.ForeignKey('Store', on_delete=models.CASCADE)
    user = models.ForeignKey('User', on_delete=models.CASCADE)

    class Meta:
        managed = False
        db_table = 'api_like'


class Menu(models.Model):
    id = models.AutoField(primary_key=True)
    store_id = models.ForeignKey('Store', on_delete=models.CASCADE)
    menu = models.CharField(max_length=45, blank=True, null=True)
    price = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'api_menu'


class Review(models.Model):
    id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey('User', on_delete=models.CASCADE)
    store_id = models.ForeignKey('Store', on_delete=models.CASCADE)
    total_score = models.FloatField(blank=True, null=True)
    taste_score = models.FloatField(blank=True, null=True)
    price_score = models.FloatField(blank=True, null=True)
    service_score = models.FloatField(blank=True, null=True)
    content = models.CharField(max_length=500, blank=True, null=True)
    img = models.CharField(max_length=500, blank=True, null=True)
    tag = models.CharField(max_length=45, blank=True, null=True)
    reg_time = models.CharField(max_length=40, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'api_review'

class Tag(models.Model):
    id = models.AutoField(primary_key=True)
    store_id = models.ForeignKey('Store', on_delete=models.CASCADE)
    tag = models.CharField(max_length=45, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'api_tag'


class User(models.Model):
    id = models.AutoField(primary_key=True)
    provider = models.CharField(max_length=20, blank=True, null=True)
    api_id = models.CharField(unique=True, max_length=30, blank=True, null=True)
    nickname = models.CharField(unique=True, max_length=20)
    age = models.IntegerField(blank=True, null=True)
    gender = models.CharField(max_length=10, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'api_user'
