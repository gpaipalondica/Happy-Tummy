# Generated by Django 4.1.5 on 2023-04-20 18:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('apis', '0016_order_status'),
    ]

    operations = [
        migrations.CreateModel(
            name='RecipeTable',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('recipeName', models.CharField(max_length=255)),
                ('count', models.IntegerField()),
            ],
        ),
    ]
