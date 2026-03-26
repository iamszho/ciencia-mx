# ✅ Optimizaciones Implementadas - Resumen

## 🎯 Objetivo
Reducir el tiempo de carga de ~25 minutos a ~6-8 minutos para 197,928 documentos.

## 📝 Cambios Realizados

### 1. ⚡ Aumento de BATCH_SIZE (Alto Impacto)

**Archivo:** `search-service/src/load_data.py`

```python
# Antes
BATCH_SIZE = int(os.getenv('BATCH_SIZE', '1000'))

# Después
BATCH_SIZE = int(os.getenv('BATCH_SIZE', '5000'))  # Optimized for faster loading
```

**Impacto:**
- ✅ Reduce batches de ~198 a ~40
- ✅ Menos overhead de red/API
- ✅ **Tiempo estimado: ~6-8 minutos** (desde 25 min)

---

### 2. ⏱️ Reducción de Timeout (Detección Temprana de Errores)

**Archivo:** `search-service/src/load_data.py`

```python
# Antes
client.wait_for_task(task_info.task_uid, timeout_in_ms=600000)  # 10 minutos

# Después
client.wait_for_task(task_info.task_uid, timeout_in_ms=120000)  # 2 minutos
```

**Impacto:**
- ✅ Detecta problemas más rápido
- ✅ Timeout razonable para batches de 5000 docs
- ✅ No espera 10 minutos para descubrir un error

---

### 3. 🔧 Consolidación de Configuración

**Archivo:** `search-service/src/load_data.py`

Función `ensure_index_and_settings()` ahora incluye:

```python
settings = {
    'searchableAttributes': [...],
    'filterableAttributes': [...],
    'sortableAttributes': ['datestamp'],
    'faceting': {                           # ← NUEVO
        'maxValuesPerFacet': 1000,
        'sortFacetValuesBy': {'*': 'count'}
    },
    'pagination': {                          # ← NUEVO
        'maxTotalHits': 800000
    }
}
```

**Impacto:**
- ✅ **Soluciona problema #1 y #2 de facets**
- ✅ Configuración aplicada tanto en startup como en load_data
- ✅ Mejor logging y manejo de errores
- ✅ No más errores silenciosos

---

### 4. 🧹 Simplificación de main.py

**Archivo:** `search-service/src/main.py`

```python
# Antes: 55 líneas de configuración manual con try-except

# Después: 6 líneas delegando a ensure_index_and_settings()
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Setting up Meilisearch index and configuration...")
    try:
        ensure_index_and_settings(client, INDEX_NAME)
        print("✓ Meilisearch ready!")
    except Exception as e:
        print(f"✗ Error configuring Meilisearch: {e}")
    
    yield
```

**Impacto:**
- ✅ Código más limpio y mantenible
- ✅ Sin duplicación de configuración
- ✅ Errores visibles en lugar de silenciosos

---

### 5. 🔍 Endpoint de Debug

**Archivo:** `search-service/src/main.py`

Nuevo endpoint: `GET /debug/faceting-config`

```python
@app.get("/debug/faceting-config")
async def get_faceting_config():
    """Get current faceting configuration from Meilisearch (for debugging)"""
    try:
        index = client.index(INDEX_NAME)
        settings = index.get_settings()
        return {
            "faceting": settings.get('faceting', {}),
            "filterableAttributes": settings.get('filterableAttributes', []),
            "pagination": settings.get('pagination', {})
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

**Uso:**
```bash
curl http://localhost:8000/debug/faceting-config
```

**Impacto:**
- ✅ Verificar que la configuración se aplicó correctamente
- ✅ Debugging más fácil
- ✅ **Soluciona problema #6 de facets** (falta de validación)

---

### 6. ⚙️ Actualización de .env

**Archivo:** `search-service/src/.env`

```bash
# Data Processing Settings - OPTIMIZED FOR PERFORMANCE
BATCH_SIZE="5000"  # Increased from 1000 for faster loading (~6-8 min for 200k docs)
```

---

## 🚀 Cómo Aplicar los Cambios

### Opción 1: Reiniciar el servicio API (RECOMENDADO)

```bash
cd /home/angelmanuelsanchezhipolito/Indava/Ciencia_MX/ciencia-mx

# Reconstruir y reiniciar solo el servicio API
docker-compose up -d --build api

