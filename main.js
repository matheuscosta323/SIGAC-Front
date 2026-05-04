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
        const coordenadores = [
            {
                nome: 'Ameliara Freire',
                email: 'coordenador@senac.br',
                curso: 'ADS'
            },
            {
                nome: 'Carlos Henrique',
                email: 'carlos@senac.br',
                curso: 'Administração'
            },
            {
                nome: 'Juliana Souza',
                email: 'juliana@senac.br',
                curso: 'Design Gráfico'
            }
        ];

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


    // ==========================================
    // TROCAR ENTRE TABS
    // ==========================================
    const tabAlunos = document.getElementById('tabAlunos');
    const tabCoordenadores = document.getElementById('tabCoordenadores');

    if (tabAlunos && tabCoordenadores) {
        tabAlunos.addEventListener('click', () => {
            document.getElementById('listaAlunos').style.display = 'grid';
            document.getElementById('listaCoordenadores').style.display = 'none';

            tabAlunos.classList.add('active');
            tabCoordenadores.classList.remove('active');
        });

        tabCoordenadores.addEventListener('click', () => {
            document.getElementById('listaAlunos').style.display = 'none';
            document.getElementById('listaCoordenadores').style.display = 'grid';

            tabCoordenadores.classList.add('active');
            tabAlunos.classList.remove('active');
        });
    }


    // ==========================================
    // CONTROLE DE ACESSO GLOBAL
    // ==========================================
    const perfil = localStorage.getItem('perfilLogado');
    const nome = localStorage.getItem('nomeUsuario');

    // bloqueia páginas sem login
    if (!perfil && !window.location.pathname.includes('index.html')) {
        window.location.href = 'index.html';
        return;
    }

    // mostra nome do usuário quando existir elemento
    const elementoNome = document.getElementById('nome-usuario-topo');
    if (elementoNome) {
        elementoNome.innerText = nome;
    }

    // esconde itens exclusivos de admin
    if (perfil === 'coordenador') {
        const itensAdmin = document.querySelectorAll('.only-admin');

        itensAdmin.forEach(item => {
            item.style.display = 'none';
        });
    }
});