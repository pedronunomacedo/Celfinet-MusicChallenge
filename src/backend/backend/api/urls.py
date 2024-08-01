from django.urls import path, include
from .views import AlbumViewSet, ImageViewSet, TagViewSet
from .aws_view_files import AWSS3ViewSet
from .spotify_view import SpotifyViewSet
from rest_framework.routers import DefaultRouter

# Create a router and register your viewset with it
router = DefaultRouter()
router.register(r'albums', AlbumViewSet, basename='album')
router.register(r'images', ImageViewSet, basename='image')
router.register(r'tags', TagViewSet, basename='tags')
router.register(r'aws-files', AWSS3ViewSet, basename='aws-files')
router.register(r'spotify-api', SpotifyViewSet, basename='spotify-api')

# Define additional URL patterns
urlpatterns = [
    path('', include(router.urls)),  # This includes all default routes provided by the router
    # path('albums/create/', AlbumViewSet.as_view({'post': 'createAlbum'}), name='album-create'),
]