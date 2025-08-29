// GitHub Gist API для XeetFlow с безопасной настройкой токенов
class GistAPI {
    constructor() {
        this.baseUrl = 'https://api.github.com/gists';
        this.githubToken = null;
        this.gistId = null;
        this.isConfigured = false;
    }

    // Безопасная инициализация - запрашиваем данные у пользователя
    async initialize() {
        if (this.isConfigured) return true;

        // Пытаемся получить из localStorage (если пользователь уже вводил)
        const savedToken = localStorage.getItem('xeetflow_github_token');
        const savedGistId = localStorage.getItem('xeetflow_gist_id');

        if (savedToken && savedGistId) {
            this.githubToken = savedToken;
            this.gistId = savedGistId;
            this.isConfigured = true;
            console.log('✅ GitHub credentials loaded from storage');
            return true;
        }

        // Если нет сохраненных данных, показываем форму настройки
        return await this.showSetupForm();
    }

    // Показать форму настройки GitHub
    async showSetupForm() {
        return new Promise((resolve) => {
            // Создаем модальное окно
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
            modal.innerHTML = `
                <div class="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
                    <h3 class="text-xl font-semibold text-white mb-4">🔧 GitHub Setup Required</h3>
                    <p class="text-gray-300 text-sm mb-4">
                        To enable global data sharing, you need to configure GitHub Gist.
                        Follow the instructions in <a href="GITHUB_SETUP.md" target="_blank" class="text-indigo-400 underline">GITHUB_SETUP.md</a>
                    </p>
                    
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-2">GitHub Personal Access Token</label>
                            <input type="password" id="github-token-input" 
                                   placeholder="ghp_your_token_here" 
                                   class="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm">
                            <p class="text-xs text-gray-400 mt-1">This will be stored locally in your browser</p>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-2">Gist ID (optional)</label>
                            <input type="text" id="gist-id-input" 
                                   placeholder="your_gist_id_here" 
                                   class="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm">
                            <p class="text-xs text-gray-400 mt-1">Leave empty to create automatically</p>
                        </div>
                    </div>
                    
                    <div class="flex space-x-3 mt-6">
                        <button id="setup-skip-btn" class="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded font-medium">
                            Skip Setup
                        </button>
                        <button id="setup-save-btn" class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded font-medium">
                            Save & Test
                        </button>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            // Обработчики кнопок
            const tokenInput = modal.querySelector('#github-token-input');
            const gistIdInput = modal.querySelector('#gist-id-input');
            const saveBtn = modal.querySelector('#setup-save-btn');
            const skipBtn = modal.querySelector('#setup-skip-btn');

            saveBtn.addEventListener('click', async () => {
                const token = tokenInput.value.trim();
                const gistId = gistIdInput.value.trim();

                if (!token) {
                    alert('Please enter your GitHub Personal Access Token');
                    return;
                }

                // Сохраняем в localStorage
                localStorage.setItem('xeetflow_github_token', token);
                if (gistId) {
                    localStorage.setItem('xeetflow_gist_id', gistId);
                }

                this.githubToken = token;
                this.gistId = gistId;
                this.isConfigured = true;

                // Тестируем подключение
                const result = await this.testConnection();
                if (result.success) {
                    alert('✅ GitHub setup successful! You can now use global data sharing.');
                } else {
                    alert('⚠️ Setup saved but connection test failed. Check your token.');
                }

                document.body.removeChild(modal);
                resolve(true);
            });

            skipBtn.addEventListener('click', () => {
                document.body.removeChild(modal);
                resolve(false);
            });
        });
    }

    // Проверить, настроен ли API
    async ensureConfigured() {
        if (!this.isConfigured) {
            await this.initialize();
        }
        return this.isConfigured;
    }

    // Проверить, есть ли свежие данные в gist
    async checkDataFreshness(tournament, lastTimestamp = 0) {
        if (!await this.ensureConfigured()) return null;

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
        if (!await this.ensureConfigured()) return false;

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
        if (!await this.ensureConfigured()) return null;

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
        if (!await this.ensureConfigured()) return null;

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
                localStorage.setItem('xeetflow_gist_id', gist.id);
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
        if (!await this.ensureConfigured()) return null;

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
        if (!await this.ensureConfigured()) {
            return { success: false, error: 'Not configured' };
        }

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

    // Очистить сохраненные данные
    clearCredentials() {
        localStorage.removeItem('xeetflow_github_token');
        localStorage.removeItem('xeetflow_gist_id');
        this.githubToken = null;
        this.gistId = null;
        this.isConfigured = false;
        console.log('✅ GitHub credentials cleared');
    }
}

// Экспорт для использования в HTML
window.GistAPI = GistAPI;
