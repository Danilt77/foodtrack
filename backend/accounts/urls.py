from django.urls import path
from .views import csrf_token, RegisterView, LoginView, LogoutView, CurrentUserView

urlpatterns = [
  path('csrf/', csrf_token, name="csrf-token"),
  path('register/', RegisterView.as_view(), name="register"),
  path('login/', LoginView.as_view(), name="login"),
  path('logout/', LogoutView.as_view(), name="logout"),
  path('profile/', CurrentUserView.as_view(), name="profile"),
]