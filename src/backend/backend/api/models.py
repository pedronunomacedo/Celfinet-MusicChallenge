import logging
from djongo import models
from PIL import Image as PilImage
from PIL.ExifTags import TAGS
from bson import ObjectId
from datetime import datetime
from django.utils import timezone

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
    
class Image(models.Model):
    # id = models.ObjectIdField(primary_key=True, default=ObjectId, editable=False)
    id = models.CharField(max_length=24, primary_key=True, default=lambda: str(ObjectId()))
    image = models.ImageField(
        upload_to='post_images'
    )
    creation_date = models.DateTimeField(null=True, blank=True, auto_now_add=True)
    image_url = models.CharField(max_length=600, default='/default_images/default_camera_icon.png')
    
    def __str__(self):
        return f"Image(id={self.id}, creation_date={self.creation_date})"
    
    def save(self, *args, **kwargs):
        if not self.creation_date:
            pil_image = PilImage.open(self.image)
            exif_data = pil_image._getexif()
            if exif_data:
                for tag, value in exif_data.items():
                    decoded = TAGS.get(tag, tag)
                    if decoded == 'DateTimeOriginal':
                        naive_datetime = datetime.strptime(value, '%Y:%m:%d %H:%M:%S')
                        self.creation_date = timezone.make_aware(naive_datetime)
                        break
                
        # Get the name of the file and extension, like image.png
        original_filename = self.image.name
        _, file_extension = original_filename.rsplit('.', 1)
        
        # Generate a unique filename, like image_1234567890.png
        unique_filename = f'{datetime.now().strftime("%Y%m%d%H%M%S")}_{self.pk}.{file_extension}'
        
        self.image_url ='/media/post_images/' + unique_filename
                
        # Rename the file to the unique filename
        self.image.name = unique_filename
                
        # Call the parent save method to save the changes to the database
        super().save(*args, **kwargs)
        
        logger.Info(f"Image {unique_filename} saved successfully!")
        
        # Update the image_url field
        if not self.image_url:  # To avoid redundant saves
            self.image_url = '/media/post_images/' + unique_filename
            super().save(update_fields=['image_url'])