# App full-stack con Astra DB

Proyecto base para resolver las dos actividades de las capturas:

1. Crear una coleccion `students`, insertar documentos y consultar por nombre.
2. Construir una app full-stack con Flask + HTML/JavaScript para crear y consultar usuarios en Astra DB.

## Requisitos

- Python 3.8 o superior
- Un endpoint de Data API de Astra DB
- Un application token con permisos sobre la base

## Instalacion

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Despues, edita `.env` y agrega:

- `ASTRA_DB_API_ENDPOINT`
- `ASTRA_DB_APPLICATION_TOKEN`
- `ASTRA_DB_KEYSPACE` solo si deseas usar otro keyspace distinto al predeterminado

## Ejecutar la app

```bash
python3 app.py
```

Luego abre [http://127.0.0.1:5000](http://127.0.0.1:5000).

### Endpoints

- `GET /` sirve el frontend
- `GET /api/health` confirma que el servidor esta arriba
- `GET /users` consulta los usuarios guardados en la coleccion `users`
- `POST /users` guarda un usuario en la coleccion `users`

Ejemplo de `POST /users`:

```json
{
  "name": "Ana Perez",
  "email": "ana@correo.com"
}
```

## Actividad de coleccion `students`

El script `students_activity.py` hace lo siguiente:

- crea la coleccion `students` si no existe
- inserta al menos 3 estudiantes
- consulta un estudiante por nombre
- inserta un documento con estructura diferente

Ejecucion:

```bash
python3 students_activity.py
```

## Estructura

- `app.py`: API Flask y entrega del frontend
- `database.py`: conexion a Astra DB y operaciones CRUD
- `students_activity.py`: solucion de la primera actividad
- `static/index.html`: interfaz
- `static/app.js`: consumo del backend con `fetch()`
- `static/styles.css`: estilos de la interfaz
