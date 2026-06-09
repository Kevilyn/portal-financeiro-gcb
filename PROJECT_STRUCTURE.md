# Project Documentation: banQi & Casas Bahia Financial Portal

## 1. Project Overview
This project is a comprehensive frontend financial management platform designed for Casas Bahia and banQi customers. It allows users to manage debts, simulate agreements, make advance payments, and view their financial products (Carnê Digital, Credit Cards, banQi Account).

- **Type**: Single Page Application (SPA)
- **Tech Stack**: React 18, Vite, React Router v6, Tailwind CSS, Framer Motion
- **Icons**: Lucide React
- **Authentication**: Custom CPF-based simulation (Mock Backend + LocalStorage)

## 2. Routes & Pages Structure

### Public Routes
- `/`: Landing Page (Home)
- `/login`: User Authentication
- `/signup`: User Registration

### Protected Routes (`/dashboard/*`)
Requires authentication via `AuthContext`.
- `/dashboard` (index): Main Dashboard Overview
- `/dashboard/perfil`: User Profile Settings
- `/dashboard/produtos`: All Products/Contracts View
- `/dashboard/meus-produtos`: Alternate Product View (Categorized)
- `/dashboard/carne-digital`: Specific Carnê Digital Management
- `/dashboard/cartao-casas-bahia`: Credit Card Management
- `/dashboard/banqi`: BanQi Account Promotion/View
- `/dashboard/simular-acordo`: Agreement Simulation Landing
- `/dashboard/simular-acordo/:contractId`: Specific Contract Negotiation
- `/dashboard/pagamentos`: Payment History & Status
- `/dashboard/adiantamento`: Advance Installment Payment Flow
- `/dashboard/processar-adiantamento`: Checkout for Advance Payment
- `/dashboard/confirmacao-pagamento`: Payment Success Page
- `/dashboard/comprovantes`: Receipts Center
- `/dashboard/ajuda`: Support Center

### Admin Routes (`/admin/*`)
Requires admin privileges.
- `/admin/dashboard`: System Overview
- `/admin/users`: User Management
- `/admin/cpf-status`: CPF Status Monitoring

## 3. Page Inventory

| File Name | Description |
|-----------|-------------|
| `Home.jsx` | Main landing page featuring the Hero section, CPF lookup form, and marketing sections. |
| `HomePage.jsx` | Alternative landing page structure with floating buttons. |
| `LoginPage.jsx` | Handles CPF verification and password entry (simulated). |
| `SignUp.jsx` | Multi-step registration wizard (Personal info, Address, Validation). |
| `DashboardInicio.jsx` | The "Home" of the logged-in user. Shows alerts, scores, and quick actions. |
| `DashboardPerfil.jsx` | Form to view and edit user personal data and address. |
| `DashboardProdutos.jsx` | List view of all user contracts with status indicators and action buttons. |
| `DashboardMeusProdutos.jsx` | Accordion-style view categorizing products by type. |
| `SimularAcordo.jsx` | Selection screen to choose which contract to negotiate. |
| `DashboardSimularAcordo.jsx` | The actual negotiation wizard (Value -> Date -> Payment -> Terms). |
| `DashboardAdiantamento.jsx` | Flow to select installments to pay in advance with discounts. |
| `ProcessarAdiantamento.jsx` | Checkout screen for selecting payment method (Pix, Card, Boleto). |
| `DashboardPagamentos.jsx` | History of payments, agreements, and pending items. |
| `DashboardAjuda.jsx` | FAQ and contact options. |
| `DashboardCarneDigital.jsx` | Detailed view for Carnê Digital contracts. |
| `DashboardCartaoCasasBahia.jsx` | Credit card dashboard showing limits, invoices, and status. |
| `DashboardBanQi.jsx` | Information and call-to-action for the digital account. |
| `ReceiptsCenter.jsx` | Repository of generated receipts for payments and agreements. |
| `DashboardConfirmacaoPagamento.jsx` | Success feedback page after a transaction. |
| `AdminDashboard.jsx` | High-level metrics for administrators (Total users, debt volume). |
| `AdminUsers.jsx` | List and management interface for all system users. |

## 4. Navigation Structure

- **Header (`Header.jsx`)**: Top navigation bar. Shows Logo and "Login/Register" for public users, or "UserMenu" for authenticated users.
- **Sidebar (`DashboardLayout.jsx`)**: Collapsible side navigation for the dashboard. Contains links to Home, Products, Simulation, Payments, Receipts, and Help.
- **Breadcrumb (`Breadcrumb.jsx`)**: Contextual navigation aid showing current path.
- **Route Wrappers**:
  - `ProtectedRoute.jsx`: Redirects unauthenticated users to login.
  - `AdminRoute.jsx`: Restricts access to admin pages based on user permissions.

