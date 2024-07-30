
import logging
import boto3
import uuid 
from io import BytesIO
from django.core.files.uploadedfile import InMemoryUploadedFile
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from .models import AWSS3Service, Image
from PIL import Image as PilImage
from PIL.ExifTags import TAGS
from datetime import datetime
from django.utils import timezone
from .serializers import ImageSerializer


# Configure logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

class AWSS3ViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny] # Allow access to all users (comment this to add authentication security privacy)
    
    @csrf_exempt  # Uncomment this for testing (if comment, it should give the error CSRF verification failed)
    @action(detail=False, methods=['get'], url_path='files')
    def listAWSFiles(self, request, *args, **kwargs):
        s3_service = AWSS3Service()
        s3_service.list_s3_files()
        return Response({"detail": "Files listed in the console"}, status=status.HTTP_200_OK)
    
    @csrf_exempt
    @action(detail=False, methods=['post'], url_path='upload')
    def uploadAWSFile(self, request, *args, **kwargs):
        image_file = request.FILES.get('image')
        if not image_file:
            return Response({"detail": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)
                
        if not hasattr(image_file, 'name') or not image_file.name:
            return Response({"detail": "File name is missing"}, status=status.HTTP_400_BAD_REQUEST)
        
        s3 = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_S3_REGION_NAME
        )

        bucket_name = settings.AWS_STORAGE_BUCKET_NAME
        
        try:
            creation_datetime = self.extract_exif_data(image_file)
            unique_filename = f"{uuid.uuid4()}_{image_file.name}"
            image_url = f"https://{bucket_name}.s3.{settings.AWS_S3_REGION_NAME}.amazonaws.com/{unique_filename}"

            s3.upload_fileobj(
                image_file.file,
                bucket_name,
                unique_filename,
                ExtraArgs={
                    'ACL': 'public-read',
                    'ContentType': image_file.content_type
                }
            )
                        
            object_data = {
                'image_url': image_url,
                'name': unique_filename
            }

            if creation_datetime:
                object_data['creation_date'] = creation_datetime

            serializer = ImageSerializer(data=object_data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            logger.error(f"Error uploading file: {e}")
            return Response({"detail": "Error uploading file"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def extract_exif_data(self, image_file):
        try:
            pil_image = PilImage.open(image_file)
            exif_data = pil_image._getexif()
            if exif_data:
                for tag, value in exif_data.items():
                    decoded = TAGS.get(tag, tag)
                    if decoded == 'DateTimeOriginal':
                        naive_datetime = datetime.strptime(value, '%Y:%m:%d %H:%M:%S')
                        return timezone.make_aware(naive_datetime)
        except Exception as e:
            logger.error(f"Error extracting EXIF data: {e}")
        return None