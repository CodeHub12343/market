# University Market - Complete Project Structure

```
university-market/
├── 📁 src/
│   ├── 📁 app/
│   │   ├── 📁 (protected)/                    # Protected routes (require authentication)
│   │   │   ├── layout.js                      # Protected routes layout wrapper
│   │   │   ├── 📁 dashboard/
│   │   │   │   └── page.js                    # User dashboard page
│   │   │   ├── 📁 my-products/
│   │   │   │   └── page.js                    # User's product listings
│   │   │   └── 📁 products/
│   │   │       ├── page.js                    # Products marketplace listing (redesigned)
│   │   │       ├── 📁 [id]/
│   │   │       │   └── page.js                # Product details page (new complex layout)
│   │   │       └── 📁 new/
│   │   │           └── page.js                # Create new product page
│   │   ├── layout.js                          # Root app layout
│   │   ├── page.js                            # Home page
│   │   ├── globals.css                        # Global styles
│   │   ├── page.module.css                    # Home page styles
│   │   ├── styles.js                          # Home page styled components
│   │   ├── favicon.ico                        # App favicon
│   │   ├── 📁 login/
│   │   │   ├── page.js                        # Login page
│   │   │   └── styles.js                      # Login page styled components
│   │   └── 📁 signup/
│   │       └── page.js                        # Signup page
│   │
│   ├── 📁 components/                         # Reusable components
│   │   ├── header.jsx                         # Header navigation component
│   │   ├── bottom-nav.jsx                     # Bottom navigation (mobile)
│   │   ├── search-bar.jsx                     # Search functionality
│   │   ├── car-brands.jsx                     # Car brands filter
│   │   ├── special-offers.jsx                 # Special offers section
│   │   ├── top-deals.jsx                      # Top deals section
│   │   ├── Providers.jsx                      # Context/Provider setup
│   │   ├── 📁 common/
│   │   │   ├── ErrorAlert.jsx                 # Error alert component
│   │   │   ├── LoadingSpinner.jsx             # Loading spinner
│   │   │   └── SuccessAlert.jsx               # Success alert component
│   │   └── 📁 products/
│   │       ├── ProductCard.jsx                # Individual product card (redesigned - 8+ sections)
│   │       ├── ProductGrid.jsx                # Products grid layout
│   │       └── ProductForm.jsx                # Product creation/edit form
│   │
│   ├── 📁 context/
│   │   └── AuthContext.jsx                    # Authentication context provider
│   │
│   ├── 📁 hooks/
│   │   ├── useAuth.js                         # Auth state hook
│   │   ├── useProducts.js                     # Product queries (enhanced with useProductById)
│   │   ├── useProductForm.js                  # Product form logic
│   │   ├── useProtectedRoute.js               # Protected route validation
│   │   └── useQueries.js                      # React Query configuration
│   │
│   ├── 📁 lib/
│   │   ├── api.js                             # Axios API client with JWT interceptors
│   │   ├── react-query.js                     # React Query instance
│   │   ├── registry.jsx                       # styled-components registry
│   │   ├── cookies.js                         # Cookie utilities
│   │   └── errors.js                          # Error handling utilities
│   │
│   └── 📁 services/
│       ├── api.js                             # API base configuration
│       ├── auth.js                            # Authentication API calls
│       ├── products.js                        # Product API calls (enhanced)
│       └── campus.js                          # Campus/location API calls
│
├── 📁 public/
│   ├── next.svg                               # Next.js logo
│   ├── vercel.svg                             # Vercel logo
│   ├── file.svg                               # File icon
│   ├── globe.svg                              # Globe icon
│   ├── window.svg                             # Window icon
│   └── Annotation 2025-12-14 112140.jpg       # Sample product image
│
├── 📁 .next/                                  # Next.js build output (gitignored)
│
├── Configuration Files
│   ├── package.json                           # Dependencies and scripts
│   ├── package-lock.json                      # Locked dependency versions
│   ├── next.config.mjs                        # Next.js configuration
│   ├── jsconfig.json                          # JavaScript configuration
│   ├── eslint.config.mjs                      # ESLint configuration
│   ├── .env.local                             # Environment variables (gitignored)
│   └── .gitignore                             # Git ignore rules
│
└── Documentation Files
    ├── README.md                              # Project README
    ├── PROJECT_STRUCTURE.md                   # This file
    ├── COMPLETE_REDESIGN_SUMMARY.md           # Complete UI redesign summary
    ├── PRODUCTS_PAGE_REDESIGN.md              # Products page redesign details
    ├── PRODUCT_CARD_REDESIGN.md               # ProductCard component redesign
    └── DEBUG_REMOVAL_SUMMARY.md               # Debug info removal summary
```

