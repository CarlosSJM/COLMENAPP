import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Plus, Users, Calendar, AlertCircle, QrCode, ScanLine, ChevronRight, Pencil, Trash2 } from "lucide-react";
import { api } from "../services/api";
import { offlineApi } from "../services/offlineStore";
import { adaptHives } from "../services/adapters";
import { QRModal } from "./QRModal";
import { QRScanner } from "./QRScanner";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import type { Hive, Apiary } from "../types";

export function Hives() {
  const { apiaryId } = useParams();
  const navigate = useNavigate();
  const [hives, setHives] = useState<(Hive & { apiary_name: string })[]>([]);
  const [apiaries, setApiaries] = useState<Apiary[]>([]);
  const [selectedHive, setSelectedHive] = useState<(Hive & { apiary_name: string }) | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingHive, setEditingHive] = useState<(Hive & { apiary_name: string }) | null>(null);
  const [deletingHive, setDeletingHive] = useState<(Hive & { apiary_name: string }) | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [qrModalData, setQrModalData] = useState<{
    isOpen: boolean;
    hiveCode: string;
    hiveName: string;
    apiaryName: string;
  }>({
    isOpen: false,
    hiveCode: "",
    hiveName: "",
    apiaryName: "",
  });

  const { refreshPendingCount } = useAuth();

  const loadData = () => {
    const hivesPromise = apiaryId
      ? offlineApi.getApiaryHives(apiaryId).then(adaptHives)
      : offlineApi.getHives().then(adaptHives);
    hivesPromise.then(setHives).catch(() => toast.error("Error al cargar colmenas"));
    offlineApi.getApiaries().then(setApiaries).catch(() => {});
  };

  useEffect(() => { loadData(); }, [apiaryId]);

  const filteredHives = hives;

  const currentApiary = apiaryId
    ? apiaries.find((a) => a.id === apiaryId)
    : null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-300";
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-300";
      case "quarantine":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "lost":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Activa";
      case "inactive":
        return "Inactiva";
      case "quarantine":
        return "Cuarentena";
      case "lost":
        return "Perdida";
      default:
        return status;
    }
  };

  const handleAddHive = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const selectedApiaryId = apiaryId || (formData.get("apiary_id") as string);

    try {
      const { offline } = await offlineApi.createHive({
        code: formData.get("code") as string,
        name: formData.get("name") as string,
        apiary_id: selectedApiaryId,
        status: formData.get("status") as string,
        queen_origin: formData.get("queen_origin") as string,
        population: parseInt(formData.get("population") as string),
        frames: parseInt(formData.get("frames") as string),
        installed_at: formData.get("installed_at") as string,
        notes: (formData.get("notes") as string) || undefined,
      });
      toast.success(offline ? "Colmena guardada localmente. Se sincronizará al recuperar conexión." : "Colmena agregada exitosamente");
      await refreshPendingCount();
      setIsAddDialogOpen(false);
      loadData();
    } catch { toast.error("Error al crear colmena"); }
  };

  const handleShowQR = (hive: Hive & { apiary_name: string }) => {
    setQrModalData({
      isOpen: true,
      hiveCode: hive.code,
      hiveName: hive.name,
      apiaryName: hive.apiary_name,
    });
  };

  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const handleScanQR = () => {
    setIsScannerOpen(true);
  };

  const handleQRScanned = async (code: string) => {
    setIsScannerOpen(false);
    try {
      const hive = await api.getHiveByCode(code);
      if (hive) {
        setSelectedHive({ ...hive, apiary_name: hive.apiary?.name || '' });
        toast.success(`Colmena ${code} encontrada`);
      }
    } catch {
      toast.error(`No se encontró colmena con código: ${code}`);
    }
  };

  const handleEditHive = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingHive) return;
    const formData = new FormData(e.currentTarget);
    try {
      const { offline } = await offlineApi.updateHive(editingHive.id, {
        code: formData.get("code") as string,
        name: formData.get("name") as string,
        status: formData.get("status") as string,
        queen_origin: formData.get("queen_origin") as string,
        population: parseInt(formData.get("population") as string),
        frames: parseInt(formData.get("frames") as string),
        installed_at: formData.get("installed_at") as string,
        notes: (formData.get("notes") as string) || undefined,
      });
      toast.success(offline ? "Cambios guardados localmente. Se sincronizarán al recuperar conexión." : "Colmena actualizada exitosamente");
      await refreshPendingCount();
      setEditingHive(null);
      setSelectedHive(null);
      loadData();
    } catch { toast.error("Error al actualizar colmena"); }
  };

  const handleDeleteHive = async () => {
    if (!deletingHive) return;
    setIsDeleting(true);
    try {
      const { offline } = await offlineApi.deleteHive(deletingHive.id);
      toast.success(offline ? "Eliminación guardada localmente." : "Colmena eliminada");
      await refreshPendingCount();
      setDeletingHive(null);
      setSelectedHive(null);
      loadData();
    } catch { toast.error("Error al eliminar colmena"); }
    finally { setIsDeleting(false); }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      {currentApiary && (
        <div className="flex items-center gap-2 text-sm text-amber-700">
          <button
            onClick={() => navigate("/apiaries")}
            className="hover:text-amber-900 hover:underline"
          >
            Apiarios
          </button>
          <ChevronRight className="size-4" />
          <span className="font-semibold text-amber-900">{currentApiary.name}</span>
          <ChevronRight className="size-4" />
          <span>Colmenas</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-amber-900 mb-2">
            {currentApiary ? `Colmenas - ${currentApiary.name}` : "Colmenas"}
          </h2>
          <p className="text-amber-700">
            {currentApiary
              ? `${filteredHives.length} colmenas en este apiario`
              : "Gestiona todas tus colmenas"}
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-600 hover:bg-amber-700">
              <Plus className="size-4 mr-2" />
              Nueva Colmena
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Agregar Nueva Colmena</DialogTitle>
              <DialogDescription>
                Registra una nueva colmena en tu apiario
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddHive} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="code">Código</Label>
                  <Input id="code" name="code" required placeholder="Ej: AN-001" />
                </div>
                <div>
                  <Label htmlFor="name">Nombre</Label>
                  <Input id="name" name="name" required placeholder="Ej: Colmena Alfa" />
                </div>
              </div>

              {!apiaryId && (
                <div>
                  <Label htmlFor="apiary_id">Apiario</Label>
                  <Select name="apiary_id" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un apiario" />
                    </SelectTrigger>
                    <SelectContent>
                      {apiaries.map((apiary) => (
                        <SelectItem key={apiary.id} value={apiary.id}>
                          {apiary.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Estado</Label>
                  <Select name="status" defaultValue="active" required>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Activa</SelectItem>
                      <SelectItem value="inactive">Inactiva</SelectItem>
                      <SelectItem value="quarantine">Cuarentena</SelectItem>
                      <SelectItem value="lost">Perdida</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="queen_origin">Origen de Reina</Label>
                  <Select name="queen_origin" defaultValue="purchased" required>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="purchased">Comprada</SelectItem>
                      <SelectItem value="raised">Criada</SelectItem>
                      <SelectItem value="swarm">Enjambre</SelectItem>
                      <SelectItem value="unknown">Desconocida</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="population">Población</Label>
                  <Input
                    id="population"
                    name="population"
                    type="number"
                    required
                    placeholder="40000"
                  />
                </div>
                <div>
                  <Label htmlFor="frames">Cuadros</Label>
                  <Input id="frames" name="frames" type="number" required placeholder="10" />
                </div>
              </div>

              <div>
                <Label htmlFor="installed_at">Fecha de Instalación</Label>
                <Input id="installed_at" name="installed_at" type="date" required />
              </div>

              <div>
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Observaciones adicionales..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
                  Agregar Colmena
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Hives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredHives.map((hive) => (
          <Card
            key={hive.id}
            className="border-amber-200 bg-white hover:shadow-lg transition-shadow"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs text-amber-700 border-amber-300">
                      {hive.code}
                    </Badge>
                    <Badge className={getStatusColor(hive.status)}>
                      {getStatusLabel(hive.status)}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{hive.name}</CardTitle>
                  {!apiaryId && (
                    <p className="text-sm text-amber-600 mt-1">{hive.apiary_name}</p>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-amber-700">
                <Users className="size-4" />
                <span>{(hive.population ?? 0).toLocaleString()} abejas • {hive.frames ?? 0} cuadros</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-amber-700">
                <Calendar className="size-4" />
                <span>
                  Última inspección:{" "}
                  {hive.last_inspection ? new Date(hive.last_inspection).toLocaleDateString("es-ES") : "Sin inspecciones"}
                </span>
              </div>
              <div className="pt-2 border-t border-amber-100">
                <p className="text-sm text-amber-600">
                  Reina: {hive.queen_origin}
                </p>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleShowQR(hive)}
                >
                  <QrCode className="size-4 mr-1" />
                  Ver QR
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setSelectedHive(hive)}
                >
                  Detalles
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredHives.length === 0 && (
        <Card className="border-amber-200 bg-white">
          <CardContent className="py-12 text-center">
            <AlertCircle className="size-12 text-amber-400 mx-auto mb-3" />
            <p className="text-amber-700">
              No hay colmenas en {currentApiary ? "este apiario" : "el sistema"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* FAB - Scan QR */}
      <button
        onClick={handleScanQR}
        className="fixed bottom-6 right-6 bg-amber-600 hover:bg-amber-700 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110"
        aria-label="Escanear QR"
      >
        <ScanLine className="size-6" />
      </button>

      {/* Hive Details Dialog */}
      {selectedHive && (
        <Dialog open={!!selectedHive} onOpenChange={() => setSelectedHive(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between pr-10">
                <div className="flex items-center gap-2">
                  <span>{selectedHive.name}</span>
                  <Badge variant="outline" className="text-xs">{selectedHive.code}</Badge>
                </div>
                <Badge className={getStatusColor(selectedHive.status)}>
                  {getStatusLabel(selectedHive.status)}
                </Badge>
              </DialogTitle>
              <DialogDescription>
                Información detallada de la colmena
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-amber-700">Apiario</Label>
                  <p className="text-amber-900">{selectedHive.apiary_name}</p>
                </div>
                <div>
                  <Label className="text-amber-700">Población</Label>
                  <p className="text-amber-900">{(selectedHive.population ?? 0).toLocaleString()} abejas</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-amber-700">Origen de Reina</Label>
                  <p className="text-amber-900">{selectedHive.queen_origin}</p>
                </div>
                <div>
                  <Label className="text-amber-700">Cuadros</Label>
                  <p className="text-amber-900">{selectedHive.frames}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-amber-700">Instalada</Label>
                  <p className="text-amber-900">
                    {selectedHive.installed_at ? new Date(selectedHive.installed_at).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }) : "No registrada"}
                  </p>
                </div>
                <div>
                  <Label className="text-amber-700">Última Inspección</Label>
                  <p className="text-amber-900">
                    {selectedHive.last_inspection ? new Date(selectedHive.last_inspection).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }) : "Sin inspecciones"}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-amber-700">Notas</Label>
                <div className="mt-2 p-3 bg-amber-50 rounded-lg">
                  <p className="text-amber-900">{selectedHive.notes}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => handleShowQR(selectedHive)}>
                  <QrCode className="size-4 mr-2" />Ver QR
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => { setEditingHive(selectedHive); setSelectedHive(null); }}>
                  <Pencil className="size-4 mr-2" />Editar
                </Button>
                <Button variant="outline" className="flex-1 text-red-600 hover:text-red-700" onClick={() => { setDeletingHive(selectedHive); setSelectedHive(null); }}>
                  <Trash2 className="size-4 mr-2" />Eliminar
                </Button>
              </div>

              {(selectedHive.status === "quarantine" || selectedHive.status === "lost") && (
                <div className="flex items-start gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <AlertCircle className="size-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-orange-900">Atención Requerida</p>
                    <p className="text-sm text-orange-700">
                      Esta colmena requiere seguimiento especial.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* QR Modal */}
      <QRModal
        isOpen={qrModalData.isOpen}
        onClose={() => setQrModalData({ ...qrModalData, isOpen: false })}
        hiveCode={qrModalData.hiveCode}
        hiveName={qrModalData.hiveName}
        apiaryName={qrModalData.apiaryName}
      />

      {/* QR Scanner */}
      <QRScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={handleQRScanned}
      />

      {/* Edit Hive Dialog */}
      <Dialog open={!!editingHive} onOpenChange={() => setEditingHive(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Colmena</DialogTitle>
            <DialogDescription>Modifica los datos de la colmena</DialogDescription>
          </DialogHeader>
          {editingHive && (
            <form onSubmit={handleEditHive} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label htmlFor="edit-code">Código</Label><Input id="edit-code" name="code" required defaultValue={editingHive.code} /></div>
                <div><Label htmlFor="edit-name">Nombre</Label><Input id="edit-name" name="name" required defaultValue={editingHive.name} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-status">Estado</Label>
                  <Select name="status" defaultValue={editingHive.status}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Activa</SelectItem>
                      <SelectItem value="inactive">Inactiva</SelectItem>
                      <SelectItem value="quarantine">Cuarentena</SelectItem>
                      <SelectItem value="lost">Perdida</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-queen">Origen de Reina</Label>
                  <Select name="queen_origin" defaultValue={editingHive.queen_origin}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="purchased">Comprada</SelectItem>
                      <SelectItem value="raised">Criada</SelectItem>
                      <SelectItem value="swarm">Enjambre</SelectItem>
                      <SelectItem value="unknown">Desconocida</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label htmlFor="edit-pop">Población</Label><Input id="edit-pop" name="population" type="number" required defaultValue={editingHive.population} /></div>
                <div><Label htmlFor="edit-frames">Cuadros</Label><Input id="edit-frames" name="frames" type="number" required defaultValue={editingHive.frames} /></div>
              </div>
              <div><Label htmlFor="edit-installed">Fecha de Instalación</Label><Input id="edit-installed" name="installed_at" type="date" required defaultValue={editingHive.installed_at?.split("T")[0]} /></div>
              <div><Label htmlFor="edit-notes">Notas</Label><Textarea id="edit-notes" name="notes" rows={3} defaultValue={editingHive.notes} /></div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setEditingHive(null)}>Cancelar</Button>
                <Button type="submit" className="bg-amber-600 hover:bg-amber-700">Guardar Cambios</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDeleteDialog
        isOpen={!!deletingHive}
        onClose={() => setDeletingHive(null)}
        onConfirm={handleDeleteHive}
        title="Eliminar Colmena"
        description={`¿Estás seguro de eliminar "${deletingHive?.name}" (${deletingHive?.code})?`}
        warning="Se eliminarán todas las inspecciones, registros de producción y tareas asociadas a esta colmena."
        isLoading={isDeleting}
      />
    </div>
  );
}
