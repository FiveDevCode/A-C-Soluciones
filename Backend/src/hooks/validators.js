//validación de fechas anteriores 
export function noFechasPasadas(value) {
    if (value) {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0); // Normaliza la hora
      const fechaIngresada = new Date(value);
      fechaIngresada.setHours(0, 0, 0, 0);
      if (fechaIngresada < hoy) {
        throw new Error('La fecha de solicitud no puede ser una fecha anterior a la actual.');
      }
    }
  }
export function sinEspaciosSolamente(value) {
    if (value.trim() === '') {
        throw new Error('El campo no puede contener solo espacios.');
    }
}