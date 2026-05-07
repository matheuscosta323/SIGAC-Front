import { 
    enviarEmailAprovacao, 
    enviarEmailRecusa 
} from './email.js';

document.addEventListener('DOMContentLoaded', () => {

    let certificados = JSON.parse(localStorage.getItem('certificados')) || [];

    function salvarCertificados() {
        localStorage.setItem('certificados', JSON.stringify(certificados));
    }

    function registrarLog(acao, certificado) {

        const logs = JSON.parse(localStorage.getItem('logs')) || [];
        const nomeUsuario = localStorage.getItem('nomeUsuario') || 'Usuário';

        const novoLog = {
            usuario: nomeUsuario,
            acao,
            certificado,
            data: new Date().toLocaleString()
        };

        logs.push(novoLog);
        localStorage.setItem('logs', JSON.stringify(logs));
    }

    const listaCertificados = document.getElementById('listaCertificados');
    const tabs = document.querySelectorAll('.tab-btn');

    const countPendente = document.getElementById('count-pendente');
    const countAprovado = document.getElementById('count-aprovado');
    const countRejeitado = document.getElementById('count-rejeitado');

    const btnCriarCertificado = document.getElementById('btnCriarCertificado');


    function atualizarContadores() {
        const pendentes = certificados.filter(c => c.status === 'pendente').length;
        const aprovados = certificados.filter(c => c.status === 'aprovado').length;
        const rejeitados = certificados.filter(c => c.status === 'rejeitado').length;

        if (countPendente) countPendente.innerText = pendentes;
        if (countAprovado) countAprovado.innerText = aprovados;
        if (countRejeitado) countRejeitado.innerText = rejeitados;
    }


    function renderizarCertificados(status) {

        if (!listaCertificados) return;

        listaCertificados.innerHTML = '';

        const filtrados = certificados.filter(c => c.status === status);

        if (filtrados.length === 0) {
            listaCertificados.innerHTML = `
                <div style="padding: 20px; text-align:center; color:#64748b;">
                    Nenhum certificado encontrado.
                </div>
            `;
            return;
        }

        filtrados.forEach(cert => {
            listaCertificados.innerHTML += `
                <div class="cert-card">
                    <h3>${cert.titulo}</h3>
                    <p>${cert.aluno}</p>

                    <span class="status-pill ${cert.status}">
                        ${cert.status}
                    </span>

                    <div class="cert-actions">

                        <button class="btn-view" data-id="${cert.id}">
                            <i class="fa-regular fa-eye"></i> Ver
                        </button>

                        <button class="btn-download" data-id="${cert.id}">
                            <i class="fa-solid fa-download"></i>
                        </button>

                        ${cert.status === 'pendente' ? `
                            <button class="btn-approve" data-id="${cert.id}">
                                <i class="fa-regular fa-circle-check"></i> Aprovar
                            </button>

                            <button class="btn-reject" data-id="${cert.id}">
                                <i class="fa-regular fa-circle-xmark"></i> Rejeitar
                            </button>
                        ` : ''}
                    </div>
                </div>
            `;
        });
    }


    if (listaCertificados) {
        listaCertificados.addEventListener('click', async (e) => {

            const btn = e.target.closest('button');
            if (!btn) return;

            const id = Number(btn.dataset.id);
            const cert = certificados.find(c => c.id === id);
            if (!cert) return;

            // botão aprovar

            if (btn.classList.contains('btn-approve')) {
                cert.status = 'aprovado';
                salvarCertificados();

                registrarLog('aprovou o certificado', cert.titulo);

                if (cert.emailAluno) {
                    await enviarEmailAprovacao(cert.emailAluno, cert.aluno);
                }

                alert('Certificado aprovado!');
            }

            //botão rejeitar

            if (btn.classList.contains('btn-reject')) {
                const motivo = prompt('Motivo da recusa:');

                cert.status = 'rejeitado';
                salvarCertificados();

                registrarLog('rejeitou o certificado', cert.titulo);

                if (cert.emailAluno) {
                    await enviarEmailRecusa(
                        cert.emailAluno,
                        cert.aluno,
                        motivo || 'Não informado'
                    );
                }

                alert('Certificado rejeitado!');
            }
                // botão ver certificados

            if (btn.classList.contains('btn-view')) {
                if (cert.arquivo) {

                    const novaJanela = window.open();

                    if (cert.arquivo.startsWith('data:image')) {
                        novaJanela.document.write(`
                            <img src="${cert.arquivo}" style="width:100%">
                        `);
                    } else {
                        novaJanela.location.href = cert.arquivo;
                    }

                } else {
                    alert('Arquivo não disponível');
                }
            }

            // botão download certificado

            if (btn.classList.contains('btn-download')) {
                if (cert.arquivo) {

                    const link = document.createElement('a');
                    link.href = cert.arquivo;

                    let extensao = 'pdf';
                    if (cert.arquivo.startsWith('data:image/png')) extensao = 'png';
                    if (cert.arquivo.startsWith('data:image/jpeg')) extensao = 'jpg';

                    link.download = `${cert.titulo}.${extensao}`;
                    link.click();

                } else {
                    alert('Arquivo não disponível');
                }
            }

            atualizarContadores();

            const tabAtiva = document.querySelector('.tab-btn.active');
            if (tabAtiva) renderizarCertificados(tabAtiva.dataset.status);
        });
    }

    tabs.forEach(btn => {
        btn.addEventListener('click', () => {

            tabs.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            renderizarCertificados(btn.dataset.status);
        });
    });

    // criação de certificado

    if (btnCriarCertificado) {
        btnCriarCertificado.addEventListener('click', () => {

            const titulo = prompt('Título do certificado:');
            if (!titulo) return;

            const aluno = prompt('Nome do aluno:');
            if (!aluno) return;

            const emailAluno = prompt('Email do aluno:');
            const arquivo = prompt('URL do arquivo (PDF ou imagem):');

            const novoCertificado = {
                id: Date.now(),
                titulo,
                aluno,
                emailAluno,
                status: 'pendente',
                arquivo: arquivo || null
            };

            certificados.push(novoCertificado);
            salvarCertificados();

            registrarLog('criou o certificado', titulo);

            atualizarContadores();

            const tabAtiva = document.querySelector('.tab-btn.active');
            if (tabAtiva) renderizarCertificados(tabAtiva.dataset.status);

            alert('Certificado criado com sucesso!');
        });
    }

    atualizarContadores();

    const tabInicial = document.querySelector('.tab-btn.active');
    if (tabInicial) {
        renderizarCertificados(tabInicial.dataset.status);
    } else {
        renderizarCertificados('pendente');
    }

});