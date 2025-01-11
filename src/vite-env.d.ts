/// <reference types="vite/client" />

interface Window {
  MercadoPago: any
}

declare module '@mercadopago/sdk-js' {
  const MercadoPago: any
  export default MercadoPago
}