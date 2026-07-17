# GK Financial — Web Client

**A modern single-page web client for the GK Financial platform (chit-fund & loan management), built with React 19, TypeScript, and Vite.**

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-nginx-2496ED?logo=docker&logoColor=white)

This is the front-end for a financial-services dashboard — managing chit funds, loans, and
member accounts — with role-based views, client-side routing, and a Tailwind-based UI. It ships
with a Docker + nginx setup for static deployment.

---

## Tech stack

| Concern | Technology |
|---------|-----------|
| Framework | React 19 + TypeScript |
| Build tool | Vite 7 |
| Styling | Tailwind CSS 4, `clsx` + `tailwind-merge` |
| Routing | React Router 7 |
| Icons | lucide-react |
| Rich text | react-markdown |
| Tooling | ESLint 9, `typescript-eslint`, knip |
| Deployment | Docker + nginx |

## Project structure

```
gk-financial-dev-app2/
├── src/
│   ├── main.tsx          # app entry
│   ├── App.tsx           # root component + routes
│   ├── pages/            # route-level screens
│   ├── components/       # reusable UI components
│   ├── layouts/          # shared page layouts (nav, shells)
│   ├── context/          # React context providers (app/auth state)
│   ├── data/             # client-side data layer
│   ├── types/            # shared TypeScript types
│   ├── utils/            # helpers
│   └── index.css         # Tailwind entry
├── public/               # static assets
├── Dockerfile            # containerized build
├── nginx.conf            # static serving config
├── docker-compose.yml
├── vite.config.ts
└── tailwind.config.js
```

## Getting started

### Prerequisites
- Node.js 18+

### Develop

```bash
git clone https://github.com/chiranjeevigundu/gk-financial-dev-app2.git
cd gk-financial-dev-app2
npm install
npm run dev          # start the Vite dev server
```

### Build & preview

```bash
npm run build        # type-check (tsc -b) + production build
npm run preview      # serve the production build locally
```

### Run with Docker

```bash
docker compose up --build
```

Serves the production build behind nginx.

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |
