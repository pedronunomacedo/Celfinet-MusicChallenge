# Generated by Django 4.1.13 on 2024-08-05 07:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='album',
            name='images',
            field=models.ManyToManyField(related_name='albums', to='api.image'),
        ),
    ]
