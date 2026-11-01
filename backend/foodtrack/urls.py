from rest_framework.routers import DefaultRouter
from .views import DailyFoodLogViewSet, FoodEntryViewSet

router = DefaultRouter()
router.register("daily-food-logs", DailyFoodLogViewSet, basename="daily-food-log")
router.register("food-entries", FoodEntryViewSet, basename="food-entry")

urlpatterns = router.urls