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

- `http://localhost:8080`

Os endpoints preparados no projeto incluem:

- `/clientes`
- `/barbeiros`
- `/servicos`
- `/produtos`
- `/agendamentos`
- `/vendas`

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

## Status

Projeto funcional, com build validado e pronto para evolução visual e integração com backend real.
