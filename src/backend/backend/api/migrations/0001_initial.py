# Generated by Django 4.1.13 on 2024-07-26 21:15

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Album',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100)),
                ('creator', models.CharField(max_length=100)),
                ('creation_date', models.DateField()),
            ],
        ),
    ]
