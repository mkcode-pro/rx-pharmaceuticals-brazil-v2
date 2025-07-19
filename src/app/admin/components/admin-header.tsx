"use client";

import { useAdminAuth } from "@/store/admin-auth-context";
import { User } from "lucide-react";

export default function AdminHeader() {
  const { isAuthenticated } = useAdminAuth();

  if (!isAuthenticated) return null;

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-20">
      <div className="px-6 py-4 flex justify-between items-center">
        <div className="md:ml-64">
          <h1 className="text-xl font-semibold text-gray-800">
            Painel Administrativo
          </h1>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <User size={20} />
          <span>Admin</span>
        </div>
      </div>
    </header>
  );
}
