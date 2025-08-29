// Simple API for global data storage using JSONBin.io
class GlobalDataAPI {
    constructor() {
        // JSONBin.io - бесплатный сервис для хранения JSON данных
        this.baseUrl = 'https://api.jsonbin.io/v3/b';
        this.binId = '65f8a8c8266cfc3fde9c1234'; // Замените на ваш ID
        this.apiKey = '$2a$10$your_api_key_here'; // Замените на ваш ключ
    }

    // Сохранить данные глобально
    async saveData(tournament, data) {
        try {
            const response = await fetch(`${this.baseUrl}/${this.binId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': this.apiKey,
                    'X-Bin-Name': `xeetflow-${tournament}-data`
                },
                body: JSON.stringify({
                    tournament: tournament,
                    heroes: data.heroes,
                    avatars: data.avatars,
                    timestamp: Date.now(),
                    totalRecords: data.heroes.length
                })
            });

            if (response.ok) {
                console.log('✅ Data saved globally');
                return true;
            } else {
                throw new Error(`HTTP ${response.status}`);
            }
        } catch (error) {
            console.error('❌ Error saving global data:', error);
            return false;
        }
    }

    // Загрузить данные глобально
    async loadData(tournament) {
        try {
            const response = await fetch(`${this.baseUrl}/${this.binId}/latest`, {
                headers: {
                    'X-Master-Key': this.apiKey
                }
            });

            if (response.ok) {
                const result = await response.json();
                const data = result.record;
                
                if (data && data.tournament === tournament) {
                    console.log('✅ Global data loaded');
                    return {
                        heroes: data.heroes || [],
                        avatars: data.avatars || {},
                        timestamp: data.timestamp,
                        totalRecords: data.totalRecords
                    };
                }
            }
        } catch (error) {
            console.error('❌ Error loading global data:', error);
        }
        
        return null;
    }

    // Проверить, есть ли свежие данные
    async checkForUpdates(tournament, lastTimestamp) {
        try {
            const data = await this.loadData(tournament);
            if (data && data.timestamp > lastTimestamp) {
                return data;
            }
        } catch (error) {
            console.error('❌ Error checking for updates:', error);
        }
        return null;
    }
}

// Экспорт для использования в HTML
window.GlobalDataAPI = GlobalDataAPI;
