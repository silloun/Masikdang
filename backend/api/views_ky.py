from .models import User, Store, Review, Review_img, Tag, Menu, Bhour, Amenity, Like_store
from .serializers import UserSerializer, StoreSerializer, ReviewSerializer, ReviewImgSerializer, TagSerializer, MenuSerializer, BhourSerializer
from django.http import Http404
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view

from django.db.models import Q
from django.db.models import Avg
from django.db.models import Subquery
from django.db.models import functions
from django.db.models import Count

from django.core.paginator import Paginator

from rest_framework.decorators import api_view


from api import models, serializers
from rest_framework import viewsets
from rest_framework.pagination import PageNumberPagination
from rest_framework.decorators import action

import json
import numbers
import math
import time
import random


# 음식 뭐먹을지 서베이 끝났을 때
@api_view(['GET', 'POST'])
def SurveySearch(request):
    if request.method == 'GET':
        print("==========================================")
        print("SurveySearch GET!!")
        survey = request.query_params.get("data", "")
        print(survey)

        food = dict()
        food[0] = ["훠거","마라탕","육개장","샤브샤브","탄탄면","파스타","닭도리탕"]
        food[1] =["김치찌개","부대찌개","라멘","탄탄면","만두","막국수","훠궈","마라탕","돈까스","카레"]
        food[2] =["불족발","닭발","꼬치","닭갈비","마라샹궈","등갈비","깐풍기","매운갈비찜","찜닭"]
        food[3] =["김치볶음밥","닭꼬치","라자냐","피자","돈까스","불족발","찜닭","꼬치","닭갈비","마라샹궈","등갈비","깐풍기","매운갈비찜"]
        food[4] =["감자탕","샤브샤브","치킨","뼈해장국","나베","샤브샤브","우육면","어묵","설렁탕"]
        food[5] =["백숙","불고기","갈비","만두국","설렁탕","순대국","해장국","쌀국수","라멘","우육면","갈비탕"]
        food[6] = ["육회","곱창","등갈비","삼겹살","대패삼겹살","막창","족발","보쌈","치킨","양꼬치","버거","순대","탕수육","양고기","슈바인학센","양갈비","갈비","어향가지","지삼선"]
        food[7] =["치킨","짜장면","만두","볶음밥","스테이크","오리고기","순대국","리조또","갈비","피자","샤오룽바오","돈까스","버거"]
        food[8] = ["해물탕","매운탕","알탕","갈치찜","고등어조림","라멘","떡볶이","짬뽕","비빔냉면","파스타","라면","커리","파스타"]
        food[9] = ["떡볶이","짬뽕","비빔냉면","커리","파스타","라면","해물탕","매운탕","알탕","갈치찜","고등어조림","라멘"]
        food[10] =   ["회덮밥","쭈꾸미","골뱅이소면","오삼불고기","아구찜","해물찜","깐쇼새우","타코야키"]
        food[11] =  ["돈까스","김치만두","비빔면","파스타","타코야끼","떡볶이","쫄면","깐쇼새우"]
        food[12] = ["조개탕","나베","감바스","연포탕","샤브샤브","미역국"]
        food[13] =  ["쌀국수","된장찌개","김치찌개","추어탕","돈까스","파스타","냉면","똠양꿍","우동","파스타"]
        food[14] =  ["연어","회","해물파전","모둠전","꽃새우","모둠전","삼합","참치","대하","교자","푸빳뽕커리","마파두부","연어숙회"]
        food[15] =  ["짜장면","월남쌈","순대","김밥","만두","오믈렛","타코야키","반비","잡채","간장새우",'팟타이',"파스타","샌드위치","샐러드","토스트","뇨끼","주먹밥","나시고랭","연어","회","버거"]
        index = int(survey, 2)
        return Response(random.sample(food[index], 5))



