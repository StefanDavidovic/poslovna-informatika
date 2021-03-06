# Generated by Django 4.0 on 2022-01-18 20:15

from django.db import migrations
import ool


class Migration(migrations.Migration):

    dependencies = [
        ('likvidatura', '0012_izlaznafaktura_partner'),
    ]

    operations = [
        migrations.AddField(
            model_name='banka',
            name='version',
            field=ool.VersionField(default=0),
        ),
        migrations.AddField(
            model_name='bankarskiracun',
            name='version',
            field=ool.VersionField(default=0),
        ),
        migrations.AddField(
            model_name='dnevnostanje',
            name='version',
            field=ool.VersionField(default=0),
        ),
        migrations.AddField(
            model_name='izlaznafaktura',
            name='version',
            field=ool.VersionField(default=0),
        ),
        migrations.AddField(
            model_name='poslovnagodina',
            name='version',
            field=ool.VersionField(default=0),
        ),
        migrations.AddField(
            model_name='poslovnipartner',
            name='version',
            field=ool.VersionField(default=0),
        ),
        migrations.AddField(
            model_name='preduzece',
            name='version',
            field=ool.VersionField(default=0),
        ),
        migrations.AddField(
            model_name='stavkaizvoda',
            name='version',
            field=ool.VersionField(default=0),
        ),
        migrations.AddField(
            model_name='zakljucenefakture',
            name='version',
            field=ool.VersionField(default=0),
        ),
    ]
