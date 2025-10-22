# Frontend - Smart Forms Application

React + TypeScript + Vite application with dynamic form generation.

## 🚀 Features

- ✅ **Smart Forms** - Dynamic form generation based on JSON schema from backend
- ✅ **Generic Data Table** - Reusable table component for any data type
- ✅ **Material-UI** - Modern and beautiful UI components
- ✅ **React Router** - Client-side routing
- ✅ **TypeScript** - Type-safe code
- ✅ **Axios** - HTTP client for API calls

## 📦 Structure

```
fronted/
├── src/
│   ├── api/
│   │   └── axios.ts           # API configuration
│   ├── components/
│   │   ├── SmartForm.tsx      # 🌟 Dynamic form component
│   │   └── DataTable.tsx      # Generic table component
│   ├── pages/
│   │   ├── MachinesList.tsx   # Machines list page
│   │   ├── CreateMachine.tsx  # Create machine page
│   │   └── EditMachine.tsx    # Edit machine page
│   ├── types/
│   │   └── index.ts           # TypeScript interfaces
│   ├── App.tsx                # Main app with routing
│   └── main.tsx               # Entry point
└── package.json
```

## 🛠️ Installation & Running

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Backend server running on http://localhost:8000

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

The app will be available at: **http://localhost:5173**

### Build for Production

```bash
npm run build
```

## 🎯 How It Works

### Smart Form Component

The **SmartForm** component is the heart of the application:

1. **Fetches JSON schema** from `/machine/schema/{method}` endpoint
2. **Parses the schema** to determine field types
3. **Renders form fields dynamically**:
   - Text fields for strings
   - Number inputs for integers/floats
   - Email validation for email fields
   - Select dropdowns for enums
   - Password fields for password
4. **Handles form submission** to create/update endpoints
5. **Shows success/error messages**

#### Props:

```typescript
{
  topic: string;           // e.g., "machine"
  formType: "create" | "update";
  rawData?: object;        // For update forms
  machineId?: number;      // For update forms
  onSuccess?: () => void;  // Callback on success
}
```

### Data Table Component

Generic reusable table component:

```typescript
{
  topic: string; // API endpoint prefix
  title: string; // Display title
  createPath: string; // Route for create page
  editPathPrefix: string; // Route prefix for edit pages
}
```

## 🔄 API Integration

### Endpoints Used:

- `GET /machine/get` - Fetch all machines
- `GET /machine/get?id={id}` - Fetch specific machine
- `POST /machine/create` - Create new machine
- `PUT /machine/update?machine_id={id}` - Update machine
- `GET /machine/schema/create` - Get create form schema
- `GET /machine/schema/update` - Get update form schema

## 🎨 Customization

### Adding New Entity Types

To add a new entity (e.g., "Users"):

1. Add routes in `App.tsx`:

```typescript
<Route path="/users" element={<UsersList />} />
<Route path="/users/create" element={<CreateUser />} />
<Route path="/users/edit/:id" element={<EditUser />} />
```

2. Create pages using existing components:

```typescript
<DataTable
  topic="user"
  title="Users"
  createPath="/users/create"
  editPathPrefix="/users/edit"
/>

<SmartForm
  topic="user"
  formType="create"
  onSuccess={handleSuccess}
/>
```

**That's it!** The Smart Form will automatically adapt to the schema.

## 🐛 Troubleshooting

### Backend Connection Issues

- Ensure backend is running on http://localhost:8000
- Check CORS is enabled in backend
- Verify API endpoints are working

### TypeScript Errors

```bash
npm run build
```

### Vite Dev Server Issues

```bash
# Clear cache and restart
rm -rf node_modules/.vite
npm run dev
```

## 📝 Technologies

- **React 19** - UI library
- **TypeScript 5.9** - Type safety
- **Vite 7** - Build tool
- **Material-UI 6** - UI components
- **React Router 7** - Routing
- **Axios 1.7** - HTTP client
- **Emotion** - CSS-in-JS

## ✅ Assessment Requirements Met

1. ✅ React TSX app using Vite
2. ✅ Dynamic form generation from JSON schema
3. ✅ Generic reusable components (DataTable, SmartForm)
4. ✅ Handles different field types (string, number, email, enum, etc.)
5. ✅ Updates automatically when backend schema changes
6. ✅ Material-UI for beautiful design
7. ✅ Create and Update forms using same component
8. ✅ Type-safe with TypeScript

## 🎉 Result

A fully dynamic frontend that requires **ZERO code changes** when adding new fields to the backend!
