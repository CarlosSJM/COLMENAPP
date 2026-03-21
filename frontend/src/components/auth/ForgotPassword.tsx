import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Hexagon, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulación de envío
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setEmailSent(true);
    setIsLoading(false);
    toast.success("Enlace de recuperación enviado");
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
          <CardTitle className="text-2xl text-amber-900">Recuperar Contraseña</CardTitle>
          <CardDescription>
            {emailSent
              ? "Revisa tu email para continuar"
              : "Ingresa tu email para recibir un enlace de recuperación"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!emailSent ? (
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
              <Button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700"
                disabled={isLoading}
              >
                {isLoading ? "Enviando..." : "Enviar Enlace"}
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-amber-700">
                Hemos enviado un enlace de recuperación a <strong>{email}</strong>
              </p>
              <p className="text-sm text-amber-600">
                Si no recibes el email en unos minutos, revisa tu carpeta de spam.
              </p>
            </div>
          )}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm text-amber-700 hover:text-amber-900 hover:underline"
            >
              <ArrowLeft className="size-4" />
              Volver al inicio de sesión
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
