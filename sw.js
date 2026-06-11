const CACHE_NAME = 'sigac-cache-v6';

const STATIC_ASSETS = [
    './',
    './index.html',
    './home.html',
    './dashboard.html',
    './listar-alunos.html',
    './cadastrar-aluno.html',
    './listar-cursos.html',
    './cadastrar-curso.html',
    './listar-coordenadores.html',
    './cadastrar-coordenador.html',
    './validacao.html',
    './upload-certificado.html',
    './regras-curso.html',
    './relatorios.html',
    './vincular-curso.html',
    './logs.html',
    './style.css',
    './dashboard.css',
    './validacao.css',
    './alunos.css',
    './relatorios.css',
    './main.js',
    './api.js',
    './validacao.js',
    './logs.js',
    './manifest.json',
    './icon-192.png',
    './icon-512.png',
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
