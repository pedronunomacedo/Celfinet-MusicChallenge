from django.db import models
from PIL import Image as PilImage
from PIL.ExifTags import TAGS
from datetime import datetime

# Create your models here.

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
    # album = models.ForeignKey(Album, on_delete=models.CASCADE)
    image = models.ImageField(
        upload_to='post_images'
    )
    creation_date = models.DateTimeField(null=True, blank=True, default=datetime.now())
    image_url = models.CharField(max_length=600, default='/default_images/default_camera_icon.png')
    
    def __str__(self):
        return self.description
    
    def save(self, *args, **kwargs):
        if not self.creation_date:
            pil_image = PilImage.open(self.image)
            exif_data = pil_image._getexif()
            if exif_data:
                for tag, value in exif_data.items():
                    decoded = TAGS.get(tag, tag)
                    if decoded == 'DateTimeOriginal':
                        self.creation_date = datetime.strptime(value, '%Y:%m:%d %H:%M:%S').date()
                        break
        
        # Get the name of the file and extension, like image.png
        original_filename = self.image.name
        _, file_extension = original_filename.rsplit('.', 1)
        
        # Generate a unique filename, like image_1234567890.png
        unique_filename = f'{datetime.now().strftime("%Y%m%d%H%M%S")}_{self.pk}.{file_extension}'
        
        # Rename the file to the unique filename
        self.image.name = unique_filename
        
        # Call the parent save method to save the changes to the database
        # This will also generate the correct URL for the image
        super().save(*args, **kwargs)
        self.image_url = '/media/post_images/' + unique_filename
        super().save(*args, **kwargs)