class StoreSearch(APIView):
    # Store 검색을 위한 클래스
    '''
    # Store 검색
    '''

    def get(self, request, word, format=None):
        print("==========================================")
        print("StoreSearch Total GET!")
        word = word.split(" ")
        
        used = set()
        tag_list = set()
        tag = Tag.objects.all()
        for w in word:
            for t in tag:
                if w in t.tag:
                    tag_list.add(t.store_id)
                    used.add(w)

        amenity_list = set()
        amenity = Amenity.objects.all()
        for w in word:
            for a in amenity:
                if w in a.amenity:
                    amenity_list.add(a.store_id)
                    used.add(w)

        tmp_list = list(tag_list | amenity_list)
        store1 = Store.objects.all().filter(id__in=tmp_list)

        for w in set(word) - set(used):
            store1 = store1.filter((
                Q(area__contains=w) | Q(address__contains=w)
                | Q(store_name__contains=w) | Q(category__contains=w)))

        store2 = Store.objects.all()
        for w in word:
            store2 = store2.filter((
                Q(area__contains=w) | Q(address__contains=w)
                | Q(store_name__contains=w) | Q(category__contains=w)))

        queryset = store1 | store2
        serializer = StoreSerializer(store1 | store2, many=True)
        return Response(serializer.data)


@api_view(['GET', 'POST'])
def SurveyType(request):
    if request.method == 'GET':
        print("get 시작")
        surveyArr = request.query_params.get("data", "")
        print(surveyArr)
        food_table = [["불고기", "간장게장", "닭볶음탕", "비빔밥", "잡채"],
                      ["스테이크", "감바스", "로스티드 터키", "시저샐러드", "햄버거"],
                      ["탕수육", "유산슬", "깐풍기", "어향가지", "잡탕밥"],
                      ["규카츠", "초밥", "오야꼬동", "야채고로케", "라멘"],
                      ["분짜", "푸팟뽕커리", "탄두리치킨", "월남쌈", "반미"],
                      ["순대", "어묵", "닭꼬치", "야채튀김", "김밥"],
                      ]

        adjective_table = ["레시피보고 만든", "엄마가 만들어 준", "둘이 먹다 셋이 죽는", "또 먹고 싶은",
                           "지옥에서 온", "눈물 젖은", "심혈을 기울여 만든", "죽기 전에 마지막으로 먹고 싶은",
                           "먹다 남긴", "줘도 안먹는", "실수로 소금을 쏟은", "까맣게 타버린",
                           "어쩌다 이렇게 된", "수줍게 선보인 나의", "혀 끝을 휘감는", "장인이 만든"]

        taste_table = ["쓴 맛 나는 ", "싱거운", "기름진", "촉촉한",
                       "짠", "달달한", "매콤한", "떫은",
                       "고소한", "새콤한", "칼칼한", "오묘한",
                       "맛없는", "맛있는", "눅눅한", "바삭한"]

        food = food_table[int(surveyArr[1])][int(surveyArr[4])]
        adjective = adjective_table[int(surveyArr[5:9], 2)]

        index = "" + str(format(int(surveyArr[0]), 'b')) + str(
            format(int(surveyArr[2]), 'b')) + str(format(int(surveyArr[3]), 'b'))
        index = int(index, 2)
        taste = taste_table[index]

        ret = [adjective, taste, food]
        print(ret)
        return Response(ret)


class LodationBased(APIView):
    # 강남역   127.02758, 37.49794

    def get(self, request, latitude, longitude, km, format=None):
        print("==========================================")
        print("Location Based Recommendation GET!")
        print("latitude: "+latitude+" longitude: " + longitude + ", km="+km)
        start = time.time()
        latitude = float(latitude)
        longitude = float(longitude)
        km = float(km)

        # print(type(latitude))
        # print(latitude)

        # print(type(longitude))
        # print(longitude)

        store = Store.objects.all()
        review_object = Review.objects.values(
            "store_id").annotate(dcount=Count('store_id')).order_by('-dcount').values_list('store_id', flat=True)
        store_list = [r for r in review_object]

        store = Store.objects.all().filter(id__in=store_list)
        # store = sorted(store, key=lambda s: store_list.index(s.id))

        ret = []
        for s in store.iterator():
            if s.longitude is None:
                continue
            if s.longitude == 0:
                continue
            if km >= GeoUtil.get_harversion_distance(
                    longitude, latitude, float(s.longitude), float(s.latitude)):
                ret.append(s)
        print("time :", time.time() - start)  # 현재시각 - 시작시간 = 실행 시간
        print(len(ret))

        num_store = len(ret)

        # 페이징 적용
        paginator = Paginator(ret, 15)
        num_page = paginator.num_pages
        page = request.GET.get('page')
        pagestore = paginator.get_page(page)
        serializer = StoreSerializer(pagestore, many=True)

        result = serializer.data
        user_id = request.GET.get('user_id')
        like = 0
        if user_id is not "":
            for r in result:
                like = Like_store.objects.filter(
                    store_id=r['id'], user_id=user_id).count()
                r['like'] = like
        else:
            for r in result:
                r['like'] = like

        return Response({
            'num_store': num_store,
            'num_page': num_page,
            'data': serializer.data
        })


