"use client";

import { ReactNode } from "react";
import { AdminAuthProvider } from "@/store/admin-auth-context";
import AdminSidebar from "./components/admin-sidebar";
import AdminHeader from "./components/admin-header";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminAuthProvider>
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 p-6 ml-0 md:ml-64">
            {children}
          </main>
        </div>
      </div>
    </AdminAuthProvider>
  );
}
