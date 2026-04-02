import { AppLayout } from "../components/layout/AppLayout";

export function ProtectedRoute({ children }) {
  return <AppLayout>{children}</AppLayout>;
}
