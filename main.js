document.addEventListener('DOMContentLoaded', () => {
    const perfil = localStorage.getItem('perfilLogado');
    const nomeUsuario = localStorage.getItem('nomeUsuario');


    if (perfil === 'coordenador') {
        // Agora isso vai rodar em qualquer página, inclusive na de Cursos!
        document.querySelectorAll('.only-admin').forEach(item => {
            item.style.setProperty('display', 'none', 'important');
        });
    } else if (perfil === 'admin') {
        // Garante que o Admin veja os itens (caso o CSS tenha escondido por padrão)
        document.querySelectorAll('.only-admin').forEach(item => {
            item.style.setProperty('display', 'flex', 'important');
        });
    }

    // === 1. SISTEMA DE LOGIN E CADASTRO ===
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value.trim().toLowerCase();
            const password = document.getElementById('password').value;

            if (email === 'admin@senac.br' && password === 'admin123') {
                localStorage.setItem('perfilLogado', 'admin');
                localStorage.setItem('nomeUsuario', 'Administrador');
                window.location.href = 'home.html';
            } 
            else if (email === 'coordenador@senac.br' && password === 'senac123') {
                localStorage.setItem('perfilLogado', 'coordenador');
                localStorage.setItem('nomeUsuario', 'Coordenadora Ameliara Freire');
                window.location.href = 'home.html';
            } 
            else {
                alert('Credenciais incorretas. Tente novamente.');
            }
        });
    }

    // CADASTRO CURSO
    const formCurso = document.getElementById('formCadastroCurso');

    if (formCurso) {
        formCurso.addEventListener('submit', (e) => {
            e.preventDefault();

            const cursos = JSON.parse(localStorage.getItem('cursos')) || [];

            cursos.push({
                id: cursos.length + 1,
                nome: document.getElementById('nomeCurso').value,
                cargaHoraria: document.getElementById('cargaHoraria').value,
                modalidade: document.getElementById('modalidade')?.value || ''
            });

            localStorage.setItem('cursos', JSON.stringify(cursos));
            alert('Curso cadastrado com sucesso!');
            formCurso.reset();
        });
    }

    // PREENCHER SELECTS DE CURSO
    function preencherSelectCursos(selectId) {
        const select = document.getElementById(selectId);
        if (!select) return;

        const cursos = JSON.parse(localStorage.getItem('cursos')) || [];

        select.innerHTML = '<option value="">Selecione um curso</option>';

        cursos.forEach((curso) => {
            select.innerHTML += `<option value="${curso.id}">${curso.nome}</option>`;
        });
    }

    preencherSelectCursos('cursoAluno');
    preencherSelectCursos('cursoCoordenador');

    // =========================
    // CADASTRO ALUNO
    // =========================
    const formAluno = document.getElementById('formCadastroAluno');

    if (formAluno) {
        formAluno.addEventListener('submit', (e) => {
            e.preventDefault();

            const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
            const alunoCurso = JSON.parse(localStorage.getItem('alunoCurso')) || [];

            const novoAluno = {
                id: usuarios.length + 1,
                nome: document.getElementById('nomeAluno').value,
                email: document.getElementById('emailAluno').value,
                senha: document.getElementById('senhaAluno').value,
                tipo: 'aluno',
                matricula: document.getElementById('matriculaAluno').value
            };

            usuarios.push(novoAluno);
            localStorage.setItem('usuarios', JSON.stringify(usuarios));

            alunoCurso.push({
                id_aluno: novoAluno.id,
                id_curso: Number(document.getElementById('cursoAluno').value)
            });

            localStorage.setItem('alunoCurso', JSON.stringify(alunoCurso));

            alert('Aluno cadastrado com sucesso!');
            formAluno.reset();
        });
    }

    // =========================
    // LISTAR ALUNOS
    // =========================
    const listaAlunos = document.getElementById('listaAlunos');

