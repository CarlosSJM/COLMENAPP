import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { QrCode, Printer } from "lucide-react";

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  hiveCode: string;
  hiveName: string;
  apiaryName: string;
}

export function QRModal({ isOpen, onClose, hiveCode, hiveName, apiaryName }: QRModalProps) {
  const handlePrint = () => {
    window.print();
  };

  // En una app real, aquí generarías el QR con una librería como qrcode.react
  // Por ahora usaremos un placeholder
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(hiveCode)}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Código QR de Colmena</DialogTitle>
          <DialogDescription>
            Escanea este código para acceder rápidamente a la colmena
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {/* QR Code */}
          <div className="flex justify-center p-6 bg-white rounded-lg border-2 border-amber-200">
            <img
              src={qrCodeUrl}
              alt={`QR Code para ${hiveCode}`}
              className="size-64"
            />
          </div>

          {/* Info */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <QrCode className="size-5 text-amber-600" />
              <p className="text-2xl font-bold text-amber-900">{hiveCode}</p>
            </div>
            <p className="text-lg text-amber-800">{hiveName}</p>
            <p className="text-sm text-amber-600">{apiaryName}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handlePrint}
            >
              <Printer className="size-4 mr-2" />
              Imprimir
            </Button>
            <Button
              className="flex-1 bg-amber-600 hover:bg-amber-700"
              onClick={onClose}
            >
              Cerrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
