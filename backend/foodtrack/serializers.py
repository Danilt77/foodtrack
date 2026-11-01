from rest_framework import serializers
from .models import DailyFoodLog, FoodEntry

class DailyFoodLogSerializer(serializers.ModelSerializer):
  total_calories = serializers.ReadOnlyField()
  class Meta:
    model = DailyFoodLog
    fields = ["id", "date", "total_calories"]

class FoodEntrySerializer(serializers.ModelSerializer):
  date = serializers.DateField(write_only=True)
  daily_food_log_date = serializers.DateField(source="daily_food_log.date", read_only=True)

  class Meta:
    model = FoodEntry
    exclude = ["daily_food_log"]

  def create(self, validated_data):
    validated_data.pop("date")
    return super().create(validated_data)