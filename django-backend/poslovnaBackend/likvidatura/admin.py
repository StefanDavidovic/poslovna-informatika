from django.contrib import admin
from .models import Banka, BankarskiRacun, DnevnoStanje, IzlaznaFaktura, PoslovnaGodina, PoslovniPartner, Preduzece, StavkaIzvoda, ZakljuceneFakture
from import_export import resources
from import_export.admin import ImportExportModelAdmin

# Register your models here.

class DnevnaStanjaResource(resources.ModelResource):
   class Meta:
      model = DnevnoStanje

class DnevnaStanjaAdmin(ImportExportModelAdmin):
   resource_class = DnevnaStanjaResource

admin.site.register(Banka)
admin.site.register(BankarskiRacun)
admin.site.register(DnevnoStanje, DnevnaStanjaAdmin)
admin.site.register(IzlaznaFaktura)
admin.site.register(PoslovnaGodina)
admin.site.register(PoslovniPartner)
admin.site.register(Preduzece)
admin.site.register(StavkaIzvoda)
admin.site.register(ZakljuceneFakture)

