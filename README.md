# Selector de asientos — Teatro San Jerónimo

App web estática para que asistentes seleccionen un asiento, ingresen nombre y correo, y vean ocupación sincronizada en tiempo real con Supabase.

## Funcionalidad

- Mapa responsive con el layout solicitado: palcos, lunetas, mezzanine, cabina central y escenario inferior.
- Estados visuales: disponible, seleccionado, ocupado y discapacidad.
- Asientos de discapacidad: fila A de lunetas izquierda/derecha y fila J de mezz centro.
- Modal de confirmación con nombre y correo.
- Modo demo local si no hay credenciales de Supabase.
- Sincronización realtime y prevención de doble reserva mediante RPC transaccional y constraint único `section, row, col`.

## Configuración de Supabase

1. Crea un proyecto de Supabase.
2. Ejecuta `supabase/schema.sql` en el SQL editor del proyecto.
3. Agrega esta configuración antes de `app.js` en `index.html` o en un archivo cargado antes del script principal:

```html
<script>
  window.SEAT_APP_CONFIG = {
    supabaseUrl: "https://TU-PROYECTO.supabase.co",
    supabaseAnonKey: "TU_ANON_KEY"
  };
</script>
```

4. Publica el sitio en GitHub Pages o cualquier hosting estático.

> Nota: la llave `anon` es pública por diseño. La reserva se realiza con la función `reserve_seat`, que solo escribe si el asiento aún no tiene `occupied_at`.
