// main.js — Lógica compartilhada entre as páginas

document.addEventListener('DOMContentLoaded', () => {
    const perfil = localStorage.getItem('perfil');
    const nomeUsuario = localStorage.getItem('nomeUsuario');

    aplicarControleDeAcesso(perfil);

    // Nome no topo
    const nomeEl = document.getElementById('nome-usuario-topo');
    if (nomeEl && nomeUsuario) nomeEl.textContent = nomeUsuario;

    // Proteção de rota — redireciona para login se não autenticado
    const paginasProtegidas = [
        'home.html', 'dashboard.html', 'listar-alunos.html',
        'listar-cursos.html', 'listar-coordenadores.html',
        'cadastrar-aluno.html', 'cadastrar-coordenador.html',
        'cadastrar-curso.html', 'validacao.html', 'vincular-curso.html',
        'regras-curso.html', 'relatorios.html', 'logs.html'
    ];
    const paginaAtual = window.location.pathname.split('/').pop() || 'index.html';
    if (paginasProtegidas.includes(paginaAtual) && !localStorage.getItem('token')) {
        window.location.href = '../../index.html';
        return;
    }

    // Marcar link ativo no menu da sidebar
    document.querySelectorAll('.menu a').forEach(link => {
        if (link.href && link.href.includes(paginaAtual)) {
            link.classList.add('active');
        }
    });

    // Registrar Service Worker (PWA)
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('../../sw.js').catch(() => {});
    }
});

//Controla visibilidade por role.
//   .only-admin 
//   .only-coordenador-admin

function aplicarControleDeAcesso(perfil) {
    function mostrar(selector) {
        document.querySelectorAll(selector).forEach(el => { el.style.display = 'flex'; });
    }
    function esconder(selector) {
        document.querySelectorAll(selector).forEach(el => { el.style.display = 'none'; });
    }
    esconder('.only-admin');
    esconder('.only-coordenador-admin');

    if (perfil === 'admin') {
        mostrar('.only-admin');
        mostrar('.only-coordenador-admin');
    } else if (perfil === 'coordenador') {
        esconder('.only-admin');
        mostrar('.only-coordenador-admin');
    }
}

// Logout global
function logout() {
    localStorage.clear();
    window.location.href = '../../index.html';
}

// Exibe mensagem de feedback (sucesso ou erro) num elemento
function exibirMensagem(elementId, texto, tipo = 'sucesso') {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.textContent = texto;
    el.style.display = 'block';
    el.style.color = tipo === 'sucesso' ? '#059669' : '#dc2626';
    el.style.padding = '10px 14px';
    el.style.borderRadius = '8px';
    el.style.background = tipo === 'sucesso' ? '#ecfdf5' : '#fef2f2';
    el.style.border = `1px solid ${tipo === 'sucesso' ? '#d1fae5' : '#fee2e2'}`;
    setTimeout(() => { el.style.display = 'none'; }, 5000);
}
