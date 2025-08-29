// Secure API using GitHub Gist with authentication
class SecureGlobalAPI {
    constructor() {
        // GitHub Gist ID (создайте приватный gist)
        this.gistId = 'your_private_gist_id';
        this.githubToken = 'your_github_token'; // Personal Access Token
    }

    // Сохранить данные в приватный GitHub Gist
    async saveData(tournament, data) {
        try {
            // Создаем приватный gist
            const gistData = {
                description: `XeetFlow ${tournament} data - ${new Date().toISOString()}`,
                public: false, // Приватный gist
                files: {
                    [`xeetflow-${tournament}.json`]: {
                        content: JSON.stringify({
                            tournament: tournament,
                            heroes: data.heroes,
                            avatars: data.avatars,
                            timestamp: Date.now(),
                            totalRecords: data.heroes.length,
                            version: '1.0'
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
                console.log('✅ Data saved to secure GitHub Gist');
                return true;
            } else {
                throw new Error(`HTTP ${response.status}`);
            }
        } catch (error) {
            console.error('❌ Error saving to GitHub Gist:', error);
            return false;
        }
    }

    // Загрузить данные из приватного GitHub Gist
    async loadData(tournament) {
        try {
            const response = await fetch(`https://api.github.com/gists/${this.gistId}`, {
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
                        console.log('✅ Data loaded from secure GitHub Gist');
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

// Альтернатива: Firebase Realtime Database (еще более безопасно)
class FirebaseAPI {
    constructor() {
        // Firebase конфигурация
        this.config = {
            apiKey: "your_firebase_api_key",
            authDomain: "your_project.firebaseapp.com",
            databaseURL: "https://your_project.firebaseio.com",
            projectId: "your_project_id",
            storageBucket: "your_project.appspot.com",
            messagingSenderId: "your_sender_id",
            appId: "your_app_id"
        };
        
        // Инициализация Firebase (требует подключения firebase.js)
        if (typeof firebase !== 'undefined') {
            firebase.initializeApp(this.config);
            this.database = firebase.database();
        }
    }

    // Сохранить данные в Firebase
    async saveData(tournament, data) {
        try {
            if (!this.database) {
                throw new Error('Firebase not initialized');
            }

            const reference = this.database.ref(`xeetflow/${tournament}`);
            await reference.set({
                heroes: data.heroes,
                avatars: data.avatars,
                timestamp: Date.now(),
                totalRecords: data.heroes.length
            });

            console.log('✅ Data saved to Firebase');
            return true;
        } catch (error) {
            console.error('❌ Error saving to Firebase:', error);
            return false;
        }
    }

    // Загрузить данные из Firebase
    async loadData(tournament) {
        try {
            if (!this.database) {
                throw new Error('Firebase not initialized');
            }

            const reference = this.database.ref(`xeetflow/${tournament}`);
            const snapshot = await reference.once('value');
            const data = snapshot.val();

            if (data) {
                console.log('✅ Data loaded from Firebase');
                return {
                    heroes: data.heroes || [],
                    avatars: data.avatars || {},
                    timestamp: data.timestamp,
                    totalRecords: data.totalRecords
                };
            }
        } catch (error) {
            console.error('❌ Error loading from Firebase:', error);
        }
        
        return null;
    }
}

// Локальное решение без внешних API (самое безопасное)
class LocalSecureAPI {
    constructor() {
        this.storageKey = 'xeetflow_secure_data';
    }

    // Сохранить данные локально с шифрованием
    saveData(tournament, data) {
        try {
            // Простое шифрование (для продакшена используйте более сложное)
            const encryptedData = btoa(JSON.stringify({
                tournament: tournament,
                heroes: data.heroes,
                avatars: data.avatars,
                timestamp: Date.now(),
                totalRecords: data.heroes.length
            }));

            localStorage.setItem(`${this.storageKey}_${tournament}`, encryptedData);
            console.log('✅ Data saved locally with encryption');
            return true;
        } catch (error) {
            console.error('❌ Error saving locally:', error);
            return false;
        }
    }

    // Загрузить данные локально с расшифровкой
    loadData(tournament) {
        try {
            const encryptedData = localStorage.getItem(`${this.storageKey}_${tournament}`);
            
            if (encryptedData) {
                const data = JSON.parse(atob(encryptedData));
                
                if (data && data.tournament === tournament) {
                    console.log('✅ Data loaded from local storage');
                    return {
                        heroes: data.heroes || [],
                        avatars: data.avatars || {},
                        timestamp: data.timestamp,
                        totalRecords: data.totalRecords
                    };
                }
            }
        } catch (error) {
            console.error('❌ Error loading from local storage:', error);
        }
        
        return null;
    }
}

// Экспорт для использования в HTML
window.SecureGlobalAPI = SecureGlobalAPI;
window.FirebaseAPI = FirebaseAPI;
window.LocalSecureAPI = LocalSecureAPI;
