import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Hexagon, AlertTriangle, ClipboardList, CheckSquare } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { mockHives, mockInspections, mockTasks, mockApiaries } from "../data/mockData";

export function Dashboard() {
  const stats = useMemo(() => {
    const totalHives = mockHives.length;
    const activeHives = mockHives.filter(h => h.status === "active").length;
    const inactiveHives = mockHives.filter(h => h.status === "inactive").length;
    const quarantineHives = mockHives.filter(h => h.status === "quarantine").length;
    const lostHives = mockHives.filter(h => h.status === "lost").length;
    
    // Colmenas que requieren atención (quarantine o estado crítico en inspecciones)
    const criticalInspections = mockInspections.filter(i => i.health_status === "Crítica");
    const needsAttention = quarantineHives + criticalInspections.filter(
      i => !mockHives.find(h => h.id === i.hive_id && h.status === "quarantine")
    ).length;
    
    // Inspecciones pendientes (sin inspección en 15 días)
    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
    const needsInspection = mockHives.filter(h => {
      const lastInspection = new Date(h.last_inspection);
      return lastInspection < fifteenDaysAgo;
    }).length;
    
    const pendingTasks = mockTasks.filter(t => !t.completed).length;
    const highPriorityTasks = mockTasks.filter(t => !t.completed && t.priority === "high").length;

    return {
      totalHives,
      activeHives,
      inactiveHives,
      quarantineHives,
      lostHives,
      needsAttention,
      needsInspection,
      pendingTasks,
      highPriorityTasks,
    };
  }, []);

  // Colmenas por apiario
  const hivesByApiary = mockApiaries.map(apiary => ({
    name: apiary.name,
    colmenas: mockHives.filter(h => h.apiary_id === apiary.id).length,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-amber-900 mb-2">Dashboard</h2>
        <p className="text-amber-700">Resumen general de tu apiario</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-amber-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Colmenas</CardTitle>
            <Hexagon className="size-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900">{stats.totalHives}</div>
            <div className="mt-2 space-y-1">
              <p className="text-xs text-green-600">
                ✓ {stats.activeHives} activas
              </p>
              <p className="text-xs text-gray-600">
                • {stats.inactiveHives} inactivas
              </p>
              {stats.quarantineHives > 0 && (
                <p className="text-xs text-orange-600">
                  ⚠ {stats.quarantineHives} en cuarentena
                </p>
              )}
              {stats.lostHives > 0 && (
                <p className="text-xs text-red-600">
                  ✗ {stats.lostHives} perdidas
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Requieren Atención</CardTitle>
            <AlertTriangle className="size-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.needsAttention}</div>
            <p className="text-xs text-amber-600 mt-1">
              {stats.quarantineHives > 0 && `${stats.quarantineHives} en cuarentena`}
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Inspecciones Pendientes</CardTitle>
            <ClipboardList className="size-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.needsInspection}</div>
            <p className="text-xs text-amber-600 mt-1">
              Sin revisión en 15+ días
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Tareas Pendientes</CardTitle>
            <CheckSquare className="size-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900">{stats.pendingTasks}</div>
            <p className="text-xs text-red-600 mt-1">
              {stats.highPriorityTasks} de alta prioridad
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hives by Apiary */}
        <Card className="border-amber-200 bg-white">
          <CardHeader>
            <CardTitle>Colmenas por Apiario</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hivesByApiary}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="colmenas" fill="#f59e0b" name="Colmenas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Inspections */}
        <Card className="border-amber-200 bg-white">
          <CardHeader>
            <CardTitle>Últimas 5 Inspecciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockInspections.slice(0, 5).map((inspection) => {
                const healthColor = ({
                  Saludable: "text-green-600",
                  Débil: "text-yellow-600",
                  Enferma: "text-orange-600",
                  Crítica: "text-red-600",
                } as Record<string, string>)[inspection.health_status];

                return (
                  <div key={inspection.id} className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                    <div className={`p-2 rounded-full ${
                      inspection.health_status === "Crítica" || inspection.health_status === "Enferma"
                        ? 'bg-red-100'
                        : 'bg-green-100'
                    }`}>
                      {inspection.health_status === "Crítica" || inspection.health_status === "Enferma" ? (
                        <AlertTriangle className="size-4 text-red-600" />
                      ) : (
                        <ClipboardList className="size-4 text-green-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-amber-900 truncate">{inspection.hive_name}</p>
                        <span className="text-xs text-amber-600 flex-shrink-0">
                          {new Date(inspection.date).toLocaleDateString('es-ES', { 
                            day: '2-digit',
                            month: 'short'
                          })}
                        </span>
                      </div>
                      <p className={`text-sm font-semibold ${healthColor}`}>
                        {inspection.health_status}
                      </p>
                      <p className="text-xs text-amber-700 mt-1 line-clamp-1">
                        {inspection.notes}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
