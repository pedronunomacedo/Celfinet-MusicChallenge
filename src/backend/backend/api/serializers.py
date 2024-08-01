from rest_framework import serializers
from .models import Album, Image, Tag
from bson import ObjectId

class AlbumSerializer(serializers.ModelSerializer):
    class Meta:
        model = Album
        fields = '__all__'
        
class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'

class ImageSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True)  # Display tags in the image serializer
    
    class Meta:
        model = Image
        fields = '__all__'
        
    def create(self, validated_data):
        tags_data = validated_data.pop('tags', [])
        image_instance = Image.objects.create(**validated_data)
        
        for tag_name in tags_data:
            tag, created = Tag.objects.get_or_create(name=tag_name)
            image_instance.tags.add(tag)
        
        return image_instance
    
        

class ObjectIdField(serializers.Field):
    def to_representation(self, value):
        return str(value)

    def to_internal_value(self, data):
        return ObjectId(data)
    
class FileUploadSerializer(serializers.Serializer):
    file = serializers.FileField()

    def create(self, validated_data):
        # Implement your file save logic here
        return validated_data