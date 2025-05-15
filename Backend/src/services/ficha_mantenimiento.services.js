import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

export const generarPDF = async (ficha, clienteInfo, tecnicoInfo) => {
  const doc = new PDFDocument();
  const filename = `ficha_${ficha.id}.pdf`;
  const folderPath = path.join('uploads', 'fichas');
  const filePath = path.join(folderPath, filename);

  // Funcion crear carpetas
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  doc.fontSize(18).text('Ficha de Mantenimiento', { align: 'center' }).moveDown();
  doc.fontSize(12);
  doc.text(`Cliente: ${clienteInfo.nombre}`);
  doc.text(`Teléfono: ${clienteInfo.telefono}`);
  doc.text(`Fecha: ${new Date(ficha.fecha_de_mantenimiento).toLocaleString('es-CO')}`);
  doc.moveDown();

  doc.text(`Técnico Responsable: ${tecnicoInfo.nombre} ${tecnicoInfo.apellido}`);
  doc.text(`Teléfono Técnico: ${tecnicoInfo.telefono}`);
  doc.text(`Correo Técnico: ${tecnicoInfo.correo}`);
  doc.moveDown();

  doc.text(`Introducción:\n${ficha.introduccion}\n`);
  doc.text(`Detalles del servicio:\n${ficha.detalles_servicio}\n`);
  doc.text(`Observaciones:\n${ficha.observaciones}\n`);
  doc.text(`Estado antes:\n${ficha.estado_antes}\n`);
  doc.text(`Descripción del trabajo:\n${ficha.descripcion_trabajo}\n`);
  doc.text(`Materiales utilizados:\n${ficha.materiales_utilizados}\n`);
  doc.text(`Estado final:\n${ficha.estado_final}\n`);
  doc.text(`Tiempo de trabajo: ${ficha.tiempo_de_trabajo}`);
  if (ficha.recomendaciones) {
    doc.text(`Recomendaciones:\n${ficha.recomendaciones}`);
  }

  doc.end();

  return new Promise((resolve, reject) => {
    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
};
