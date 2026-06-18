import { listarSubmissoes, validarSubmissao } from './api.js';

document.addEventListener('DOMContentLoaded', () => {

    const listaCertificados = document.getElementById('listaCertificados');
    const tabs = document.querySelectorAll('.tab-btn');
    const countPendente = document.getElementById('count-pendente');
    const countAprovado = document.getElementById('count-aprovado');
    const countRejeitado = document.getElementById('count-rejeitado');

    const perfil = localStorage.getItem('perfil');
    let todasSubmissoes = [];

    async function carregarSubmissoes() {
        try {
            const data = await listarSubmissoes();
            todasSubmissoes = data.submissoes || [];
            atualizarContadores();
            const tabAtiva = document.querySelector('.tab-btn.active');
            renderizar(tabAtiva ? tabAtiva.dataset.status : 'pendente');
        } catch (err) {
            if (listaCertificados) {
                listaCertificados.innerHTML = `<div style="padding:20px;text-align:center;color:#dc2626;">${err.message}</div>`;
            }
        }
    }

    function atualizarContadores() {
        if (countPendente) countPendente.textContent = todasSubmissoes.filter(s => s.status === 'pendente').length;
        if (countAprovado) countAprovado.textContent = todasSubmissoes.filter(s => s.status === 'aprovado').length;
        if (countRejeitado) countRejeitado.textContent = todasSubmissoes.filter(s => s.status === 'recusado').length;
    }

    function renderizar(status) {
        if (!listaCertificados) return;
        // 'recusado' no backend, 'rejeitado' na tab
        const statusBackend = status === 'rejeitado' ? 'recusado' : status;
        const filtrados = todasSubmissoes.filter(s => s.status === statusBackend);

        if (filtrados.length === 0) {
            listaCertificados.innerHTML = '<div style="padding:20px;text-align:center;color:#64748b;">Nenhum certificado encontrado.</div>';
            return;
        }

        const podValidar = perfil === 'coordenador' || perfil === 'admin';

        listaCertificados.innerHTML = filtrados.map(s => `
            <div class="cert-card" data-id="${s.id}">
                <h3>${s.atividade_descricao}</h3>
                <p><strong>Aluno:</strong> ${s.aluno_nome} — ${s.aluno_email}</p>
                <p><strong>Curso:</strong> ${s.curso_nome}</p>
                <p><strong>Horas solicitadas:</strong> ${s.carga_horaria_solicitada}h</p>
                ${s.carga_horaria_aprovada ? `<p><strong>Horas aprovadas:</strong> ${s.carga_horaria_aprovada}h</p>` : ''}
                ${s.motivo_rejeicao ? `<p><strong>Motivo:</strong> ${s.motivo_rejeicao}</p>` : ''}
                <p><small>Enviado em: ${new Date(s.data_envio).toLocaleDateString('pt-BR')}</small></p>

                <span class="status-pill ${s.status}">${s.status}</span>

                <div class="cert-actions">
                    ${s.certificado_url ? `
                        <a class="btn-view" href="${s.certificado_url}" download target="_blank" rel="noopener">
                            <i class="fa-solid fa-download"></i> Baixar certificado
                        </a>
                    ` : ''}

                    ${(s.status === 'pendente' && podValidar) ? `
                        <button class="btn-approve" data-id="${s.id}">
                            <i class="fa-regular fa-circle-check"></i> Aprovar
                        </button>
                        <button class="btn-reject" data-id="${s.id}">
                            <i class="fa-regular fa-circle-xmark"></i> Rejeitar
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    // Delegação de eventos nos cards
    if (listaCertificados) {
        listaCertificados.addEventListener('click', async (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;

            const id = Number(btn.dataset.id);

            // Aprovar
            if (btn.classList.contains('btn-approve')) {
                const horas = prompt('Quantidade de horas a aprovar:');
                if (!horas) return;
                try {
                    await validarSubmissao(id, {
                        status: 'aprovado',
                        carga_horaria_aprovada: Number(horas)
                    });
                    alert('Submissão aprovada!');
                    carregarSubmissoes();
                } catch (err) {
                    alert(err.message || 'Erro ao aprovar.');
                }
            }

            // Rejeitar
            if (btn.classList.contains('btn-reject')) {
                const motivo = prompt('Motivo da recusa:');
                if (!motivo) return;
                try {
                    await validarSubmissao(id, {
                        status: 'recusado',
                        motivo_rejeicao: motivo
                    });
                    alert('Submissão recusada.');
                    carregarSubmissoes();
                } catch (err) {
                    alert(err.message || 'Erro ao recusar.');
                }
            }
        });
    }

    // Tabs
    tabs.forEach(btn => {
        btn.addEventListener('click', () => {
            tabs.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderizar(btn.dataset.status);
        });
    });

    carregarSubmissoes();
});
