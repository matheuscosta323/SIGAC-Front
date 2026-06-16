# SIGAC — Frontend

Interface web do **Sistema de Gestão de Atividades Complementares**, desenvolvida com HTML5, CSS3 e JavaScript puro (ES Modules), com suporte a **PWA**.

> Painel exclusivo para perfis **admin** e **coordenador**. Alunos acessam apenas as páginas de upload de certificado e acompanhamento de status.

---

## Tecnologias

| Tecnologia | Uso |
|---|---|
| HTML5 + CSS3 | Estrutura e estilização |
| JavaScript (ES Modules) | Lógica e integração com API |
| Chart.js 4 | Gráficos no dashboard e relatórios |
| Font Awesome 6 | Ícones |
| Service Worker + Web App Manifest | PWA (instalação, cache offline) |

---

## Como executar

O frontend é composto por arquivos estáticos. Você pode servir de três formas:

### Opção 1 — Node.js (recomendado)
```bash
# Instale o pacote serve globalmente (apenas uma vez)
npm install -g serve

# Dentro da pasta do frontend:
serve .
# → disponível em http://localhost:3000
```

### Opção 2 — Python
```bash
python -m http.server 3000
# → disponível em http://localhost:3000
```

### Opção 3 — VS Code
Instale a extensão **Live Server** e clique em "Go Live".

> **Atenção**: abrir os arquivos diretamente pelo `file://` impede o Service Worker de funcionar. Use sempre um servidor local.

---

## Configuração do backend

Em `src/js/api.js`, altere `API_BASE` para o endereço do seu backend Flask:

```javascript
const API_BASE = 'http://localhost:5000';
```

O backend de produção está hospedado no **Render**: `https://sigac-back-6jy9.onrender.com`

---

## Estrutura do Projeto

```
SIGAC-Front/
├── index.html                       ← Login
├── home.html                        ← Shell com sidebar + iframe
├── manifest.json                    ← Web App Manifest (PWA)
├── sw.js                            ← Service Worker (cache + offline)
│
├── assets/
│   └── icons/
│       ├── icon-192.png             ← Ícone PWA 192×192
│       └── icon-512.png             ← Ícone PWA 512×512
│
├── src/
│   ├── css/
│   │   ├── style.css                ← Estilos globais e login
│   │   ├── dashboard.css            ← Sidebar, layout, cards
│   │   ├── alunos.css               ← Tabela e barras de progresso
│   │   ├── validacao.css            ← Cards de certificado
│   │   └── relatorios.css           ← Layout de relatórios e gráficos
│   │
│   ├── js/
│   │   ├── api.js                   ← Camada de integração com o backend (ES Module)
│   │   ├── main.js                  ← Lógica compartilhada (proteção de rota, role, SW)
│   │   ├── validacao.js             ← Lógica da página de validação
│   │   ├── logs.js                  ← Lógica de logs
│   │   └── email.js                 ← Utilitários de e-mail
│   │
│   └── pages/
│       ├── dashboard.html           ← Painel principal (métricas + gráficos)
│       ├── listar-alunos.html       ← Lista de alunos com progresso de horas
│       ├── cadastrar-aluno.html     ← Formulário de cadastro de aluno
│       ├── listar-coordenadores.html
│       ├── cadastrar-coordenador.html
│       ├── vincular-curso.html      ← Vincular usuário a curso adicional
│       ├── listar-cursos.html
│       ├── cadastrar-curso.html
│       ├── regras-curso.html        ← CRUD de regras de atividade por curso
│       ├── validacao.html           ← Validação de certificados (pendente/aprovado/recusado)
│       ├── upload-certificado.html  ← Upload de certificado pelo aluno
│       ├── relatorios.html          ← Relatórios com gráficos
│       └── logs.html                ← Logs do sistema
```

---

## PWA — Progressive Web App

O SIGAC pode ser **instalado como app** em dispositivos móveis e desktops.

