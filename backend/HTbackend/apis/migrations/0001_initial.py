# Generated by Django 4.1.3 on 2022-11-13 19:42

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Item',
            fields=[
                ('item_id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=200)),
                ('stock', models.DecimalField(decimal_places=2, max_digits=7)),
                ('price', models.DecimalField(decimal_places=2, max_digits=7)),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('phone', models.CharField(max_length=13)),
                ('email', models.EmailField(max_length=254)),
                ('address', models.TextField()),
                ('zipcode', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Recipe',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('item_quantity', models.DecimalField(decimal_places=2, max_digits=7)),
                ('item_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='apis.item')),
            ],
        ),
        migrations.CreateModel(
            name='Order',
            fields=[
                ('order_id', models.AutoField(primary_key=True, serialize=False)),
                ('total_cost', models.DecimalField(decimal_places=2, max_digits=7)),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='apis.user')),
        
            ],
        ),
        migrations.CreateModel(
            name='Ingredient',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('item_quantity', models.DecimalField(decimal_places=2, max_digits=7)),
                ('item_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='apis.item')),
                ('order_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='apis.order')),
            ],
        ),
    ]
