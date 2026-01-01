# Stone Notes UI

Stone Notes UI is a React-based frontend for the Stone Notes application, providing a user-friendly interface to manage notes with secure authentication.

## Technologies Used

- **Vite** - Fast build tool and development server
- **React 19** - UI library with TypeScript
- **TypeScript** - Type-safe development
- **OIDC (OpenID Connect)** - Authentication via react-oidc-context
- **TanStack Query** - Server state management
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Shadcn/ui** - Accessible component library
- **Jest** - Testing framework

## Features

- OIDC-based authentication with protected routes
- Create, read, update, and delete notes
- Responsive design with Tailwind CSS
- Type-safe development with TypeScript
- Comprehensive test coverage

## Prerequisites

Before running the application, ensure you have the following:

- Node.js (v18 or higher recommended)
- An OIDC provider configured (e.g., Keycloak, Auth0, Okta)
- Dependencies installed:
  ```sh
  npm install
  ```

## Environment Configuration

Create a `.env.local` file in the project root with the following variables (see `.env.template` for reference):

```env
VITE_STONE_NOTES_API_URL=http://localhost:8080
VITE_OIDC_AUTHORITY=https://your-oidc-provider.com
VITE_OIDC_CLIENT_ID=your-client-id
VITE_OIDC_REDIRECT_URI=http://localhost:5173
VITE_OIDC_RESPONSE_TYPE=code
VITE_OIDC_SCOPE=openid profile email
```

## Running the Application

To start the development server:

```sh
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run test:coverage` - Run tests with coverage report
- `npm run watch` - Run tests in watch mode
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── notes/       # Note-related components
│   ├── ui/          # Shadcn UI components
│   └── ProtectedRoute.tsx
├── hooks/           # Custom React hooks
├── pages/           # Route page components
│   ├── HomePage.tsx
│   ├── NotesPage.tsx
│   └── SignedOut.tsx
├── lib/             # Configuration and utilities
└── App.tsx          # Main application component
```

## Running Tests

To execute the test suite:

```sh
npm run test
```

For test coverage:

```sh
npm run test:coverage
```

## Authentication Flow

1. Users are redirected to the OIDC provider for authentication
2. After successful login, users are redirected back to the application
3. Protected routes (like `/notes`) require authentication
4. Unauthenticated users are redirected to sign in
