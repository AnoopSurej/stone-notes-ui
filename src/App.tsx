import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "./pages/HomePage";
import { AuthProvider } from "react-oidc-context";
import { oidcConfig } from "@/lib/config.ts";
import { ProtectedRoute } from "@/components/ProtectedRoute.tsx";
import NotesPage from "@/pages/NotesPage.tsx";
import SignedOut from "@/pages/SignedOut.tsx";
import { Toaster } from "@/components/ui/sonner";

const queryClient = new QueryClient();

function App() {
  return (
    <AuthProvider {...oidcConfig}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signedout" element={<SignedOut />} />
            <Route
              path="/notes"
              element={
                <ProtectedRoute>
                  <NotesPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
