// ================================================
// api.js — Camada de integração com o backend SIGAC
// ================================================

const API_BASE = 'https://sigac-back-6jy9.onrender.com';

// -----------------------------------------------
// Helpers internos
// -----------------------------------------------

function getToken() {
    return localStorage.getItem('token');
}

function getHeaders(isFormData = false) {
    const headers = { Authorization: `Bearer ${getToken()}` };
    if (!isFormData) headers['Content-Type'] = 'application/json';
    return headers;
}

async function handleResponse(res) {
    let data;
    try {
        data = await res.json();
    } catch {
        throw new Error(`Erro ${res.status}: resposta inválida do servidor.`);
    }
    if (!res.ok) {
        if (res.status === 401) {
            localStorage.clear();
            window.location.href = 'index.html';
            return;
        }
        throw new Error(data.message || `Erro ${res.status}`);
    }
    return data;
}

// -----------------------------------------------
// AUTH
// -----------------------------------------------

export async function login(email, senha) {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
    });
    return handleResponse(res);
}

// -----------------------------------------------
// USUÁRIOS
// -----------------------------------------------

export async function cadastrarUsuario(dados) {
    const res = await fetch(`${API_BASE}/api/usuarios/cadastrar`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(dados)
    });
    return handleResponse(res);
}

export async function vincularCurso(dados) {
    const res = await fetch(`${API_BASE}/api/usuarios/vincular-curso`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(dados)
    });
    return handleResponse(res);
}

export async function listarAlunos() {
    const res = await fetch(`${API_BASE}/api/usuarios/listar_alunos`, {
        headers: getHeaders()
    });
    return handleResponse(res);
}

export async function listarCoordenadores() {
    const res = await fetch(`${API_BASE}/api/usuarios/listar_coordenadores`, {
        headers: getHeaders()
    });
    return handleResponse(res);
}

// -----------------------------------------------
// CURSOS
// -----------------------------------------------

export async function cadastrarCurso(dados) {
    const res = await fetch(`${API_BASE}/api/cursos/cadastrar`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(dados)
    });
    return handleResponse(res);
}

export async function listarCursos() {
    const res = await fetch(`${API_BASE}/api/cursos/listar`, {
        headers: getHeaders()
    });
    return handleResponse(res);
}

// -----------------------------------------------
// REGRAS
// -----------------------------------------------

export async function listarRegras(cursoId = null) {
    const url = cursoId
        ? `${API_BASE}/api/regras/listar?curso_id=${cursoId}`
        : `${API_BASE}/api/regras/listar`;
    const res = await fetch(url, { headers: getHeaders() });
    return handleResponse(res);
}

export async function criarRegra(dados) {
    const res = await fetch(`${API_BASE}/api/regras/criar`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(dados)
    });
    return handleResponse(res);
}

export async function atualizarRegra(id, dados) {
    const res = await fetch(`${API_BASE}/api/regras/atualizar/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(dados)
    });
    return handleResponse(res);
}

export async function excluirRegra(id) {
    const res = await fetch(`${API_BASE}/api/regras/excluir/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    return handleResponse(res);
}

// -----------------------------------------------
// SUBMISSÕES / CERTIFICADOS
// -----------------------------------------------

export async function uploadCertificado(dados, arquivo) {
    const formData = new FormData();
    formData.append('titulo', dados.titulo);
    formData.append('id_curso', dados.id_curso);
    formData.append('id_regra_atividade', dados.id_regra_atividade);
    formData.append('carga_horaria_solicitada', dados.carga_horaria_solicitada);
    formData.append('file', arquivo);

    const res = await fetch(`${API_BASE}/api/certificados/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` }, // sem Content-Type: o browser define boundary do multipart
        body: formData
    });
    return handleResponse(res);
}

export async function listarSubmissoes(status = null) {
    const url = status
        ? `${API_BASE}/api/submissoes/listar?status=${status}`
        : `${API_BASE}/api/submissoes/listar`;
    const res = await fetch(url, { headers: getHeaders() });
    return handleResponse(res);
}

export async function validarSubmissao(id, dados) {
    const res = await fetch(`${API_BASE}/api/submissoes/validar/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(dados)
    });
    return handleResponse(res);
}

// -----------------------------------------------
// RELATÓRIOS / DASHBOARD
// -----------------------------------------------

export async function getDashboard() {
    const res = await fetch(`${API_BASE}/api/relatorios/dashboard`, {
        headers: getHeaders()
    });
    return handleResponse(res);
}
