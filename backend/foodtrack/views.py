from rest_framework.viewsets import ModelViewSet
from .serializers import DailyFoodLogSerializer, FoodEntrySerializer
from .models import DailyFoodLog, FoodEntry

class DailyFoodLogViewSet(ModelViewSet):
  serializer_class = DailyFoodLogSerializer

  def get_queryset(self):
    return DailyFoodLog.objects.filter(user=self.request.user)

  def perform_create(self, serializer):
    serializer.save(user=self.request.user)

class FoodEntryViewSet(ModelViewSet):
  serializer_class = FoodEntrySerializer

  def get_queryset(self):
    queryset = FoodEntry.objects.filter(daily_food_log__user = self.request.user)
    date = self.request.query_params.get("date")
    if date:
      queryset = queryset.filter(daily_food_log__date = date)
    return queryset

  def perform_create(self, serializer):
    daily_food_log, _ = DailyFoodLog.objects.get_or_create(
      user=self.request.user,
      date=serializer.validated_data["date"],
    )
    serializer.save(daily_food_log=daily_food_log)