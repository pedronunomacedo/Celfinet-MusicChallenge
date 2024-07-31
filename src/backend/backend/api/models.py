import os
import logging
from djongo import models
from PIL import Image as PilImage
from PIL.ExifTags import TAGS
from bson import ObjectId
from datetime import datetime
from django.utils import timezone
from dotenv import load_dotenv
import boto3
from django.conf import settings

# Load environment variables from .env file
load_dotenv()

# Create your models here.

# Configure logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

class Album(models.Model):
    title = models.CharField(max_length=100)
    creator = models.CharField(max_length=100)
    creation_date = models.DateField(auto_now_add=True)
    main_image = models.ImageField(
        upload_to='post_images',
        default='default_images/default_camera_icon.png'
    )
    
    
    def __str__(self):
        return self.title
    
def generate_object_id():
    return str(ObjectId())

class Image(models.Model):
    # id = models.ObjectIdField(primary_key=True, default=ObjectId, editable=False)
    id = models.CharField(max_length=24, primary_key=True, default=generate_object_id)
    image = models.ImageField(
        upload_to='post_images',
        blank=True,
        null=True
    )
    creation_date = models.DateTimeField(null=True, blank=True, auto_now_add=True)
    image_url = models.CharField(max_length=600, default=f"https://{os.getenv('AWS_STORAGE_BUCKET_NAME', 'your-bucket-name')}.s3.amazonaws.com/default_images/default_camera_icon.png")
    download_url = models.CharField(max_length=600, default=f"https://{os.getenv('AWS_STORAGE_BUCKET_NAME', 'your-bucket-name')}.s3.amazonaws.com/default_images/default_camera_icon.png")
    name=models.CharField(max_length=100, default="default_camera_icon.png")
    
    def __str__(self):
        return f"Image(id={self.id}, creation_date={self.creation_date})"        

# Configure logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

class AWSS3Service:
    def __init__(self):
        self.s3_client = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_S3_REGION_NAME
        )
        self.bucket_name = settings.AWS_STORAGE_BUCKET_NAME

    def list_s3_files(self):
        try:
            response = self.s3_client.list_objects_v2(Bucket=self.bucket_name)
            files = []
            if 'Contents' in response:
                for obj in response['Contents']:
                    files.append(obj['Key'])
            else:
                logger.info('No files found in the bucket.')
            return files
        except Exception as e:
            logger.error(f"Error listing files from S3: {e}")
            return None