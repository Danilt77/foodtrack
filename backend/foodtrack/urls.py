from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import DailyFoodLogViewSet, FoodEntryViewSet, product_search

router = DefaultRouter()
router.register("daily-food-logs", DailyFoodLogViewSet, basename="daily-food-log")
router.register("food-entries", FoodEntryViewSet, basename="food-entry")

urlpatterns = [
    path("products/search/", product_search, name="product-search"),
] + router.urls