# Generated by Django 4.1.3 on 2023-03-09 16:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('apis', '0015_test_post_cuisine'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='status',
            field=models.CharField(default='order_placed', max_length=100),
        ),
    ]
