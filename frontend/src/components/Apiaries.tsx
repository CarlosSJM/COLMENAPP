import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Plus, MapPin, Hexagon } from "lucide-react";
import { mockApiaries } from "../data/mockData";
import { toast } from "sonner";

export function Apiaries() {
  const [apiaries, setApiaries] = useState(mockApiaries);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleAddApiary = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const lat = formData.get("lat") as string;
    const lng = formData.get("lng") as string;
    
    const newApiary = {
      id: String(apiaries.length + 1),
      name: formData.get("name") as string,
      location: formData.get("location") as string,
      coordinates: lat && lng ? {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
      } : undefined,
      notes: formData.get("notes") as string,
      hive_count: 0,
    };

    setApiaries([...apiaries, newApiary]);
    setIsAddDialogOpen(false);
    toast.success("Apiario agregado exitosamente");
  };

  const handleApiaryClick = (apiaryId: string) => {
    navigate(`/apiaries/${apiaryId}/hives`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-amber-900 mb-2">Apiarios</h2>
          <p className="text-amber-700">Gestiona tus ubicaciones de colmenas</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-600 hover:bg-amber-700">
              <Plus className="size-4 mr-2" />
              Nuevo Apiario
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Apiario</DialogTitle>
              <DialogDescription>
                Registra una nueva ubicación para tus colmenas
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddApiary} className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre del Apiario</Label>
                <Input id="name" name="name" required placeholder="Ej: Apiario Norte" />
              </div>

              <div>
                <Label htmlFor="location">Ubicación</Label>
                <Input
                  id="location"
                  name="location"
                  required
                  placeholder="Ej: Finca El Roble, Km 23 Ruta 5"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lat">Latitud (Opcional)</Label>
                  <Input
                    id="lat"
                    name="lat"
                    type="number"
                    step="any"
                    placeholder="-34.6037"
                  />
                </div>
                <div>
                  <Label htmlFor="lng">Longitud (Opcional)</Label>
                  <Input
                    id="lng"
                    name="lng"
                    type="number"
                    step="any"
                    placeholder="-58.3816"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Observaciones sobre el apiario..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
                  Agregar Apiario
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Apiaries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {apiaries.map((apiary) => (
          <Card
            key={apiary.id}
            className="border-amber-200 bg-white hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleApiaryClick(apiary.id)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{apiary.name}</CardTitle>
                <Badge className="bg-amber-100 text-amber-800 border-amber-300">
                  {apiary.hive_count} {apiary.hive_count === 1 ? "colmena" : "colmenas"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2 text-sm text-amber-700">
                <MapPin className="size-4 mt-0.5 flex-shrink-0" />
                <span>{apiary.location}</span>
              </div>
              {apiary.coordinates && (
                <div className="text-xs text-amber-600">
                  📍 {apiary.coordinates.lat.toFixed(4)}, {apiary.coordinates.lng.toFixed(4)}
                </div>
              )}
              {apiary.notes && (
                <div className="pt-2 border-t border-amber-100">
                  <p className="text-sm text-amber-600 line-clamp-2">{apiary.notes}</p>
                </div>
              )}
              <div className="flex items-center gap-2 pt-2">
                <Hexagon className="size-4 text-amber-600" />
                <span className="text-sm text-amber-700">Ver colmenas</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {apiaries.length === 0 && (
        <Card className="border-amber-200 bg-white">
          <CardContent className="py-12 text-center">
            <Hexagon className="size-12 text-amber-400 mx-auto mb-3" />
            <p className="text-amber-700">No hay apiarios registrados</p>
            <p className="text-sm text-amber-600 mt-1">Agrega tu primer apiario para comenzar</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
