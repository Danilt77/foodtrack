from django.db import models
from django.conf import settings

class DailyFoodLog(models.Model):
  user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="daily_food_logs")
  date = models.DateField()

  @property
  def total_calories(self):
    result = self.food_entries.aggregate(
      total=models.Sum(
        models.ExpressionWrapper(
          models.F("calories_per_100g") * models.F("amount") / 100,
          output_field=models.DecimalField(),
        )
      )
    )
    return result["total"] or 0

  class Meta:
    ordering = ["-date"]
    constraints = [
      models.UniqueConstraint(
        fields=["user", "date"],
        name="unique_user_date"
      )
    ]

  def __str__(self):
    return f"{self.user} — {self.date}"

class FoodEntry(models.Model):
  daily_food_log = models.ForeignKey("foodtrack.DailyFoodLog", on_delete=models.CASCADE, related_name="food_entries")
  food_name = models.CharField(max_length=255)
  protein_per_100g = models.DecimalField(max_digits=5, decimal_places=2)
  fat_per_100g = models.DecimalField(max_digits=5, decimal_places=2)
  carbs_per_100g = models.DecimalField(max_digits=5, decimal_places=2)
  calories_per_100g = models.DecimalField(max_digits=7, decimal_places=2)
  amount = models.DecimalField(max_digits=6, decimal_places=2)

  def __str__(self):
    return self.food_name