from django.db.models import fields
from .models import Banka, BankarskiRacun, DnevnoStanje, IzlaznaFaktura, PoslovnaGodina, PoslovniPartner, Preduzece, StavkaIzvoda
from rest_framework import serializers

class BankaSerializer(serializers.ModelSerializer):
  class Meta:
    model =  Banka
    fields = '__all__'

class BankarskiRacunSerializer(serializers.ModelSerializer):
  class Meta:
    model =  BankarskiRacun
    fields = '__all__'

class DnevnoStanjeSerializer(serializers.ModelSerializer):
  class Meta:
    model =  DnevnoStanje
    fields = '__all__'


class PoslovnaGodinaSerializer(serializers.ModelSerializer):
  class Meta:
    model =  PoslovnaGodina
    fields = '__all__'

class PreduzeceSerializer(serializers.ModelSerializer):
  class Meta:
    model =  Preduzece
    fields = '__all__'

class PoslovniPartnerSerializer(serializers.ModelSerializer):
  bankarski_racun_id = BankarskiRacunSerializer()
  class Meta:
    model = PoslovniPartner
    fields = ['id','naziv', 'bankarski_racun_id']

class IzlaznaFakturaSerializer(serializers.ModelSerializer):
  poslovna_godina_id = PoslovnaGodinaSerializer()
  class Meta:
    model =  IzlaznaFaktura
    fields = ['id', 'broj_fakture', 'iznos_za_placanje', 'poslovna_godina_id']

class StavkaIzvodaSerializer(serializers.ModelSerializer):
  fakture = IzlaznaFakturaSerializer(many=True, read_only=True)
  duznik = PoslovniPartnerSerializer(read_only=True)
  class Meta:
    model =  StavkaIzvoda
    fields = ['id', 'broj_stavke', 'iznos', 'model', 'poziv_na_broj', 'primalac', 'racun_primaoca', 'svrha_placanja', 'duznik', 'dnevno_stanje', 'fakture']
