# Generated by Django 4.0.10 on 2023-07-20 08:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_nodes_user_userroute_userpref_library_userpref_park_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userpref',
            name='park',
            field=models.CharField(default=' ', max_length=30, verbose_name='Parks'),
            preserve_default=False,
        ),
    ]
