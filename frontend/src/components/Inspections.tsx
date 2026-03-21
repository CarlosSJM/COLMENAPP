import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { Plus, Eye, Bug, ThermometerSun, Weight, Activity, Heart } from "lucide-react";
import { api } from "../services/api";
import { adaptInspections } from "../services/adapters";
import { toast } from "sonner";

export function Inspections() {
  const [inspections, setInspections] = useState<any[]>([]);
  const [hives, setHives] = useState<any[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [treatmentApplied, setTreatmentApplied] = useState(false);

  const loadData = () => {
    api.getInspections().then(adaptInspections).then(setInspections).catch(() => toast.error("Error al cargar inspecciones"));
    api.getHives().then(setHives).catch(() => {});
  };

  useEffect(() => { loadData(); }, []);

  const getBroodPatternColor = (pattern: string) => {
    switch (pattern) {
      case "excellent":
        return "bg-green-100 text-green-800 border-green-300";
      case "good":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "fair":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "poor":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getBroodPatternLabel = (pattern: string) => {
    const labels = {
      excellent: "Excelente",
      good: "Bueno",
      fair: "Regular",
      poor: "Pobre",
    };
    return labels[pattern as keyof typeof labels] || pattern;
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case "Saludable":
        return "bg-green-100 text-green-800 border-green-300";
      case "Débil":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Enferma":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "Crítica":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getTemperamentColor = (temperament: string) => {
    switch (temperament) {
      case "calm":
        return "text-green-600";
      case "normal":
        return "text-blue-600";
      case "aggressive":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getTemperamentLabel = (temperament: string) => {
    const labels = {
      calm: "Calmada",
      normal: "Normal",
      aggressive: "Agresiva",
    };
    return labels[temperament as keyof typeof labels] || temperament;
  };

  const handleAddInspection = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const diseases = formData.get("diseases") ? (formData.get("diseases") as string).split(",").map(d => d.trim()).filter(Boolean) : [];

    try {
      await api.createInspection({
        hive_id: formData.get("hive_id"),
        date: formData.get("date"),
        queen_seen: formData.get("queen_seen") === "on",
        brood_pattern: formData.get("brood_pattern"),
        temperament: formData.get("temperament"),
        weight: parseFloat(formData.get("weight") as string),
        varroa_count: parseInt(formData.get("varroa_count") as string),
        activity_level: formData.get("activity_level"),
        health_status: formData.get("health_status"),
        diseases,
        treatment_applied: treatmentApplied,
        treatment_product: formData.get("treatment_product") || undefined,
        treatment_dose: formData.get("treatment_dose") || undefined,
        notes: formData.get("notes"),
      });
      toast.success("Inspección registrada exitosamente");
      setIsAddDialogOpen(false);
      setTreatmentApplied(false);
      loadData();
    } catch { toast.error("Error al crear inspección"); }
    return;
    setInspections([] as any);
    setIsAddDialogOpen(false);
    setTreatmentApplied(false);
    toast.success("Inspección registrada exitosamente");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-amber-900 mb-2">Inspecciones</h2>
          <p className="text-amber-700">Registro de inspecciones de colmenas</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) setTreatmentApplied(false);
        }}>
          <DialogTrigger asChild>
            <Button className="bg-amber-600 hover:bg-amber-700">
              <Plus className="size-4 mr-2" />
              Nueva Inspección
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Registrar Nueva Inspección</DialogTitle>
              <DialogDescription>
                Registra los detalles de la inspección de una colmena
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddInspection} className="space-y-4">
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
                          {hive.code} - {hive.name}
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

              <div className="flex items-center space-x-2">
                <Checkbox id="queen_seen" name="queen_seen" />
                <Label htmlFor="queen_seen" className="cursor-pointer">
                  Reina vista durante la inspección
                </Label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="brood_pattern">Patrón de Cría</Label>
                  <Select name="brood_pattern" required>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excelente</SelectItem>
                      <SelectItem value="good">Bueno</SelectItem>
                      <SelectItem value="fair">Regular</SelectItem>
                      <SelectItem value="poor">Pobre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="temperament">Temperamento</Label>
                  <Select name="temperament" required>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="calm">Calmada</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="aggressive">Agresiva</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="weight">Peso (kg)</Label>
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    step="0.1"
                    required
                    placeholder="42.5"
                  />
                </div>
                <div>
                  <Label htmlFor="varroa_count">Conteo de Varroa</Label>
                  <Input
                    id="varroa_count"
                    name="varroa_count"
                    type="number"
                    required
                    placeholder="5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="activity_level">Nivel de Actividad</Label>
                  <Select name="activity_level" required>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Baja">Baja</SelectItem>
                      <SelectItem value="Media">Media</SelectItem>
                      <SelectItem value="Alta">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="health_status">Estado de Salud</Label>
                  <Select name="health_status" required>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Saludable">Saludable</SelectItem>
                      <SelectItem value="Débil">Débil</SelectItem>
                      <SelectItem value="Enferma">Enferma</SelectItem>
                      <SelectItem value="Crítica">Crítica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="diseases">
                  Enfermedades/Plagas (separadas por comas)
                </Label>
                <Input
                  id="diseases"
                  name="diseases"
                  placeholder="Ej: Varroa, Loque americana"
                />
              </div>

              {/* Tratamiento Section */}
              <div className="border border-amber-200 rounded-lg p-4 bg-amber-50/50">
                <div className="flex items-center space-x-2 mb-3">
                  <Checkbox
                    id="treatment_applied"
                    name="treatment_applied"
                    checked={treatmentApplied}
                    onCheckedChange={(checked) => setTreatmentApplied(checked as boolean)}
                  />
                  <Label htmlFor="treatment_applied" className="cursor-pointer font-semibold">
                    Tratamiento aplicado
                  </Label>
                </div>
                
                {treatmentApplied && (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="treatment_product">Producto</Label>
                      <Input
                        id="treatment_product"
                        name="treatment_product"
                        placeholder="Ej: Ácido Oxálico"
                      />
                    </div>
                    <div>
                      <Label htmlFor="treatment_dose">Dosis</Label>
                      <Input
                        id="treatment_dose"
                        name="treatment_dose"
                        placeholder="Ej: 5ml por cuadro"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Observaciones detalladas de la inspección..."
                  rows={4}
                  required
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => {
                  setIsAddDialogOpen(false);
                  setTreatmentApplied(false);
                }}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
                  Registrar Inspección
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Inspections List */}
      <div className="space-y-4">
        {inspections.map((inspection) => (
          <Card key={inspection.id} className="border-amber-200 bg-white">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{inspection.hive_name}</CardTitle>
                  <p className="text-sm text-amber-600 mt-1">
                    {new Date(inspection.date).toLocaleDateString("es-ES", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge className={getBroodPatternColor(inspection.brood_pattern)}>
                    {getBroodPatternLabel(inspection.brood_pattern)}
                  </Badge>
                  <Badge className={getHealthStatusColor(inspection.health_status)}>
                    {inspection.health_status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Eye className={`size-4 ${inspection.queen_seen ? "text-green-600" : "text-gray-400"}`} />
                  <span className="text-sm text-amber-700">
                    {inspection.queen_seen ? "Reina vista" : "Reina no vista"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ThermometerSun className={`size-4 ${getTemperamentColor(inspection.temperament)}`} />
                  <span className="text-sm text-amber-700">
                    {getTemperamentLabel(inspection.temperament)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Weight className="size-4 text-amber-600" />
                  <span className="text-sm text-amber-700">
                    {inspection.weight} kg
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="size-4 text-amber-600" />
                  <span className="text-sm text-amber-700">
                    Actividad: {inspection.activity_level}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Bug className={`size-4 ${inspection.varroa_count > 10 ? "text-red-600" : "text-amber-600"}`} />
                  <span className="text-sm text-amber-700">
                    Varroa: {inspection.varroa_count}
                  </span>
                </div>
                {inspection.diseases.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Heart className="size-4 text-red-600" />
                    <span className="text-sm text-red-700">
                      {inspection.diseases.join(", ")}
                    </span>
                  </div>
                )}
              </div>

              {inspection.treatment_applied && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-semibold text-blue-900 mb-1">Tratamiento Aplicado</p>
                  <p className="text-sm text-blue-700">
                    {inspection.treatment_product} - {inspection.treatment_dose}
                  </p>
                </div>
              )}

              <div className="pt-3 border-t border-amber-100">
                <Label className="text-amber-700 text-xs">Notas</Label>
                <p className="text-sm text-amber-900 mt-1">{inspection.notes}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
