# King of Cut

Frontend premium de barbearia construído com React + Vite, com landing page em pt-BR para portfólio e uma área administrativa para operações de clientes, barbeiros, serviços, produtos, agendamentos e vendas.

## Visão Geral

O projeto combina duas frentes no mesmo frontend:

- Landing page premium da marca King of Cut
- Painel administrativo com páginas CRUD preparadas para consumo de API

A experiência visual foi refinada com estética black + gold, animações sutis, tipografia premium e layout responsivo.

## Demonstração

GIF de navegação da landing page:

![Demonstração King of Cut](public/screenshots/demo.gif)

## Stack

- React
- Vite
- JavaScript
- React Router DOM
- Axios
- CSS customizado com foco em UI premium e responsividade

## Funcionalidades

### Landing Page

- Hero section com visual premium, fundo animado sutil e CTA para agendamento
- Navbar fixa com navegação por seções
- Seção de serviços
- Seção de barbeiros
- Seção de preços
- Depoimentos
- Formulário de agendamento
- Rodapé institucional

### Área Administrativa

- Gestão de clientes
- Gestão de barbeiros
- Gestão de serviços
- Gestão de produtos
- Gestão de agendamentos
- Gestão de vendas

## Rotas

- `/` - landing page King of Cut
- `/clientes` - painel de clientes
- `/barbeiros` - painel de barbeiros
- `/servicos` - painel de serviços
- `/produtos` - painel de produtos
- `/agendamentos` - painel de agendamentos
- `/vendas` - painel de vendas

## Integração com API

O frontend está configurado para consumir a API em:

- `https://diligent-transformation-production-4c42.up.railway.app`

Voce tambem pode sobrescrever via variavel de ambiente:

- `VITE_API_BASE_URL`

Os endpoints preparados no projeto incluem:

- `/clientes`
- `/barbeiros`
- `/servicos`
- `/produtos`
- `/agendamentos`
- `/vendas`

### Configuração Centralizada

A integração HTTP foi centralizada em `src/services/api.js` com:

- `API_BASE_URL` por ambiente (fallback para produção)
- Instância única do Axios para todo o projeto
- Interceptor de request para incluir `Authorization: Bearer <token>` quando existir token em `localStorage`
- Interceptor de response para padronização de mensagens de erro

### Organização de Serviços

Além do serviço genérico de entidades, o projeto possui serviços dedicados para separar responsabilidades:

- `src/services/authService.js` para autenticação e gerenciamento de token
- `src/services/clienteService.js` para operações de clientes

Esse padrão permite criar novos serviços específicos sem acoplamento às páginas.

### Feedback Visual de Requisições

O frontend possui feedback global para chamadas de API:

- Barra de loading no topo durante requisições em andamento
- Toast de erro com mensagem amigável em falhas de comunicação

Componente responsável: `src/components/ApiRequestFeedback.jsx`.

## Como Rodar o Projeto

### 1. Instalar dependências

```bash
npm install
```

### 2. Rodar em desenvolvimento

```bash
npm run dev
```

### 3. Gerar build de produção

```bash
npm run build
```

### 4. Visualizar build localmente

```bash
npm run preview
```

## Scripts Disponíveis

- `npm run dev` - inicia o servidor de desenvolvimento do Vite
- `npm run build` - gera o build de produção
- `npm run preview` - sobe uma prévia local do build
- `npm run lint` - executa o ESLint

## Estrutura Principal

```text
src/
	components/
	pages/
	services/
	styles/
	assets/
```

## Destaques de UI/UX

- Visual premium com paleta preta e dourada
- Tipografia com hierarquia mais editorial
- Hover states e transições suaves
- Divisores elegantes entre seções
- Scroll reveal em elementos da landing page
- Hero mais compacto e profissional

## Deploy no Railway

O projeto está configurado para deploy automático no Railway com o arquivo `railway.json`.

### Pré-requisitos

1. Conta no Railway ([railway.app](https://railway.app))
2. Repositório GitHub conectado
3. Variável de ambiente configurada no Railway:
	- `VITE_API_BASE_URL`: URL da API em produção

### Passos para Deploy

1. **Conectar Repositório**
	- Acesse o painel do Railway
	- Clique em "New Project" → "GitHub Repo"
	- Selecione o repositório `barbearia-frontend`

2. **Configurar Variáveis de Ambiente**
	- No painel do projeto Railway
	- Vá em "Variables"
	- Adicione: `VITE_API_BASE_URL=https://sua-api.railway.app`

3. **Deploy Automático**
	- Railway detectará o `railway.json` automaticamente
	- Build será executado com `npm run build`
	- Serviço iniciará com `npm run preview -- --host 0.0.0.0 --port $PORT`

### Arquivo Local

O arquivo `.env.local` é ignorado pelo git. Configure localmente com:

```bash
VITE_API_BASE_URL=http://localhost:8080
```

Para usar a API de produção no desenvolvimento:

```bash
VITE_API_BASE_URL=https://sua-api.railway.app
```

## Status

Projeto funcional, com build validado e pronto para deploy no Railway com configuração automática via railway.json.
