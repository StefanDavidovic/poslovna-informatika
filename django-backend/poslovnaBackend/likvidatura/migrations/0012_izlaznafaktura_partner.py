# Generated by Django 4.0 on 2022-01-16 21:26

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('likvidatura', '0011_izlaznafaktura_uplaceno_stavkaizvoda_preostalo_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='izlaznafaktura',
            name='partner',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='likvidatura.poslovnipartner'),
        ),
    ]