if (listaAlunos) {
    listaAlunos.innerHTML = '';

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const cursos = JSON.parse(localStorage.getItem('cursos')) || [];
    const alunoCurso = JSON.parse(localStorage.getItem('alunoCurso')) || [];
    const certificados = JSON.parse(localStorage.getItem('certificados')) || [];

    const alunos = usuarios.filter((u) => u.tipo === 'aluno');

    if (alunos.length === 0) {
        listaAlunos.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center; padding:20px;">
                    Nenhum aluno cadastrado.
                </td>
            </tr>
        `;
    }

    alunos.forEach((aluno) => {

        // =========================
        // CURSO
        // =========================
        const vinculo = alunoCurso.find((v) => v.id_aluno === aluno.id);
        const curso = cursos.find((c) => c.id === vinculo?.id_curso);

        // =========================
        // CÁLCULO DE HORAS
        // =========================
        const certificadosAluno = certificados.filter(
            (c) => c.alunoId === aluno.id && c.status === 'aprovado'
        );

        const horasConcluidas = certificadosAluno.reduce(
            (total, cert) => total + (Number(cert.cargaHoraria) || 0),
            0
        );

        const totalHoras = 100; // 🔥 pode mudar depois para dinâmica

        const porcentagem = Math.min(
            (horasConcluidas / totalHoras) * 100,
            100
        );

        // =========================
        // STATUS
        // =========================
        let status = 'Pendente';
        let statusClass = 'pill-pending';

        if (porcentagem >= 100) {
            status = 'Concluído';
            statusClass = 'pill-approved';
        }

        // =========================
        // RENDER
        // =========================
        listaAlunos.innerHTML += `
            <tr>
                <td>
                    <strong style="color:#0a2540;">${aluno.nome}</strong><br>
                    <small style="color:#94a3b8;">Matrícula: ${aluno.matricula}</small>
                </td>

                <td>${curso ? curso.nome : 'Sem curso'}</td>

                <td>
                    <div style="display:flex; flex-direction:column; gap:5px;">
                        <small>${horasConcluidas}/${totalHoras}h</small>

                        <div style="background:#e5e7eb; height:8px; border-radius:8px; overflow:hidden;">
                            <div style="
                                width:${porcentagem}%;
                                height:100%;
                                background:#22c55e;
                                transition:0.3s;
                            "></div>
                        </div>
                    </div>
                </td>

                <td>
                    <span class="pill ${statusClass}">
                        ${status}
                    </span>
                </td>

                <td>
                    <i class="fa-regular fa-eye"></i>
                </td>
            </tr>
        `;
    });
}

    // =========================
    // LISTAR CURSOS
    // =========================
    const listaCursos = document.getElementById('listaCursos');

    if (listaCursos) {
        listaCursos.innerHTML = '';

        const cursos = JSON.parse(localStorage.getItem('cursos')) || [];

        if (cursos.length === 0) {
            listaCursos.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align:center;">Nenhum curso cadastrado.</td>
                </tr>
            `;
        }

        cursos.forEach((curso) => {
            listaCursos.innerHTML += `
                <tr>
                    <td>${curso.id}</td>
                    <td>${curso.nome}</td>
                    <td>${curso.cargaHoraria}h</td>
                    <td>Não atribuído</td>
                    <td><i class="fa-solid fa-pen-to-square"></i></td>
                </tr>
            `;
        });
    }

    // =========================
    // LISTAR COORDENADORES
    // =========================
const listaCoordenadores = document.getElementById('listaCoordenadores');

if (listaCoordenadores) {
    listaCoordenadores.innerHTML = '';

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    // 🔥 FILTRA APENAS COORDENADORES
    const coordenadores = usuarios.filter((u) => u.tipo === 'coordenador');

    if (coordenadores.length === 0) {
        listaCoordenadores.innerHTML = `
            <tr>
                <td colspan="4" style="text-align:center;">
                    Nenhum coordenador cadastrado.
                </td>
            </tr>
        `;
        return;
    }

    coordenadores.forEach((coord) => {
        listaCoordenadores.innerHTML += `
            <tr>
                <td>${coord.nome}</td>
                <td>${coord.email}</td>
                <td>${coord.matricula}</td>
                <td>
                    <i class="fa-solid fa-pen-to-square"></i>
                </td>
            </tr>
        `;
    });
}

    // =========================
    // CADASTRO COORDENADOR
    // =========================
    const formCoordenador = document.getElementById('formCadastroCoordenador');

    if (formCoordenador) {
        formCoordenador.addEventListener('submit', (e) => {
            e.preventDefault();

            const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

            usuarios.push({
                id: usuarios.length + 1,
                nome: document.getElementById('nomeCoordenador').value,
                email: document.getElementById('emailCoordenador').value,
                senha: document.getElementById('senhaCoordenador').value,
                tipo: 'coordenador',
                matricula: document.getElementById('matriculaCoordenador').value
            });

            localStorage.setItem('usuarios', JSON.stringify(usuarios));
            alert('Coordenador cadastrado com sucesso!');
            formCoordenador.reset();
        });
    }

});