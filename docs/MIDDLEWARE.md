# Middleware Architecture

The application's middleware has been refactored into a modular architecture to improve maintainability and separation of concerns.

## Structure

```
lib/middleware/
├── admin-guard.ts       # Logic for protecting /admin routes
├── auth-guard.ts        # Logic for Supabase session management
└── __tests__/           # Unit tests
middleware.ts            # Main entry point with routing logic
```

## Modules

### 1. Admin Guard (`lib/middleware/admin-guard.ts`)

**Purpose**: Protects the `/admin` path from unauthorized access.

**Features**:
- **Secret Cookie Verification**: Checks for the presence and validity of the `admin_session` cookie against the `ADMIN_ACCESS_KEY` environment variable.
- **Access Control**: Redirects unauthorized users to the homepage (`/`).
- **Chain of Responsibility**: If authorized, it delegates to `authGuard` to ensure the Supabase session is also refreshed.

### 2. Auth Guard (`lib/middleware/auth-guard.ts`)

**Purpose**: Manages Supabase authentication state for all users.

**Features**:
- **Session Refresh**: Calls `supabase.auth.getUser()` to refresh the auth token if needed.
- **Cookie Management**: Handles setting and removing auth cookies via `createServerClient`.

### 3. Main Middleware (`middleware.ts`)

**Purpose**: Routes requests to the appropriate guard based on the URL path.

**Logic**:
- **Priority**: `/admin` routes are checked first.
- **Fallback**: All other routes fall through to `authGuard`.

## Testing

Unit tests are located in `lib/middleware/__tests__/`.
They use `vitest` syntax. Ensure you have a test runner installed to execute them.

```bash
# Example (if vitest is installed)
npm run test
```
