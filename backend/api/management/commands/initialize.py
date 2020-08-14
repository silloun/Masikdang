from pathlib import Path
import pandas as pd
import numpy as np
from django.core.management.base import BaseCommand
from backend import settings
from api import models
import math


class Command(BaseCommand):
    help = "initialize database"
    DATA_DIR = Path(settings.BASE_DIR).parent / "data"
    DATA_FILE = str(DATA_DIR / "crawling2.pkl")

    def _load_dataframes(self):
        try:
            data = pd.read_pickle(Command.DATA_FILE)
        except:
            print(f"[-] Reading {Command.DATA_FILE} failed")
            exit(1)
        return data

    def _initialize(self):
        """
        Sub PJT 1에서 만든 Dataframe을 이용하여 DB를 초기화합니다.
        """
        print("[*] Loading data...")
        dataframes = self._load_dataframes()
        
        # store db 초기화
        # print("[*] Initializing stores...")
        # models.Store.objects.all().delete()
        # stores = dataframes["store"]
        # print(stores)
        #중복 제거
        # stores = stores.drop_duplicates(['store_name','latitude','longitude','tel'], keep='first')
        # store_id = stores['id']
        # print(stores)
        # stores_bulk = [
        #     models.Store(
        #         id=store.id,
        #         store_name=store.store_name,
        #         branch=store.branch,
        #         area=store.area,
        #         tel=store.tel,
        #         address=store.address,
        #         latitude=store.latitude,
        #         longitude=store.longitude,
        #         category=store.category_list,
        #         img=store.store_img,
        #     )
        #     for store in stores.itertuples()
        # ]
        # models.Store.objects.bulk_create(stores_bulk)

        # amenity db 초기화
        # print("[*] Initializing amenity...")
        # models.Amenity.objects.all().delete()
        # amenities = dataframes["amenity"]
        # amenities = amenities[amenities['store_id'].isin(store_id)]
        # print(amenities)
        # amenitys_bulk = [
        #     models.Amenity(
        #         store_id=amenity.store_id,
        #         amenity=amenity.amenity,
        #     )
        #     for amenity in amenities.itertuples()
        # ]
        # models.Amenity.objects.bulk_create(amenitys_bulk)

        # store tag db 초기화
        # print("[*] Initializing tag...")
        # models.Tag.objects.all().delete()
        # tags = dataframes["tag"]
        # print(tags)
        # tags_bulk = [
        #     models.Tag(
        #         store_id=tag.store_id,
        #         tag=tag.tag,
        #     )
        #     for tag in tags.itertuples()
        # ]
        # models.Tag.objects.bulk_create(tags_bulk)

        # review db 초기화
        # print("[*] Initializing review...")
        # models.Review.objects.all().delete()
        # reviews = dataframes["review"]
        # reviews = reviews[reviews['store_id'].isin(store_id)]
        # reviews = reviews.drop_duplicates(['content'],keep='first')

        # reviews = reviews.replace({'score':np.nan},{'score':None})
        # reviews['user_id'] = 1
        # review_id = reviews['id']
        # reviews_bulk = [
        #     models.Review(
        #         id=review.id,
        #         store_id=review.store_id,
        #         user_id=review.user_id,
        #         user_nickname=review.writer_name,
        #         total_score= review.score ,
        #         taste_score= review.taste ,
        #         price_score= review.price ,
        #         service_score=review.service,
        #         content=review.content,
        #         # reg_time=review.date,
        #         tag=review.tag_list,
        #     )
        #     for review in reviews.itertuples()
        # ]
        # models.Review.objects.bulk_create(reviews_bulk)

        # review_img db 초기화
        # print("[*] Initializing review_img...")
        # models.Review_img.objects.all().delete()
        # review_imgs = dataframes["review_img"]
        # review_imgs = review_imgs[review_imgs['review_id'].isin(review_id)]
        # print(review_imgs)
        # review_imgs_bulk = [
        #     models.Review_img(
        #         review_id=review_img.review_id,
        #         img=review_img.img,
        #     )
        #     for review_img in review_imgs.itertuples()
        # ]
        # models.Review_img.objects.bulk_create(review_imgs_bulk)

        # bhours db 초기화
        # print("[*] Initializing bhour...")
        # models.Bhour.objects.all().delete()
        # bhours = dataframes["bhour"]
        # bhours = bhours[bhours['store_id'].isin(store_id)]

        # bhours = bhours.fillna(0)
        # print(bhours)
        # bhours_bulk = []
        # bhours_bulk = [
        #     models.Bhour(
        #         store_id = bhour.store_id,
        #         type=bhour.type,
        #         week_type=bhour.type,
        #         mon=bhour.mon,
        #         tue=bhour.tue,
        #         wed=bhour.wed,
        #         thu=bhour.thu,
        #         fri=bhour.fri,
        #         sat=bhour.sat,
        #         sun=bhour.sun,
        #         start_time=bhour.start_time,
        #         end_time=bhour.end_time,
        #         etc=bhour.etc,
        #     )
        #     for bhour in bhours.itertuples()
        # ]
        # models.Bhour.objects.bulk_create(bhours_bulk)
        

        # menu db 초기화
        # print("[*] Initializing menu...")
        # models.Menu.objects.all().delete()
        # menues = dataframes["menu"]
        # menues = menues[menues['store_id'].isin(store_id)]
        # menues = menues.fillna(0)
        # print(menues)
        # menues_bulk = [
        #     models.Menu(
        #         store_id=menu.store_id,
        #         menu=menu.menu,
        #         price = menu.price
        #     )
        #     for menu in menues.itertuples()
        # ]
        # models.Menu.objects.bulk_create(menues_bulk)

        # print("[+] Done")

    def handle(self, *args, **kwargs):
        self._initialize()
