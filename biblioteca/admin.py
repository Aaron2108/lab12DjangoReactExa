from django.contrib import admin
from .models import Autor,Libro,Usuario,Prestamo

admin.site.register(Autor)
admin.site.register(Libro)
admin.site.register(Usuario)
admin.site.register(Prestamo)

