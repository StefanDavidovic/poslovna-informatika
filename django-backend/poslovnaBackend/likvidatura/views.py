from typing import Counter
from django.http import response
from django.http.response import HttpResponse
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.pagination import PageNumberPagination
from rest_framework.generics import ListAPIView
from filter_and_pagination import FilterPagination
from rest_framework.response import Response
from .serializers import BankaSerializer, BankarskiRacunSerializer, DnevnoStanjeSerializer, IzlaznaFakturaSerializer, PoslovnaGodinaSerializer, PoslovniPartnerSerializer, PreduzeceSerializer, StavkaIzvodaSerializer, ZakljuceneSerializer, ZakljuceneSerializer2
from .models import Banka, BankarskiRacun,DnevnoStanje,IzlaznaFaktura,PoslovnaGodina, PoslovniPartner, Preduzece, StavkaIzvoda, ZakljuceneFakture
import json
import io
from django.db.models import Q
import math
from django.http import FileResponse
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch,mm
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle

from likvidatura import serializers

class StavkeToList(ListAPIView):
  def get(self,request):
    q = request.GET.get('q')
    page=int(request.GET.get('page',1))
    per_page = 3

    stavke = StavkaIzvoda.objects.all()

    if q:
      stavke = stavke.filter(Q(broj_stavke__icontains=q) | Q(iznos__icontains=q) | 
      Q(preostalo__icontains=q) | Q(duznik__naziv__icontains=q))
    total = stavke.count()
    start = (page-1)*per_page
    end = page * per_page

    serializer = StavkaIzvodaSerializer(stavke[start:end], many=True)
    return Response({
      'data':serializer.data,
      'total':total,
      'page':page,
      'last_page':math.ceil(total/per_page)
    })

class FaktureToList(ListAPIView):
  def get(self,request):
    q = request.GET.get('q')
    page=int(request.GET.get('page',1))
    per_page = 3

    stavke = IzlaznaFaktura.objects.all()

    if q:
      stavke = stavke.filter(Q(broj_fakture__icontains=q) | Q(iznos_za_placanje__icontains=q) | 
      Q(uplaceno__icontains=q) | Q(partner__naziv__icontains=q))
    total = stavke.count()
    start = (page-1)*per_page
    end = page * per_page

    serializer = IzlaznaFakturaSerializer(stavke[start:end], many=True)
    return Response({
      'data':serializer.data,
      'total':total,
      'page':page,
      'last_page':math.ceil(total/per_page)
    })

class ZakljuceneToList(ListAPIView):
  def get(self,request):
    q = request.GET.get('q')
    page=int(request.GET.get('page',1))
    per_page = 3

    stavke = ZakljuceneFakture.objects.all()

    if q:
      stavke = stavke.filter(Q(faktura__broj_fakture__icontains=q) | Q(stavka__broj_stavke__icontains=q) | 
      Q(uplaceno__icontains=q) | Q(stavka__duznik__naziv__icontains=q))
    total = stavke.count()
    start = (page-1)*per_page
    end = page * per_page

    serializer = ZakljuceneSerializer2(stavke[start:end], many=True)
    return Response({
      'data':serializer.data,
      'total':total,
      'page':page,
      'last_page':math.ceil(total/per_page)
    })

