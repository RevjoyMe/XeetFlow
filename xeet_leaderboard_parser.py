import requests
import csv
import time
import json
import os
from datetime import datetime
from typing import List, Dict, Any

class XeetLeaderboardParser:
    def __init__(self, tournament_type="leagues"):
        """
        Initialize parser for specific tournament type
        tournament_type: "leagues" or "signals"
        """
        self.tournament_type = tournament_type
        
        # API endpoints for different tournaments
        self.tournament_configs = {
            "leagues": {
                "url": "https://www.xeet.ai/api/tournaments/5ea420b7-17c1-4a9d-9501-0fcaa60387f9/leaderboard",
                "total_pages": 431,
                "csv_file": "xeet_leagues_stats.csv",
                "avatars_file": "xeet_leagues_avatars.csv",
                "metadata_file": "xeet_leagues_metadata.json"
            },
            "signals": {
                "url": "https://www.xeet.ai/api/tournaments/xeet-tournament-1/leaderboard",
                "total_pages": 360,  # Based on the API response showing 360 pages
                "csv_file": "xeet_signals_stats.csv",
                "avatars_file": "xeet_signals_avatars.csv",
                "metadata_file": "xeet_signals_metadata.json"
            }
        }
        
        # Set configuration based on tournament type
        config = self.tournament_configs[tournament_type]
        self.base_url = config["url"]
        self.csv_file = config["csv_file"]
        self.avatars_file = config["avatars_file"]
        self.metadata_file = config["metadata_file"]
        self.total_pages = config["total_pages"]
        self.limit = 20
        self.delay = 0.5
        
        self.session = requests.Session()
        # Add headers to mimic browser
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
        })
        
    def fetch_page(self, page: int) -> Dict[str, Any]:
        """Получает данные с одной страницы API"""
        params = {
            'page': page,
            'limit': self.limit
        }
        
        try:
            response = self.session.get(self.base_url, params=params, timeout=30)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Ошибка при запросе страницы {page}: {e}")
            return None
        except json.JSONDecodeError as e:
            print(f"Ошибка парсинга JSON для страницы {page}: {e}")
            return None
    
    def get_last_updated_from_api(self) -> str:
        """Получает дату последнего обновления из API (первая страница)"""
        try:
            response = self.session.get(self.base_url, params={'page': 1, 'limit': 1}, timeout=30)
            response.raise_for_status()
            data = response.json()
            
            # lastUpdated находится в каждой записи, берем из первой
            if 'data' in data and len(data['data']) > 0:
                return data['data'][0].get('lastUpdated', '')
            return ''
        except Exception as e:
            print(f"Ошибка при получении даты последнего обновления: {e}")
            return ''
    
    def load_metadata(self) -> Dict[str, Any]:
        """Загружает метаданные из файла"""
        if os.path.exists(self.metadata_file):
            try:
                with open(self.metadata_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except Exception as e:
                print(f"Ошибка при загрузке метаданных: {e}")
        return {}
    
    def save_metadata(self, metadata: Dict[str, Any]):
        """Сохраняет метаданные в файл"""
        try:
            with open(self.metadata_file, 'w', encoding='utf-8') as f:
                json.dump(metadata, f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"Ошибка при сохранении метаданных: {e}")
    
    def check_if_update_needed(self) -> bool:
        """Проверяет, нужно ли обновлять данные"""
        print("Проверка необходимости обновления данных...")
        
        # Получаем текущую дату последнего обновления из API
        current_last_updated = self.get_last_updated_from_api()
        if not current_last_updated:
            print("Не удалось получить дату последнего обновления из API. Продолжаем парсинг...")
            return True
        
        print(f"Дата последнего обновления в API: {current_last_updated}")
        
        # Загружаем сохраненные метаданные
        metadata = self.load_metadata()
        saved_last_updated = metadata.get('lastUpdated', '')
        
        if not saved_last_updated:
            print("Метаданные не найдены. Требуется полный парсинг.")
            return True
        
        print(f"Дата последнего обновления в сохраненных данных: {saved_last_updated}")
        
        # Сравниваем даты
        if current_last_updated == saved_last_updated:
            print("✅ Данные актуальны! Обновление не требуется.")
            return False
        else:
            print("🔄 Данные устарели. Требуется обновление.")
            return True
    
    def extract_influencer_data(self, item: Dict[str, Any]) -> Dict[str, Any]:
        """Извлекает нужные данные из объекта инфлюенсера"""
        user = item.get('user', {})
        
        return {
            'rank': item.get('rank', 0),
            'username': user.get('username', ''),
            'followerCount': user.get('followerCount', 0),
            'score': round(item.get('score', 0), 2),
            'signalScore': round(item.get('signalScore', 0), 2),
            'noisePoints': round(item.get('noisePoints', 0), 2),
            'totalEngagement': item.get('totalEngagement', 0),
            'engagementRate': item.get('engagementRate', 0),
            'averageEngagementPerPost': item.get('averageEngagementPerPost', 0)
        }
    
    def extract_avatar_data(self, item: Dict[str, Any]) -> Dict[str, Any]:
        """Извлекает данные аватара из объекта инфлюенсера"""
        user = item.get('user', {})
        
        return {
            'username': user.get('username', ''),
            'avatar': user.get('avatar', ''),
            'name': user.get('name', '')
        }
    
    def parse_all_pages(self) -> tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
        """Парсит все страницы и возвращает кортеж (основные данные, данные аватаров)"""
        all_data = []
        all_avatars = []
        
        for page in range(1, self.total_pages + 1):
            print(f"Обработка страницы {page}/{self.total_pages}...")
            
            # Получаем данные страницы
            page_data = self.fetch_page(page)
            
            if page_data is None:
                print(f"Пропускаем страницу {page} из-за ошибки")
                continue
            
            # Извлекаем список инфлюенсеров
            influencers = page_data.get('data', [])
            
            if not influencers:
                print(f"Страница {page} не содержит данных")
                continue
            
            # Обрабатываем каждого инфлюенсера
            for influencer in influencers:
                extracted_data = self.extract_influencer_data(influencer)
                avatar_data = self.extract_avatar_data(influencer)
                all_data.append(extracted_data)
                all_avatars.append(avatar_data)
            
            print(f"Страница {page}: получено {len(influencers)} записей")
            
            # Задержка между запросами
            time.sleep(0.5)
        
        return all_data, all_avatars
    
    def save_to_csv(self, data: List[Dict[str, Any]], filename: str = "xeet_crypto_creators_stats.csv"):
        """Сохраняет данные в CSV файл"""
        if not data:
            print("Нет данных для сохранения")
            return
        
        fieldnames = [
            'rank', 'username', 'followerCount', 'score', 'signalScore',
            'noisePoints', 'totalEngagement', 'engagementRate', 'averageEngagementPerPost'
        ]
        
        try:
            with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                writer.writeheader()
                writer.writerows(data)
            
            print(f"Данные успешно сохранены в файл {filename}")
            print(f"Всего записей: {len(data)}")
            
        except Exception as e:
            print(f"Ошибка при сохранении файла: {e}")
    
    def save_avatars_to_csv(self, avatar_data: List[Dict[str, Any]], filename: str = "xeet_avatars.csv"):
        """Сохраняет данные аватаров в отдельный CSV файл"""
        if not avatar_data:
            print("Нет данных аватаров для сохранения")
            return
        
        fieldnames = ['username', 'avatar', 'name']
        
        try:
            with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                writer.writeheader()
                writer.writerows(avatar_data)
            
            print(f"Данные аватаров успешно сохранены в файл {filename}")
            print(f"Всего аватаров: {len(avatar_data)}")
            
        except Exception as e:
            print(f"Ошибка при сохранении файла аватаров: {e}")
    
    def save_metadata_after_parsing(self, last_updated: str, total_records: int):
        """Сохраняет метаданные после успешного парсинга"""
        metadata = {
            'lastUpdated': last_updated,
            'totalRecords': total_records,
            'parsedAt': datetime.now().isoformat(),
            'totalPages': self.total_pages
        }
        self.save_metadata(metadata)
        print(f"Метаданные сохранены: {last_updated}")
    
    def run(self):
        """Основной метод для запуска парсера"""
        print(f"Начинаем парсинг лидерборда Xeet.ai ({self.tournament_type.upper()})...")
        print(f"Всего страниц для обработки: {self.total_pages}")
        print("-" * 50)
        
        # Проверяем, нужно ли обновление
        if not self.check_if_update_needed():
            print("\n" + "="*50)
            print("ДАННЫЕ АКТУАЛЬНЫ")
            print("="*50)
            print("Парсинг не требуется. Используйте существующий файл:")
            print(f"- {self.csv_file}")
            print(f"- Метаданные: {self.metadata_file}")
            return
        
        print("\n" + "="*50)
        print("НАЧИНАЕМ ОБНОВЛЕНИЕ ДАННЫХ")
        print("="*50)
        
        # Получаем дату последнего обновления для сохранения
        last_updated = self.get_last_updated_from_api()
        
        # Парсим все страницы
        all_data, all_avatars = self.parse_all_pages()
        
        if all_data:
            # Сохраняем основные данные в CSV
            self.save_to_csv(all_data, self.csv_file)
            
            # Сохраняем данные аватаров в отдельный файл
            self.save_avatars_to_csv(all_avatars, self.avatars_file)
            
            # Сохраняем метаданные
            if last_updated:
                self.save_metadata_after_parsing(last_updated, len(all_data))
        else:
            print("Не удалось получить данные")

def main():
    """Точка входа в программу"""
    import sys
    
    # Check command line arguments
    tournament_type = "leagues"  # default
    if len(sys.argv) > 1:
        tournament_type = sys.argv[1].lower()
        if tournament_type not in ["leagues", "signals"]:
            print("Error: tournament_type must be 'leagues' or 'signals'")
            print("Usage: python xeet_leaderboard_parser.py [leagues|signals]")
            sys.exit(1)
    
    print(f"Starting parser for {tournament_type.upper()} tournament...")
    parser = XeetLeaderboardParser(tournament_type)
    parser.run()

if __name__ == "__main__":
    main()
