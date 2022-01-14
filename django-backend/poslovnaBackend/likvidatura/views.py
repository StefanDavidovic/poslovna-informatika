from django.http import response
from django.http.response import HttpResponse
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import BankaSerializer, BankarskiRacunSerializer, DnevnoStanjeSerializer, IzlaznaFakturaSerializer, PoslovnaGodinaSerializer, PreduzeceSerializer, StavkaIzvodaSerializer
from .models import Banka, BankarskiRacun,DnevnoStanje,IzlaznaFaktura,PoslovnaGodina, Preduzece, StavkaIzvoda
from rest_framework.views import APIView
import csv
import json
from tkinter import Tk     # from tkinter import Tk for Python 3.x
from tkinter.filedialog import askopenfilename




class ExportCSVStudents(APIView):
    def get(self, request, *args, **kwargs):

        Tk().withdraw()
        response = HttpResponse(content_type='application/json')
        response['Content-Disposition'] = 'attachment; filename="sample.csv"'

        writer = csv.writer(response)
        stanja = DnevnoStanje.objects.all()

        for j in stanja:
          k = DnevnoStanjeSerializer(j)
          i = k.data
          serializer = DnevnoStanjeSerializer(j)

          id = str(list(i.items())[0][1])
          broj_izvoda = str(list(i.items())[1][1])
          datum_izvoda = list(i.items())[2][1]
          novo_stanje = list(i.items())[3][1]
          prethodno_stanje = list(i.items())[4][1]
          promet_na_teret = list(i.items())[5][1]
          promet_u_korist = list(i.items())[6][1]
          rezervisano = list(i.items())[7][1]
          bankarski_racun_id = list(i.items())[8][1]

          stavkeSve = j.stavke.all()
          listaStavki = []

          for st in stavkeSve:
            stavkeSer = StavkaIzvodaSerializer(st)
            stavka = stavkeSer.data
            stavkaId = list(stavka.items())[1][1]
            listaStavki.append(stavkaId)

          lista = [str(id),str(broj_izvoda) ,datum_izvoda, str(novo_stanje), str(prethodno_stanje),str(promet_na_teret),
          str(promet_u_korist), str(rezervisano), str(bankarski_racun_id), listaStavki]

          writer.writerow(lista)

        return response
### Banka ###
@api_view(['POST'])
def importStanja(request):
    # Tk().withdraw()
    
    response = HttpResponse(content_type='application/json')
    response['Content-Disposition'] = 'attachment; filename="sample.csv"'
    print(request.FILES['File'] , 'OVO JE FAJL')
    nazivFajla = request.FILES['File'] 
    with open(f'/home/ubuntu/Desktop/{nazivFajla}') as f:
        reader = csv.reader(f)
        for row in reader:
          print(row[9])

          stanja= DnevnoStanje.objects.create(
              # id=row[0],
              broj_izvoda=row[1],
              datum_izvoda=row[2],
              novo_stanje=row[3],
              prethodno_stanje=row[4],
              promet_na_teret=row[5],
              promet_u_korist=row[6],
              rezervisano=row[7],
              # bankarski_racun_id=stanja.stanja.crate(id = row[8])
              )
          stanjaSer = DnevnoStanjeSerializer(stanja)

    return Response(stanjaSer.data)
    

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
    serializer.save()

  return Response("Izlazna faktura uspesno izmenjena")

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

