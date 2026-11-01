import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import time
import logging


logger = logging.getLogger(__name__)

CACHE = {
    "products": [],
    "updated_at": 0
}

CACHE_TTL = 60 * 60 * 24  # 24 часа

BASE_URL = "https://health-diet.ru"

HEADERS = {
    "User-Agent": "Mozilla/5.0"
}


def get_page():
    url = "https://health-diet.ru/table_calorie/"

    response = requests.get(
        url,
        headers={"User-Agent": "Mozilla/5.0"},
        timeout=15
    )

    response.raise_for_status()

    return BeautifulSoup(response.text, "html.parser")


def get_categories():
    soup = get_page()
    categories = []

    for item in soup.select(".mzr-tc-group-item-href"):
        href = item.get("href")

        if not href:
            continue

        url = urljoin(BASE_URL, href)

        categories.append({
            "name": item.get_text(strip=True),
            "url": url
        })

    return categories


def parse_category(category_url):
    response = requests.get(
        category_url,
        headers={"User-Agent": "Mozilla/5.0"},
        timeout=15
    )

    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")

    table = soup.select_one(".mzr-tc-group-table")

    if table is None:
        print("Таблица не найдена")
        return []

    products = []

    for row in table.select("tbody tr"):
        cells = row.find_all("td")

        if len(cells) < 5:
            continue

        link = cells[0].find("a")

        if link is None:
            continue

        product = {
            "name": link.get_text(strip=True),
            "calories": parse_nutrition(cells[1].get_text(strip=True)),
            "protein": parse_nutrition(cells[2].get_text(strip=True)),
            "fat": parse_nutrition(cells[3].get_text(strip=True)),
            "carbs": parse_nutrition(cells[4].get_text(strip=True)),
        } 

        products.append(product)

    return products


def get_all_products():
    products = []

    categories = get_categories()

    for category in categories:
        logger.info("Загружаю категорию: %s", category["name"])

        try:
            category_products = parse_category(category["url"])
            products.extend(category_products)

        except requests.RequestException as error:
            logger.exception("Ошибка загрузки категории: %s", category["name"])

    return products


def search_products(query):
    current_time = time.time()

    if (
        not CACHE["products"]
        or current_time - CACHE["updated_at"] > CACHE_TTL
    ):
        CACHE["products"] = get_all_products()
        CACHE["updated_at"] = current_time

    results = []

    for product in CACHE["products"]:
        if query.lower() in product["name"].lower():
            results.append(product)

        if len(results) >= 20:
            break

    return results


def parse_nutrition(value):
    value = value.replace(",", ".")

    return round(float(
        "".join(
            char for char in value
            if char.isdigit() or char == "."
        )
    ), 2)


if __name__ == "__main__":
    while True:
        query = input("Введите продукт (или exit): ")

        if query.lower() == "exit":
            break

        products = search_products(query)

        for product in products:
            print(product)