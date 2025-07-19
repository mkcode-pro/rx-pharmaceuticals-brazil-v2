"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  Truck,
  Ticket,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useAdminAuth } from "@/store/admin-auth-context";
import { useState, useEffect } from "react";

const menuItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
  { href: "/admin/categorias", label: "Categorias", icon: Tags },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingCart },
  { href: "/admin/shipping", label: "Frete", icon: Truck },
  { href: "/admin/coupons", label: "Cupons", icon: Ticket },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout, isAuthenticated } = useAdminAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated && pathname !== "/admin/login") {
      window.location.href = "/admin/login";
    }
  }, [isAuthenticated, pathname]);

  if (!isAuthenticated || pathname === "/admin/login") return null;

  return (
    <>
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside className={`
        fixed top-0 left-0 h-full bg-white shadow-lg z-40 transition-transform duration-300
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 w-64
      `}>
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">RX Admin</h2>
        </div>

        <nav className="p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors
                  ${isActive
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-100 text-gray-700'
                  }
                `}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg mt-6
                     hover:bg-red-50 text-red-600 transition-colors"
          >
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </nav>
      </aside>

      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
