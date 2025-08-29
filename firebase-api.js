// Firebase API для XeetFlow с автоматической синхронизацией
class FirebaseAPI {
    constructor() {
        this.database = window.firebaseDatabase;
        this.isInitialized = false;
        this.listeners = new Map();
    }

    // Инициализация Firebase
    async initialize() {
        if (this.isInitialized) return true;

        try {
            // Проверяем, что Firebase загружен
            if (!this.database) {
                console.error('❌ Firebase не инициализирован');
                return false;
            }

            this.isInitialized = true;
            console.log('✅ Firebase API инициализирован');
            return true;
        } catch (error) {
            console.error('❌ Ошибка инициализации Firebase:', error);
            return false;
        }
    }

    // Сохранить данные в Firebase
    async saveData(tournament, data) {
        if (!await this.initialize()) return false;

        try {
            const dataToSave = {
                tournament: tournament,
                heroes: data.heroes,
                avatars: data.avatars,
                timestamp: data.timestamp || Date.now(),
                totalRecords: data.heroes.length,
                version: "1.0",
                lastUpdated: new Date().toISOString(),
                updatedBy: 'user_' + Math.random().toString(36).substr(2, 9) // Анонимный ID
            };

            await this.database.ref(`xeetflow/${tournament}`).set(dataToSave);
            console.log('✅ Данные сохранены в Firebase');
            return true;
        } catch (error) {
            console.error('❌ Ошибка сохранения в Firebase:', error);
            return false;
        }
    }

    // Загрузить данные из Firebase
    async loadData(tournament) {
        if (!await this.initialize()) return null;

        try {
            const snapshot = await this.database.ref(`xeetflow/${tournament}`).once('value');
            const data = snapshot.val();

            if (data && data.tournament === tournament) {
                console.log('✅ Данные загружены из Firebase');
                return {
                    heroes: data.heroes || [],
                    avatars: data.avatars || {},
                    timestamp: data.timestamp,
                    totalRecords: data.totalRecords,
                    lastUpdated: data.lastUpdated
                };
            }
        } catch (error) {
            console.error('❌ Ошибка загрузки из Firebase:', error);
        }

        return null;
    }

    // Подписаться на изменения данных в реальном времени
    subscribeToData(tournament, callback) {
        if (!this.initialize()) return null;

        try {
            const ref = this.database.ref(`xeetflow/${tournament}`);
            
            const listener = ref.on('value', (snapshot) => {
                const data = snapshot.val();
                
                if (data && data.tournament === tournament) {
                    const processedData = {
                        heroes: data.heroes || [],
                        avatars: data.avatars || {},
                        timestamp: data.timestamp,
                        totalRecords: data.totalRecords,
                        lastUpdated: data.lastUpdated
                    };
                    
                    callback(processedData);
                }
            });

            // Сохраняем listener для возможности отписки
            this.listeners.set(tournament, { ref, listener });
            console.log('✅ Подписка на изменения данных Firebase');
            
            return listener;
        } catch (error) {
            console.error('❌ Ошибка подписки на Firebase:', error);
            return null;
        }
    }

    // Отписаться от изменений
    unsubscribeFromData(tournament) {
        const listenerInfo = this.listeners.get(tournament);
        if (listenerInfo) {
            listenerInfo.ref.off('value', listenerInfo.listener);
            this.listeners.delete(tournament);
            console.log('✅ Отписка от изменений Firebase');
        }
    }

    // Проверить подключение к Firebase
    async testConnection() {
        if (!await this.initialize()) {
            return { success: false, error: 'Firebase not initialized' };
        }

        try {
            // Пытаемся записать тестовые данные
            const testData = { test: true, timestamp: Date.now() };
            await this.database.ref('test').set(testData);
            
            // Читаем обратно
            const snapshot = await this.database.ref('test').once('value');
            const result = snapshot.val();
            
            // Удаляем тестовые данные
            await this.database.ref('test').remove();

            if (result && result.test) {
                console.log('✅ Подключение к Firebase успешно');
                return { success: true, message: 'Firebase connected successfully' };
            } else {
                return { success: false, error: 'Test data mismatch' };
            }
        } catch (error) {
            console.error('❌ Ошибка подключения к Firebase:', error);
            return { success: false, error: error.message };
        }
    }

    // Получить статистику данных
    async getDataStats(tournament) {
        if (!await this.initialize()) return null;

        try {
            const snapshot = await this.database.ref(`xeetflow/${tournament}`).once('value');
            const data = snapshot.val();

            if (data) {
                return {
                    totalRecords: data.totalRecords || 0,
                    lastUpdated: data.lastUpdated,
                    timestamp: data.timestamp,
                    version: data.version
                };
            }
        } catch (error) {
            console.error('❌ Ошибка получения статистики:', error);
        }

        return null;
    }

    // Очистить все данные
    async clearAllData() {
        if (!await this.initialize()) return false;

        try {
            await this.database.ref('xeetflow').remove();
            console.log('✅ Все данные Firebase очищены');
            return true;
        } catch (error) {
            console.error('❌ Ошибка очистки данных Firebase:', error);
            return false;
        }
    }
}

// Экспорт для использования в HTML
window.FirebaseAPI = FirebaseAPI;
