import Sidebar from "@/components/admin/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <main className="lg:ml-64 p-8">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