## 5. Core Components

### Authentication
- `CPFForm`: Main entry point for CPF lookup on landing page.
- `CPFInput`: Masked input component for CPF.
- `CPFModal`: Modal for quick CPF status checks.
- `ContactValidationModal`: Modal for email/SMS code validation.

### Dashboard & Layout
- `DashboardLayout`: Main wrapper for protected pages.
- `UserMenu`: Dropdown menu in header for profile/logout.
- `WelcomeMessage`: Personalized greeting component.

### Products & Contracts
- `ProductCard`: Detailed card showing contract status, value, and actions.
- `ContractCard`: Simplified card for contract listing.
- `ContractDetailModal`: Comprehensive modal showing contract terms and history.
- `ContractInstallmentList`: List view of specific installments within a contract.

### Payments & Negotiation
- `PaymentOptions`: Component to select payment methods.
- `PaymentSummary`: Summary of amounts before confirmation.
- `SimuladorValor`: Slider/Input to propose negotiation values.
- `FacaSuaProposta`: Component allowing user to suggest custom terms.
- `RenegotiationModal`: Modal wrapper for the renegotiation flow.
- `InstallmentPaymentModal`: Modal for paying specific installments.

### Features & AI
- `AssistenteCBIA`: Floating AI chat assistant button/window.
- `CBIAChat`: The actual chat interface component.
- `AIRecommendationCard`: Smart product recommendations based on user profile.
- `FidelityBenefitsCard`: Display of user loyalty tier (Bronze/Silver/Gold).

### UI Primitives (shadcn/ui based)
- Located in `src/components/ui/`
- `Button`, `Input`, `Label`, `Card`, `Dialog`, `Badge`, `Checkbox`, `RadioGroup`, `Accordion`, `Tabs`, `ScrollArea`, `Separator`.

### Admin
- `CPFStatusDashboard`: Dashboard widget for monitoring CPF statuses.
- `UsersList`: Datatable of users with actions (Suspend, View).
- `CPFDetailModal`: Admin view of specific user details.

## 6. State Management

The application uses **React Context** for global state management, specifically `AuthContext.jsx`.

- **AuthContext**:
  - Stores `user` object (profile, contracts, status).
  - Manages `isAuthenticated` boolean.
  - Provides `login`, `logout`, `createNewAccount`, `updateUserProfile` methods.
  - Handles simulated backend logic (`searchCustomerByCPF` using `TEST_CPF_DB`).
  - Persists session data via `localStorage`.

Local state (`useState`, `useReducer`) is used within page components for form handling and wizard steps.

## 7. Data Flow

1. **Entry**: User enters CPF in `Home.jsx`.
2. **Lookup**: `AuthContext` checks `TEST_CPF_DB` (mock data) or `localStorage`.
3. **Hydration**: If user exists, data is hydrated (installments generated dynamically if needed). If new, a template profile is created.
4. **Session**: User data is stored in Context and LocalStorage.
5. **Dashboard**: Components read directly from `useAuth().user`.
6. **Updates**: Actions like "Paying an installment" or "Updating Profile" update the Context state and persist to LocalStorage to simulate persistence.

## 8. Key Features

- **CPF-First Experience**: All flows start with CPF identification.
- **Dynamic Agreement Simulation**: Users can simulate debt negotiation with real-time calculation of discounts and installments.
- **Advance Payment (Adiantamento)**: Specific flow to select future installments and pay them with a discount.
- **Gamification**: Client scores (Bronze/Silver/Gold) based on payment history.
- **Admin Panel**: capability to view all users and monitor system status.
- **Receipt Generation**: Visual generation of payment receipts.
- **Status Tracking**: Visual indicators for "Overdue", "Suspended", "Up to date".

## 9. Styling & Design

- **Framework**: Tailwind CSS v3.
- **Animation**: Framer Motion used for page transitions, modal appearances, and list staggering.
- **Theme**:
  - Primary: Blue (`#003DA5`, `#0066CC`) and Red (`#E31C23`) reflecting the brand colors.
  - UI Style: Clean, card-based layout with rounded corners (`rounded-xl`) and subtle shadows.
  - Responsiveness: Mobile-first design with `md:` and `lg:` breakpoints.

## 10. File Organization