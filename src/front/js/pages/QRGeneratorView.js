import React, { useState } from "react";
import QRCode from "qrcode.react";

const DatosViajeroQR = [qrData, setQrData] = useState(null);
const isLoading = [isLoading, setIsLoading] = useState(false);

const handleGenerateQR = async () => {
   setIsLoading(true);
   try {
      const qrPayload = {
         ...DatosViajero,
         user_id: user.id,
      }
   }

   const response = await fetch('/api/datos-viajero/qr/generate', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify(qrPayload),
   });

   if (!response.ok) {
      throw new Error('Error al generar el QR');
   }

   setQrData(JSON.stringify(qrPayload));
} catch (error) {
   console.error('Error:', error);
} finally {
   setIsLoading(false);
}
};