import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import crypto from 'crypto';

export const generarPDFReporte = async (reporte, clienteInfo, tecnicoInfo, parametros, verificaciones) => {
  const doc = new PDFDocument({ margin: 50 });
  const randomString = crypto.randomBytes(8).toString('hex');
  const filename = `reporte_mantenimiento_${randomString}.pdf`;
  const folderPath = path.join('uploads', 'reportes');
  const filePath = path.join(folderPath, filename);

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  // --- Paleta de Colores Formal ---
  const headerColor = '#07119bff'; // Azul oscuro
  const titleColor = '#34495e';    // Gris azulado
  const textColor = '#000000';     // Negro
  const borderColor = '#bdc3c7';   // Gris claro
  const subtleGray = '#ecf0f1';    // Gris muy claro
  const successColor = '#27ae60';  // Verde
  const warningColor = '#e74c3c';  // Rojo

  // --- Funciones de Ayuda ---
  const drawHeader = () => {
    doc.fillColor(headerColor)
       .fontSize(20)
       .font('Helvetica-Bold')
       .text('REPORTE DE MANTENIMIENTO', { align: 'center' });
    
    doc.fontSize(16)
       .text('PLANTAS ELÉCTRICAS', { align: 'center' });
    
    doc.moveDown(0.5);

    doc.fontSize(10)
       .font('Helvetica')
       .fillColor(textColor)
       .text(`Fecha: ${new Date(reporte.fecha).toLocaleDateString('es-CO')}`, { align: 'right' });

    doc.moveDown(1.5);
    doc.strokeColor(borderColor)
       .lineWidth(1)
       .moveTo(50, doc.y)
       .lineTo(doc.page.width - 50, doc.y)
       .stroke();
    doc.moveDown(1);
  };

  const createSectionHeader = (title) => {
    if (doc.y > 700) {
      doc.addPage();
    }
    
    doc.fillColor(titleColor)
       .fontSize(14)
       .font('Helvetica-Bold')
       .text(title);
    
    doc.moveDown(0.5);
    doc.strokeColor(subtleGray)
       .lineWidth(0.5)
       .moveTo(50, doc.y)
       .lineTo(doc.page.width - 50, doc.y)
       .stroke();
    doc.moveDown(0.8);
  };

  const createInfoRow = (label, value) => {
    if (!value && value !== 0 && value !== false) return;
    doc.fontSize(10).font('Helvetica-Bold').fillColor(textColor).text(`${label}: `, { continued: true });
    doc.font('Helvetica').text(value);
    doc.moveDown(0.5);
  };

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

  const createTable = (headers, rows) => {
    const startX = 50;
    const startY = doc.y;
    const columnWidth = (doc.page.width - 100) / headers.length;
    const rowHeight = 25;

    // Encabezados
    doc.fillColor(headerColor)
       .fontSize(10)
       .font('Helvetica-Bold');

    headers.forEach((header, i) => {
      const x = startX + (i * columnWidth);
      doc.rect(x, startY, columnWidth, rowHeight)
         .fillAndStroke(headerColor, borderColor);
      
      doc.fillColor('#ffffff')
         .text(header, x + 5, startY + 7, {
           width: columnWidth - 10,
           align: 'center'
         });
    });

    // Filas
    doc.fillColor(textColor).font('Helvetica').fontSize(9);
    
    rows.forEach((row, rowIndex) => {
      const y = startY + rowHeight + (rowIndex * rowHeight);
      
      if (y > 700) {
        doc.addPage();
        return;
      }

      row.forEach((cell, colIndex) => {
        const x = startX + (colIndex * columnWidth);
        doc.rect(x, y, columnWidth, rowHeight)
           .stroke(borderColor);
        
        doc.fillColor(textColor)
           .text(cell, x + 5, y + 7, {
             width: columnWidth - 10,
             align: 'left'
           });
      });
    });

    doc.y = startY + rowHeight + (rows.length * rowHeight);
    doc.moveDown(1.5);
  };

  // --- Construcción del Documento ---

  drawHeader();

  // Información del Cliente y Ubicación
  createSectionHeader('Información del Cliente');
  createInfoRow('Nombre', clienteInfo.nombre);
  createInfoRow('Dirección', reporte.direccion);
  createInfoRow('Ciudad', reporte.ciudad);
  createInfoRow('Teléfono', reporte.telefono || clienteInfo.telefono);
  createInfoRow('Encargado', reporte.encargado);
  createInfoRow('Correo', clienteInfo.correo);
  doc.moveDown(1);

  // Información del Generador
  createSectionHeader('Información del Generador');
  createInfoRow('Marca', reporte.marca_generador);
  createInfoRow('Modelo', reporte.modelo_generador);
  createInfoRow('KVA', reporte.kva || 'No especificado');
  createInfoRow('Serie', reporte.serie_generador || 'No especificado');
  doc.moveDown(1);

  // Técnico Responsable
  createSectionHeader('Técnico Responsable');
  createInfoRow('Nombre', `${tecnicoInfo.nombre} ${tecnicoInfo.apellido}`);
  createInfoRow('Teléfono', tecnicoInfo.telefono);
  createInfoRow('Correo', tecnicoInfo.correo);
  doc.moveDown(1);

  // Parámetros de Operación
  if (parametros && parametros.length > 0) {
    createSectionHeader('Parámetros de Operación');
    
    parametros.forEach((param, index) => {
      if (index > 0) doc.moveDown(0.5);
      
      createInfoRow('Presión de Aceite', param.presion_aceite || 'No registrado');
      createInfoRow('Temperatura de Aceite', param.temperatura_aceite || 'No registrado');
      createInfoRow('Temperatura de Refrigerante', param.temperatura_refrigerante || 'No registrado');
      createInfoRow('Fugas de Aceite', param.fugas_aceite ? 'SÍ' : 'NO');
      createInfoRow('Fugas de Combustible', param.fugas_combustible ? 'SÍ' : 'NO');
      createInfoRow('Frecuencia/RPM', param.frecuencia_rpm || 'No registrado');
      createInfoRow('Voltaje de Salida', param.voltaje_salida || 'No registrado');
    });
    
    doc.moveDown(1);
  }

  // Verificación de Mantenimiento
  if (verificaciones && verificaciones.length > 0) {
    if (doc.y > 600) {
      doc.addPage();
    }
    
    createSectionHeader('Verificación de Mantenimiento');
    
    const headers = ['Item', 'Estado', 'Observación'];
    const rows = verificaciones.map(v => [
      v.item,
      v.visto ? '✓ Verificado' : '✗ No verificado',
      v.observacion || 'Sin observaciones'
    ]);

    createTable(headers, rows);
  }

  // Observaciones Finales
  if (reporte.observaciones_finales) {
    if (doc.y > 650) {
      doc.addPage();
    }
    
    createSectionHeader('Observaciones Finales');
    createParagraph(reporte.observaciones_finales);
  }

  // Pie de página
  doc.fontSize(8)
     .font('Helvetica-Oblique')
     .fillColor(textColor)
     .text('Este reporte ha sido generado automáticamente por A-C Soluciones', 50, doc.page.height - 50, {
       align: 'center',
       width: doc.page.width - 100
     });

  doc.end();

  return new Promise((resolve, reject) => {
    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
};
