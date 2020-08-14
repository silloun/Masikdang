from api import models, serializers
from rest_framework import viewsets
from rest_framework.pagination import PageNumberPagination
from rest_framework.decorators import action
from rest_framework.response import Response


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


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.UserSerializer

    def get_queryset(self):
        # name = self.request.query_params.get("name", "")
        queryset = models.User.objects.all().order_by("id")
        return queryset

    @action(detail=True, methods=['get'], url_path='test')
    def create_user(self, request, *args, **kwargs):
        serializer_class = serializers.UserSerializer
        queryset = models.User.objects.all().order_by("id")
        result = serializer_class(queryset, many=True)
        print(result.data)
        return Response(result.data)
