import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Plus, MapPin, Hexagon } from "lucide-react";
import { api } from "../services/api";
import { toast } from "sonner";
import type { Apiary } from "../types";

export function Apiaries() {
  const [apiaries, setApiaries] = useState<Apiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const navigate = useNavigate();

  const loadApiaries = () => {
    api.getApiaries()
      .then(setApiaries)
      .catch(() => toast.error("Error al cargar apiarios"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadApiaries(); }, []);

  const handleAddApiary = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const lat = formData.get("latitude") as string;
    const lng = formData.get("longitude") as string;

    try {
      await api.createApiary({
        name: formData.get("name"),
        location: formData.get("location"),
        latitude: lat ? parseFloat(lat) : undefined,
        longitude: lng ? parseFloat(lng) : undefined,
        notes: formData.get("notes") || undefined,
      });
      toast.success("Apiario agregado exitosamente");
      setIsAddDialogOpen(false);
      loadApiaries();
    } catch { toast.error("Error al crear apiario"); }
  };

  if (loading) return <div className="p-6 text-amber-700">Cargando apiarios...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-amber-900 mb-2">Apiarios</h2>
          <p className="text-amber-700">Gestiona tus ubicaciones de colmenas</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-600 hover:bg-amber-700"><Plus className="size-4 mr-2" />Nuevo Apiario</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Apiario</DialogTitle>
              <DialogDescription>Registra una nueva ubicación para tus colmenas</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddApiary} className="space-y-4">
              <div><Label htmlFor="name">Nombre del Apiario</Label><Input id="name" name="name" required placeholder="Ej: Apiario Norte" /></div>
              <div><Label htmlFor="location">Ubicación</Label><Input id="location" name="location" required placeholder="Ej: Finca El Roble, Km 23" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label htmlFor="latitude">Latitud (Opcional)</Label><Input id="latitude" name="latitude" type="number" step="any" placeholder="-34.6037" /></div>
                <div><Label htmlFor="longitude">Longitud (Opcional)</Label><Input id="longitude" name="longitude" type="number" step="any" placeholder="-58.3816" /></div>
              </div>
              <div><Label htmlFor="notes">Notas</Label><Textarea id="notes" name="notes" placeholder="Observaciones..." rows={3} /></div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancelar</Button>
                <Button type="submit" className="bg-amber-600 hover:bg-amber-700">Agregar Apiario</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {apiaries.map((apiary) => (
          <Card key={apiary.id} className="border-amber-200 bg-white hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/apiaries/${apiary.id}/hives`)}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{apiary.name}</CardTitle>
                <Badge className="bg-amber-100 text-amber-800 border-amber-300">{apiary.hive_count} {apiary.hive_count === 1 ? "colmena" : "colmenas"}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2 text-sm text-amber-700"><MapPin className="size-4 mt-0.5 flex-shrink-0" /><span>{apiary.location}</span></div>
              {apiary.latitude && apiary.longitude && <div className="text-xs text-amber-600">{apiary.latitude.toFixed(4)}, {apiary.longitude.toFixed(4)}</div>}
              {apiary.notes && <div className="pt-2 border-t border-amber-100"><p className="text-sm text-amber-600 line-clamp-2">{apiary.notes}</p></div>}
              <div className="flex items-center gap-2 pt-2"><Hexagon className="size-4 text-amber-600" /><span className="text-sm text-amber-700">Ver colmenas</span></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {apiaries.length === 0 && (
        <Card className="border-amber-200 bg-white">
          <CardContent className="py-12 text-center">
            <Hexagon className="size-12 text-amber-400 mx-auto mb-3" />
            <p className="text-amber-700">No hay apiarios registrados</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
