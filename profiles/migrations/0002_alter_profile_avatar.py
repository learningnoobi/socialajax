# Generated by Django 3.2 on 2021-04-21 05:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('profiles', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='avatar',
            field=models.ImageField(default='zenitsu.jpg', upload_to='avatars'),
        ),
    ]