# 💈 Barbearia Web — Front-end SaaS

Front-end de um **SaaS para gestão de barbearias**, desenvolvido com **Next.js (App Router)** e **TypeScript**, consumindo uma API própria.

O sistema foi pensado para atender **múltiplas barbearias**, utilizando **slug na URL** para carregar dados dinâmicos de cada cliente do SaaS.

---

## 🚀 Funcionalidades

- 🌐 Sistema multi-barbearia via **slug** (`/barbearia-do-lucas`)
- 📅 Agendamento de horários
- 📊 Dashboard com métricas de agendamentos
- 🗂️ Gerenciamento de agendamentos
- 🔐 Área de login
- 🧠 Context API para estado global
- 📱 Layout responsivo
- ⚙️ Middleware para controle de acesso

---

## 🛠️ Tecnologias Utilizadas

- **Next.js** (App Router)
- **React**
- **TypeScript**
- **CSS Modules / Global CSS**
- **Context API**
- **Middleware (Next.js)**
- **Consumo de API REST**
- **Git & GitHub**

---

## 🧠 Arquitetura e Conceitos Aplicados

- **App Router (`src/app`)**
- **Rotas dinâmicas com slug**
- **Layouts aninhados**
- **Separação por domínio de funcionalidade**
- **Tipagem forte com TypeScript**
- **Middleware para proteção de rotas**
- **Projeto desacoplado do back-end**

---

## 📂 Estrutura do Projeto
```bash

src/
├── app/
│ ├── [slug]/
│ │ ├── agendamento/
│ │ ├── dashboard/
│ │ ├── meus-agendamentos/
│ │ ├── layout.tsx
│ │ └── page.tsx
│ ├── components/
│ ├── login/
│ ├── types/
│ ├── globals.css
│ ├── layout.tsx
│ └── page.tsx
├── contexts/
├── middleware.ts
public/
│ ├── logo.png
│ ├── imagem-hero.avif
│ └── ilustrativa-sobre.jpg


GET /barbershops/:slug
GET /barbershops/:slug/availability?date=YYYY-MM-DD
POST /appointments
```

---

## ▶️ Como Rodar o Projeto Localmente

```bash

1. Clone o repositório:
git clone https://github.com/josuesoares64/barbearia_web.git

Acesse a pasta:

cd barbearia_web


Instale as dependências:

npm install


Rode o projeto:

npm run dev


Acesse no navegador:

http://localhost:3000

📈 Status do Projeto

🚧 Em desenvolvimento ativo

Funcionalidades futuras:

Autenticação completa com JWT

Proteção avançada de rotas

Área administrativa do dono da barbearia

Métricas financeiras

Publicação como produto SaaS

👨‍💻 Autor

Josué Bezerra Soares
Desenvolvedor Full Stack

GitHub: https://github.com/josuesoares64