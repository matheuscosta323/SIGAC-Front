const CACHE_NAME = 'sigac-cache-v8';

const STATIC_ASSETS = [
    './',
    './index.html',
    './home.html',
    './src/pages/dashboard.html',
    './src/pages/listar-alunos.html',
    './src/pages/cadastrar-aluno.html',
    './src/pages/listar-cursos.html',
    './src/pages/cadastrar-curso.html',
    './src/pages/listar-coordenadores.html',
    './src/pages/cadastrar-coordenador.html',
    './src/pages/validacao.html',
    './src/pages/regras-curso.html',
    './src/pages/relatorios.html',
    './src/pages/vincular-curso.html',
    './src/pages/logs.html',
    './src/css/style.css',
    './src/css/dashboard.css',
    './src/css/validacao.css',
    './src/css/alunos.css',
    './src/css/relatorios.css',
    './src/js/main.js',
    './src/js/api.js',
    './src/js/validacao.js',
    './src/js/logs.js',
    './manifest.json',
    './assets/icons/icon-192.png',
    './assets/icons/icon-512.png',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@700&display=swap'
];

// Instalação: pre-cacheia assets estáticos
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(STATIC_ASSETS);
        }).then(() => self.skipWaiting())
    );
});

// Ativação: limpa caches antigos e toma controle imediato
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
            )
        ).then(() => self.clients.claim())
    );
});

// Fetch: Cache-first para assets estáticos, Network-first para API
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    // Requisições à API sempre vão para a rede (sem cache)
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(
            fetch(event.request).catch(() =>
                new Response(JSON.stringify({ success: false, message: 'Sem conexão com o servidor.' }), {
                    headers: { 'Content-Type': 'application/json' }
                })
            )
        );
        return;
    }

    // Para assets estáticos: Cache-first, fallback para rede
    event.respondWith(
        caches.match(event.request).then(cached => {
            if (cached) return cached;
            return fetch(event.request).then(response => {
                // Cacheia respostas válidas de assets estáticos
                if (response && response.status === 200 && response.type === 'basic') {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
                }
                return response;
            });
        }).catch(() => {
            // Fallback offline: retorna index.html para navegação
            if (event.request.mode === 'navigate') {
                return caches.match('./index.html');
            }
        })
    );
});
