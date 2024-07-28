import os
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.views.decorators.csrf import csrf_exempt
from PIL import Image as PilImage
from PIL.ExifTags import TAGS
from datetime import datetime
from django.utils import timezone
from .models import Album
from .models import Image
from .serializers import AlbumSerializer, ImageSerializer

# Create your views here.

class AlbumViewSet(viewsets.ModelViewSet):
    queryset = Album.objects.all()
    serializer_class = AlbumSerializer
    # permission_classes = [permissions.IsAuthenticated]  # Restrict access to authenticated users (uncomment this to add authentication security privacy)
    permission_classes = [permissions.AllowAny] # Allow access to all users (comment this to add authentication security privacy)

    # To test this endpoint, use the link: /api/albums/create/
    @csrf_exempt # Uncomment this for testing (if comment, it should give the error CSRF verification failed)
    @action(detail=False, methods=['post'], url_path='create')
    def createAlbum(self, request, *args, **kwargs):
        # if not request.user.is_authenticated:
        #     return Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)

        serializer = AlbumSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ImageViewSet(viewsets.ModelViewSet):
    queryset = Image.objects.all().order_by('-creation_date')
    serializer_class = ImageSerializer
    # permission_classes = [permissions.IsAuthenticated]  # Restrict access to authenticated users (uncomment this to add authentication security privacy)
    permission_classes = [permissions.AllowAny] # Allow access to all users (comment this to add authentication security privacy)
    
    def extract_exif_data(self, image_file):
        pil_image = PilImage.open(image_file)
        exif_data = pil_image._getexif()
        creation_datetime = None
        if exif_data:
            for tag, value in exif_data.items():
                decoded = TAGS.get(tag, tag)
                if decoded == 'DateTimeOriginal':
                    creation_datetime = datetime.strptime(value, '%Y:%m:%d %H:%M:%S')
                    creation_datetime = timezone.make_aware(creation_datetime)  # Make datetime timezone-aware
                    break
        else:
            creation_datetime = datetime.now() # If the image does not have a datetime included, make the datetime the upload time (this is, the current time).
        return creation_datetime
    
    @csrf_exempt  # Uncomment this for testing (if comment, it should give the error CSRF verification failed)
    @action(detail=False, methods=['post'], url_path='upload')
    def uploadImage(self, request, *args, **kwargs):
        try:
            # if not request.user.is_authenticated:
            #     return Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)

            image_file = request.FILES.get('image')
            if not image_file:
                return Response({"detail": "No image file provided."}, status=status.HTTP_400_BAD_REQUEST)

            creation_datetime = self.extract_exif_data(image_file)
            
            if creation_datetime:
                image_instance = Image(image=image_file, creation_date=creation_datetime)
                image_instance.save()
                serializer = ImageSerializer(image_instance)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                image_instance = Image(image=image_file)
                image_instance.save()
                serializer = ImageSerializer(image_instance)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            # Log the exception (you might use logging module instead of print in production)
            print(f"An error occurred: {e}")
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    @csrf_exempt  # Uncomment this for testing (if comment, it should give the error CSRF verification failed)
    @action(detail=False, methods=['post'], url_path='delete')
    def deleteImage(self, request, *args, **kwargs):
        # Create this method that deletes an image
        try:
            # if not request.user.is_authenticated:
            #     return Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)

            image_id = request.data.get('image_id')
            if not image_id:
                return Response({"detail": "No image ID provided."}, status=status.HTTP_400_BAD_REQUEST)

            image_instance = Image.objects.get(pk=image_id)
            image_path = image_instance.image.path  # Assuming 'image' is the field name for the image file

            # Delete the image file from the folder
            if os.path.exists(image_path):
                os.remove(image_path)

            # Delete the image record from the database
            image_instance.delete()

            return Response({"detail": "Image deleted successfully."}, status=status.HTTP_200_OK)
        except Image.DoesNotExist:
            return Response({"detail": "Image not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            # Log the exception (you might use logging module instead of print in production)
            print(f"An error occurred: {e}")
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            