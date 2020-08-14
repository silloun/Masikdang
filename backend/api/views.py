from .models import User, Store, Review, Review_img, Tag, Menu, Bhour, Image_upload, Like_store, Amenity, Profile_img
from .serializers import UserSerializer, StoreSerializer, ReviewSerializer, ReviewImgSerializer, TagSerializer, MenuSerializer, BhourSerializer, LikeSerializer, Profile_imgSerializer
from django.http import Http404
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view

from django.db.models import Q
from django.db.models import Avg
from django.db.models import Subquery
from django.db.models import functions

from rest_framework.decorators import api_view


from api import models, serializers
from rest_framework import viewsets
from rest_framework.pagination import PageNumberPagination
from rest_framework.decorators import action

from .forms import ImageForm
from backend import settings
from django.core.paginator import Paginator


class SmallPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 50


class StoreViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.StoreSerializer
    pagination_class = SmallPagination

    def get_queryset(self):
        name = self.request.query_params.get("name", "")
        queryset = (
            models.Store.objects.all().filter(store_name__contains=name).order_by("id")
        )
        return queryset

# Store


class StoreList(APIView):
    # Store list 생성
    def post(self, request, format=None):
        '''
        # Store List 생성
        '''
        serializer = StoreSerializer(data=request.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    # Store list 조회

    def get(self, request, format=None):
        '''
        # Store List 조회
        '''
        queryset = Store.objects.all()

        paginator = Paginator(queryset, 10)
        page = request.GET.get('page')
        pagestore = paginator.get_page(page)

        serializer = StoreSerializer(pagestore, many=True)

        return Response(serializer.data)


class StorePost(APIView):
    # Store 생성
    def post(self, request, format=None):
        '''
        # Store 생성
        # parameter
            body{
                store_name : String(50),
                branch : String(50),
                area : String(50),
                tel : String(50),
                address : String(200),
                latitude : Float(10),
                longitude : Float(10),
                category : String(200)
            }
        '''
        serializer = StoreSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class StoreDetail(APIView):
    # 특정 Store 를 다루는 클래스

    # Store 조회
    def get(self, request, store_id, format=None):
        '''
        # Store 조회
        '''
        store = Store.objects.get(id=store_id)
        serializer = StoreSerializer(store)

        # 메뉴, 태그, 업무시간, 평점, 사진, 좋아요
        result = serializer.data
        menu = MenuSerializer(Menu.objects.filter(
            store_id=store_id), many=True).data
        result['menu'] = menu

        average = Review.objects.filter(store_id=store_id).aggregate(
            Avg('total_score'))['total_score__avg']
        result['avg_score'] = average

        tags = Tag.objects.filter(
            store_id=store_id).values_list('tag', flat=True)
        result['tags'] = tags

        bhour = BhourSerializer(Bhour.objects.filter(
            store_id=store_id), many=True).data
        result['bhour'] = bhour

        review_imgs = Review_img.objects.filter(
            review_id__store_id=store_id).values_list('img', flat=True)[:10]
        result['review_img'] = review_imgs

        user_id = request.GET.get('user_id')
        like = 0
        if user_id is not "":
            like = Like_store.objects.filter(
                store_id=store_id, user_id=user_id).count()

        result['like'] = like
        return Response(result)

    # Store 삭제
    def delete(self, request, store_id, format=None):
        '''
        # Store 삭제
        '''
        store = Store.objects.get(id=store_id)
        store.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class StoreSearch(APIView):
    # Store 검색을 위한 클래스
    '''
    # Store 검색
    '''

    def get(self, request, subject, word, format=None):

        if subject == "name":
            queryset = Store.objects.filter(
                store_name__contains=word).order_by('id')
        elif subject == "area":
            queryset = Store.objects.filter(
                Q(area__contains=word) | Q(address__contains=word)).order_by('id')
        elif subject == "category":
            queryset = Store.objects.filter(
                category__contains=word).order_by('id')
        elif subject == "total":
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

            menu_list = set()
            for w in word:
                menu = Menu.objects.all().filter(menu__contains=w).only('store_id').values_list('store_id')
                menu_list = menu_list | set(menu)
            store3 = Store.objects.all().filter(id__in=menu)

            for w in word:
                if store3.filter((Q(area__contains=w) | Q(address__contains=w))).exists():
                    store3 = store3.filter((Q(area__contains=w) | Q(address__contains=w)))           

            queryset = store1 | store2  | store3

        num_store = queryset.__len__()

        # 페이징 적용
        paginator = Paginator(queryset, 20)
        num_page = paginator.num_pages
        page = request.GET.get('page')
        pagestore = paginator.get_page(page)
        serializer = StoreSerializer(pagestore, many=True)

        result = serializer.data

        # 평균
        for r in result :
            store_id = r['id']
            average = Review.objects.filter(store_id=store_id).aggregate(
            Avg('total_score'))['total_score__avg']
            if average is None :
                average = 0
            r['avg_score'] = round(average,1)

        # 좋아요 여부
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


class UserList(APIView):
    # User List 를 다루는 클래스
    # list 조회
    def get(self, request, format=None):
        queryset = User.objects.all()
        serializer = UserSerializer(queryset, many=True)
        return Response(serializer.data)


class UserPost(APIView):
    # User 생성
    '''
    # User 생성
    # parameter
        body{
            provider : String(20),
            api_id : String(30),
            nickname : String(20),
            age : int(11),
            gender : String(5),
            survey_array : String(30),
            survey_result : String(30),
        }
    '''

    def post(self, request, format=None):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserDetail(APIView):
    # 특정 User 를 다루는 클래스
    # User 조회
    def get(self, request, api_id, format=None):
        '''
        # 유저 조회
        '''
        user = User.objects.get(api_id=api_id)
        user_id = user.id
        serializer = UserSerializer(user)
        result = serializer.data
        is_exist = Profile_img.objects.filter(user_id = user_id).count()
        
        img = None
        if is_exist >= 1 :
            print(is_exist)
            profile_img = Profile_img.objects.get(user_id = user_id)
            img = profile_img.img
            
        result['img'] = img
            
        return Response(result)

    # User 삭제
    def delete(self, request, api_id, format=None):
        '''
        # 유저 삭제
        '''
        user_del = User.objects.get(api_id=api_id)
        user_del.delete()
        return Response("delete", status=status.HTTP_204_NO_CONTENT)

    # User 수정
    def put(self, request, api_id, format=None):
        '''
        # 유저 수정
        '''
        user_modify = User.objects.get(api_id=api_id)
        serializer = UserSerializer(user_modify, data=request.data)
        if serializer.is_valid():
            
            user_id = user_modify.id
            is_exist = Profile_img.objects.filter(user_id = user_id).count()
            img = None
            if is_exist >= 1 :
                profile_img = Profile_img.objects.get(user_id = user_id)
                img = profile_img.img


            serializer.save()
            result = serializer.data
            result['img'] = img
            return Response(result)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserJoinCheck(APIView):
    # User 회원가입 여부를 확인하는 클래스
    '''
    # 가입 여부 확인
    '''

    def get(self, request, provider, api_id, format=None):
        is_exist = User.objects.filter(
            api_id=api_id, provider=provider).count()

        if is_exist == 0:
            return Response('NO')
        else:
            return Response('YES')


class NickDuplicateCheck(APIView):
    # User nickname 중복 여부를 확인하는 클래스
    '''
    # 닉네임 중복 확인
    '''

    def get(self, request, nickname, format=None):
        is_exist = User.objects.filter(nickname=nickname).count()
        if is_exist == 0:
            return Response('NO')
        else:
            return Response('YES')


# Review
# Review 생성
class ReviewPost(APIView):
    '''
    # Review 생성
    # parameter
        body{
            store : Int(11),
            user : Int(11),
            user_nickname : String(30),
            total_score : Double,
            taste_score : Double,
            service_score : Double,
            price_score : Double,
            content : String(3000),
            tag : String(500)
            reg_time : varchar(50)
        }
    '''

    def post(self, request, format=None):
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Review 가게별 조회


class ReviewList(APIView):
    
    def get(self, request, store_id, format=None):
        '''
        # 가게별 리뷰 조회
        '''
        queryset = Review.objects.filter(
            store_id=store_id).order_by('id').reverse()
        num_review = queryset.__len__()

        # 페이징 적용
        paginator = Paginator(queryset, 5)
        num_page = paginator.num_pages
        page = request.GET.get('page')
        pagestore = paginator.get_page(page)
        serializer = ReviewSerializer(pagestore, many=True)
        result = serializer.data

        # 리뷰 별 사진
        for r in result:
            review_imgs = Review_img.objects.filter(
                review_id=r['id']).values_list('img', flat=True)
            r['imgs'] = review_imgs

        return Response({
            'num_page': num_page,
            'num_review': num_review,
            'data': result
        })

# 특정 Review 를 다루는 클래스


class ReviewDetail(APIView):
    # Review 삭제
    def delete(self, request, review_id, format=None):
        '''
        # 리뷰 삭제
        '''
        review_del = Review.objects.get(id=review_id)
        review_del.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    # Review 수정
    def put(self, request, review_id, format=None):
        '''
        # 리뷰 수정
        '''
        review_modify = Review.objects.get(id=review_id)
        serializer = ReviewSerializer(review_modify, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# 특정 User Review 조회


class ReviewByUser(APIView):
    '''
    # 유저 리뷰 조회
    '''
    # Store 검색을 위한 클래스

    def get(self, request, user_id, format=None):
        reviews_by_user = Review.objects.filter(
            user_id=user_id).order_by('id').reverse()
        serializer = ReviewSerializer(reviews_by_user, many=True)
        review = serializer.data
        # print(review)

        for r in review:
            print(r['store'])
            store_name = Store.objects.get(id=r['store']).store_name
            r['store_name'] = store_name
        return Response(serializer.data)

# 가게 리뷰 사진 조회


class ReviewImgList(APIView):
    '''
    # 가게 리뷰 사진 조회
    '''

    def get(self, request, review_id, format=None):
        reivew_imgs_by_store = Review_img.objects.filter(review_id=review_id)
        serializer = ReviewImgSerializer(reivew_imgs_by_store, many=True)
        return Response(serializer.data)


# 파일 업로드
@api_view(['POST'])
def upload_image_review(request, review_id):
    '''
    # 리뷰 사진 업로드
    '''
    if request.method == 'POST':
        form = ImageForm(request.POST, request.FILES)
        if form.is_valid():
            newImg_list = request.FILES.getlist('path')
            print(newImg_list[0])
            
            for newImg in newImg_list:
                # img 저장
                img = Image_upload(path=newImg)
                img.save()
                # review_img 저장
                img_url = settings.MEDIA_HOST+str(img.path)
                review_img = Review_img(img=img_url, review_id=review_id)
                review_img.save()

            #음식점 img 추가
            review = Review.objects.get(id=review_id)
            store_id = review.store_id
            store = Store.objects.get(id=store_id)
            if store.img is None :
                store.img = img_url
                store.save()
            return Response("upload ok")

        else:
            form = ImageForm()
            return Response("upload fail")

# 가게 좋아요


class Store_like(APIView):
    def get(self, request, store_id, user_id, format=None):
        is_like = Like_store.objects.filter(
            store_id=store_id, user_id=user_id).count()

        if is_like >= 1:
            like_del = Like_store.objects.get(
                store_id=store_id, user_id=user_id)
            like_del.delete()
            return Response("dislike")
        else:
            like = Like_store(store_id=store_id, user_id=user_id)
            like.save()
            return Response("like")


class Like_by_user(APIView):
    '''
    # 좋아요 음식점 리스트
    '''

    def get(self, request, user_id, format=None):
        store_liked = StoreSerializer(Store.objects.extra(tables=['api_like_store'], where=[
                                      'api_store.id=api_like_store.store_id', "api_like_store.user_id="+user_id], order_by=['api_like_store.like_time']).reverse(), many=True)
        return Response(store_liked.data)


# 파일 업로드
@api_view(['POST'])
def upload_image_profile(request, user_id):
    '''
    # 리뷰 사진 업로드
    '''
    if request.method == 'POST':
        form = ImageForm(request.POST, request.FILES)
        if form.is_valid():
            newImg = request.FILES.get('path')
            # img 저장
            img = Image_upload(path=newImg)
            img.save()

            # profile_img 저장
            img_url = settings.MEDIA_HOST+str(img.path)
            is_exist = Profile_img.objects.filter(user_id=user_id).count()


            if is_exist >= 1 : 
                modify = Profile_img.objects.get(user_id = user_id)
                modify.img = img_url
                modify.save()
            else :
                profile_img = Profile_img(img = img_url, user_id = user_id)
                profile_img.save()
                
            return Response({
                "img": img_url
            })
        else:
            form = ImageForm()
            return Response("upload fail")