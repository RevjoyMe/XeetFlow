// Simple API using GitHub Gist as free data storage
class SimpleGlobalAPI {
    constructor() {
        // GitHub Gist ID для хранения данных (создайте свой)
        this.gistId = 'your_gist_id_here';
        this.githubToken = 'your_github_token_here'; // Опционально
    }

    // Сохранить данные в GitHub Gist
    async saveData(tournament, data) {
        try {
            const gistData = {
                files: {
                    [`xeetflow-${tournament}.json`]: {
                        content: JSON.stringify({
                            tournament: tournament,
                            heroes: data.heroes,
                            avatars: data.avatars,
                            timestamp: Date.now(),
                            totalRecords: data.heroes.length
                        }, null, 2)
                    }
                }
            };

            const response = await fetch(`https://api.github.com/gists/${this.gistId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `token ${this.githubToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                },
                body: JSON.stringify(gistData)
            });

            if (response.ok) {
                console.log('✅ Data saved to GitHub Gist');
                return true;
            } else {
                throw new Error(`HTTP ${response.status}`);
            }
        } catch (error) {
            console.error('❌ Error saving to GitHub Gist:', error);
            return false;
        }
    }

    // Загрузить данные из GitHub Gist
    async loadData(tournament) {
        try {
            const response = await fetch(`https://api.github.com/gists/${this.gistId}`);
            
            if (response.ok) {
                const gist = await response.json();
                const fileName = `xeetflow-${tournament}.json`;
                
                if (gist.files && gist.files[fileName]) {
                    const data = JSON.parse(gist.files[fileName].content);
                    
                    if (data && data.tournament === tournament) {
                        console.log('✅ Data loaded from GitHub Gist');
                        return {
                            heroes: data.heroes || [],
                            avatars: data.avatars || {},
                            timestamp: data.timestamp,
                            totalRecords: data.totalRecords
                        };
                    }
                }
            }
        } catch (error) {
            console.error('❌ Error loading from GitHub Gist:', error);
        }
        
        return null;
    }
}

// Альтернатива: использование localStorage с синхронизацией через URL
class URLSyncAPI {
    constructor() {
        this.syncInterval = null;
    }

    // Сохранить данные и поделиться через URL
    saveData(tournament, data) {
        try {
            // Создаем сжатые данные для URL
            const compressedData = btoa(JSON.stringify({
                tournament: tournament,
                heroes: data.heroes,
                avatars: data.avatars,
                timestamp: Date.now()
            }));

            // Обновляем URL с данными
            const newUrl = new URL(window.location);
            newUrl.searchParams.set('data', compressedData);
            newUrl.searchParams.set('tournament', tournament);
            
            // Обновляем URL без перезагрузки страницы
            window.history.replaceState({}, '', newUrl);
            
            console.log('✅ Data saved to URL');
            return true;
        } catch (error) {
            console.error('❌ Error saving to URL:', error);
            return false;
        }
    }

    // Загрузить данные из URL
    loadData(tournament) {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const compressedData = urlParams.get('data');
            const urlTournament = urlParams.get('tournament');
            
            if (compressedData && urlTournament === tournament) {
                const data = JSON.parse(atob(compressedData));
                
                if (data && data.tournament === tournament) {
                    console.log('✅ Data loaded from URL');
                    return {
                        heroes: data.heroes || [],
                        avatars: data.avatars || {},
                        timestamp: data.timestamp,
                        totalRecords: data.heroes.length
                    };
                }
            }
        } catch (error) {
            console.error('❌ Error loading from URL:', error);
        }
        
        return null;
    }

    // Начать автоматическую синхронизацию
    startSync(tournament, data) {
        this.syncInterval = setInterval(() => {
            this.saveData(tournament, data);
        }, 30000); // Синхронизация каждые 30 секунд
    }

    // Остановить синхронизацию
    stopSync() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
            this.syncInterval = null;
        }
    }
}

// Экспорт для использования в HTML
window.SimpleGlobalAPI = SimpleGlobalAPI;
window.URLSyncAPI = URLSyncAPI;
