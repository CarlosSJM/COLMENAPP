import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Hexagon, AlertTriangle, ClipboardList, CheckSquare } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { offlineApi } from "../services/offlineStore";
import { toast } from "sonner";
import type { DashboardStats } from "../types";

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    offlineApi.getDashboardStats()
      .then(setStats)
      .catch(() => toast.error("Error al cargar dashboard"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 text-amber-700">Cargando dashboard...</div>;
  if (!stats) return <div className="p-6 text-red-600">Error al cargar datos</div>;

  const healthColor = (status: string) =>
    ({ healthy: "text-green-600", weak: "text-yellow-600", sick: "text-orange-600", critical: "text-red-600" }[status] || "text-gray-600");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-amber-900 mb-2">Dashboard</h2>
        <p className="text-amber-700">Resumen general de tu apiario</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-amber-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Colmenas</CardTitle>
            <Hexagon className="size-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900">{stats.total_hives}</div>
            <div className="mt-2 space-y-1">
              <p className="text-xs text-green-600">✓ {stats.active_hives} activas</p>
              <p className="text-xs text-gray-600">• {stats.inactive_hives} inactivas</p>
              {stats.quarantine_hives > 0 && <p className="text-xs text-orange-600">⚠ {stats.quarantine_hives} en cuarentena</p>}
              {stats.lost_hives > 0 && <p className="text-xs text-red-600">✗ {stats.lost_hives} perdidas</p>}
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Requieren Atención</CardTitle>
            <AlertTriangle className="size-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.needs_attention}</div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Inspecciones Pendientes</CardTitle>
            <ClipboardList className="size-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.needs_inspection}</div>
            <p className="text-xs text-amber-600 mt-1">Sin revisión en 15+ días</p>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Tareas Pendientes</CardTitle>
            <CheckSquare className="size-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900">{stats.pending_tasks}</div>
            <p className="text-xs text-red-600 mt-1">{stats.high_priority_tasks} de alta prioridad</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-amber-200 bg-white">
          <CardHeader><CardTitle>Colmenas por Apiario</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.hives_by_apiary}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#f59e0b" name="Colmenas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-white">
          <CardHeader><CardTitle>Últimas 5 Inspecciones</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recent_inspections.map((inspection) => (
                <div key={inspection.id} className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                  <div className={`p-2 rounded-full ${inspection.health_status === "critical" || inspection.health_status === "sick" ? "bg-red-100" : "bg-green-100"}`}>
                    {inspection.health_status === "critical" || inspection.health_status === "sick"
                      ? <AlertTriangle className="size-4 text-red-600" />
                      : <ClipboardList className="size-4 text-green-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-amber-900 truncate">{inspection.hive?.name}</p>
                      <span className="text-xs text-amber-600 flex-shrink-0">
                        {new Date(inspection.date).toLocaleDateString("es-ES", { day: "2-digit", month: "short" })}
                      </span>
                    </div>
                    <p className={`text-sm font-semibold ${healthColor(inspection.health_status)}`}>
                      {inspection.health_status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
