import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

export const generarPDF = async (ficha, clienteInfo, tecnicoInfo, imagenes = {}) => {
  const doc = new PDFDocument({ margin: 40 });
  const filename = `ficha_${ficha.id}.pdf`;
  const folderPath = path.join('uploads', 'fichas');
  const filePath = path.join(folderPath, filename);

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  // Colores elegantes
  const primaryColor = '#1a365d';    // Azul marino elegante
  const secondaryColor = '#2b6cb0';  // Azul medio
  const accentColor = '#d53f8c';     // Rosa elegante
  const lightBlue = '#ebf8ff';       // Azul muy claro
  const textColor = '#2d3748';       // Gris oscuro para texto
  const borderColor = '#cbd5e0';     // Gris claro para bordes

  // Función para crear encabezados elegantes (REDUCIDO)
  const createSectionHeader = (text, color = primaryColor) => {
    const currentY = doc.y;
    
    // Fondo con gradiente simulado
    doc.rect(40, currentY, doc.page.width - 80, 18)  // Reducido de 22 a 18
       .fill(color);
    
    // Texto del encabezado
    doc.fillColor('white')
       .fontSize(9)  // Reducido de 10 a 9
       .font('Helvetica-Bold')
       .text(text, 50, currentY + 4, {  // Reducido padding de 5 a 4
         width: doc.page.width - 100,
         align: 'left'
       })
       .fillColor(textColor);
    
    doc.y = currentY + 20;  // Reducido de 25 a 20
  };

  // Función para crear cajas de información (REDUCIDO)
  const createInfoBox = (label, value, x = 50, width = 250) => {
    const currentY = doc.y;
    
    // Caja con borde
    doc.rect(x, currentY, width, 16)  // Reducido de 18 a 16
       .fill(lightBlue)
       .stroke(borderColor);
    
    // Etiqueta
    doc.fillColor(primaryColor)
       .fontSize(7)
       .font('Helvetica-Bold')
       .text(label, x + 5, currentY + 1);  // Reducido de 2 a 1
    
    // Valor
    doc.fillColor(textColor)
       .fontSize(8)
       .font('Helvetica')
       .text(value, x + 5, currentY + 8, { width: width - 10 });  // Reducido de 10 a 8
    
    return currentY + 18;  // Reducido de 20 a 18
  };

  // Función para texto en párrafo con estilo (OPTIMIZADO)
  const createParagraph = (text, indent = 50) => {
    if (!text) return;
    
    doc.fillColor(textColor)
       .fontSize(9)
       .font('Helvetica')
       .text(text, indent, doc.y, { 
         width: doc.page.width - (indent * 2),
         align: 'justify',
         lineGap: 1
       });
    
    doc.moveDown(0.2);  // Reducido de 0.3 a 0.2
  };

  // Función para centrar imágenes con marco elegante (OPTIMIZADO)
  const addCenteredImage = (imagePath, caption = '') => {
    if (!imagePath || !fs.existsSync(imagePath)) return;
    
    const maxWidth = 150;   // Reducido de 180 a 150
    const maxHeight = 150;  // Reducido de 180 a 150
    const pageWidth = doc.page.width - 80;
    const imageX = 40 + (pageWidth - maxWidth) / 2;
    
    // Marco exterior
    doc.rect(imageX - 6, doc.y - 2, maxWidth + 12, maxHeight + 12)  // Reducido padding
       .fill('#f7fafc')
       .stroke(borderColor);
    
    // Imagen
    doc.image(imagePath, imageX, doc.y, { 
      fit: [maxWidth, maxHeight],
      align: 'center'
    });
    
    // Caption si existe
    if (caption) {
      doc.fillColor('#718096')
         .fontSize(7)
         .font('Helvetica-Oblique')
         .text(caption, imageX, doc.y + maxHeight + 2, {  // Reducido de 3 a 2
           width: maxWidth,
           align: 'center'
         });
    }
    
    doc.y += maxHeight + 8;  // Reducido de 15 a 8
    doc.fillColor(textColor);
  };

  // ENCABEZADO PRINCIPAL ELEGANTE (REDUCIDO)
  const headerHeight = 60;  // Reducido de 70 a 60
  
  // Fondo del encabezado
  doc.rect(0, 0, doc.page.width, headerHeight)
     .fill(primaryColor);
  
  // Título principal
  doc.fillColor('white')
     .fontSize(20)  // Reducido de 22 a 20
     .font('Helvetica-Bold')
     .text('FICHA DE MANTENIMIENTO', 0, 18, { align: 'center' });  // Reducido de 20 a 18
  
  // Subtítulo
  doc.fontSize(10)  // Reducido de 11 a 10
     .font('Helvetica')
     .text(`Documento N° ${ficha.id} | ${new Date().toLocaleDateString('es-CO')}`, 0, 40, { align: 'center' });  // Reducido de 45 a 40

  doc.y = headerHeight + 8;  // Reducido de 10 a 8

  // INFORMACIÓN DEL CLIENTE
  createSectionHeader('INFORMACIÓN DEL CLIENTE', secondaryColor);
  
  let nextY = createInfoBox('Cliente', clienteInfo.nombre, 50, 300);
  doc.y = nextY;
  nextY = createInfoBox('Teléfono', clienteInfo.telefono, 50, 200);
  doc.y = nextY;
  nextY = createInfoBox('Fecha de Mantenimiento', 
    new Date(ficha.fecha_de_mantenimiento).toLocaleString('es-CO'), 50, 300);
  
  doc.y = nextY + 2;  // Reducido de 3 a 2

  // TÉCNICO RESPONSABLE
  createSectionHeader('TÉCNICO RESPONSABLE', accentColor);
  
  nextY = createInfoBox('Técnico', `${tecnicoInfo.nombre} ${tecnicoInfo.apellido}`, 50, 300);
  doc.y = nextY;
  nextY = createInfoBox('Teléfono', tecnicoInfo.telefono, 50, 200);
  doc.y = nextY;
  nextY = createInfoBox('Correo Electrónico', tecnicoInfo.correo, 50, 300);
  
  doc.y = nextY + 2;  // Reducido de 3 a 2

  // INTRODUCCIÓN
  if (ficha.introduccion) {
    createSectionHeader('INTRODUCCIÓN');
    createParagraph(ficha.introduccion);
    doc.moveDown(0.1);  // Espacio mínimo después del párrafo
  }

  // DETALLES DEL SERVICIO
  if (ficha.detalles_servicio) {
    createSectionHeader('DETALLES DEL SERVICIO');
    createParagraph(ficha.detalles_servicio);
    doc.moveDown(0.1);
  }

  // ESTADO ANTES
  if (ficha.estado_antes) {
    createSectionHeader('ESTADO ANTES DEL MANTENIMIENTO');
    createParagraph(ficha.estado_antes);
    addCenteredImage(imagenes.estadoAntes, 'Estado antes del mantenimiento');
  }

  // DESCRIPCIÓN DEL TRABAJO
  if (ficha.descripcion_trabajo) {
    createSectionHeader('TRABAJO REALIZADO');
    createParagraph(ficha.descripcion_trabajo);
    addCenteredImage(imagenes.descripcion, 'Proceso de mantenimiento');
  }

  // MATERIALES
  if (ficha.materiales_utilizados) {
    createSectionHeader('MATERIALES UTILIZADOS');
    createParagraph(ficha.materiales_utilizados);
    doc.moveDown(0.1);
  }

  // ESTADO FINAL
  if (ficha.estado_final) {
    createSectionHeader('ESTADO FINAL');
    createParagraph(ficha.estado_final);
    addCenteredImage(imagenes.estadoFinal, 'Estado final después del mantenimiento');
  }

  // INFORMACIÓN ADICIONAL
  createSectionHeader('RESUMEN DEL SERVICIO', '#4a5568');
  
  nextY = createInfoBox('Tiempo de Trabajo', ficha.tiempo_de_trabajo, 50, 250);
  doc.y = nextY + 2;  // Reducido de 3 a 2

  if (ficha.recomendaciones) {
    createSectionHeader('RECOMENDACIONES', '#38a169');
    createParagraph(ficha.recomendaciones);
    doc.moveDown(0.1);
  }

  if (ficha.observaciones) {
    createSectionHeader('OBSERVACIONES ADICIONALES', '#d69e2e');
    createParagraph(ficha.observaciones);
  }

  // PIE DE PÁGINA ELEGANTE (REDUCIDO)
  const footerY = doc.page.height - 50;  // Reducido de 60 a 50
  doc.rect(0, footerY, doc.page.width, 50)  // Reducido de 60 a 50
     .fill('#f7fafc')
     .stroke(borderColor);
  
  doc.fillColor('#718096')
     .fontSize(8)
     .font('Helvetica')
     .text(`Documento generado automáticamente el ${new Date().toLocaleString('es-CO')}`, 
            50, footerY + 10, { align: 'center' })  // Reducido de 15 a 10
     .text('Este documento constituye un registro oficial del mantenimiento realizado', 
            50, footerY + 25, { align: 'center' });  // Reducido de 30 a 25

  doc.end();

  return new Promise((resolve, reject) => {
    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
};