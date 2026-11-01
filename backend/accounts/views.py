from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import CreateAPIView, GenericAPIView, RetrieveUpdateAPIView
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer

@ensure_csrf_cookie
@api_view(["GET"])
@permission_classes([AllowAny])
def csrf_token(request):
  return Response({"detail": "CSRF cookie set"})

class RegisterView(CreateAPIView):
  serializer_class = RegisterSerializer
  permission_classes = [AllowAny]

  def create(self, request):
    serializer = self.get_serializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()

    login(request, user)

    return Response(
      {"detail": "Регистрация пройдена успешно"},
      status=status.HTTP_201_CREATED,
    )

class LoginView(GenericAPIView):
  serializer_class = LoginSerializer
  permission_classes = [AllowAny]

  def post(self, request):
    serializer = self.get_serializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    user = authenticate(
      request,
      username=serializer.validated_data["username"],
      password=serializer.validated_data["password"],
    )

    if user is None:
      return Response(
        {"detail": "Неверный логин или пароль"},
        status=status.HTTP_400_BAD_REQUEST,
      )

    login(request, user)

    return Response({"detail": f"Вы успешно вошли"})

class LogoutView(APIView):
  def post(self, request):
    logout(request)
    return Response({"detail": "Вы вышли из аккаунта"})

class CurrentUserView(RetrieveUpdateAPIView):
  serializer_class = UserSerializer

  def get_object(self):
    return self.request.user