<<<<<<< Updated upstream
# SIGAC-Front

Sistema de Gestão de Atividades Complementares – Interface web.

## Funcionalidades

- Login com autenticação JWT
- Cadastro e listagem de alunos, coordenadores e cursos
- Submissão de certificados pelos alunos
- Validação de horas pelos coordenadores
- Relatórios com gráficos de evolução e distribuição
- Logs do sistema
- Interface responsiva e PWA

## Tecnologias

- HTML5, CSS3, JavaScript
- Chart.js (gráficos)
- Service Worker + Manifest (PWA)

## Estrutura
SIGAC-Front/
├── index.html
├── home.html
├── dashboard.html
├── listar-alunos.html
├── cadastrar-aluno.html
├── listar-coordenadores.html
├── cadastrar-coordenador.html
├── listar-cursos.html
├── cadastrar-curso.html
├── upload-certificado.html
├── validacao.html
├── relatorios.html
├── regras-curso.html
├── logs.html
├── style.css
├── dashboard.css
├── alunos.css
├── validacao.css
├── relatorios.css
├── auth.js
├── dashboard.js
├── home.js
├── email.js
├── manifest.json
├── sw.js
└── icon-*.png

## Integração com o Backend

A aplicação consome uma API REST (Flask). On backend está deployado no Render.
=======
# SIGAC — Frontend

Interface web do **Sistema de Gestão de Atividades Complementares**, desenvolvida com HTML5, CSS3 e JavaScript puro (ES Modules), com suporte a **PWA**.

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

O frontend é composto por arquivos estáticos. Você pode servir de duas formas:

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

> **Atenção**: abrir os arquivos diretamente pelo `file://` faz o Service Worker não funcionar. Use sempre um servidor local.

---

## Configuração do backend

Em `api.js`, altere `API_BASE` para o endereço do seu backend Flask:

```javascript
const API_BASE = 'http://localhost:5000';
```

---

## Estrutura do Projeto

```
SIGAC-Front/
├── index.html                  ← Login
├── home.html                   ← Shell com sidebar + iframe
├── dashboard.html              ← Painel principal (métricas + gráficos)
├── listar-alunos.html          ← Lista de alunos com progresso
├── cadastrar-aluno.html        ← Formulário de cadastro de aluno
├── listar-coordenadores.html   ← Lista de coordenadores
├── cadastrar-coordenador.html  ← Formulário de cadastro de coordenador
├── vincular-curso.html         ← Vincular usuário a curso adicional (NOVO)
├── listar-cursos.html          ← Lista de cursos
├── cadastrar-curso.html        ← Formulário de cadastro de curso
├── regras-curso.html           ← CRUD de regras de atividade por curso
├── validacao.html              ← Validação de certificados (tabs: pendente/aprovado/recusado)
├── upload-certificado.html     ← Upload de certificado pelo aluno
├── relatorios.html             ← Relatórios com gráficos
├── logs.html                   ← Logs do sistema
│
├── api.js                      ← Camada de integração com o backend (ES Module)
├── main.js                     ← Lógica compartilhada (proteção de rota, role, SW)
├── validacao.js                ← Lógica da página de validação
├── logs.js                     ← Lógica de logs
│
├── style.css                   ← Estilos globais e login
├── dashboard.css               ← Sidebar, layout, cards
├── alunos.css                  ← Tabela e barras de progresso
├── validacao.css               ← Cards de certificado
├── relatorios.css              ← Layout de relatórios e gráficos
│
├── manifest.json               ← Web App Manifest (PWA)
├── sw.js                       ← Service Worker (cache + offline)
├── icon-192.png                ← Ícone PWA 192×192
└── icon-512.png                ← Ícone PWA 512×512
```

---

## PWA — Progressive Web App

O SIGAC pode ser **instalado como app** em dispositivos móveis e desktops.

### Como funciona
- `manifest.json` — define nome, ícones, cor de tema e atalhos de instalação
- `sw.js` — Service Worker com duas estratégias:
  - **Cache-first** para assets estáticos (HTML, CSS, JS, ícones)
  - **Network-first** para chamadas à API (`/api/*`), com fallback de erro offline
- O SW é registrado automaticamente pelo `main.js` e `index.html`

### Como instalar
No Chrome/Edge, ao acessar o sistema, aparecerá um ícone de instalação na barra de endereço. Em mobile, use "Adicionar à tela inicial".

---

## Controle de Acesso por Role

Cada página respeita o perfil (`localStorage.perfil`) salvo no login:

| Classe CSS | Visível para |
|---|---|
| `.only-admin` | Apenas `admin` |
| `.only-coordenador-admin` | `admin` e `coordenador` |
| `.only-aluno` | Apenas `aluno` |

O `main.js` controla automaticamente a visibilidade de elementos com essas classes.

---

## Páginas por Perfil

| Página | admin | coordenador | aluno |
|---|---|---|---|
| Dashboard (métricas) | ✅ | ✅ | ✅ (básico) |
| Listar / Cadastrar Alunos | ✅ | ✅ | ❌ |
| Listar / Cadastrar Coordenadores | ✅ | ❌ | ❌ |
| Vincular Curso | ✅ | ❌ | ❌ |
| Cursos | ✅ | ✅ (ver) | ❌ |
| Regras de Curso | ✅ | ❌ | ❌ |
| Validação de Certificados | ✅ | ✅ (seus cursos) | ✅ (ver) |
| Upload de Certificado | ❌ | ❌ | ✅ |
| Relatórios | ✅ | ✅ | ❌ |
| Logs | ✅ | ❌ | ❌ |

---

## Funcionalidades Implementadas

- ✅ Login com JWT (decodifica payload para obter role e nome)
- ✅ Proteção de rotas (redireciona para login se não autenticado)
- ✅ Dashboard com métricas reais da API + gráficos (Chart.js)
- ✅ Listagem de alunos com progresso de horas por curso
- ✅ Cadastro de aluno, coordenador e curso
- ✅ **Vincular usuário a múltiplos cursos** (novo)
- ✅ **CRUD completo de regras de atividade** por curso (novo)
- ✅ Upload de certificado com seleção de regra/curso e validação de limite de horas
- ✅ Validação de certificados em 3 abas (pendente / aprovado / recusado)
- ✅ Relatórios com gráfico de evolução mensal e distribuição por área
- ✅ **PWA** — instalável, funciona offline com assets em cache

---

## Integração com o Backend

Toda comunicação com o backend está centralizada em `api.js`. As funções exportadas:

```javascript
// Auth
login(email, senha)

// Usuários
cadastrarUsuario(dados)
vincularCurso({ id_usuario, id_curso })   // novo
listarAlunos()
listarCoordenadores()

// Cursos
cadastrarCurso(dados)
listarCursos()

// Regras
listarRegras(cursoId?)
criarRegra(dados)
atualizarRegra(id, dados)
excluirRegra(id)

// Submissões
uploadCertificado(formData)
listarSubmissoes(status?)
validarSubmissao(id, dados)

// Dashboard
getDashboard()
```
>>>>>>> Stashed changes
