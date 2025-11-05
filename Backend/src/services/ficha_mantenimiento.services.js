import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import crypto from 'crypto';

// Cambio de diseño para un estilo más formal y profesional.
export const generarPDF = async (ficha, clienteInfo, tecnicoInfo, imagenes = {}) => {
  const doc = new PDFDocument({ margin: 50 });
  const randomString = crypto.randomBytes(8).toString('hex');
  const filename = `ficha_${randomString}.pdf`;
  const folderPath = path.join('uploads', 'fichas');
  const filePath = path.join(folderPath, filename);

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  // --- Paleta de Colores Formal ---
  const headerColor = '#c0bfbdff'; // Azul oscuro (Midnight Blue)
  const titleColor = '#34495e';  // Gris azulado (Wet Asphalt)
  const textColor = '#000000';     // Negro
  const borderColor = '#bdc3c7'; // Gris claro (Silver)
  const subtleGray = '#ecf0f1';   // Gris muy claro (Clouds)

  // --- Funciones de Ayuda para el Diseño ---

  // Dibuja el encabezado principal del documento
  const drawHeader = () => {
    doc.fillColor(titleColor)
       .fontSize(20)
       .font('Helvetica-Bold')
       .text('FICHA DE MANTENIMIENTO', { align: 'center' });
    
    doc.moveDown(0.5);

    doc.fontSize(10)
       .font('Helvetica')
       .fillColor(textColor)
       .text(`Fecha: ${new Date(ficha.fecha_de_mantenimiento).toLocaleDateString('es-CO')}`, { align: 'right' });

    doc.moveDown(1.5);
    // Línea separadora
    doc.strokeColor(borderColor)
       .lineWidth(1)
       .moveTo(50, doc.y)
       .lineTo(doc.page.width - 50, doc.y)
       .stroke();
    doc.moveDown(1);
  };

  // Crea un encabezado de sección
  const createSectionHeader = (title) => {
    doc.fillColor(titleColor)
       .fontSize(14)
       .font('Helvetica-Bold')
       .text(title);
    
    doc.moveDown(0.5);
    // Línea sutil debajo del título de la sección
    doc.strokeColor(subtleGray)
       .lineWidth(0.5)
       .moveTo(50, doc.y)
       .lineTo(doc.page.width - 50, doc.y)
       .stroke();
    doc.moveDown(0.8);
  };

  // Crea una fila de información con etiqueta y valor
  const createInfoRow = (label, value) => {
    if (!value) return;
    doc.fontSize(10).font('Helvetica-Bold').fillColor(textColor).text(`${label}: `, { continued: true });
    doc.font('Helvetica').text(value);
    doc.moveDown(0.5);
  };

  // Crea un párrafo de texto justificado
  const createParagraph = (text) => {
    if (!text) return;
    doc.fillColor(textColor)
       .fontSize(10)
       .font('Helvetica')
       .text(text, {
         align: 'justify',
         lineGap: 2
       });
    doc.moveDown(1);
  };

  // Agrega una imagen centrada con un borde sutil
  const addCenteredImage = (imagePath, caption = '') => {
    if (!imagePath || !fs.existsSync(imagePath)) return;

    const maxWidth = 200;
    const maxHeight = 200;
    
    // Centrar la imagen
    const imageOptions = { fit: [maxWidth, maxHeight], align: 'center' };
    const imageWidth = doc.getImageWidth?.(imagePath, imageOptions) || maxWidth;
    const x = (doc.page.width - imageWidth) / 2;

    // Borde sutil
    doc.rect(x - 5, doc.y - 5, imageWidth + 10, maxHeight + 10)
       .strokeColor(borderColor)
       .lineWidth(0.5)
       .stroke();
       
    doc.image(imagePath, x, doc.y, imageOptions);
    const imageHeight = doc.getImageHeight?.(imagePath, imageOptions) || maxHeight;
    doc.y += imageHeight;

    if (caption) {
      doc.moveDown(0.5);
      doc.fillColor(titleColor)
         .fontSize(8)
         .font('Helvetica-Oblique')
         .text(caption, { align: 'center' });
    }
    doc.moveDown(1.5);
  };

  // --- Construcción del Documento ---

  drawHeader();

  // Información del Cliente y Técnico en dos columnas
  const infoStartY = doc.y;
  
  // Columna Izquierda: Cliente
  createSectionHeader('Información del Cliente');
  createInfoRow('Nombre', clienteInfo.nombre);
  createInfoRow('Teléfono', clienteInfo.telefono);
  createInfoRow('Correo', clienteInfo.correo);
  
  // Columna Derecha: Técnico
  doc.y = infoStartY; // Reset Y to align columns
  doc.x = 320; // Move to the second column
  createSectionHeader('Técnico Responsable');
  createInfoRow('Nombre', `${tecnicoInfo.nombre} ${tecnicoInfo.apellido}`);
  createInfoRow('Teléfono', tecnicoInfo.telefono);
  createInfoRow('Correo', tecnicoInfo.correo);

  // Resetear posición para el resto del documento
  doc.x = 50;
  doc.moveDown(2);

  // --- Secciones del Mantenimiento ---

  if (ficha.introduccion) {
    createSectionHeader('Introducción');
    createParagraph(ficha.introduccion);
  }

  if (ficha.detalles_servicio) {
    createSectionHeader('Detalles del Servicio');
    createParagraph(ficha.detalles_servicio);
  }

  if (ficha.estado_antes) {
    createSectionHeader('Estado Antes del Mantenimiento');
    createParagraph(ficha.estado_antes);
    addCenteredImage(imagenes.estadoAntes, 'Estado inicial del equipo');
  }

  if (ficha.descripcion_trabajo) {
    createSectionHeader('Descripción del Trabajo Realizado');
    createParagraph(ficha.descripcion_trabajo);
    addCenteredImage(imagenes.descripcion, 'Trabajo en proceso');
  }
  
  if (ficha.materiales_utilizados) {
    createSectionHeader('Materiales Utilizados');
    createParagraph(ficha.materiales_utilizados);
  }

  if (ficha.estado_final) {
    createSectionHeader('Estado Final del Equipo');
    createParagraph(ficha.estado_final);
    addCenteredImage(imagenes.estadoFinal, 'Estado final del equipo');
  }

  if (ficha.recomendaciones) {
    createSectionHeader('Recomendaciones');
    createParagraph(ficha.recomendaciones);
  }

  if (ficha.observaciones) {
    createSectionHeader('Observaciones Adicionales');
    createParagraph(ficha.observaciones);
  }

  // --- Pie de Página ---
  const pageHeight = doc.page.height;
  doc.y = pageHeight - 60; // Posicionar cerca del final

  // Línea separadora del pie de página
  doc.strokeColor(borderColor)
     .lineWidth(1)
     .moveTo(50, doc.y)
     .lineTo(doc.page.width - 50, doc.y)
     .stroke();
  doc.moveDown(0.5);

  doc.fontSize(8).font('Helvetica').fillColor(textColor);
  doc.text('A&C Soluciones.', 50, doc.y, { align: 'left' });
  doc.moveDown(0.5);
  doc.text('Este documento es un registro oficial del servicio de mantenimiento prestado.', 50, doc.y, { align: 'center' });

  doc.end();

  return new Promise((resolve, reject) => {
    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
};

