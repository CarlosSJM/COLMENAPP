import { Outlet, NavLink } from "react-router-dom";
import { Home, Hexagon, ClipboardList, Droplet, CheckSquare, MapPin, CloudOff, Cloud, RefreshCw } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";

export function Layout() {
  const { isOnline, pendingSync, isSyncing, syncNow } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-amber-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-amber-500 to-yellow-600 p-2 rounded-lg">
                <Hexagon className="size-8 text-white" fill="currentColor" />
              </div>
              <div>
                <h1 className="font-bold text-2xl text-amber-900">COLMENAPP</h1>
                <p className="text-sm text-amber-700">Sistema de Gestión Apícola</p>
              </div>
            </div>

            {/* Status Indicators */}
            <div className="flex items-center gap-2">
              {/* Sync Status */}
              {pendingSync > 0 && (
                <Badge variant="outline" className="border-orange-300 text-orange-700 bg-orange-50 flex items-center gap-1">
                  {pendingSync} pendientes
                  {isOnline && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="size-5 p-0 ml-1"
                      onClick={syncNow}
                      disabled={isSyncing}
                    >
                      <RefreshCw className={`size-3 ${isSyncing ? 'animate-spin' : ''}`} />
                    </Button>
                  )}
                </Badge>
              )}
              {isSyncing && (
                <Badge variant="outline" className="border-blue-300 text-blue-700 bg-blue-50">
                  <RefreshCw className="size-3 mr-1 animate-spin" />
                  Sincronizando...
                </Badge>
              )}

              {/* Online/Offline Status */}
              <Badge
                variant="outline"
                className={
                  isOnline
                    ? "border-green-300 text-green-700 bg-green-50"
                    : "border-orange-300 text-orange-700 bg-orange-50"
                }
              >
                {isOnline ? (
                  <>
                    <Cloud className="size-3 mr-1" />
                    Online
                  </>
                ) : (
                  <>
                    <CloudOff className="size-3 mr-1" />
                    Offline
                  </>
                )}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-amber-100 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-3 rounded-t-lg transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-amber-100 text-amber-900"
                    : "text-amber-700 hover:bg-amber-50"
                }`
              }
            >
              <Home className="size-4" />
              <span>Dashboard</span>
            </NavLink>
            <NavLink
              to="/apiaries"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-3 rounded-t-lg transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-amber-100 text-amber-900"
                    : "text-amber-700 hover:bg-amber-50"
                }`
              }
            >
              <MapPin className="size-4" />
              <span>Apiarios</span>
            </NavLink>
            <NavLink
              to="/hives"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-3 rounded-t-lg transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-amber-100 text-amber-900"
                    : "text-amber-700 hover:bg-amber-50"
                }`
              }
            >
              <Hexagon className="size-4" />
              <span>Colmenas</span>
            </NavLink>
            <NavLink
              to="/inspections"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-3 rounded-t-lg transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-amber-100 text-amber-900"
                    : "text-amber-700 hover:bg-amber-50"
                }`
              }
            >
              <ClipboardList className="size-4" />
              <span>Inspecciones</span>
            </NavLink>
            <NavLink
              to="/production"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-3 rounded-t-lg transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-amber-100 text-amber-900"
                    : "text-amber-700 hover:bg-amber-50"
                }`
              }
            >
              <Droplet className="size-4" />
              <span>Producción</span>
            </NavLink>
            <NavLink
              to="/tasks"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-3 rounded-t-lg transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-amber-100 text-amber-900"
                    : "text-amber-700 hover:bg-amber-50"
                }`
              }
            >
              <CheckSquare className="size-4" />
              <span>Tareas</span>
            </NavLink>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
