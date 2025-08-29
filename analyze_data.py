import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from typing import Dict, Any
import numpy as np

class XeetDataAnalyzer:
    def __init__(self, csv_file: str = "xeet_crypto_creators_stats.csv"):
        self.csv_file = csv_file
        self.df = None
        self.load_data()
    
    def load_data(self):
        """Загружает данные из CSV файла"""
        try:
            self.df = pd.read_csv(self.csv_file)
            print(f"Данные успешно загружены: {len(self.df)} записей")
            print(f"Колонки: {list(self.df.columns)}")
        except Exception as e:
            print(f"Ошибка при загрузке данных: {e}")
    
    def basic_statistics(self) -> Dict[str, Any]:
        """Выводит базовую статистику по данным"""
        if self.df is None:
            return {}
        
        # Округляем числовые поля до 2 знаков после запятой
        self.df['score'] = self.df['score'].round(2)
        self.df['signalScore'] = self.df['signalScore'].round(2)
        self.df['noisePoints'] = self.df['noisePoints'].round(2)
        
        stats = {
            'total_creators': len(self.df),
            'top_10_by_followers': self.df.nlargest(10, 'followerCount')[['rank', 'username', 'followerCount']],
            'top_10_by_score': self.df.nlargest(10, 'score')[['rank', 'username', 'score']],
            'avg_followers': self.df['followerCount'].mean(),
            'median_followers': self.df['followerCount'].median(),
            'avg_score': self.df['score'].mean(),
            'median_score': self.df['score'].median(),
            'score_stats': self.df['score'].describe(),
            'follower_stats': self.df['followerCount'].describe()
        }
        
        print("\n" + "="*50)
        print("БАЗОВАЯ СТАТИСТИКА")
        print("="*50)
        print(f"Всего крипто-инфлюенсеров: {stats['total_creators']}")
        print(f"Среднее количество подписчиков: {stats['avg_followers']:,.0f}")
        print(f"Медианное количество подписчиков: {stats['median_followers']:,.0f}")
        print(f"Средний балл: {stats['avg_score']:.2f}")
        print(f"Медианный балл: {stats['median_score']:.2f}")
        
        print("\nТОП-10 ПО КОЛИЧЕСТВУ ПОДПИСЧИКОВ:")
        print(stats['top_10_by_followers'].to_string(index=False))
        
        print("\nТОП-10 ПО БАЛЛУ:")
        print(stats['top_10_by_score'].to_string(index=False))
        
        return stats
    
    def correlation_analysis(self):
        """Анализирует корреляции между различными метриками"""
        if self.df is None:
            return
        
        # Вычисляем корреляции
        numeric_cols = ['followerCount', 'score', 'signalScore', 'noisePoints', 
                       'totalEngagement', 'engagementRate', 'averageEngagementPerPost']
        
        correlation_matrix = self.df[numeric_cols].corr()
        
        print("\n" + "="*50)
        print("КОРРЕЛЯЦИОННЫЙ АНАЛИЗ")
        print("="*50)
        print(correlation_matrix.round(3))
        
        # Визуализация корреляций
        plt.figure(figsize=(10, 8))
        sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', center=0, 
                   square=True, fmt='.3f')
        plt.title('Корреляционная матрица метрик крипто-инфлюенсеров')
        plt.tight_layout()
        plt.savefig('correlation_heatmap.png', dpi=300, bbox_inches='tight')
        plt.show()
    
    def distribution_analysis(self):
        """Анализирует распределения основных метрик"""
        if self.df is None:
            return
        
        fig, axes = plt.subplots(2, 2, figsize=(15, 12))
        
        # Распределение подписчиков (логарифмическая шкала)
        axes[0, 0].hist(np.log10(self.df['followerCount'] + 1), bins=50, alpha=0.7, color='skyblue')
        axes[0, 0].set_xlabel('log10(Количество подписчиков + 1)')
        axes[0, 0].set_ylabel('Частота')
        axes[0, 0].set_title('Распределение количества подписчиков')
        axes[0, 0].grid(True, alpha=0.3)
        
        # Распределение баллов
        axes[0, 1].hist(self.df['score'], bins=50, alpha=0.7, color='lightgreen')
        axes[0, 1].set_xlabel('Балл')
        axes[0, 1].set_ylabel('Частота')
        axes[0, 1].set_title('Распределение баллов')
        axes[0, 1].grid(True, alpha=0.3)
        
        # Распределение signal score
        axes[1, 0].hist(self.df['signalScore'], bins=50, alpha=0.7, color='salmon')
        axes[1, 0].set_xlabel('Signal Score')
        axes[1, 0].set_ylabel('Частота')
        axes[1, 0].set_title('Распределение Signal Score')
        axes[1, 0].grid(True, alpha=0.3)
        
        # Распределение noise points
        axes[1, 1].hist(self.df['noisePoints'], bins=50, alpha=0.7, color='gold')
        axes[1, 1].set_xlabel('Noise Points')
        axes[1, 1].set_ylabel('Частота')
        axes[1, 1].set_title('Распределение Noise Points')
        axes[1, 1].grid(True, alpha=0.3)
        
        plt.tight_layout()
        plt.savefig('distributions.png', dpi=300, bbox_inches='tight')
        plt.show()
    
    def top_performers_analysis(self):
        """Анализирует топ-перформеров"""
        if self.df is None:
            return
        
        # Топ-20 по баллу (уже округлено в basic_statistics)
        top_20 = self.df.nlargest(20, 'score')
        
        print("\n" + "="*50)
        print("АНАЛИЗ ТОП-20 ПЕРФОРМЕРОВ")
        print("="*50)
        
        print("\nТоп-20 по общему баллу:")
        for idx, row in top_20.iterrows():
            print(f"{row['rank']:2d}. {row['username']:<20} | "
                  f"Подписчики: {row['followerCount']:>8,} | "
                  f"Балл: {row['score']:>6.2f} | "
                  f"Signal: {row['signalScore']:>6.2f} | "
                  f"Noise: {row['noisePoints']:>6.2f}")
        
        # Визуализация топ-20
        plt.figure(figsize=(14, 8))
        bars = plt.barh(range(20), top_20['score'], color='steelblue', alpha=0.7)
        plt.yticks(range(20), top_20['username'])
        plt.xlabel('Общий балл')
        plt.title('Топ-20 крипто-инфлюенсеров по баллу')
        plt.gca().invert_yaxis()
        
        # Добавляем значения на бары
        for i, bar in enumerate(bars):
            width = bar.get_width()
            plt.text(width + 1, bar.get_y() + bar.get_height()/2, 
                    f'{width:.1f}', ha='left', va='center', fontsize=9)
        
        plt.tight_layout()
        plt.savefig('top_20_performers.png', dpi=300, bbox_inches='tight')
        plt.show()
    
    def engagement_analysis(self):
        """Анализирует метрики вовлеченности"""
        if self.df is None:
            return
        
        # Проверяем, есть ли данные о вовлеченности
        engagement_data = self.df[
            (self.df['totalEngagement'] > 0) | 
            (self.df['engagementRate'] > 0) | 
            (self.df['averageEngagementPerPost'] > 0)
        ]
        
        if len(engagement_data) == 0:
            print("\n" + "="*50)
            print("АНАЛИЗ ВОВЛЕЧЕННОСТИ")
            print("="*50)
            print("Данные о вовлеченности отсутствуют (все значения равны 0)")
            return
        
        print(f"\nНайдено {len(engagement_data)} записей с данными о вовлеченности")
        
        # Статистика по вовлеченности
        print("\nСтатистика по вовлеченности:")
        print(f"Средняя общая вовлеченность: {engagement_data['totalEngagement'].mean():.2f}")
        print(f"Средний уровень вовлеченности: {engagement_data['engagementRate'].mean():.2f}")
        print(f"Средняя вовлеченность на пост: {engagement_data['averageEngagementPerPost'].mean():.2f}")
    
    def generate_report(self):
        """Генерирует полный отчет по анализу"""
        print("НАЧАЛО АНАЛИЗА ДАННЫХ XEET.AI")
        print("="*60)
        
        # Базовая статистика
        stats = self.basic_statistics()
        
        # Корреляционный анализ
        self.correlation_analysis()
        
        # Анализ распределений
        self.distribution_analysis()
        
        # Анализ топ-перформеров
        self.top_performers_analysis()
        
        # Анализ вовлеченности
        self.engagement_analysis()
        
        print("\n" + "="*60)
        print("АНАЛИЗ ЗАВЕРШЕН")
        print("="*60)
        print("Созданные файлы:")
        print("- correlation_heatmap.png")
        print("- distributions.png") 
        print("- top_20_performers.png")

def main():
    """Точка входа для анализа данных"""
    analyzer = XeetDataAnalyzer()
    analyzer.generate_report()

if __name__ == "__main__":
    main()
