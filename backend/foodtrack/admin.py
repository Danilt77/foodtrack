from django.contrib import admin
from .models import DailyFoodLog, FoodEntry

admin.site.register(DailyFoodLog)
admin.site.register(FoodEntry)