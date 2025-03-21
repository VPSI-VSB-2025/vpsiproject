# System pro nemocnice

## 🛠 Front-end Stack

### **1️⃣ Základní technologie**

- **[Next.js](https://nextjs.org/)** – SSR, ISR, SSG, optimalizace obrázků, SEO-friendly
- **TypeScript**

### **2️⃣ API komunikace & Stavová správa**

- **[TanStack Query (React Query)](https://tanstack.com/query/latest/)** – Fetchování dat, caching, synchronizace
- **[Zustand](https://github.com/pmndrs/zustand)** – Jednoduchý state management
- **[Axios](https://github.com/axios/axios)** – Lepší než FetchAPI

### **3️⃣ UI komponenty & Styling**

- **[shadcn/ui](https://ui.shadcn.com/)** – Pěkné, přizpůsobitelné komponenty
- **[Tailwind CSS](https://tailwindcss.com/)** – Styling

### **4️⃣ Formuláře & Validace**

- **[TanStack Form](https://tanstack.com/form)** – Knihovna pro práci s formuláři
- **[Zod](https://zod.dev/)** – Validace dat s podporou TypeScriptu

### **5️⃣ Autentizace & Autorizace**

- **[Clerk](https://clerk.dev/)** – Řešení pro autentizaci v Next.js

### **6️⃣ Ikony & Grafy**

- **[lucide-react](https://lucide.dev/)** – Sada ikon
- **[Recharts](https://recharts.org/en-US/)** – Interaktivní grafy a vizualizace

### **7️⃣ Další nástroje**

- **ESLint & Prettier** – Linting a formátování kódu
- **PNPM** – Rychlejší a efektivnější správce balíčků než npm/yarn

## 🛠 Back-end Stack

### **1️⃣ Základní technologie**
- **[Python](https://www.python.org/)** – Jazyk pro backend  
- **[FastAPI](https://fastapi.tiangolo.com/)** – Framework pro tvorbu REST API  
- **[Uvicorn](https://www.uvicorn.org/)** – ASGI server pro běh FastAPI aplikace

### **2️⃣ Databáze & ORM**
- **[PostgreSQL](https://www.postgresql.org/)** – Relační databáze  
- **[SQLAlchemy](https://www.sqlalchemy.org/)** – ORM pro práci s databází  
- **[Alembic](https://alembic.sqlalchemy.org/)** – Migrace databáze

### **3️⃣ Validace & Serializace**
- **[Pydantic](https://docs.pydantic.dev/)** – Validace vstupních dat a datové modely

### **4️⃣ Testování**
- **[Pytest](https://docs.pytest.org/en/stable/)** – Testovací nástroj pro backend

### **5️⃣ Nasazení**
- **[Docker](https://www.docker.com/)** – Kontejnerizace aplikace  
- **[Fly.io](https://fly.io/)** – Nasazení aplikace do cloudu

## 🛠 DB Stack

- **[postgres](https://www.postgresql.org/)** – je to free

## Front-end - ovládání, spuštění na lokálu

### Předpoklady:

- Nainstalovaný **[Node.js](https://nodejs.org/en)** (verze 18.0.0 nebo vyšší)
- Nainstalovaný **[PNPM](https://pnpm.io/installation)** (doporučuju verzi 10.x nebo vyšší)
- Nainstalovaný **[Git](https://git-scm.com/downloads)** pro správu verzí

### Instalace závislostí:

```bash
# Přejděte do složky projektu
cd frontend

# Instalace všech závislostí
pnpm install
```

### Konfigurace prostředí (.env soubor)

Ve složce `frontend` vytvořte soubor `.env` s následujícími proměnnými:

```
# API Endpoints
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# Další konfigurační proměnné
NEXT_PUBLIC_APP_ENV=development
```

### Spuštění vývojového serveru:

```bash
# Spuštění vývojového serveru
pnpm dev
```

Po spuštění bude aplikace dostupná na adrese [http://localhost:3000](http://localhost:3000).

### Vytvoření produkčního buildu:

```bash
# Vytvoření optimalizované produkční verze
pnpm build

# Spuštění produkční verze
pnpm start
```

### Struktura složek:

```
frontend/
├── public/              # Statické soubory
├── src/                 # Zdrojový kód aplikace
│   ├── app/             # Next.js App Router struktura
│   │   ├── (auth)/      # Autentizační stránky (přihlášení, registrace)
│   │   ├── dashboard/   # Sekce pro přihlášené uživatele
│   │   ├── layout.tsx   # Hlavní layout aplikace
│   │   └── page.tsx     # Hlavní stránka
│   ├── components/      # Sdílené komponenty
│   │   ├── ui/          # UI komponenty (shadcn/ui)
│   │   ├── forms/       # Formulářové komponenty
│   │   └── dashboard/   # Komponenty pro dashboard
│   ├── hooks/           # React hooks
│   ├── lib/             # Sdílené utility a funkce
│   │   └── utils.ts     # Pomocné funkce
│   ├── store/           # Zustand store
│   ├── types/           # TypeScript typy a definice
│   └── middleware.ts    # Clerk.js middleware (a další)
├── .env                 # Lokální proměnné prostředí (není v gitu)
├── .eslintrc.json       # ESLint konfigurace
├── .prettierrc          # Prettier konfigurace
├── next.config.ts       # Next.js konfigurace
├── package.json         # Závislosti projektu
├── postcss.config.mjs   # PostCSS konfigurace (pro Tailwind)
├── tailwind.config.ts   # Tailwind CSS konfigurace
└── tsconfig.json        # TypeScript konfigurace
```

## Doporučené vývojové nástroje

- **Visual Studio Code** s těmito rozšířeními:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense

## Užitečné příkazy

```bash
# Kontrola kódu pomocí lintera
pnpm lint
```

- O Enviroment variables do souboru `/frontend/.env`, požádejte front-end engineera.

## CI/CD Pipeline pro Frontend

Naše CI/CD pipeline pro frontend využívá **GitHub Actions** a zajišťuje automatickou kontrolu kódu před nasazením. Pipeline obsahuje následující kroky:

### 🛠 **CI (Continuous Integration)**

1. **Checkout kódu** – Načte aktuální verzi repozitáře.
2. **Instalace závislostí** – Používáme `pnpm` pro rychlou a efektivní správu balíčků.
3. **Typecheck** – Ověřuje správnost TypeScript kódu, aby se předešlo typovým chybám.
4. **Lint** – Spouští ESLint pro zajištění konzistence kódu.

CI se spouští pouze na **Pull Requesty a commity do `main` branche** a běží pouze pro změny ve složce `frontend/`, což šetří čas i GitHub Actions minuty.

### 🚀 **CD (Continuous Deployment)**

Nasazení frontendové aplikace je automatizováno pomocí **GitHub Actions** a **Netlify CLI**.

1. **CD krok**: Po úspěšném dokončení CI pipeline probíhá automatické nasazení, které zahrnuje:

   - Nastavení Node.js prostředí
   - Instalaci Netlify CLI
   - Instalaci závislostí pomocí pnpm
   - Build a nasazení aplikace pomocí Netlify CLI přímo z GitHub Actions

Nasazení se spouští automaticky po úspěšném dokončení CI pipeline a pouze při změnách ve složce `frontend/` na `main` větvi.

Pro správné fungování deployment pipeline jsou vyžadovány následující secrets v GitHub Actions:

- `NETLIFY_AUTH_TOKEN`
- `NETLIFY_SITE_ID`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

Tímto způsobem zajišťujeme, že kód je vždy správně ověřen a automaticky nasazen do produkčního prostředí. ✅

## ❗ Workflow pro přispěvatele ❗

1. Vytvořte novou větev pro váš feature/fix
2. Napište kód a testy
3. Ujistěte se, že všechny testy procházejí
4. Vytvořte pull request do `main` větve
