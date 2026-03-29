import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Plus, MapPin, Hexagon, Pencil, Trash2 } from "lucide-react";
import { api } from "../services/api";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import { toast } from "sonner";
import type { Apiary } from "../types";

export function Apiaries() {
  const [apiaries, setApiaries] = useState<Apiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingApiary, setEditingApiary] = useState<Apiary | null>(null);
  const [deletingApiary, setDeletingApiary] = useState<Apiary | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const loadApiaries = () => {
    api.getApiaries()
      .then(setApiaries)
      .catch(() => toast.error("Error al cargar apiarios"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadApiaries(); }, []);

  const extractFormData = (formData: FormData) => {
    const lat = formData.get("latitude") as string;
    const lng = formData.get("longitude") as string;
    return {
      name: formData.get("name"),
      location: formData.get("location"),
      latitude: lat ? parseFloat(lat) : undefined,
      longitude: lng ? parseFloat(lng) : undefined,
      notes: formData.get("notes") || undefined,
    };
  };

  const handleAddApiary = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await api.createApiary(extractFormData(new FormData(e.currentTarget)));
      toast.success("Apiario agregado exitosamente");
      setIsAddDialogOpen(false);
      loadApiaries();
    } catch { toast.error("Error al crear apiario"); }
  };

  const handleEditApiary = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingApiary) return;
    try {
      await api.updateApiary(editingApiary.id, extractFormData(new FormData(e.currentTarget)));
      toast.success("Apiario actualizado exitosamente");
      setEditingApiary(null);
      loadApiaries();
    } catch { toast.error("Error al actualizar apiario"); }
  };

  const handleDeleteApiary = async () => {
    if (!deletingApiary) return;
    setIsDeleting(true);
    try {
      await api.deleteApiary(deletingApiary.id);
      toast.success("Apiario eliminado");
      setDeletingApiary(null);
      loadApiaries();
    } catch { toast.error("Error al eliminar apiario"); }
    finally { setIsDeleting(false); }
  };

  const renderForm = (onSubmit: (e: React.FormEvent<HTMLFormElement>) => void, defaults?: Apiary, submitLabel?: string) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div><Label htmlFor="name">Nombre del Apiario</Label><Input id="name" name="name" required placeholder="Ej: Apiario Norte" defaultValue={defaults?.name} /></div>
      <div><Label htmlFor="location">Ubicación</Label><Input id="location" name="location" required placeholder="Ej: Finca El Roble, Km 23" defaultValue={defaults?.location} /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><Label htmlFor="latitude">Latitud (Opcional)</Label><Input id="latitude" name="latitude" type="number" step="any" placeholder="-34.6037" defaultValue={defaults?.latitude ?? ""} /></div>
        <div><Label htmlFor="longitude">Longitud (Opcional)</Label><Input id="longitude" name="longitude" type="number" step="any" placeholder="-58.3816" defaultValue={defaults?.longitude ?? ""} /></div>
      </div>
      <div><Label htmlFor="notes">Notas</Label><Textarea id="notes" name="notes" placeholder="Observaciones..." rows={3} defaultValue={defaults?.notes ?? ""} /></div>
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={() => { setIsAddDialogOpen(false); setEditingApiary(null); }}>Cancelar</Button>
        <Button type="submit" className="bg-amber-600 hover:bg-amber-700">{submitLabel || "Guardar"}</Button>
      </div>
    </form>
  );

  const formatUpdatedAt = (apiary: Apiary) => {
    if (!apiary.updated_at || apiary.updated_at === apiary.created_at) return null;
    return new Date(apiary.updated_at).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
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
            {renderForm(handleAddApiary, undefined, "Agregar Apiario")}
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {apiaries.map((apiary) => (
          <Card key={apiary.id} className="border-amber-200 bg-white hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg cursor-pointer" onClick={() => navigate(`/apiaries/${apiary.id}/hives`)}>{apiary.name}</CardTitle>
                <div className="flex items-center gap-1">
                  <Badge className="bg-amber-100 text-amber-800 border-amber-300">{apiary.hive_count} {apiary.hive_count === 1 ? "colmena" : "colmenas"}</Badge>
                  <Button size="sm" variant="ghost" className="size-8 p-0 text-amber-600 hover:text-amber-800" onClick={(e) => { e.stopPropagation(); setEditingApiary(apiary); }}>
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button size="sm" variant="ghost" className="size-8 p-0 text-red-500 hover:text-red-700" onClick={(e) => { e.stopPropagation(); setDeletingApiary(apiary); }}>
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 cursor-pointer" onClick={() => navigate(`/apiaries/${apiary.id}/hives`)}>
              <div className="flex items-start gap-2 text-sm text-amber-700"><MapPin className="size-4 mt-0.5 flex-shrink-0" /><span>{apiary.location}</span></div>
              {apiary.latitude && apiary.longitude && <div className="text-xs text-amber-600">{apiary.latitude.toFixed(4)}, {apiary.longitude.toFixed(4)}</div>}
              {apiary.notes && <div className="pt-2 border-t border-amber-100"><p className="text-sm text-amber-600 line-clamp-2">{apiary.notes}</p></div>}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2"><Hexagon className="size-4 text-amber-600" /><span className="text-sm text-amber-700">Ver colmenas</span></div>
                {formatUpdatedAt(apiary) && <span className="text-xs text-amber-500">Editado: {formatUpdatedAt(apiary)}</span>}
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
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingApiary} onOpenChange={() => setEditingApiary(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Apiario</DialogTitle>
            <DialogDescription>Modifica los datos del apiario</DialogDescription>
          </DialogHeader>
          {editingApiary && renderForm(handleEditApiary, editingApiary, "Guardar Cambios")}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDeleteDialog
        isOpen={!!deletingApiary}
        onClose={() => setDeletingApiary(null)}
        onConfirm={handleDeleteApiary}
        title="Eliminar Apiario"
        description={`¿Estás seguro de eliminar "${deletingApiary?.name}"?`}
        warning={deletingApiary && deletingApiary.hive_count > 0 ? `Se eliminarán ${deletingApiary.hive_count} colmena(s) y todos sus registros asociados (inspecciones, producción, tareas).` : undefined}
        isLoading={isDeleting}
      />
    </div>
  );
}
