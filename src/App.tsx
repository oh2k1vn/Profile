import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { HomePage } from "./pages/HomePage";
import { CalculatorPage } from "./pages/CalculatorPage";
import { JournalPage } from "./pages/JournalPage";
import { VocabPage } from "./pages/VocabPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AnimatePresence } from "framer-motion";

// Layout wrapper to conditionally show Navbar
function AppContent() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  // Don't show Navbar on Home page
  const showNavbar = !isHome;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-blue-500/30">
      {showNavbar && <Navbar />}

      <main>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/vocab" element={<VocabPage />} />

            {/* Protected Trading Routes */}
            <Route
              path="/calculator"
              element={
                <ProtectedRoute>
                  <CalculatorPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/journal"
              element={
                <ProtectedRoute>
                  <JournalPage />
                </ProtectedRoute>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