class LodationBasedLikeList(APIView):
    def get(self, request, user_id, latitude, longitude, km, format=None):
        print("==========================================")
        print("Location Based Recommendation GET!")
        print("user_id:"+user_id+", latitude: "+latitude +
              " longitude: " + longitude + ", km="+km)
        latitude = float(latitude)
        longitude = float(longitude)
        km = float(km)
        store_object = Store.objects.extra(tables=['api_like_store'], where=[
            'api_store.id=api_like_store.store_id', "api_like_store.user_id="+user_id])

        store_list = [s.id for s in store_object]

        store = Store.objects.all().filter(id__in=store_list)
        ret = []
        for s in store:
            if s.longitude is None:
                continue
            if s.longitude == 0:
                continue
            print(s.longitude)
            if km >= GeoUtil.get_harversion_distance(
                    longitude, latitude, float(s.longitude), float(s.latitude)):
                ret.append(s)
        print(ret)
        print("==========================================")

        num_store = len(ret)

        # 페이징 적용
        paginator = Paginator(ret, 15)
        num_page = paginator.num_pages
        page = request.GET.get('page')
        pagestore = paginator.get_page(page)
        serializer = StoreSerializer(pagestore, many=True)

        result = serializer.data
        user_id = request.GET.get('user_id')
        like = 0
        if user_id is not "":
            for r in result:
                like = Like_store.objects.filter(
                    store_id=r['id'], user_id=user_id).count()
                r['like'] = like
        else:
            for r in result:
                r['like'] = like

        return Response({
            'num_store': num_store,
            'num_page': num_page,
            'data': serializer.data
        })


class GeoUtil:
    """
    Geographical Utils
    """

    @staticmethod
    def degree2radius(degree):
        return degree * (math.pi/180)

    # 실제 km를 반환
    @staticmethod
    def get_harversion_distance(x1, y1, x2, y2, round_decimal_digits=5):
        """
        경위도 (x1,y1)과 (x2,y2) 점의 거리를 반환
        Harversion Formula 이용하여 2개의 경위도간 거래를 구함(단위:Km)
        """
        if x1 is None or y1 is None or x2 is None or y2 is None:
            return None

        # print("x1="+str(x1)+", y1="+str(y1)+", x2="+str(x2)+", y2="+str(y2))
        # longitude(경도) 범위
        assert isinstance(x1, numbers.Number) and -180 <= x1 and x1 <= 180
        # latitude(위도) 범위
        assert isinstance(y1, numbers.Number) and -90 <= y1 and y1 <= 90
        assert isinstance(x2, numbers.Number) and -180 <= x2 and x2 <= 180
        assert isinstance(y2, numbers.Number) and -90 <= y2 and y2 <= 90

        R = 6371  # 지구의 반경(단위: km)
        dLon = GeoUtil.degree2radius(x2-x1)
        dLat = GeoUtil.degree2radius(y2-y1)

        a = math.sin(dLat/2) * math.sin(dLat/2) \
            + (math.cos(GeoUtil.degree2radius(y1))
               * math.cos(GeoUtil.degree2radius(y2))
               * math.sin(dLon/2) * math.sin(dLon/2))
        b = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
        return round(R * b, round_decimal_digits)
