from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
  daily_calories_goal = models.DecimalField(max_digits=7, decimal_places=2, default=2000)