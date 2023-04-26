# Generated by Django 4.1.3 on 2022-11-20 07:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('apis', '0013_post_salt'),
    ]

    operations = [
        migrations.RenameField(
            model_name='post',
            old_name='salt',
            new_name='slug',
        ),
        migrations.AddField(
            model_name='post',
            name='likes',
            field=models.IntegerField(default=0),
        ),
    ]
