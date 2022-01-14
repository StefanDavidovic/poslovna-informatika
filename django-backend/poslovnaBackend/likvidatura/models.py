from django.db import models
from django.db.models.deletion import CASCADE
from django.db.models.expressions import Case

# Create your models here.
class Banka(models.Model):
  sifra = models.CharField(max_length=45)
  naziv = models.CharField(max_length=45)

  def __str__(self):
    return self.naziv




class Preduzece(models.Model):
  naziv = models.CharField(max_length=45)
  pib = models.CharField(max_length=45)
  maticni_broj = models.CharField(max_length=45)

  def __str__(self):
    return self.naziv


class BankarskiRacun(models.Model):
  broj_racuna = models.CharField(max_length=45)
  banka_id = models.ForeignKey(Banka, on_delete=models.CASCADE,default=1)
  preduzece = models.ForeignKey(Preduzece, on_delete=CASCADE,default=1)

  def __str__(self):
        return self.broj_racuna

class DnevnoStanje(models.Model):
  broj_izvoda = models.IntegerField()
  datum_izvoda = models.DateField()
  novo_stanje = models.FloatField()
  prethodno_stanje = models.FloatField()
  promet_na_teret = models.FloatField()
  promet_u_korist = models.FloatField()
  rezervisano = models.FloatField()
  bankarski_racun_id = models.ForeignKey(BankarskiRacun, on_delete=models.CASCADE, default=1, related_name='stanja')
  # stavke = models.ManyToManyField('StavkaIzvoda', related_name='stavke')

  def __str__(self):
        return str(self.broj_izvoda)
  


class PoslovniPartner(models.Model):
  naziv = models.CharField(max_length=45)
  bankarski_racun_id = models.ForeignKey(BankarskiRacun, on_delete=models.CASCADE, default=1)

  def __str__(self):
        return self.naziv
  

class PoslovnaGodina(models.Model):
  godina = models.IntegerField()
  zakljucena = models.BooleanField(default=False)
  preduzece = models.ForeignKey(Preduzece, on_delete=CASCADE, default=1)


class IzlaznaFaktura(models.Model):
  broj_fakture = models.CharField(max_length=45)
  iznos_za_placanje = models.FloatField()
  poslovna_godina_id = models.ForeignKey(PoslovnaGodina, on_delete=models.CASCADE ,default=1)

  def __str__(self):
        return str(self.broj_fakture)

class StavkaIzvoda(models.Model):
  broj_stavke = models.IntegerField()
  iznos = models.FloatField()
  model = models.IntegerField()
  poziv_na_broj = models.CharField(max_length=45)
  primalac = models.CharField(max_length=45)
  racun_primaoca = models.CharField(max_length=45)
  svrha_placanja = models.CharField(max_length=45)
  duznik = models.ForeignKey(PoslovniPartner, on_delete=models.CASCADE,default=1)
  dnevno_stanje = models.ForeignKey(DnevnoStanje, on_delete=models.CASCADE, related_name='stavke')
  fakture = models.ManyToManyField(IzlaznaFaktura) 

  def __str__(self):
       return str(self.broj_stavke)
