# Servicio de Búsqueda con MeiliSearch y FastAPI

Este proyecto proporciona una aplicación FastAPI integrada con MeiliSearch para realizar búsquedas eficientes en documentos académicos. El servicio permite búsquedas parciales y totales sobre un conjunto de datos consolidados.

## Descripción

El servicio carga automáticamente datos de producción desde `prod_data/consolidated_data.json` al iniciar, los modifica para asignar IDs incrementales y los indexa en MeiliSearch. Proporciona endpoints REST para realizar búsquedas con diferentes límites de resultados.

## Características

- **Búsqueda rápida**: Utiliza MeiliSearch para búsquedas full-text eficientes
- **API REST**: Endpoints simples con FastAPI
- **Carga automática de datos**: Los datos se cargan al iniciar la aplicación
- **Dockerizado**: Fácil despliegue con Docker Compose
- **Manejo de errores**: Respuestas HTTP apropiadas para errores

## Prerrequisitos

- Docker y Docker Compose instalados
- (Opcional para desarrollo local) Python 3.8+, pip, MeiliSearch instalado localmente

## Instalación y Configuración

### Opción 1: Ejecutar con Docker Compose (Recomendado)

1. Asegúrate de tener Docker y Docker Compose instalados en tu sistema.

2. Navega al directorio raíz del proyecto (donde se encuentra `docker-compose.yml`).

3. Construye y ejecuta los servicios:
   ```bash
   docker compose up --build
   ```

   Esto iniciará:
   - MeiliSearch en el puerto 7700
   - La aplicación FastAPI en el puerto 8000

4. La aplicación estará disponible en `http://localhost:8000`

5. MeiliSearch estará disponible en `http://localhost:7700`

6. Para detener los servicios:
   ```bash
   docker compose down
   ```

### Opción 2: Ejecutar localmente (Desarrollo)

1. Instala las dependencias:
   ```bash
   pip install -r requirements.txt
   ```

2. Inicia MeiliSearch localmente:
   ```bash
   meilisearch
   ```
   Debería ejecutarse en `http://localhost:7700` por defecto.

3. Ejecuta la aplicación FastAPI:
   ```bash
   cd search-service/src
   uvicorn main:app --reload
   ```

4. La aplicación estará disponible en `http://localhost:8000`

## Endpoints de la API

### Búsqueda

#### Búsqueda Parcial
- **GET** `/search/partial?q=<consulta>`
- Retorna hasta 3 resultados más relevantes
- Ejemplo: `GET /search/partial?q=hongos`

#### Búsqueda Total
- **GET** `/search/total?q=<consulta>`
- Retorna todos los resultados que coinciden
- Ejemplo: `GET /search/total?q=hongos`

Respuesta de búsqueda (ejemplo):
```json
{
  "results": [
    {
      "id": 1,
      "original_id": "...",
      "titulo": "...",
      "autores": "..."
    }
  ]
}
```

### Recursos e ingesta

#### Obtener un documento por id
- **GET** `/resource/{id}`
- Devuelve el documento cuyo `id` (clave primaria) coincide.
- Ejemplo: `GET /resource/oai_cenoteando_org_Cenotes_121`
- Respuesta: `{ "resource": { ... } }`

#### Actualización parcial por id (PATCH)
- **PATCH** `/resource/{id}`
- Actualiza solo los campos enviados en el cuerpo; el resto del documento se mantiene. El `id` no puede modificarse.
- **Cuerpo:** JSON con los campos a cambiar (ej. `title`, `description`, `creator`, etc.).
- Ejemplo:
  ```bash
  curl -X PATCH "http://localhost:8000/resource/oai_cenoteando_org_Cenotes_121" \
    -H "Content-Type: application/json" \
    -d '{"title": "Nuevo título", "description": "Nueva descripción"}'
  ```
- Respuesta: `{ "resource": { ...documento actualizado... }, "message": "Document updated" }`
- Si el documento no existe: `404`.

