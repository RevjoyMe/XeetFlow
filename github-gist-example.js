// Пример работы с GitHub Gist API
class GitHubGistExample {
    constructor() {
        // 1. Создаем Personal Access Token на GitHub
        // Settings -> Developer settings -> Personal access tokens -> Generate new token
        this.githubToken = 'ghp_your_token_here';
        
        // 2. Создаем приватный gist вручную или через API
        this.gistId = 'your_gist_id_here';
    }

    // Шаг 1: Создание нового gist
    async createGist() {
        const gistData = {
            description: "XeetFlow Data Storage",
            public: false, // Приватный gist
            files: {
                "xeetflow-leagues.json": {
                    content: JSON.stringify({
                        tournament: "leagues",
                        heroes: [],
                        avatars: {},
                        timestamp: Date.now(),
                        version: "1.0"
                    }, null, 2)
                }
            }
        };

        const response = await fetch('https://api.github.com/gists', {
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
            console.log('✅ Gist создан:', gist.id);
            return gist.id;
        }
    }

    // Шаг 2: Обновление существующего gist
    async updateGist(gistId, tournament, data) {
        const gistData = {
            description: `XeetFlow ${tournament} data - ${new Date().toISOString()}`,
            files: {
                [`xeetflow-${tournament}.json`]: {
                    content: JSON.stringify({
                        tournament: tournament,
                        heroes: data.heroes,
                        avatars: data.avatars,
                        timestamp: Date.now(),
                        totalRecords: data.heroes.length,
                        version: "1.0"
                    }, null, 2)
                }
            }
        };

        const response = await fetch(`https://api.github.com/gists/${gistId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `token ${this.githubToken}`,
                'Accept': 'application/vnd.github.v3+json'
            },
            body: JSON.stringify(gistData)
        });

        if (response.ok) {
            console.log('✅ Gist обновлен');
            return true;
        }
    }

    // Шаг 3: Чтение данных из gist
    async readGist(gistId, tournament) {
        const response = await fetch(`https://api.github.com/gists/${gistId}`, {
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
                console.log('✅ Данные загружены из gist');
                return data;
            }
        }
        
        return null;
    }
}

// Пример использования:
/*
1. Создаем Personal Access Token на GitHub:
   - Идем на GitHub.com -> Settings -> Developer settings
   - Personal access tokens -> Tokens (classic)
   - Generate new token -> Select scopes: gist
   - Копируем токен

2. Создаем gist:
   const gistExample = new GitHubGistExample();
   const gistId = await gistExample.createGist();

3. Обновляем данные:
   await gistExample.updateGist(gistId, 'leagues', {heroes: [...], avatars: {...}});

4. Читаем данные:
   const data = await gistExample.readGist(gistId, 'leagues');
*/
