
document.addEventListener('DOMContentLoaded', () => {
    const perfil = localStorage.getItem('perfilLogado');
    const nomeUsuario = localStorage.getItem('nomeUsuario');

    // =========================
    // CONTROLE DE ACESSO
    // =========================
    if (!window.location.pathname.includes('index.html')) {
        if (!perfil) {
            window.location.href = 'index.html';
            return;
        }
    }

    const nomeTopo = document.getElementById('nome-usuario-topo');
    if (nomeTopo) nomeTopo.innerText = nomeUsuario || '';

    if (perfil !== 'admin') {
        document.querySelectorAll('.only-admin').forEach((item) => {
            item.remove();
        });
    }

    // =========================
    // LOGIN
    // =========================
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value.trim().toLowerCase();
            const senha = document.getElementById('password').value;

            if (email === 'admin@senac.br' && senha === 'admin123') {
                localStorage.setItem('perfilLogado', 'admin');
                localStorage.setItem('nomeUsuario', 'Administrador');
                window.location.href = 'home.html';
                return;
            }

            const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

            const usuario = usuarios.find(
                u => u.email.toLowerCase() === email && u.senha === senha
            );

            if (usuario) {
                localStorage.setItem('perfilLogado', usuario.tipo);
                localStorage.setItem('nomeUsuario', usuario.nome);
                window.location.href = 'home.html';
            } else {
                alert('Credenciais incorretas.');
            }
        });
    }

    // =========================
    // CADASTRO CURSO
    // =========================
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

    // =========================
    // PREENCHER SELECTS DE CURSO
    // =========================
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
            const vinculo = alunoCurso.find((v) => v.id_aluno === aluno.id);
            const curso = cursos.find((c) => c.id === vinculo?.id_curso);

            listaAlunos.innerHTML += `
                <tr>
                    <td>
                        <strong style="color:#0a2540;">${aluno.nome}</strong><br>
                        <small style="color:#94a3b8;">Matrícula: ${aluno.matricula}</small>
                    </td>
                    <td>${curso ? curso.nome : 'Sem curso'}</td>
                    <td>0/100h</td>
                    <td><span class="pill pill-pending">Pendente</span></td>
                    <td><i class="fa-regular fa-eye"></i></td>
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
