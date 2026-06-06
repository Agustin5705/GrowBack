# Backend de Tienda (Concepto)

Este proyecto es un **backend de e-commerce** desarrollado con **NestJS + PostgreSQL + MercadoPago**.  
El objetivo era implementar un flujo completo de órdenes y pagos como un concepto funcional.

---

## 🚀 Tecnologías

- **Framework:** NestJS
- **Base de Datos:** PostgreSQL (vía Docker)
- **Pasarela de Pagos:** MercadoPago SDK
- **Herramientas de Red:** Ngrok (para pruebas de webhooks locales)

---

## 📂 Estructura del Proyecto

- `orders` → Creación, gestión y actualización del estado de las órdenes.
- `payments` → Integración con la API de MercadoPago y manejo de webhooks.

---

## ⚙️ Configuración e Instalación

1. **Clonar el repositorio:**

   git clone <URL_DE_TU_REPOSITORIO>
   cd <NOMBRE_DE_LA_CARPETA>

Instalar dependencias:

npm install

Variables de entorno (.env):

Crea un archivo .env en la raíz del proyecto y configura las siguientes variables:

DATABASE_URL=postgres://user:pass@localhost:5432/db
MERCADOPAGO_ACCESS_TOKEN=TU_TOKEN_DE_MERCADOPAGO

Levantar el backend en modo desarrollo:

npm run start:dev

📌 Endpoints Principales

1. Crear Orden
   Endpoint: POST /orders/create

Cuerpo de la petición (Body):

JSON
{
"items": [
{ "product_id": 1, "quantity": 2 }
]
}

2. Crear Preferencia de Pago
   Endpoint: POST /payments/create

Cuerpo de la petición (Body):

JSON
{
"orderId": 123,
"items": [
{ "product_id": 1, "price": 100, "quantity": 2 }
]
} 3. Webhook de MercadoPago

Endpoint: POST /payments/webhook

Descripción: Recibe las notificaciones asíncronas de MercadoPago para actualizar el estado de la orden (pending, approved, rejected).

🔄 Flujo de Negocio

El Cliente crea una orden en el sistema ➡️ La orden toma el estado inicial pending.

Se genera la Preferencia de Pago en MercadoPago, vinculando el orderId en el parámetro external_reference.

El Cliente realiza el pago en la interfaz de MercadoPago.

MercadoPago envía una notificación (Webhook) al backend.

El Backend consulta el estado del pago y actualiza la orden correspondiente a approved o rejected.

🧪 Pruebas Locales

Para probar el flujo completo de pagos desde tu entorno local:

Utilizar el Sandbox de MercadoPago: Asegúrate de usar las credenciales de prueba y tarjetas de test proporcionadas por MercadoPago.

Exponer el Backend local: Dado que MercadoPago necesita una URL pública para enviar los webhooks, expón tu puerto local usando Ngrok:

ngrok http 3000

Configurar el Webhook: Copia la URL generada por Ngrok y configúrala en el panel de desarrolladores de MercadoPago apuntando al endpoint correspondiente:

https://<TU_SUBDOMINIO_NGROK>.ngrok.io/payments/webhook

📌 Estado del Proyecto
Este backend se desarrolló exclusivamente como un concepto funcional. No cuenta con una interfaz de usuario (frontend) ni despliegue en producción, pero implementa de manera estricta y funcional todo el flujo lógico de órdenes y pasarela de pagos.
