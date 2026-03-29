import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { ScanLine } from "lucide-react";

interface QRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (code: string) => void;
}

export function QRScanner({ isOpen, onClose, onScan }: QRScannerProps) {
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<string>("qr-reader-" + Math.random().toString(36).slice(2));

  useEffect(() => {
    if (!isOpen) return;

    const startScanner = async () => {
      try {
        setError(null);
        const scanner = new Html5Qrcode(containerRef.current);
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            // Parse colmenapp://hive/{code} or just use raw text as code
            const match = decodedText.match(/colmenapp:\/\/hive\/(.+)/);
            const code = match ? match[1] : decodedText;
            onScan(code);
            scanner.stop().catch(() => {});
          },
          () => {} // ignore scan failures (no QR found yet)
        );
      } catch (err: any) {
        setError(err?.message || "No se pudo acceder a la cámara");
      }
    };

    // Small delay to ensure DOM element exists
    const timeout = setTimeout(startScanner, 300);

    return () => {
      clearTimeout(timeout);
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
        scannerRef.current = null;
      }
    };
  }, [isOpen, onScan]);

  const handleClose = () => {
    if (scannerRef.current) {
      scannerRef.current.stop().catch(() => {});
      scannerRef.current = null;
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ScanLine className="size-5 text-amber-600" />
            Escanear QR de Colmena
          </DialogTitle>
          <DialogDescription>
            Apunta la cámara al código QR de la colmena
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div
            id={containerRef.current}
            className="w-full min-h-[300px] rounded-lg overflow-hidden bg-gray-100"
          />

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
              <p className="text-xs text-red-600 mt-1">
                Verifica que has dado permiso de cámara al navegador.
              </p>
            </div>
          )}

          <Button
            variant="outline"
            className="w-full"
            onClick={handleClose}
          >
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
