# Настройка GitHub Gist для XeetFlow

## Шаг 1: Создание Personal Access Token

1. Идите на [GitHub.com](https://github.com)
2. Нажмите на свой аватар → Settings
3. В левом меню: Developer settings → Personal access tokens → Tokens (classic)
4. Generate new token → Generate new token (classic)
5. Отметьте галочку "gist"
6. Нажмите "Generate token"
7. **Скопируйте токен** (он показывается только один раз!)

## Шаг 2: Создание приватного Gist

1. Идите на [gist.github.com](https://gist.github.com)
2. Создайте новый файл: `xeetflow-leagues.json`
3. Добавьте базовое содержимое:
```json
{
  "tournament": "leagues",
  "heroes": [],
  "avatars": {},
  "timestamp": 0,
  "version": "1.0"
}
```
4. Поставьте галочку "Secret gist"
5. Нажмите "Create secret gist"
6. **Скопируйте ID gist** из URL (например: `https://gist.github.com/username/abc123` → ID: `abc123`)

## Шаг 3: Обновление кода

Замените в `secure-api.js`:
```javascript
this.gistId = 'your_private_gist_id'; // Ваш ID gist
this.githubToken = 'your_github_token'; // Ваш токен
```

## Шаг 4: Тестирование

Откройте консоль браузера и выполните:
```javascript
const api = new SecureGlobalAPI();
api.saveData('leagues', {heroes: [], avatars: {}});
```

---

# Настройка Firebase для XeetFlow

## Шаг 1: Создание проекта Firebase

1. Идите на [console.firebase.google.com](https://console.firebase.google.com)
2. Create a project
3. Введите название проекта (например: "xeetflow")
4. Отключите Google Analytics (опционально)
5. Create project

## Шаг 2: Настройка Realtime Database

1. В левом меню: Realtime Database
2. Create database
3. Выберите регион (например: us-central1)
4. Start in test mode (для демо)

## Шаг 3: Получение конфигурации

1. В левом меню: Project settings (шестеренка)
2. Вкладка "General"
3. Прокрутите вниз до "Your apps"
4. Нажмите на иконку веб-приложения (</>)
5. Введите название приложения
6. **Скопируйте конфигурацию**

## Шаг 4: Обновление кода

Замените в `firebase-example.js`:
```javascript
this.config = {
    apiKey: "ваш_api_key",
    authDomain: "ваш_project.firebaseapp.com",
    databaseURL: "https://ваш_project.firebaseio.com",
    // ... остальные параметры
};
```

## Шаг 5: Подключение в HTML

Добавьте в `<head>`:
```html
<script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js"></script>
```

## Шаг 6: Тестирование

Откройте консоль браузера и выполните:
```javascript
const firebase = new FirebaseExample();
firebase.saveData('leagues', {heroes: [], avatars: {}});
```
