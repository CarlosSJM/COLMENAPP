import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Hexagon } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "sonner";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
      toast.success("Sesión iniciada correctamente");
      navigate("/");
    } catch (error) {
      toast.error("Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-amber-200">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-amber-500 to-yellow-600 p-3 rounded-lg">
              <Hexagon className="size-12 text-white" fill="currentColor" />
            </div>
          </div>
          <CardTitle className="text-2xl text-amber-900">COLMENAPP</CardTitle>
          <CardDescription>Inicia sesión para gestionar tu apiario</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-amber-700 hover:text-amber-900 hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <Button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-700"
              disabled={isLoading}
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-amber-700">
              ¿No tienes cuenta?{" "}
              <Link to="/register" className="font-semibold hover:underline text-amber-900">
                Crear cuenta
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
