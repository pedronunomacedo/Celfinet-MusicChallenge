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
        default=None
    )
    creation_date = models.DateTimeField(null=True, blank=True, auto_now_add=True)
    image_url = models.CharField(max_length=600, default=f"https://{os.getenv('AWS_STORAGE_BUCKET_NAME', 'your-bucket-name')}.s3.amazonaws.com/default_images/default_camera_icon.png")
    name=models.CharField(max_length=100, default="default_camera_icon.png")
    
    def __str__(self):
        return f"Image(id={self.id}, creation_date={self.creation_date})"        
    
    # def save(self, *args, **kwargs):

    #     logger.info("SAVE1")
        
    #     if not self.creation_date:
    #         logger.info("SAVE2")
    #         pil_image = PilImage.open(self.image)
    #         logger.info("SAVE3")
    #         exif_data = pil_image._getexif()
    #         logger.info("SAVE4")
    #         if exif_data:
    #             logger.info("SAVE5")
    #             for tag, value in exif_data.items():
    #                 logger.info("SAVE6")
    #                 decoded = TAGS.get(tag, tag)
    #                 logger.info("SAVE7")
    #                 if decoded == 'DateTimeOriginal':
    #                     logger.info("SAVE8")
    #                     naive_datetime = datetime.strptime(value, '%Y:%m:%d %H:%M:%S')
    #                     logger.info("SAVE9")
    #                     self.creation_date = timezone.make_aware(naive_datetime)
    #                     logger.info("SAVE10")
    #                     break
                    
    #     # # Get the name of the file and extension, like image.png
    #     # original_filename = self.image.name
    #     # _, file_extension = original_filename.rsplit('.', 1)
        
    #     # # Generate a unique filename, like image_1234567890.png
    #     # unique_filename = f'{datetime.now().strftime("%Y%m%d%H%M%S")}_{self.pk}.{file_extension}'
        
    #     # # Rename the file to the unique filename
    #     # self.image.name = unique_filename
    #     # self.name = unique_filename
        
    #     self.image_url = f"https://{settings.AWS_STORAGE_BUCKET_NAME}.s3.{settings.AWS_S3_REGION_NAME}.amazonaws.com/{self.image.name}"
                    
    #     super().save(*args, **kwargs)

    #     logger.info("SAVE11")
    #     logger.info(f"Image {self.image.name} saved successfully!")
        
    # def save(self, *args, **kwargs):
    #     if not self.creation_date:
    #         pil_image = PilImage.open(self.image)
    #         exif_data = pil_image._getexif()
    #         if exif_data:
    #             for tag, value in exif_data.items():
    #                 decoded = TAGS.get(tag, tag)
    #                 if decoded == 'DateTimeOriginal':
    #                     naive_datetime = datetime.strptime(value, '%Y:%m:%d %H:%M:%S')
    #                     self.creation_date = timezone.make_aware(naive_datetime)
    #                     break
                
    #     # Get the name of the file and extension, like image.png
    #     original_filename = self.image.name
    #     _, file_extension = original_filename.rsplit('.', 1)
        
    #     # Generate a unique filename, like image_1234567890.png
    #     unique_filename = f'{datetime.now().strftime("%Y%m%d%H%M%S")}_{self.pk}.{file_extension}'
        
    #     self.image_url ='/media/post_images/' + unique_filename
                
    #     # Rename the file to the unique filename
    #     self.image.name = unique_filename
                
    #     # Call the parent save method to save the changes to the database
    #     super().save(*args, **kwargs)
        
    #     logger.info(f"Image {unique_filename} saved successfully!")
        
    #     # Update the image_url field
    #     if not self.image_url:  # To avoid redundant saves
    #         self.image_url = '/media/post_images/' + unique_filename
    #         super().save(update_fields=['image_url'])
    
    
    
import boto3
import logging
from django.conf import settings

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