# peter-mbiriri-gikunda-app — KCB User Management System

**Author:** Peter Mbiriri Gikunda

A front-end user management application built with Angular 21, Tailwind CSS v4, and a fully mocked REST API. It demonstrates JWT authentication with token refresh, paginated user CRUD, role/status filtering, and a profile drawer — all without a real backend.

---

## Prerequisites

| Tool        | Version                                            |
| ----------- | -------------------------------------------------- |
| Node.js     | 18 or higher                                       |
| npm         | 9 or higher                                        |
| Angular CLI | 21 (installed via `npx`, no global install needed) |

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/GikundaMbiriri/peter-mbiriri-gikunda-app.git
cd peter-mbiriri-gikunda-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm start
```

Open your browser at **http://localhost:4200**

---

## Login Credentials

The application uses a mock API — no real backend is required.

| Field    | Value      |
| -------- | ---------- |
| Username | `admin`    |
| Password | `admin123` |

---

## Available Scripts

| Command         | Description                                                                 |
| --------------- | --------------------------------------------------------------------------- |
| `npm start`     | Start the development server at http://localhost:4200                       |
| `npm run build` | Build for production (outputs to `dist/` and `dist-peter-mbiriri-gikunda/`) |
| `npm run watch` | Build in development mode and watch for changes                             |
| `npm test`      | Run unit tests via Karma                                                    |

---

## Project Structure

```
src/
├── app/
│   ├── components/       # UI components (login, user-list, user-form, navbar, profile, etc.)
│   ├── guards/           # Route authentication guard
│   ├── interceptors/     # HTTP interceptors (auth token, mock backend)
│   ├── layouts/          # Auth layout wrapper
│   ├── models/           # TypeScript interfaces (User, AuthResponse, etc.)
│   └── services/         # Business logic services (auth, user, alert)
├── environments/         # Environment configuration (dev & production)
└── styles.css            # Global Tailwind CSS styles

dist-peter-mbiriri-gikunda/   # Pre-built production bundle (deploy directly to any web server)
```

---

## Deploying the Pre-built App

The `dist-peter-mbiriri-gikunda/` folder contains the compiled production build. To serve it:

**Using any static web server (e.g. `serve`):**

```bash
npx serve dist-peter-mbiriri-gikunda/browser
```

**Using nginx** — point the document root to `dist-peter-mbiriri-gikunda/browser/` and add a fallback rewrite rule for Angular routing:

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

---

## Key Features

- **JWT Authentication** — login with username/password, token stored in `sessionStorage`, auto-refresh on expiry
- **Mock REST API** — fully simulated in `mock-backend.interceptor.ts` (no backend needed)
- **User Management** — create, read, update, delete users with real-time validation
- **Pagination** — server-side pagination (10 users per page)
- **Search & Filters** — filter by name/email/phone, role, and status
- **Duplicate detection** — API rejects duplicate emails/phones with inline field errors
- **Profile Drawer** — click the user pill in the navbar to view profile & quick stats
- **Environment-aware** — `useMockApi: false` in production disables the mock interceptor

````

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
````

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
