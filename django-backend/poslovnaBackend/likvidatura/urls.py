from django.urls import path
from . import views

urlpatterns = [
    path('banke/', views.banke, name='banke' ),
    path('banka/<str:pk>', views.banka, name='banka' ),

    path('racuni/', views.racuni, name='racuni' ),
    path('racuni/<str:pk>', views.racun, name='racun' ),

    path('dnevna-stanja/', views.dnevnaStanja, name='dnevna-stanja' ),
    
    path('dnevna-stanja/create', views.createDnevnoStanje, name='create-dnevna-stanja' ),
    path('dnevna-stanja/<str:pk>/update', views.updateDnevnaStanja, name='update-dnevna-stanja' ),
    path('dnevna-stanja/<str:pk>/delete', views.deleteDnevnaStanja, name='delete-dnevna-stanja' ),
    path('dnevna-stanja/<str:pk>', views.dnevnoStanje, name='dnevno-stanje' ),

    path('fakture/', views.fakture, name='fakture' ),
    path('fakture/create', views.createFaktura, name='create-faktura' ),
    path('fakture/<str:pk>/update', views.updateFaktura, name='update-faktura' ),
    path('fakture/<str:pk>/delete', views.deleteFaktura, name='delete-faktura' ),
    path('fakture/<str:pk>', views.faktura, name='faktura' ),

    path('godine/', views.godine, name='godine' ),
    path('godine/<str:pk>/update', views.updateGodina, name='update-godina' ),
    path('godine/<str:pk>', views.godina, name='godina' ),

    path('preduzeca/', views.preduzeca, name='preduzeca' ),
    path('preduzeca/<str:pk>', views.preduzece, name='preduzece' ),

    path('stavke/', views.stavke, name='stavke' ),
    path('stavke/create', views.createStavka, name='create-stavka' ),
    path('stavke/<str:pk>/update', views.updateStavka, name='update-stavka' ),
    path('stavke/<str:pk>/delete', views.deleteStavka, name='delete-stavka' ),
    path('stavke/<str:pk>', views.stavka, name='stavka' ),

    path('zakljucene/', views.zakljucene, name='zakljucene' ),
    path('zakljucene/create', views.createZakljucena, name='create-zakljucena' ),
    path('zakljucene/<str:pk>/update', views.updateZakljucena, name='update-zakljucena' ),
    path('zakljucene/<str:pk>/delete', views.deleteZakljucena, name='delete-zakljucena' ),
    path('zakljucene/<str:pk>', views.zakljucena, name='zakljucena' ),

    path('import/', views.importStanja, name='export2')




    
]
