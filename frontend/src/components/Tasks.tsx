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
import { Plus, Calendar, AlertCircle, CheckCircle2, Circle, Pencil, Trash2 } from "lucide-react";
import { api } from "../services/api";
import { adaptTasks } from "../services/adapters";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import { toast } from "sonner";

export function Tasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [hives, setHives] = useState<any[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any | null>(null);
  const [deletingTask, setDeletingTask] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");

  const loadData = () => {
    api.getTasks().then(adaptTasks).then(setTasks).catch(() => toast.error("Error al cargar tareas"));
    api.getHives().then(setHives).catch(() => {});
  };

  useEffect(() => { loadData(); }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "low":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getPriorityLabel = (priority: string) => {
    const labels = {
      high: "Alta",
      medium: "Media",
      low: "Baja",
    };
    return labels[priority as keyof typeof labels] || priority;
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "pending") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const handleToggleTask = async (taskId: string) => {
    try {
      await api.toggleTask(taskId);
      loadData();
      const task = tasks.find((t) => t.id === taskId);
      toast.success(task?.completed ? "Tarea marcada como pendiente" : "Tarea completada");
    } catch { toast.error("Error al actualizar tarea"); }
  };

  const handleAddTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const hiveId = formData.get("hive_id") as string;

    try {
      await api.createTask({
        title: formData.get("title"),
        description: formData.get("description") || undefined,
        due_date: formData.get("due_date"),
        priority: formData.get("priority"),
        hive_id: hiveId && hiveId !== "none" ? hiveId : undefined,
      });
      toast.success("Tarea agregada exitosamente");
      setIsAddDialogOpen(false);
      loadData();
    } catch { toast.error("Error al crear tarea"); }
  };

  const handleEditTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingTask) return;
    const formData = new FormData(e.currentTarget);
    const hiveId = formData.get("hive_id") as string;
    try {
      await api.updateTask(editingTask.id, {
        title: formData.get("title"),
        description: formData.get("description") || undefined,
        due_date: formData.get("due_date"),
        priority: formData.get("priority"),
        hive_id: hiveId && hiveId !== "none" ? hiveId : undefined,
      });
      toast.success("Tarea actualizada exitosamente");
      setEditingTask(null);
      loadData();
    } catch { toast.error("Error al actualizar tarea"); }
  };

  const handleDeleteTask = async () => {
    if (!deletingTask) return;
    setIsDeleting(true);
    try {
      await api.deleteTask(deletingTask.id);
      toast.success("Tarea eliminada");
      setDeletingTask(null);
      loadData();
    } catch { toast.error("Error al eliminar tarea"); }
    finally { setIsDeleting(false); }
  };

  const pendingCount = tasks.filter((t) => !t.completed).length;
  const overdueCount = tasks.filter((t) => !t.completed && isOverdue(t.due_date)).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-amber-900 mb-2">Tareas</h2>
          <p className="text-amber-700">Gestiona las tareas de tu apiario</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-600 hover:bg-amber-700">
              <Plus className="size-4 mr-2" />
              Nueva Tarea
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Agregar Nueva Tarea</DialogTitle>
              <DialogDescription>
                Crea una nueva tarea para gestionar tu apiario
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input id="title" name="title" required placeholder="Ej: Revisión de colmena" />
              </div>

              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  name="description"
                  required
                  placeholder="Describe la tarea en detalle..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="due_date">Fecha de Vencimiento</Label>
                  <Input id="due_date" name="due_date" type="date" required />
                </div>
                <div>
                  <Label htmlFor="priority">Prioridad</Label>
                  <Select name="priority" defaultValue="medium" required>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baja</SelectItem>
                      <SelectItem value="medium">Media</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="hive_id">Colmena (Opcional)</Label>
                <Select name="hive_id" defaultValue="none">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una colmena (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Ninguna (tarea general)</SelectItem>
                    {hives.map((hive) => (
                      <SelectItem key={hive.id} value={hive.id}>
                        {hive.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
                  Agregar Tarea
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-amber-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Tareas Pendientes</CardTitle>
            <Circle className="size-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900">{pendingCount}</div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Tareas Vencidas</CardTitle>
            <AlertCircle className="size-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueCount}</div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Tareas Completadas</CardTitle>
            <CheckCircle2 className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
          className={filter === "all" ? "bg-amber-600 hover:bg-amber-700" : ""}
        >
          Todas
        </Button>
        <Button
          variant={filter === "pending" ? "default" : "outline"}
          onClick={() => setFilter("pending")}
          className={filter === "pending" ? "bg-amber-600 hover:bg-amber-700" : ""}
        >
          Pendientes
        </Button>
        <Button
          variant={filter === "completed" ? "default" : "outline"}
          onClick={() => setFilter("completed")}
          className={filter === "completed" ? "bg-amber-600 hover:bg-amber-700" : ""}
        >
          Completadas
        </Button>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <Card
            key={task.id}
            className={`border-amber-200 ${
              task.completed ? "bg-gray-50 opacity-60" : "bg-white"
            }`}
          >
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => handleToggleTask(task.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3
                        className={`font-semibold text-amber-900 ${
                          task.completed ? "line-through" : ""
                        }`}
                      >
                        {task.title}
                      </h3>
                      <p
                        className={`text-sm text-amber-700 mt-1 ${
                          task.completed ? "line-through" : ""
                        }`}
                      >
                        {task.description}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getPriorityColor(task.priority)}>
                        {getPriorityLabel(task.priority)}
                      </Badge>
                      {!task.completed && isOverdue(task.due_date) && (
                        <Badge className="bg-red-100 text-red-800 border-red-300">
                          Vencida
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-sm text-amber-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="size-4" />
                      <span>
                        {new Date(task.due_date).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    {task.hive_name && (
                      <Badge variant="outline" className="text-amber-700 border-amber-300">
                        {task.hive_name}
                      </Badge>
                    )}
                    <div className="flex gap-1 ml-auto">
                      <Button size="sm" variant="ghost" className="size-7 p-0 text-amber-600" onClick={() => setEditingTask(task)}>
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button size="sm" variant="ghost" className="size-7 p-0 text-red-500" onClick={() => setDeletingTask(task)}>
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredTasks.length === 0 && (
          <Card className="border-amber-200 bg-white">
            <CardContent className="py-12 text-center">
              <CheckCircle2 className="size-12 text-amber-400 mx-auto mb-3" />
              <p className="text-amber-700">No hay tareas en esta categoría</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Task Dialog */}
      <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Tarea</DialogTitle>
            <DialogDescription>Modifica los datos de la tarea</DialogDescription>
          </DialogHeader>
          {editingTask && (
            <form onSubmit={handleEditTask} className="space-y-4">
              <div><Label htmlFor="edit-title">Título</Label><Input id="edit-title" name="title" required defaultValue={editingTask.title} /></div>
              <div><Label htmlFor="edit-desc">Descripción</Label><Textarea id="edit-desc" name="description" rows={3} defaultValue={editingTask.description} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label htmlFor="edit-due">Fecha de Vencimiento</Label><Input id="edit-due" name="due_date" type="date" required defaultValue={editingTask.due_date?.split("T")[0]} /></div>
                <div>
                  <Label htmlFor="edit-priority">Prioridad</Label>
                  <Select name="priority" defaultValue={editingTask.priority}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baja</SelectItem>
                      <SelectItem value="medium">Media</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="edit-hive">Colmena (Opcional)</Label>
                <Select name="hive_id" defaultValue={editingTask.hive_id || "none"}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Ninguna (tarea general)</SelectItem>
                    {hives.map((hive: any) => (<SelectItem key={hive.id} value={hive.id}>{hive.name}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setEditingTask(null)}>Cancelar</Button>
                <Button type="submit" className="bg-amber-600 hover:bg-amber-700">Guardar Cambios</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDeleteDialog
        isOpen={!!deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleDeleteTask}
        title="Eliminar Tarea"
        description={`¿Estás seguro de eliminar "${deletingTask?.title}"?`}
        isLoading={isDeleting}
      />
    </div>
  );
}