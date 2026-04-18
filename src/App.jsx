import './App.css'
import { lazy, Suspense } from 'react'
import { Toaster } from 'react-hot-toast'
import { Navigate, Route, Routes } from 'react-router';
const AuthPage = lazy(() => import("./components/Pages/Auth/AuthPage"));
const HomePage = lazy(() => import("./components/Pages/Home/HomePage"));
import ErrorBoundary from './components/Error-Boundary/ErrorBoundary';
import ProtectedRoutes from "./components/Routes/ProtectedRoutes/ProtectedRoutes";
import PageLoader from "./components/UI/PageLoader/PageLoader";
const AppLayout = lazy(() => import("./components/Layout/AppLayout/AppLayout"));
const Dashboard = lazy(() => import("./components/Pages/Dashboard/Dashboard"));
const Users = lazy(() => import("./components/Pages/Users/Users"));
const Customers = lazy(() => import("./components/Pages/Customers/Customers"));
const Leads = lazy(() => import("./components/Pages/Leads/Leads"));
const Deals = lazy(() => import("./components/Pages/Deals/Deals"));
const Tasks = lazy(() => import("./components/Pages/Tasks/Tasks"));
const NotFound = lazy(() => import("./components/Pages/NotFound/NotFoundPage"));
const UnauthorizedPage = lazy(() => import("./components/Pages/Unauthorized/UnauthorizedPage"));

function App() {

  return (
    <>
      <ErrorBoundary>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#111827",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.1)",
            },
          }}
        />
        <Routes>
          <Route path="/" element={<Navigate to="/auth" replace />} />
          <Route path="/auth" element={
            <Suspense fallback={<PageLoader />}>
              <AuthPage />
            </Suspense>
          } />
          <Route element={<ProtectedRoutes allowedRoles={["admin", "user"]} />}>
            <Route path="/home" element={
              <Suspense fallback={<PageLoader />}>
                <HomePage />
              </Suspense>
            } />
            <Route element={
              <Suspense fallback={<PageLoader />}>
                <AppLayout />
              </Suspense>
            } >
              <Route index element={
                <Suspense fallback={<PageLoader />} >
                  <Dashboard />
                </Suspense>
              } />
              <Route path="dashboard" element={
                <Suspense fallback={<PageLoader />}>
                  <Dashboard />
                </Suspense>
              } />
              <Route path="users" element={
                <Suspense fallback={<PageLoader />}>
                  <Users />
                </Suspense>
              } />
              <Route path="customers" element={
                <Suspense fallback={<PageLoader />}>
                  <Customers />
                </Suspense>
              } />
              <Route path="leads" element={
                <Suspense fallback={<PageLoader />}>
                  <Leads />
                </Suspense>
              } />
              <Route path="deals" element={
                <Suspense fallback={<PageLoader />}>
                  <Deals />
                </Suspense>
              } />
              <Route path="tasks" element={
                <Suspense fallback={<PageLoader />}>
                  <Tasks />
                </Suspense>
              } />
            </Route>
          </Route>
          <Route path="*" element={
            <Suspense fallback={<PageLoader />}>
              <NotFound />
            </Suspense>
          } />
          <Route path="/unauthorized" element={
            <Suspense fallback={<PageLoader />}>
              <UnauthorizedPage />
            </Suspense>
          } />
        </Routes>
      </ErrorBoundary>
    </>
  )
}

export default App
