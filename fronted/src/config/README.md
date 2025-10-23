# Entity Configuration

## How to Change Entity Name (e.g., machine → user)

To rename the entire application from "Machine" to another entity (like "User"), you only need to edit **ONE FILE**:

### File: `entities.ts`

```typescript
export const ENTITY_CONFIG = {
  apiName: "machine", // Change to: 'user'
  displayName: "Machine", // Change to: 'User'
  displayNamePlural: "Machines", // Change to: 'Users'
  routePath: "machines", // Change to: 'users'
} as const;
```

## Example: Converting to "User" Entity

```typescript
export const ENTITY_CONFIG = {
  apiName: "user", // API calls: /user/create, /user/get, etc.
  displayName: "User", // Singular display: "User"
  displayNamePlural: "Users", // Plural display: "Users"
  routePath: "users", // Routes: /users, /users/create, /users/edit/:id
} as const;
```

**That's it!** All API calls, routes, and displays will automatically update throughout the entire application.

## What Gets Updated Automatically:

- ✅ All API endpoint URLs (`/machine/*` → `/user/*`)
- ✅ All frontend routes (`/machines/*` → `/users/*`)
- ✅ All page titles and labels
- ✅ Form submissions
- ✅ Navigation paths

## Files That Use This Config:

- `pages/MachinesList.tsx`
- `pages/MachineForm.tsx`
- `App.tsx` (routing)
- Any component that imports `ENTITY_CONFIG`
