// GitHub Gist API для XeetFlow с проверкой актуальности данных
class GistAPI {
    constructor() {
        // Замените на ваши данные после настройки
        this.githubToken = 'ghp_your_token_here';
        this.gistId = 'your_gist_id_here';
        this.baseUrl = 'https://api.github.com/gists';
    }

    // Проверить, есть ли свежие данные в gist
    async checkDataFreshness(tournament, lastTimestamp = 0) {
        try {
            const data = await this.loadData(tournament);
            if (data && data.timestamp > lastTimestamp) {
                console.log('🔄 Найдены свежие данные в gist');
                return data;
            }
            return null;
        } catch (error) {
            console.error('❌ Ошибка проверки свежести данных:', error);
            return null;
        }
    }

    // Сохранить данные в gist с проверкой актуальности
    async saveData(tournament, data) {
        try {
            // Проверяем, есть ли уже данные в gist
            const existingData = await this.loadData(tournament);
            
            // Если данные устарели или их нет, обновляем
            if (!existingData || existingData.timestamp < data.timestamp) {
                const gistData = {
                    description: `XeetFlow ${tournament} data - ${new Date().toISOString()}`,
                    files: {
                        [`xeetflow-${tournament}.json`]: {
                            content: JSON.stringify({
                                tournament: tournament,
                                heroes: data.heroes,
                                avatars: data.avatars,
                                timestamp: data.timestamp || Date.now(),
                                totalRecords: data.heroes.length,
                                version: "1.0",
                                lastUpdated: new Date().toISOString()
                            }, null, 2)
                        }
                    }
                };

                const response = await fetch(`${this.baseUrl}/${this.gistId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `token ${this.githubToken}`,
                        'Accept': 'application/vnd.github.v3+json'
                    },
                    body: JSON.stringify(gistData)
                });

                if (response.ok) {
                    console.log('✅ Данные обновлены в gist');
                    return true;
                } else {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
            } else {
                console.log('ℹ️ Данные уже актуальны, обновление не требуется');
                return true;
            }
        } catch (error) {
            console.error('❌ Ошибка сохранения в gist:', error);
            return false;
        }
    }

    // Загрузить данные из gist
    async loadData(tournament) {
        try {
            const response = await fetch(`${this.baseUrl}/${this.gistId}`, {
                headers: {
                    'Authorization': `token ${this.githubToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (response.ok) {
                const gist = await response.json();
                const fileName = `xeetflow-${tournament}.json`;
                
                if (gist.files && gist.files[fileName]) {
                    const data = JSON.parse(gist.files[fileName].content);
                    
                    if (data && data.tournament === tournament) {
                        console.log('✅ Данные загружены из gist');
                        return {
                            heroes: data.heroes || [],
                            avatars: data.avatars || {},
                            timestamp: data.timestamp,
                            totalRecords: data.totalRecords,
                            lastUpdated: data.lastUpdated
                        };
                    }
                }
            } else if (response.status === 404) {
                console.log('ℹ️ Gist не найден, создаем новый...');
                return await this.createGist(tournament);
            }
        } catch (error) {
            console.error('❌ Ошибка загрузки из gist:', error);
        }
        
        return null;
    }

    // Создать новый gist если его нет
    async createGist(tournament) {
        try {
            const gistData = {
                description: "XeetFlow Data Storage",
                public: false, // Приватный gist
                files: {
                    [`xeetflow-${tournament}.json`]: {
                        content: JSON.stringify({
                            tournament: tournament,
                            heroes: [],
                            avatars: {},
                            timestamp: 0,
                            totalRecords: 0,
                            version: "1.0",
                            lastUpdated: new Date().toISOString()
                        }, null, 2)
                    }
                }
            };

            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `token ${this.githubToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                },
                body: JSON.stringify(gistData)
            });

            if (response.ok) {
                const gist = await response.json();
                console.log('✅ Новый gist создан:', gist.id);
                // Обновляем ID gist для будущих запросов
                this.gistId = gist.id;
                return {
                    heroes: [],
                    avatars: {},
                    timestamp: 0,
                    totalRecords: 0
                };
            }
        } catch (error) {
            console.error('❌ Ошибка создания gist:', error);
        }
        
        return null;
    }

    // Получить информацию о gist
    async getGistInfo() {
        try {
            const response = await fetch(`${this.baseUrl}/${this.gistId}`, {
                headers: {
                    'Authorization': `token ${this.githubToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (response.ok) {
                const gist = await response.json();
                return {
                    id: gist.id,
                    description: gist.description,
                    createdAt: gist.created_at,
                    updatedAt: gist.updated_at,
                    files: Object.keys(gist.files)
                };
            }
        } catch (error) {
            console.error('❌ Ошибка получения информации о gist:', error);
        }
        
        return null;
    }

    // Проверить подключение к GitHub API
    async testConnection() {
        try {
            const response = await fetch('https://api.github.com/user', {
                headers: {
                    'Authorization': `token ${this.githubToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (response.ok) {
                const user = await response.json();
                console.log('✅ Подключение к GitHub API успешно');
                return { success: true, user: user.login };
            } else {
                console.error('❌ Ошибка подключения к GitHub API:', response.status);
                return { success: false, error: response.status };
            }
        } catch (error) {
            console.error('❌ Ошибка подключения к GitHub API:', error);
            return { success: false, error: error.message };
        }
    }
}

// Экспорт для использования в HTML
window.GistAPI = GistAPI;
