import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { SidebarContext } from '../lib/sidebar';

export function AppShell() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Close the mobile drawer whenever the route changes.
  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      <div className="min-h-screen flex bg-ink-deep">
        {/* Backdrop — only on mobile when the drawer is open */}
        {open && (
          <button
            aria-label="Cerrar menú"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-ink-deep/70 backdrop-blur-sm lg:hidden"
          />
        )}
        <Sidebar />
        <main className="flex-1 min-w-0 flex flex-col">
          <Outlet />
        </main>
      </div>
    </SidebarContext.Provider>
  );
}