@api_view(['GET'])
def generatePdf(request, pk):
  buf = io.BytesIO()
  c = canvas.Canvas(buf, pagesize=A4, bottomup=0)
  width, height = A4
  c.drawString(217,40, 'IZLAZNE FAKTURE')
  print(pk)
  fakture = IzlaznaFaktura.objects.all()
  fakturee =[]
  for fakt in fakture:
    if int(pk) == int(fakt.partner.id):
      fakturee.append(fakt)
  print(fakturee)
  counter = len(fakturee) + 1

  lines = []
  for ob in fakturee:
    data = [ob.broj_fakture, str(ob.iznos_za_placanje), str(ob.uplaceno)]
    lines.append(data)
  
  lines.append(["Broj Fakture", "Iznos za Placanje", "Uplaceno"])

  table = Table(lines, colWidths=[1.9*inch] * 5, rowHeights=[0.4*inch] *counter)

  table.setStyle(TableStyle([
        ('BACKGROUND', (0, -1), (2, -1), '#a7a5a5'),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
  table.wrapOn(c, width, height)
  table.drawOn(c, 25*mm, 25*mm)
  
  c.showPage()
  c.save()
  buf.seek(0)

  return FileResponse(buf, as_attachment=True, filename='fakture.pdf')



@api_view(['GET'])
def generatePdf2(request):
  buf = io.BytesIO()
  c = canvas.Canvas(buf, pagesize=A4, bottomup=0)
  width, height = A4
  c.drawString(217,40, 'IZLAZNE FAKTURE')

  fakture = IzlaznaFaktura.objects.all()

  lines = []
  for ob in fakture:
    data = [ob.broj_fakture, str(ob.iznos_za_placanje), str(ob.uplaceno)]
    lines.append(data)
  
  lines.append(["Broj Fakture", "Iznos za Placanje", "Uplaceno"])
  counter = len(fakture) + 1
  table = Table(lines, colWidths=[1.9*inch] * 5, rowHeights=[0.4*inch] *counter)

  table.setStyle(TableStyle([
        ('BACKGROUND', (0, -1), (2, -1), '#a7a5a5'),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
  table.wrapOn(c, width, height)
  table.drawOn(c, 25*mm, 25*mm)
  
  c.showPage()
  c.save()
  buf.seek(0)

  return FileResponse(buf, as_attachment=True, filename='fakture.pdf')

### Import ###
@api_view(['POST'])
def importStanja(request):    
    response = HttpResponse(content_type='application/json')
    response['Content-Disposition'] = 'attachment; filename="sample.csv"'

    nazivFajla = request.FILES['File'] 
    with open(f'/home/ubuntu/Desktop/{nazivFajla}') as f:
      stanjaDict = json.load(f)
      stavkeIzvodaa = stanjaDict['stavke']

      stanja= DnevnoStanje.objects.create(
          broj_izvoda=stanjaDict['broj_izvoda'],
          datum_izvoda=stanjaDict['datum_izvoda'],
          novo_stanje=stanjaDict['novo_stanje'],
          prethodno_stanje=stanjaDict['prethodno_stanje'],
          promet_na_teret=stanjaDict['promet_na_teret'],
          promet_u_korist=stanjaDict['promet_u_korist'],
          rezervisano=stanjaDict['rezervisano']
      )
      stanjaSer = DnevnoStanjeSerializer(stanja)

      for stavkeIzvoda in stavkeIzvodaa: 
        stavke = StavkaIzvoda.objects.create(
          broj_stavke = stavkeIzvoda['broj_stavke'],
          iznos = stavkeIzvoda['iznos'],
          model =  stavkeIzvoda['model'],
          poziv_na_broj = stavkeIzvoda['poziv_na_broj'],
          primalac = stavkeIzvoda['primalac'],
          racun_primaoca = stavkeIzvoda['racun_primaoca'],
          svrha_placanja = stavkeIzvoda['svrha_placanja'],
          dnevno_stanje = DnevnoStanje.objects.get(id=int(stavkeIzvoda['dnevno_stanje'])),
          preostalo = stavkeIzvoda['iznos']
        )
        print("kreirana stavka")

        stavkeSer = StavkaIzvodaSerializer(stavke)

    return Response(201)
    

### Banka ###

@api_view(['GET'])
def banke(request):
  banke = Banka.objects.all()
  serializer = BankaSerializer(banke, many=True)
  return Response(serializer.data)

@api_view(['GET'])
def banka(request, pk):
  banka = Banka.objects.get(id=pk)
  serializer = BankaSerializer(banka, many=False)
  return Response(serializer.data)

### Bankarski Racun ###

@api_view(['GET'])
def racuni(request):
  racuni = BankarskiRacun.objects.all()
  serializer = BankarskiRacunSerializer(racuni, many=True)
  return Response(serializer.data)

@api_view(['GET'])
def racun(request, pk):
  racuni = BankarskiRacun.objects.get(id=pk)
  serializer = BankarskiRacunSerializer(racuni, many=False)
  return Response(serializer.data)

@api_view(['GET'])
def partneri(request):
  racuni = PoslovniPartner.objects.all()
  serializer = PoslovniPartnerSerializer(racuni, many=True)
  return Response(serializer.data)

@api_view(['GET'])
def partner(request, pk):
  racuni = PoslovniPartner.objects.get(id=pk)
  serializer = PoslovniPartnerSerializer(racuni, many=False)
  return Response(serializer.data)


### Dnevno Stanje ###
@api_view(['GET'])
def dnevnaStanja(request):
  stanja = DnevnoStanje.objects.all()
  serializer = DnevnoStanjeSerializer(stanja, many=True)
  return Response(serializer.data)

@api_view(['GET'])
def dnevnoStanje(request, pk):
  stanje = DnevnoStanje.objects.get(id=pk)
  serializer = DnevnoStanjeSerializer(stanje, many=False)
  return Response(serializer.data)

@api_view(['POST'])
def createDnevnoStanje(request):
  serializer = DnevnoStanjeSerializer(data=request.data)
  
  if serializer.is_valid():
    serializer.save()

  return Response(serializer.data)

@api_view(['PUT'])
def updateDnevnaStanja(request, pk):
  stanje = DnevnoStanje.objects.get(id=pk)
  serializer = DnevnoStanjeSerializer(instance=stanje,data=request.data)

  if serializer.is_valid():
    serializer.save()

  return Response(serializer.data)

@api_view(['DELETE'])
def deleteDnevnaStanja(request, pk):
  stanje = DnevnoStanje.objects.get(id=pk)
  stanje.delete()
  
  return Response("Dnevno stanje je obrisano")
 

### Izlazna Faktura ###
@api_view(['GET'])
def fakture(request):
  fakture = IzlaznaFaktura.objects.all()
  serializer = IzlaznaFakturaSerializer(fakture, many=True)
  return Response(serializer.data)

@api_view(['GET'])
def faktura(request, pk):
  faktura = IzlaznaFaktura.objects.get(id=pk)
  serializer = IzlaznaFakturaSerializer(faktura, many=False)
  return Response(serializer.data)

@api_view(['POST'])
def createFaktura(request):
  serializer = IzlaznaFakturaSerializer(data=request.data)
  
  if serializer.is_valid():
    serializer.save()

  return Response("Faktura uspesno kreirana")

@api_view(['PUT'])
def updateFaktura(request, pk):
  faktura = IzlaznaFaktura.objects.get(id=pk)
  serializer = IzlaznaFakturaSerializer(instance=faktura,data=request.data)
  
  if serializer.is_valid():
    print(serializer.errors)
    serializer.save()
  print(serializer.errors)

  return Response(serializer.data)

@api_view(['DELETE'])
def deleteFaktura(request, pk):
  stanje = IzlaznaFaktura.objects.get(id=pk)
  stanje.delete()
  
  return Response("Faktura je obrisana")

### Poslovna Godina ###
def godine(request):
  godine = PoslovnaGodina.objects.all()
  serializer = PoslovnaGodinaSerializer(godine, many=True)
  return Response(serializer.data)

@api_view(['GET'])
def godina(request, pk):
  godina = PoslovnaGodina.objects.get(id=pk)
  serializer = PoslovnaGodinaSerializer(godina, many=False)
  return Response(serializer.data)


@api_view(['PUT'])
def updateGodina(request, pk):
  godina = PoslovnaGodina.objects.get(id=pk)
  serializer = PoslovnaGodinaSerializer(instance=godina,data=request.data)
  
  if serializer.is_valid():
    serializer.save()

  return Response("Poslovna godina uspesno izmenjena")

### Preduzece ###
@api_view(['GET'])
def preduzeca(request):
  godine = Preduzece.objects.all()
  serializer = PreduzeceSerializer(godine, many=True)
  return Response(serializer.data)

@api_view(['GET'])
def preduzece(request, pk):
  godina = Preduzece.objects.get(id=pk)
  serializer = PreduzeceSerializer(godina, many=False)
  return Response(serializer.data)


### STAVKE IZVODA ###

@api_view(['GET'])
def stavke(request):
  stavke = StavkaIzvoda.objects.all()
  serializer = StavkaIzvodaSerializer(stavke, many=True)
  return Response(serializer.data)

@api_view(['GET'])
def stavka(request, pk):
  stavka = StavkaIzvoda.objects.get(id=pk)
  serializer = StavkaIzvodaSerializer(stavka, many=False)
  return Response(serializer.data)

@api_view(['POST'])
def createStavka(request):
  serializer = StavkaIzvodaSerializer(data=request.data)
  
  if serializer.is_valid():
    serializer.save()

  return Response("Stavka uspesno kreirana")

@api_view(['PUT'])
def updateStavka(request, pk):
  stavka = StavkaIzvoda.objects.get(id=pk)
  serializer = StavkaIzvodaSerializer(instance=stavka,data=request.data)
  
  if serializer.is_valid():
    serializer.save()

  return Response("Izlazna faktura uspesno izmenjena")

@api_view(['DELETE'])
def deleteStavka(request, pk):
  stanje = StavkaIzvoda.objects.get(id=pk)
  stanje.delete()
  
  return Response("Stavka je obrisana") 

### Zakljucene Fakture ###


@api_view(['GET'])
def zakljucene(request):
  stavke = ZakljuceneFakture.objects.all()
  serializer = ZakljuceneSerializer2(stavke, many=True)
  return Response(serializer.data)

@api_view(['GET'])
def zakljucena(request, pk):
  stavka = ZakljuceneFakture.objects.get(id=pk)
  serializer = ZakljuceneSerializer2(stavka, many=False)
  return Response(serializer.data)

@api_view(['POST'])
def createZakljucena(request):
  serializer = ZakljuceneSerializer(data=request.data)
  
  if serializer.is_valid():
    serializer.save()

  return Response("Zakljucena faktura uspesno kreirana")

@api_view(['PUT'])
def updateZakljucena(request, pk):
  stavka = ZakljuceneFakture.objects.get(id=pk)
  serializer = ZakljuceneSerializer(instance=stavka,data=request.data)
  
  if serializer.is_valid():
    serializer.save()

  return Response("Zakljucena faktura uspesno izmenjena")

@api_view(['DELETE'])
def deleteZakljucena(request, pk):
  stanje = ZakljuceneFakture.objects.get(id=pk)
  stanje.delete()
  
  return Response("Zakljucena faktura je obrisana") 