# Ver logs para confirmar que la configuración se aplicó
docker logs -f ciencia-mx-api-1
```

**Deberías ver:**
```
Setting up Meilisearch index and configuration...
✓ Updated all index settings for 'documents'
  - Faceting: maxValuesPerFacet=1000, sortBy=count
  - Pagination: maxTotalHits=800000
✓ Meilisearch ready!
```

---

### Opción 2: Reiniciar todo el stack

```bash
docker-compose down
docker-compose up -d --build
```

---

## ✅ Verificación

### 1. Verificar que la configuración se aplicó

```bash
curl http://localhost:8000/debug/faceting-config | python3 -m json.tool
```

**Salida esperada:**
```json
{
  "faceting": {
    "maxValuesPerFacet": 1000,
    "sortFacetValuesBy": {
      "*": "count"
    }
  },
  "filterableAttributes": [
    "repository",
    "type",
    "subject",
    "rights",
    "format",
    "language",
    "date"
  ],
  "pagination": {
    "maxTotalHits": 800000
  }
}
```

---

### 2. Probar la carga optimizada

```bash
# Tiempo estimado: ~6-8 minutos para 200k documentos
docker exec -it ciencia-mx-api-1 ./scripts/reload.sh
```

**Monitorea el tiempo:**
```bash
# Inicia
⏰ Start time: Wed Jan 29 15:48:11 UTC 2026
→ Submitted batch 1: 5000 documents
→ Submitted batch 2: 5000 documents
...
✓ Batch 40 completed: 5000 documents
⏰ End time: Wed Jan 29 15:54:32 UTC 2026  # ~6 minutos!
```

---

### 3. Verificar que los facets funcionan

```bash
curl "http://localhost:8000/search/facets?max_values=10" | python3 -m json.tool
```

**Verifica que:**
- ✅ Los valores están ordenados por count (mayor a menor)
- ✅ Retorna hasta 10 valores por facet
- ✅ Los valores son los correctos (top items más frecuentes)

---

## 📊 Comparación Antes/Después

| Métrica | Antes | Después | Mejora |
|---------|-------|---------|--------|
| **BATCH_SIZE** | 1,000 | 5,000 | 5x |
| **Timeout** | 600s | 120s | 5x más rápido en detectar errores |
| **Número de batches** | ~198 | ~40 | -80% |
| **Tiempo de carga** | ~25 min | ~6-8 min | **3-4x más rápido** 🚀 |
| **Configuración** | Duplicada | Consolidada | ✅ |
| **Logging** | Errores ocultos | Errores visibles | ✅ |
| **Facets ordenados** | ❓ No verificable | ✅ Verificable | ✅ |

---

## 🎯 Problemas Solucionados

### Facets:
- ✅ **Problema #1:** Configuración de faceting ahora se aplica correctamente
- ✅ **Problema #2:** Configuración consolidada (sin inconsistencias)
- ✅ **Problema #6:** Endpoint de debug para validar configuración

### Performance:
- ✅ **Problema #2:** Batch size aumentado (menos overhead)
- ✅ **Problema #3:** Timeout reducido (detección temprana)

---

## 🔜 Próximos Pasos (Opcionales)

Si quieres aún más velocidad (**Nivel 2** del plan):

1. **Procesamiento asíncrono** - Enviar 5 batches concurrentemente
   - Tiempo estimado: ~2-3 minutos
   
2. **Aumentar BATCH_SIZE a 10000**
   - Tiempo estimado: ~3-5 minutos

3. **Corregir facets frontend** - Aumentar límite de 10 a 50

---

## 🐛 Troubleshooting

### Error: "Settings update failed"
```bash
# Ver logs detallados
docker logs ciencia-mx-api-1

# Reiniciar Meilisearch
docker-compose restart meilisearch
```

### El tiempo no mejoró
```bash
# Verificar que BATCH_SIZE se aplicó
docker exec ciencia-mx-api-1 printenv | grep BATCH_SIZE
# Debería mostrar: BATCH_SIZE=5000
```

### Facets siguen sin ordenarse
```bash
# Verificar configuración
curl http://localhost:8000/debug/faceting-config

# Si faceting está vacío, reinicia API
docker-compose restart api
```

---

## 📞 Soporte

Si algo no funciona:
1. Revisa los logs: `docker logs ciencia-mx-api-1`
2. Verifica la configuración: `curl http://localhost:8000/debug/faceting-config`
3. Reinicia los servicios: `docker-compose restart`
