# 🔄 Guía: Recargar Datos desde Google Drive a Meilisearch

Esta guía te muestra cómo volver a cargar datos desde Google Drive a Meilisearch **sin tener que apagar todo el servidor**.

## 📋 Prerrequisitos

- Los servicios deben estar corriendo: `docker-compose up -d`
- El contenedor `ciencia-mx-api-1` debe estar activo
- Variables de entorno configuradas:
  - `DRIVE_FOLDER_ID` - ID de la carpeta de Google Drive
  - `GOOGLE_SA_FILE` - Path al archivo de service account
  - `MEILISEARCH_URL` - URL de Meilisearch (normalmente `http://meilisearch:7700`)

---

## 🚀 Método 1: Ejecutar desde el contenedor Docker (RECOMENDADO)

Este método ejecuta el script de carga dentro del contenedor que ya está corriendo, sin interrumpir el servidor FastAPI.

### Comando:

```bash
docker exec -it ciencia-mx-api-1 python -m src.load_from_drive_streaming
```

### ¿Qué hace?
1. Se conecta al contenedor `ciencia-mx-api-1` que ya está corriendo
2. Ejecuta el script de carga en un proceso separado
3. El servidor FastAPI sigue funcionando normalmente
4. Los datos se cargan directamente a Meilisearch

### Salida esperada:<>
```
Found 5 files in Drive folder.
[1] Processing file: data_part1.json
[1] 40000 records detected in data_part1.json
✓ Loaded batch 1: 1000 documents (total processed: 1000)
✓ Loaded batch 2: 1000 documents (total processed: 2000)
...
Drive → MeiliSearch ingestion completed.
```

---

## 🔧 Método 2: Ejecutar localmente (Si tienes Python local)

Si prefieres ejecutar el script fuera de Docker:

### Paso 1: Configurar variables de entorno

```bash
# Desde el directorio raíz del proyecto
cd /home/angelmanuelsanchezhipolito/Indava/Ciencia_MX/ciencia-mx

# Exportar variables
export DRIVE_FOLDER_ID="1HxtoLhN27srAhABUv4dbRrwdrzxr4Ps9"
export GOOGLE_SA_FILE="/ruta/absoluta/a/service-account.json"
export MEILISEARCH_URL="http://localhost:7700"  # Nota: localhost en vez de meilisearch
export INDEX_NAME="documents"
export BATCH_SIZE="5000"  # Opcional: aumentar para mayor velocidad
```

### Paso 2: Ejecutar el script

```bash
cd search-service
python -m src.load_from_drive_streaming
```

---

## ⚙️ Método 3: Usar el endpoint `/reset` (CUIDADO: Borra datos existentes)

Si quieres **borrar todos los datos actuales** y recargar:

```bash
curl -X POST http://localhost:8000/reset
```

**⚠️ ADVERTENCIA:** Este método elimina TODOS los documentos del índice.

---

## 📊 Verificar que los datos se cargaron

### Ver estadísticas del índice:

```bash
curl http://localhost:8000/stats
```

Salida esperada:
```json
{
  "numberOfDocuments": 197928,
  "isIndexing": false,
  "fieldDistribution": {
    "title": 197928,
    "creator": 197928,
    ...
  }
}
```

### Ver configuración actual:

```bash
curl http://localhost:8000/settings
```

---

## 🎯 Script Automatizado (Opción Avanzada)

Puedes crear un script para automatizar la recarga:

```bash
#!/bin/bash
# save as: reload-from-drive.sh

echo "🔄 Iniciando recarga de datos desde Google Drive..."
echo "⏰ Hora de inicio: $(date)"

# Ejecutar la carga
docker exec -it ciencia-mx-api-1 python -m src.load_from_drive_streaming

# Verificar resultados
echo ""
echo "✅ Proceso completado. Verificando estadísticas..."
curl -s http://localhost:8000/stats | python3 -m json.tool

echo "⏰ Hora de finalización: $(date)"
```

Dale permisos de ejecución:
```bash
chmod +x reload-from-drive.sh
```

Ejecútalo:
```bash
./reload-from-drive.sh
```

---

## ⚡ Optimización: Configurar BATCH_SIZE

Para cargar más rápido, puedes aumentar el tamaño del batch:

```bash
# Método 1: Variable de entorno temporal
docker exec -it ciencia-mx-api-1 bash -c "BATCH_SIZE=5000 python -m src.load_from_drive_streaming"

# Método 2: Modificar .env permanentemente
echo "BATCH_SIZE=5000" >> search-service/.env
docker restart ciencia-mx-api-1
```

**Tamaños recomendados:**
- Conservador: `BATCH_SIZE=5000` (~6-8 minutos para 200k docs)
- Agresivo: `BATCH_SIZE=10000` (~3-5 minutos para 200k docs)

---

## 🐛 Troubleshooting

### Error: "Container not found"
```bash
# Verificar que el contenedor está corriendo
docker ps | grep api

# Si no está corriendo
docker-compose up -d api
```

### Error: "Drive folder not found"
```bash
# Verificar que las variables de entorno están configuradas
docker exec ciencia-mx-api-1 printenv | grep DRIVE
```

### Error: "Connection refused to Meilisearch"
```bash
# Verificar que Meilisearch está corriendo
docker ps | grep meilisearch

# Restart si es necesario
docker-compose restart meilisearch
```

### Los datos no aparecen
```bash
# Esperar unos segundos para que Meilisearch indexe
sleep 10

# Verificar stats
curl http://localhost:8000/stats
```

---

## 📝 Notas Importantes

1. **No es necesario reiniciar el servidor** - Los datos se cargan mientras FastAPI sigue corriendo
2. **Meilisearch puede indexar en background** - Puedes seguir haciendo búsquedas mientras se cargan datos
3. **Los nuevos documentos se agregan al índice** - No se borran los existentes (a menos que uses `/reset`)
4. **Duplicados**: Si cargas los mismos datos dos veces, Meilisearch actualiza los documentos por `id`

---

## ✅ Resumen de Comandos Rápidos

```bash
# Ver servicios corriendo
docker ps

# Recargar datos (RECOMENDADO)
docker exec -it ciencia-mx-api-1 python -m src.load_from_drive_streaming

# Ver stats
curl http://localhost:8000/stats | python3 -m json.tool

# Reiniciar solo API (si es necesario)
docker-compose restart api
```
