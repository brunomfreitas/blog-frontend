📘 README — Blog Educacional (Tech Challenge – Fase 3)
📌 Visão Geral

	Este projeto consiste no front-end de uma aplicação de blogging educacional, desenvolvida em React, com foco em oferecer uma experiência intuitiva e acessível para professores(as) e estudantes.

	A aplicação consome uma API REST previamente desenvolvida em Node.js, permitindo a criação, edição, visualização e administração de postagens educacionais, com controle de autenticação e autorização.

	Este projeto faz parte do Tech Challenge – Fase 3, atividade avaliativa obrigatória do curso.


🎯 Objetivo do Projeto

Desenvolver uma interface gráfica moderna, responsiva e funcional, que permita:

	A docentes: criar, editar e administrar postagens
	A estudantes: visualizar conteúdos educacionais publicados
	Integração completa com o back-end via endpoints REST
	Controle de acesso baseado em autenticação


🛠️ Tecnologias Utilizadas

	React (componentes funcionais e hooks)
	React Router DOM (roteamento)
	Context API (gerenciamento de estado global)
	Material UI (MUI) (estilização e responsividade)
	Formik + Yup (formulários e validação)
	Axios (requisições HTTP)
	Docker (containerização)

🧱 Arquitetura da Aplicação

A aplicação foi organizada de forma modular, visando manutenibilidade, clareza e escalabilidade.

📁 Estrutura de Pastas (resumo)
src/
 ├── auth/              # Contexto de autenticação e rotas protegidas
 ├── components/        # Componentes reutilizáveis
 ├── layout/            # Layout da aplicação (header, navegação)
 ├── pages/             # Páginas (pública e administrativa)
 ├── services/          # Comunicação com a API REST
 ├── theme/             # Configuração de tema MUI
 └── utils/             # Funções auxiliares



🔐 Gerenciamento de Estado Global

O projeto utiliza a Context API do React para gerenciamento de estado global, por meio do AuthContext.


🎯 O que é gerenciado globalmente:
	Usuário autenticado
	Token de autenticação
	Login e logout
	Controle de acesso a rotas protegidas

📌 Benefícios dessa abordagem:
	Evita prop drilling
	Centraliza regras de autenticação
	Facilita manutenção e escalabilidade

A escolha pela Context API foi adequada ao escopo do projeto, não sendo necessário o uso de bibliotecas adicionais como Redux.


🔒 Autenticação e Autorização

Apenas usuários autenticados (professores) podem:
	Criar postagens
	Editar postagens
	Acessar a área administrativa

Rotas protegidas são controladas pelo componente ProtectedRoute
Usuários não autenticados têm acesso apenas às páginas públicas

📄 Funcionalidades Implementadas

🏠 Página Principal
	Listagem de posts
	Exibição de título, autor e descrição
	Campo de busca por palavras-chave

📖 Página de Leitura
	Visualização completa do conteúdo do post
	Acesso público

✍️ Criação de Postagens
	Formulário exclusivo para docentes
	Integração com backend via API REST

✏️ Edição de Postagens
	Carregamento automático dos dados existentes
	Atualização das informações do post

🛠️ Página Administrativa
	Listagem de todas as postagens
	Opções de editar e excluir
	Acesso restrito a usuários autenticados

🎨 Estilização e Responsividade
A estilização da aplicação foi realizada utilizando Material UI (MUI), que oferece:
	Componentes prontos e acessíveis
	Layout responsivo para dispositivos móveis e desktop
	Padronização visual e melhor experiência do usuário

🔗 Integração com Back-End
A aplicação consome uma API REST desenvolvida em Node.js, realizando operações de:
	Listagem de posts
	Criação de postagens
	Edição de postagens
	Exclusão de postagens
	Autenticação de usuários

Toda a comunicação é realizada via requisições HTTP utilizando Axios.

🚀 Como Executar o Projeto
Pré-requisitos
	Node.js (versão LTS)
	Docker (opcional)


Passos para execução local
# Instalar dependências
npm install

# Executar a aplicação
npm run dev

# Buildar a aplicação
npm run build


A aplicação estará disponível em:
http://localhost:5173

🐳 Execução com Docker (opcional)
docker build -t blog-frontend .
docker run -p 3000:3000 blog-frontend

