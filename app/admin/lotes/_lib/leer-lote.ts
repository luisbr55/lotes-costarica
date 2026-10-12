const TIPOS = ['residencial', 'comercial', 'agricola'];
const ESTADOS = ['disponible', 'reservado', 'vendido'];

const num = (v: FormDataEntryValue | null) => {
  const s = String(v ?? '').trim();
  return s === '' ? NaN : Number(s);
};

export function leerLote(formData: FormData) {
  const metros_cuadrados = num(formData.get('metros_cuadrados'));
  const distrito_id = num(formData.get('distrito_id'));
  const latitud = num(formData.get('latitud'));
  const longitud = num(formData.get('longitud'));
  const tipo = String(formData.get('tipo') ?? '');
  const estado = String(formData.get('estado') ?? '');
  const descripcion = String(formData.get('descripcion') ?? '').trim();

  const precioTexto = String(formData.get('precio_referencia') ?? '').trim();
  const precio_referencia = precioTexto ? Number(precioTexto) : null;

  const valido =
    Number.isFinite(metros_cuadrados) && metros_cuadrados > 0 &&
    Number.isInteger(distrito_id) && distrito_id > 0 &&
    Number.isFinite(latitud) && latitud >= -90 && latitud <= 90 &&
    Number.isFinite(longitud) && longitud >= -180 && longitud <= 180 &&
    TIPOS.includes(tipo) &&
    ESTADOS.includes(estado) &&
    descripcion.length <= 2000 &&
    (precio_referencia === null ||
      (Number.isFinite(precio_referencia) && precio_referencia >= 0));

  if (!valido) return null;

  return {
    metros_cuadrados,
    tipo,
    estado,
    distrito_id,
    descripcion,
    precio_referencia,
    mostrar_precio: formData.has('mostrar_precio'),
    latitud,
    longitud,
    agua_potable: formData.has('agua_potable'),
    electricidad: formData.has('electricidad'),
    alcantarillado: formData.has('alcantarillado'),
    internet: formData.has('internet'),
    calle_asfaltada: formData.has('calle_asfaltada'),
    alumbrado_publico: formData.has('alumbrado_publico'),
    telefono: formData.has('telefono'),
  };
}