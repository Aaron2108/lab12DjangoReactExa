# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AutorViewSet, LibroViewSet, UsuarioViewSet, PrestamoViewSet

router = DefaultRouter()
router.register(r'autores', AutorViewSet)
router.register(r'libros', LibroViewSet)
router.register(r'usuarios', UsuarioViewSet)
router.register(r'prestamos', PrestamoViewSet)

