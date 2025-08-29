import requests
import json

def test_api_response():
    """Тестирует ответ API для понимания структуры данных"""
    url = "https://www.xeet.ai/api/tournaments/5ea420b7-17c1-4a9d-9501-0fcaa60387f9/leaderboard"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
    }
    
    try:
        response = requests.get(url, params={'page': 1, 'limit': 1}, headers=headers, timeout=30)
        response.raise_for_status()
        data = response.json()
        
        print("Структура ответа API:")
        print("="*50)
        print(f"Ключи в ответе: {list(data.keys())}")
        print(f"lastUpdated: {data.get('lastUpdated', 'НЕ НАЙДЕН')}")
        print(f"Количество записей в data: {len(data.get('data', []))}")
        
        if 'data' in data and len(data['data']) > 0:
            print(f"\nПример записи:")
            print(json.dumps(data['data'][0], indent=2, ensure_ascii=False))
        
    except Exception as e:
        print(f"Ошибка: {e}")

if __name__ == "__main__":
    test_api_response()