## Key Features by File

### App Routes
- **`/`** - Home page with featured products and categories
- **`/login`** - User login
- **`/signup`** - User registration
- **`/(protected)/dashboard`** - User dashboard
- **`/(protected)/my-products`** - User's product listings
- **`/(protected)/products`** - Marketplace products (mobile-first redesigned grid)
- **`/(protected)/products/[id]`** - Product details (complex mobile layouts)
- **`/(protected)/products/new`** - Create new product listing

### Components

#### ProductCard.jsx (REDESIGNED)
- Image gallery with gradient background
- Condition & popular badges
- Favorite/heart button (glassmorphic)
- Shop info card with avatar gradient
- Location and time info (MapPin/Clock icons)
- Analytics badge (views with Zap icon)
- Price section
- Quick action buttons (delete, edit, share)
- **Responsive**: Font scaling 15px→19px, layout adjustments per breakpoint

#### ProductGrid.jsx
- Grid layout for product cards
- Pagination support
- Responsive columns (1 mobile, 2 tablet, 3+ desktop)

### Hooks (React Query Integration)

#### useProducts.js
- **`useAllProducts(page, limit, filters)`** - Fetch all marketplace products (removes seller filter)
- **`useProductById(id)`** - Fetch single product details (with logging)
- **`useProducts(page, limit, filters)`** - Fetch products with filters
- **`useMyProducts(page, limit)`** - Fetch user's own products
- **`useCreateProduct()`** - Mutation for creating products
- **`useUpdateProduct()`** - Mutation for updating products
- **`useDeleteProduct()`** - Mutation for deleting products
- **`useSearchProducts(query)`** - Search products

### Services (API Layer)

#### products.js (ENHANCED)
- **`fetchAllMarketplaceProducts(page, limit, filters)`** - All marketplace products (no seller filter)
- **`fetchProductById(id)`** - Single product (handles nested response: `product: {...}`)
- **`fetchProductsPaginated(page, limit, filters)`** - Paginated products
- **`fetchMyProducts(page, limit)`** - User's products
- **`createProduct(data)`** - Create new product
- **`updateProduct(id, data)`** - Update product
- **`deleteProduct(id)`** - Delete product
- **`searchProducts(query)`** - Search products

### Styling System

**Color Palette**:
- Primary: `#1a1a1a` (dark text/buttons)
- Secondary: `#999` (labels), `#666` (descriptions)
- Background: `#ffffff` (white), `#f5f5f5` (page bg), `#f8f8f8` (light bg)
- Borders: `#e5e5e5`
- Accent: `#ffc107` (ratings), `#2e7d32` (success), `#c62828` (error)

**Responsive Breakpoints**:
- Mobile: `< 768px` (16px padding)
- Tablet: `768px - 1023px` (20px padding)
- Desktop: `≥ 1024px` (32px padding)
- Large: `≥ 1440px` (extended layouts)

**Typography**:
- Titles: 15-16px mobile → 16-18px desktop
- Body: 12-13px
- Secondary: 14-15px

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: styled-components (CSS-in-JS)
- **State Management**: TanStack React Query (useQuery/useMutation)
- **HTTP Client**: Axios with JWT interceptors
- **Icons**: lucide-react
- **Authentication**: JWT tokens in cookies
- **API Base URL**: `http://localhost:5000/api/v1`

## Authentication Flow

1. User registers via `/signup` → `auth.registerUser()`
2. User logs in via `/login` → `auth.loginUser()`
3. JWT token stored in cookies
4. Protected routes wrapped with `useProtectedRoute()` hook
5. API requests include JWT in Authorization header

## Data Extraction Pattern

API responses follow nesting pattern:
```javascript
// Single product response
{
  status: "success",
  data: {
    product: { id, name, price, ... }
  }
}

// List response
{
  status: "success",
  results: 20,
  data: {
    products: [...]
  }
}
```

Services extract data with fallback chain:
```javascript
response.data.product || response.data.data || response.data
```

## Recent Updates

✅ **Phase 1**: Fixed products display (API filtering issue)
✅ **Phase 2**: Redesigned `/products` page (mobile-first, dashboard colors)
✅ **Phase 3**: Redesigned ProductCard (8+ information sections)
✅ **Phase 4**: Created `/products/[id]` page (complex mobile layouts)
✅ **Phase 5**: Added back button to products page
✅ **Phase 6**: Enhanced ProductCard with shop info, location, analytics

## Running the Application

```bash
npm install                 # Install dependencies
npm run dev               # Start development server
npm run build             # Build for production
npm run start             # Start production server
npm run lint              # Run ESLint
```

Development server runs on `http://localhost:3000`
API server should be running on `http://localhost:5000`
