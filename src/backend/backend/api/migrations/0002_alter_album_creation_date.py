# Generated by Django 4.1.13 on 2024-07-26 22:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='album',
            name='creation_date',
            field=models.DateField(auto_now_add=True),
        ),
    ]
