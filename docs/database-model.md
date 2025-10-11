✅ Colección users

📌 Usuarios generales (clientes + profesionales + admins).

{
  "_id": ObjectId,
  "name": "Jorge Moscoso",
  "email": "jorge@email.com",
  "password": "hash_bcrypt",
  "role": "cliente"  // cliente | profesional | admin
}

✅ Colección professionals

📌 Datos extra de los profesionales.

{
  "_id": ObjectId,
  "userId": ObjectId,  // referencia a users
  "oficios": ["electricista", "fontanero"],
  "descripcion": "Especialista en electricidad y fontanería",
  "tarifaBase": 20,
  "disponibilidad": "online",  // online | offline
  "ubicacion": { "lat": 40.4167, "lng": -3.70325 },
  "reseñas": [ ObjectId ] // referencias a reviews
}

✅ Colección services

📌 Servicios solicitados.

{
  "_id": ObjectId,
  "clienteId": ObjectId,
  "profesionalId": ObjectId,
  "tipo": "electricidad",
  "descripcion": "Fallo en enchufe",
  "urgente": true,
  "estado": "pendiente",  // pendiente | aceptado | completado | cancelado
  "fecha": "2025-10-05T18:00:00Z",
  "precioEstimado": { "min": 40, "max": 55 }
}

✅ Colección reviews

📌 Reseñas y puntuaciones.

{
  "_id": ObjectId,
  "serviceId": ObjectId,
  "clienteId": ObjectId,
  "profesionalId": ObjectId,
  "rating": 5,
  "comentario": "Muy puntual y profesional",
  "fecha": "2025-10-02T20:00:00Z"
}

✅ Colección pricing

📌 Rangos de precios base para IA de estimación.

{
  "_id": ObjectId,
  "tipo": "cambiar enchufe",
  "min": 40,
  "max": 55
}

✅ Colección logs

📌 Registra disponibilidad y eventos en tiempo real.

{
  "_id": ObjectId,
  "profesionalId": ObjectId,
  "accion": "cambio de estado a disponible",
  "fecha": "2025-10-02T19:55:00Z"
}