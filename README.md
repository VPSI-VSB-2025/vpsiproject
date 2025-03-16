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
├── .env           # Lokální proměnné prostředí (není v gitu)
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

## Workflow pro přispěvatele

1. Vytvořte novou větev pro váš feature/fix
2. Napište kód a testy
3. Ujistěte se, že všechny testy procházejí
4. Vytvořte pull request do `main` větve

- O Enviroment variables do souboru `/frontend/.env`, požádejte front-end engineera.
