import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Plus, Droplet, Package, Sparkles, Trash2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { offlineApi } from "../services/offlineStore";
import { adaptProductions } from "../services/adapters";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";

export function Production() {
  const [productions, setProductions] = useState<any[]>([]);
  const [hives, setHives] = useState<any[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deletingProduction, setDeletingProduction] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { refreshPendingCount } = useAuth();

  const loadData = () => {
    offlineApi.getProductions().then(adaptProductions).then(setProductions).catch(() => toast.error("Error al cargar producción"));
    offlineApi.getHives().then(setHives).catch(() => {});
  };

  useEffect(() => { loadData(); }, []);

  const stats = useMemo(() => {
    const totalHoney = productions.reduce((sum, p) => sum + p.honey_kg, 0);
    const totalWax = productions.reduce((sum, p) => sum + p.wax_kg, 0);
    const totalPropolis = productions.reduce((sum, p) => sum + p.propolis_g, 0);
    
    return { totalHoney, totalWax, totalPropolis };
  }, [productions]);

  const chartData = useMemo(() => {
    const grouped = productions.reduce((acc, prod) => {
      const existing = acc.find((item: any) => item.colmena === prod.hive_name);
      if (existing) {
        existing.miel += prod.honey_kg;
        existing.cera += prod.wax_kg;
      } else {
        acc.push({
          colmena: prod.hive_name,
          miel: prod.honey_kg,
          cera: prod.wax_kg,
        });
      }
      return acc;
    }, [] as { colmena: string; miel: number; cera: number }[]);
    
    return grouped;
  }, [productions]);

  const handleAddProduction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const { offline } = await offlineApi.createProduction({
        hive_id: formData.get("hive_id") as string,
        date: formData.get("date") as string,
        honey_kg: parseFloat(formData.get("honey_kg") as string),
        wax_kg: parseFloat(formData.get("wax_kg") as string),
        propolis_g: parseFloat(formData.get("propolis_g") as string),
      });
      toast.success(offline ? "Producción guardada localmente. Se sincronizará al recuperar conexión." : "Producción registrada exitosamente");
      await refreshPendingCount();
      setIsAddDialogOpen(false);
      loadData();
    } catch { toast.error("Error al registrar producción"); }
  };

  const handleDeleteProduction = async () => {
    if (!deletingProduction) return;
    setIsDeleting(true);
    try {
      const { offline } = await offlineApi.deleteProduction(deletingProduction.id);
      toast.success(offline ? "Eliminación guardada localmente." : "Registro eliminado");
      await refreshPendingCount();
      setDeletingProduction(null);
      loadData();
    } catch { toast.error("Error al eliminar registro"); }
    finally { setIsDeleting(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-amber-900 mb-2">Producción</h2>
          <p className="text-amber-700">Registro de producción de miel y derivados</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-600 hover:bg-amber-700">
              <Plus className="size-4 mr-2" />
              Registrar Producción
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Registrar Nueva Producción</DialogTitle>
              <DialogDescription>
                Registra la cosecha de miel, cera y propóleo
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddProduction} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hive_id">Colmena</Label>
                  <Select name="hive_id" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una colmena" />
                    </SelectTrigger>
                    <SelectContent>
                      {hives.map((hive) => (
                        <SelectItem key={hive.id} value={hive.id}>
                          {hive.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="date">Fecha</Label>
                  <Input id="date" name="date" type="date" required />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="honey_kg">Miel (kg)</Label>
                  <Input
                    id="honey_kg"
                    name="honey_kg"
                    type="number"
                    step="0.1"
                    min="0"
                    required
                    placeholder="15.5"
                  />
                </div>
                <div>
                  <Label htmlFor="wax_kg">Cera (kg)</Label>
                  <Input
                    id="wax_kg"
                    name="wax_kg"
                    type="number"
                    step="0.1"
                    min="0"
                    required
                    placeholder="1.2"
                  />
                </div>
                <div>
                  <Label htmlFor="propolis_g">Propóleo (g)</Label>
                  <Input
                    id="propolis_g"
                    name="propolis_g"
                    type="number"
                    step="1"
                    min="0"
                    required
                    placeholder="150"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
                  Registrar Producción
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Miel Total</CardTitle>
            <Droplet className="size-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-900">{stats.totalHoney.toFixed(1)} kg</div>
            <p className="text-xs text-amber-600 mt-1">
              Promedio: {(stats.totalHoney / productions.length).toFixed(1)} kg por cosecha
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-gradient-to-br from-yellow-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Cera Total</CardTitle>
            <Package className="size-5 text-yellow-700" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-900">{stats.totalWax.toFixed(1)} kg</div>
            <p className="text-xs text-amber-600 mt-1">
              Promedio: {(stats.totalWax / productions.length).toFixed(2)} kg por cosecha
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-gradient-to-br from-orange-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Propóleo Total</CardTitle>
            <Sparkles className="size-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-900">{stats.totalPropolis} g</div>
            <p className="text-xs text-amber-600 mt-1">
              Promedio: {(stats.totalPropolis / productions.length).toFixed(0)} g por cosecha
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="border-amber-200 bg-white">
        <CardHeader>
          <CardTitle>Producción por Colmena</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="colmena" angle={-45} textAnchor="end" height={100} />
              <YAxis label={{ value: 'Kilogramos', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="miel" fill="#f59e0b" name="Miel (kg)" />
              <Bar dataKey="cera" fill="#fbbf24" name="Cera (kg)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Production List */}
      <Card className="border-amber-200 bg-white">
        <CardHeader>
          <CardTitle>Registro de Producción</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-amber-200">
                  <th className="text-left py-3 px-4 text-amber-900">Fecha</th>
                  <th className="text-left py-3 px-4 text-amber-900">Colmena</th>
                  <th className="text-right py-3 px-4 text-amber-900">Miel (kg)</th>
                  <th className="text-right py-3 px-4 text-amber-900">Cera (kg)</th>
                  <th className="text-right py-3 px-4 text-amber-900">Propóleo (g)</th>
                </tr>
              </thead>
              <tbody>
                {productions.map((production, index) => (
                  <tr
                    key={production.id}
                    className={`border-b border-amber-100 ${
                      index % 2 === 0 ? "bg-amber-50/50" : "bg-white"
                    }`}
                  >
                    <td className="py-3 px-4 text-amber-700">
                      {new Date(production.date).toLocaleDateString("es-ES")}
                    </td>
                    <td className="py-3 px-4 text-amber-900">{production.hive_name}</td>
                    <td className="py-3 px-4 text-right text-amber-900">
                      {production.honey_kg.toFixed(1)}
                    </td>
                    <td className="py-3 px-4 text-right text-amber-900">
                      {production.wax_kg.toFixed(1)}
                    </td>
                    <td className="py-3 px-4 text-right text-amber-900">
                      {production.propolis_g}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button size="sm" variant="ghost" className="size-7 p-0 text-red-500 hover:text-red-700" onClick={() => setDeletingProduction(production)}>
                        <Trash2 className="size-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation */}
      <ConfirmDeleteDialog
        isOpen={!!deletingProduction}
        onClose={() => setDeletingProduction(null)}
        onConfirm={handleDeleteProduction}
        title="Eliminar Registro de Producción"
        description={`¿Estás seguro de eliminar el registro de "${deletingProduction?.hive_name}" del ${deletingProduction ? new Date(deletingProduction.date).toLocaleDateString("es-ES") : ""}?`}
        isLoading={isDeleting}
      />
    </div>
  );
}