### Como funciona
- `manifest.json` — define nome, ícones, cor de tema e atalhos de instalação
- `sw.js` — Service Worker com duas estratégias:
  - **Cache-first** para assets estáticos (HTML, CSS, JS, ícones)
  - **Network-first** para chamadas à API (`/api/*`), com fallback offline
- O SW é registrado automaticamente pelo `main.js`

### Como instalar
No Chrome/Edge, ao acessar o sistema, aparecerá um ícone de instalação na barra de endereço. Em mobile, use "Adicionar à tela inicial".

### Atalhos do app
| Atalho | URL |
|---|---|
| Dashboard | `./home.html` |
| Validar Certificados | `./src/pages/validacao.html` |

---

## Controle de Acesso por Role

O perfil do usuário é salvo em `localStorage.perfil` após o login e controlado pelo `main.js`.

| Classe CSS | Visível para |
|---|---|
| `.only-admin` | Apenas `admin` |
| `.only-coordenador-admin` | `admin` e `coordenador` |

### Páginas por perfil

| Página | admin | coordenador |
|---|---|---|
| Dashboard (métricas) | ✅ | ✅ |
| Listar / Cadastrar Alunos | ✅ | ✅ |
| Listar / Cadastrar Coordenadores | ✅ | ❌ |
| Vincular Curso | ✅ | ❌ |
| Cursos | ✅ | ✅ (somente leitura) |
| Regras de Curso | ✅ | ❌ |
| Validação de Certificados | ✅ | ✅ (seus cursos) |
| Relatórios | ✅ | ✅ |
| Logs | ✅ | ❌ |

---

## Funcionalidades

- ✅ Login com JWT (decodifica payload para obter role e nome)
- ✅ Proteção de rotas (redireciona para login se não autenticado)
- ✅ Dashboard com métricas reais da API + gráficos (Chart.js)
- ✅ Listagem de alunos com progresso de horas por curso
- ✅ Cadastro de aluno, coordenador e curso
- ✅ Vincular usuário a múltiplos cursos
- ✅ CRUD completo de regras de atividade por curso
- ✅ Upload de certificado com seleção de regra/curso e validação de limite de horas
- ✅ Validação de certificados em 3 abas (pendente / aprovado / recusado)
- ✅ Relatórios com gráfico de evolução mensal e distribuição por área
- ✅ Logs do sistema
- ✅ PWA — instalável, funciona offline com assets em cache

---

## Integração com o Backend

Toda a comunicação com o backend está centralizada em `src/js/api.js`. Autenticação é feita via **Bearer Token** (JWT) enviado no header `Authorization` em todas as requisições protegidas.

### Endpoints utilizados

```javascript
// Auth
login(email, senha)                          // POST /api/auth/login

// Usuários
cadastrarUsuario(dados)                      // POST /api/usuarios/cadastrar
vincularCurso({ id_usuario, id_curso })      // POST /api/usuarios/vincular-curso
listarAlunos()                               // GET  /api/usuarios/listar_alunos
listarCoordenadores()                        // GET  /api/usuarios/listar_coordenadores

// Cursos
cadastrarCurso(dados)                        // POST /api/cursos/cadastrar
listarCursos()                               // GET  /api/cursos/listar

// Regras
listarRegras(cursoId?)                       // GET  /api/regras/listar[?curso_id=]
criarRegra(dados)                            // POST /api/regras/criar
atualizarRegra(id, dados)                    // PUT  /api/regras/atualizar/:id
excluirRegra(id)                             // DELETE /api/regras/excluir/:id

// Submissões / Certificados
uploadCertificado(dados, arquivo)            // POST /api/certificados/upload (multipart)
listarSubmissoes(status?)                    // GET  /api/submissoes/listar[?status=]
validarSubmissao(id, dados)                  // PUT  /api/submissoes/validar/:id

// Dashboard
getDashboard()                               // GET  /api/relatorios/dashboard
```

> Em caso de resposta `401 Unauthorized`, o token é removido do `localStorage` e o usuário é redirecionado para a tela de login automaticamente.