#### Ingesta incremental (POST)
- **POST** `/ingest`
- Añade o actualiza documentos en el índice sin reconstruir ni reiniciar. Mismo formato que la carga completa; documentos con el mismo `id` se actualizan, los nuevos se insertan.
- **Opciones (una de las dos):**
  - **Por ruta:** `application/x-www-form-urlencoded` con campo `file_path` = ruta del JSON bajo `prod_data` (ej. `new_records.json` o `prod_data/new_records.json`).
  - **Por archivo:** `multipart/form-data` con campo `file` = archivo JSON (array de documentos).
- Respuesta (ejemplo): `{ "message": "Ingest complete", "ingested": 42, "index_total": 12345 }`

## Datos

### Datos de Producción
Los datos de producción se almacenan en `prod_data/consolidated_data.json`. Este archivo contiene registros académicos consolidados.

### Procesamiento de Datos
Para procesar y consolidar todos los datos (si es necesario):
```bash
cd search-service/src
python process_data.py
```

Esto generará `prod_data/consolidated_data.json` con todos los registros consolidados.

### Carga Manual de Datos
Para cargar los datos manualmente en MeiliSearch (si ya está ejecutándose):
```bash
cd search-service/src
python load_data.py
```

**Nota**: Con Docker Compose, los datos se cargan automáticamente al iniciar la aplicación.

### Ingesta incremental (CLI, sin rebuild)
Para **añadir o actualizar** documentos desde la línea de comandos sin reconstruir el índice (la API se describe en [Recursos e ingesta](#recursos-e-ingesta)):

```bash
# Un archivo JSON (array de documentos con el mismo formato que el repositorio)
docker compose exec api python -m src.incremental_ingest --file /app/prod_data/nuevos_registros.json

# Varios archivos
docker compose exec api python -m src.incremental_ingest --file /app/prod_data/a.json --file /app/prod_data/b.json

# Opciones: --meili, --index, --batch-size, --no-ensure-index
docker compose exec api python -m src.incremental_ingest --file /app/prod_data/updates.json --batch-size 1000
```

Los documentos se normalizan igual que en la carga completa; documentos con el mismo `id` se actualizan, los nuevos se insertan.

## Configuración

### Variables de Entorno
- `MEILISEARCH_URL`: URL del servidor MeiliSearch (por defecto: `http://localhost:7700` o `http://meilisearch:7700` en Docker)

### Configuración de MeiliSearch
En desarrollo, MeiliSearch se ejecuta sin clave maestra. Para producción, descomenta y configura la variable `MEILI_MASTER_KEY` en `docker-compose.yml`.

## Desarrollo

### Estructura del Proyecto
```
search-service/
├── src/
│   ├── main.py              # Aplicación FastAPI (búsqueda, /resource/{id}, PATCH, POST /ingest)
│   ├── load_data.py         # Carga y normalización de datos en MeiliSearch
│   ├── incremental_ingest.py # CLI de ingesta incremental (sin rebuild)
│   ├── load_from_drive_streaming.py  # Carga inicial desde Drive
│   ├── process_data.py      # Procesamiento y consolidación de datos
│   └── ...
├── prod_data/
│   └── consolidated_data.json  # Datos de producción
├── Dockerfile
├── requirements.txt
└── README.md
```

### Agregar Nuevos Endpoints
Edita `src/main.py` para agregar nuevos endpoints siguiendo el patrón de FastAPI.

### Modificar la Lógica de Búsqueda
Ajusta los parámetros de búsqueda en los endpoints o agrega nuevos índices en MeiliSearch.

## Solución de Problemas

### La aplicación no puede conectarse a MeiliSearch
- Verifica que MeiliSearch esté ejecutándose en el puerto correcto
- En Docker, usa `http://meilisearch:7700`
- Localmente, usa `http://localhost:7700`

### Los datos no se cargan
- Verifica que `prod_data/consolidated_data.json` exista
- Revisa los logs de la aplicación para errores de carga

### Errores de Docker
- Asegúrate de que los puertos 7700 y 8000 estén libres
- Ejecuta `docker compose down` antes de volver a construir

## Contribución

Para contribuir:
1. Haz un fork del repositorio
2. Crea una rama para tu feature
3. Realiza tus cambios
4. Envía un pull request

## Licencia

Este proyecto está bajo la licencia MIT.