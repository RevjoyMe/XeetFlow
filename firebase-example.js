// Пример работы с Firebase Realtime Database
class FirebaseExample {
    constructor() {
        // 1. Создаем проект на Firebase Console
        // 2. Получаем конфигурацию
        this.config = {
            apiKey: "AIzaSyYourApiKeyHere",
            authDomain: "your-project.firebaseapp.com",
            databaseURL: "https://your-project-default-rtdb.firebaseio.com",
            projectId: "your-project-id",
            storageBucket: "your-project.appspot.com",
            messagingSenderId: "123456789",
            appId: "1:123456789:web:abcdef123456"
        };
        
        // 3. Инициализируем Firebase
        this.initFirebase();
    }

    // Инициализация Firebase
    initFirebase() {
        // Подключаем Firebase SDK в HTML:
        // <script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js"></script>
        // <script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js"></script>
        
        if (typeof firebase !== 'undefined') {
            firebase.initializeApp(this.config);
            this.database = firebase.database();
            console.log('✅ Firebase инициализирован');
        } else {
            console.error('❌ Firebase SDK не подключен');
        }
    }

    // Сохранение данных в Firebase
    async saveData(tournament, data) {
        try {
            if (!this.database) {
                throw new Error('Firebase не инициализирован');
            }

            // Создаем ссылку на узел в базе данных
            const reference = this.database.ref(`xeetflow/${tournament}`);
            
            // Сохраняем данные
            await reference.set({
                heroes: data.heroes,
                avatars: data.avatars,
                timestamp: Date.now(),
                totalRecords: data.heroes.length,
                lastUpdated: new Date().toISOString()
            });

            console.log('✅ Данные сохранены в Firebase');
            return true;
        } catch (error) {
            console.error('❌ Ошибка сохранения в Firebase:', error);
            return false;
        }
    }

    // Загрузка данных из Firebase
    async loadData(tournament) {
        try {
            if (!this.database) {
                throw new Error('Firebase не инициализирован');
            }

            // Создаем ссылку на узел
            const reference = this.database.ref(`xeetflow/${tournament}`);
            
            // Получаем данные один раз
            const snapshot = await reference.once('value');
            const data = snapshot.val();

            if (data) {
                console.log('✅ Данные загружены из Firebase');
                return {
                    heroes: data.heroes || [],
                    avatars: data.avatars || {},
                    timestamp: data.timestamp,
                    totalRecords: data.totalRecords
                };
            }
        } catch (error) {
            console.error('❌ Ошибка загрузки из Firebase:', error);
        }
        
        return null;
    }

    // Слушатель изменений в реальном времени
    listenToChanges(tournament, callback) {
        try {
            if (!this.database) {
                throw new Error('Firebase не инициализирован');
            }

            const reference = this.database.ref(`xeetflow/${tournament}`);
            
            // Слушаем изменения
            reference.on('value', (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    console.log('🔄 Данные обновлены в реальном времени');
                    callback({
                        heroes: data.heroes || [],
                        avatars: data.avatars || {},
                        timestamp: data.timestamp,
                        totalRecords: data.totalRecords
                    });
                }
            });

            console.log('👂 Слушатель изменений активирован');
        } catch (error) {
            console.error('❌ Ошибка слушателя:', error);
        }
    }

    // Остановка слушателя
    stopListening(tournament) {
        try {
            if (this.database) {
                const reference = this.database.ref(`xeetflow/${tournament}`);
                reference.off();
                console.log('🛑 Слушатель остановлен');
            }
        } catch (error) {
            console.error('❌ Ошибка остановки слушателя:', error);
        }
    }
}

// Пример использования Firebase:
/*
1. Создаем проект на Firebase Console:
   - Идем на console.firebase.google.com
   - Create a project
   - Включаем Realtime Database
   - Получаем конфигурацию

2. Подключаем Firebase в HTML:
   <script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js"></script>
   <script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js"></script>

3. Инициализируем:
   const firebaseExample = new FirebaseExample();

4. Сохраняем данные:
   await firebaseExample.saveData('leagues', {heroes: [...], avatars: {...}});

5. Загружаем данные:
   const data = await firebaseExample.loadData('leagues');

6. Слушаем изменения:
   firebaseExample.listenToChanges('leagues', (data) => {
       console.log('Новые данные:', data);
   });
*/
