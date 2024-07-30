from django.urls import path, include
from .views import AlbumViewSet, ImageViewSet
from .aws_view_files import AWSS3ViewSet
from rest_framework.routers import DefaultRouter

# Create a router and register your viewset with it
router = DefaultRouter()
router.register(r'albums', AlbumViewSet, basename='album')
router.register(r'images', ImageViewSet, basename='image')
router.register(r'aws-files', AWSS3ViewSet, basename='aws-files')

# Define additional URL patterns
urlpatterns = [
    path('', include(router.urls)),  # This includes all default routes provided by the router
    # path('albums/create/', AlbumViewSet.as_view({'post': 'createAlbum'}), name='album-create'),
]