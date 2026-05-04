document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    // ==========================================
    // LOGIN
    // ==========================================
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


    // ==========================================
    // CADASTRO DE ALUNO
    // ==========================================
    const formAluno = document.getElementById('formCadastroAluno');

    if (formAluno) {
        formAluno.addEventListener('submit', (e) => {
            e.preventDefault();

            const aluno = {
                nomeCompleto: document.getElementById('nomeAluno').value,
                matricula: document.getElementById('matricula').value,
                cpf: document.getElementById('cpf').value,
                telefone: document.getElementById('telefone').value,
                curso: document.getElementById('curso').value,
                periodo: document.getElementById('periodo').value,
                email: document.getElementById('emailAluno').value
            };

            let alunos = JSON.parse(localStorage.getItem('alunos')) || [];
            alunos.push(aluno);

            localStorage.setItem('alunos', JSON.stringify(alunos));

            alert(`Aluno ${aluno.nomeCompleto} cadastrado com sucesso!`);
            formAluno.reset();
        });
    }


    // ==========================================
    // CADASTRO DE COORDENADOR
    // ==========================================
    const formCoordenador = document.getElementById('formCadastroCoordenador');

    if (formCoordenador) {
        formCoordenador.addEventListener('submit', (e) => {
            e.preventDefault();

            const coordenador = {
                nome: document.getElementById('nomeCoordenador').value,
                email: document.getElementById('emailCoordenador').value,
                curso: document.getElementById('cursoCoordenador').value
            };

            let coordenadores = JSON.parse(localStorage.getItem('coordenadores')) || [];
            coordenadores.push(coordenador);

            localStorage.setItem('coordenadores', JSON.stringify(coordenadores));

            alert('Coordenador cadastrado com sucesso!');
            formCoordenador.reset();
        });
    }


    // ==========================================
    // CADASTRO DE CURSO
    // ==========================================
    const formCurso = document.getElementById('formCadastroCurso');

    if (formCurso) {
        formCurso.addEventListener('submit', (e) => {
            e.preventDefault();

            let cursos = JSON.parse(localStorage.getItem('cursos')) || [];

            const curso = {
                id: cursos.length + 1,
                nome: document.getElementById('nomeCurso').value,
                cargaHoraria: document.getElementById('cargaHoraria').value
            };

            cursos.push(curso);

            localStorage.setItem('cursos', JSON.stringify(cursos));

            alert('Curso cadastrado com sucesso!');
            formCurso.reset();
        });
    }


    // ==========================================
    // LISTAR ALUNOS
    // ==========================================
    const listaAlunos = document.getElementById('listaAlunos');

    if (listaAlunos) {
        const alunos = JSON.parse(localStorage.getItem('alunos')) || [];

        if (alunos.length === 0) {
            listaAlunos.innerHTML = '<p>Nenhum aluno cadastrado.</p>';
        } else {
            alunos.forEach((aluno) => {
                listaAlunos.innerHTML += `
                    <div class="card-aluno">
                        <h3>${aluno.nomeCompleto}</h3>
                        <p><strong>Matrícula:</strong> ${aluno.matricula}</p>
                        <p><strong>CPF:</strong> ${aluno.cpf}</p>
                        <p><strong>Telefone:</strong> ${aluno.telefone}</p>
                        <p><strong>Curso:</strong> ${aluno.curso}</p>
                        <p><strong>Período:</strong> ${aluno.periodo}º</p>
                        <p><strong>Email:</strong> ${aluno.email}</p>
                    </div>
                `;
            });
        }
    }


    // ==========================================
    // LISTAR COORDENADORES
    // ==========================================
    const listaCoordenadores = document.getElementById('listaCoordenadores');

    if (listaCoordenadores) {
        const coordenadores = JSON.parse(localStorage.getItem('coordenadores')) || [];

        if (coordenadores.length === 0) {
            listaCoordenadores.innerHTML = '<p>Nenhum coordenador cadastrado.</p>';
        } else {
            coordenadores.forEach((coord) => {
                listaCoordenadores.innerHTML += `
                    <div class="card-aluno">
                        <h3>${coord.nome}</h3>
                        <p><strong>Email:</strong> ${coord.email}</p>
                        <p><strong>Curso:</strong> ${coord.curso}</p>
                    </div>
                `;
            });
        }
    }


    // ==========================================
    // LISTAR CURSOS
    // ==========================================
    const listaCursos = document.getElementById('listaCursos');

    if (listaCursos) {
        const cursos = JSON.parse(localStorage.getItem('cursos')) || [];
        const coordenadores = JSON.parse(localStorage.getItem('coordenadores')) || [];

        cursos.forEach((curso) => {
            const coordenadorDoCurso = coordenadores.find(
                coord => coord.curso === curso.nome
            );

            listaCursos.innerHTML += `
                <tr>
                    <td>${curso.id}</td>
                    <td>${curso.nome}</td>
                    <td>${curso.cargaHoraria}h</td>
                    <td>${coordenadorDoCurso ? coordenadorDoCurso.nome : 'Não atribuído'}</td>
                    <td>
                        <button
                            title="Editar"
                            class="only-admin"
                            style="border:none; background:none; color:#0a2540; cursor:pointer;"
                        >
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
    }


    // ==========================================
    // TROCAR ENTRE TABS
    // ==========================================
    const tabAlunos = document.getElementById('tabAlunos');
    const tabCoordenadoresTab = document.getElementById('tabCoordenadores');

    if (tabAlunos && tabCoordenadoresTab) {
        tabAlunos.addEventListener('click', () => {
            document.getElementById('listaAlunos').style.display = 'grid';
            document.getElementById('listaCoordenadores').style.display = 'none';

            tabAlunos.classList.add('active');
            tabCoordenadoresTab.classList.remove('active');
        });

        tabCoordenadoresTab.addEventListener('click', () => {
            document.getElementById('listaAlunos').style.display = 'none';
            document.getElementById('listaCoordenadores').style.display = 'grid';

            tabCoordenadoresTab.classList.add('active');
            tabAlunos.classList.remove('active');
        });
    }


    // ==========================================
    // CONTROLE DE ACESSO GLOBAL
    // ==========================================
    const perfil = localStorage.getItem('perfilLogado');
    const nome = localStorage.getItem('nomeUsuario');

    if (!perfil && !window.location.pathname.includes('index.html')) {
        window.location.href = 'index.html';
        return;
    }

    const elementoNome = document.getElementById('nome-usuario-topo');
    if (elementoNome) {
        elementoNome.innerText = nome;
    }

    if (perfil === 'coordenador') {
        const itensAdmin = document.querySelectorAll('.only-admin');

        itensAdmin.forEach(item => {
            item.style.display = 'none';
        });
    }
});