const CACHE_NAME = 'sigac-cache-v5';

const assets = [
    './',
    './index.html',
    './dashboard.html',
    './listar-alunos.html',
    './cadastrar-aluno.html',
    './listar-cursos.html',
    './cadastrar-curso.html',
    './analise.html',
    './validacao.html',      
    './regras-curso.html',
    './style.css',
    './dashboard.css',
    './validacao.css',      
    './alunos.css',    
    './relatorios.html',
    './main.js',
    './manifest.json',
    './icon-192.png',
    './icon-512.png',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
];

// Instalação: Cacheia arquivos e força a ativação imediata
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('SIGAC: Cache de ativos realizado com sucesso');
      return cache.addAll(assets);
    })
  );
  self.skipWaiting(); 
});

// Ativação: Limpa caches de versões anteriores (v1, etc)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => {
              console.log('SIGAC: Limpando cache antigo:', key);
              return caches.delete(key);
            })
      );
    })
  );
});

// Fetch: Tenta buscar no cache, se não tiver, busca na rede
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request);
    })
  );
});