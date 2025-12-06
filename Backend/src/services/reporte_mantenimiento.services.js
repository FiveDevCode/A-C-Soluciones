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

  const headerColor = '#0056b3';
  const titleColor = '#34495e';
  const textColor = '#000000';
  const borderColor = '#bdc3c7';
  const subtleGray = '#ecf0f1';
  const successColor = '#27ae60';
  const warningColor = '#e74c3c';

  const drawHeader = () => {
    doc.fontSize(8)
       .font('Helvetica')
       .fillColor(textColor)
       .text(`Fecha: ${new Date(reporte.fecha).toLocaleDateString('es-CO')}`, 50, 50, { align: 'right', width: doc.page.width - 100 });
    
    doc.fillColor(headerColor)
       .fontSize(14)
       .font('Helvetica-Bold')
       .text('REPORTE DE MANTENIMIENTO PLANTAS ELÉCTRICAS', 50, 70, { align: 'center', width: doc.page.width - 100 });

    doc.y = 95;
    doc.moveDown(1);
  };

  const createSectionHeader = (title, column = 'full') => {
    if (doc.y > 700) {
      doc.addPage();
    }
    
    const startX = column === 'left' ? 50 : column === 'right' ? (doc.page.width / 2) + 15 : 50;
    const width = column === 'full' ? doc.page.width - 100 : (doc.page.width - 100) / 2 - 10;
    
    doc.fillColor(titleColor)
       .fontSize(12)
       .font('Helvetica-Bold')
       .text(title, startX, doc.y, { width });
    
    doc.moveDown(0.6);
  };

  const createInfoRow = (label, value, column = 'full') => {
    if (!value && value !== 0 && value !== false) return;
    
    const startX = column === 'left' ? 50 : column === 'right' ? (doc.page.width / 2) + 15 : 50;
    const width = column === 'full' ? doc.page.width - 100 : (doc.page.width - 100) / 2 - 10;
    const rowY = doc.y;
    
    doc.fontSize(10)
       .font('Helvetica-Bold')
       .fillColor(textColor)
       .text(`${label}: `, startX, rowY, { width, continued: true });
    doc.font('Helvetica')
       .fontSize(10)
       .text(value, { width });
    doc.y = rowY + 14;
  };

  const createParagraph = (text) => {
    if (!text) return;
    doc.fillColor(textColor)
       .fontSize(10)
       .font('Helvetica')
       .text(text, {
         align: 'justify',
         lineGap: 1.5
       });
    doc.moveDown(0.8);
  };

  const createTable = (headers, rows) => {
    const startX = 50;
    const startY = doc.y;
    const columnWidth = (doc.page.width - 100) / headers.length;
    const rowHeight = 25;

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

    doc.fillColor(textColor)
       .font('Helvetica')
       .fontSize(9);
    
    rows.forEach((row, rowIndex) => {
      const y = startY + rowHeight + (rowIndex * rowHeight);
      
      if (y > 700) {
        doc.addPage();
        return;
      }

      if (rowIndex % 2 === 0) {
        doc.rect(startX, y, doc.page.width - 100, rowHeight)
           .fill(subtleGray);
      }

      row.forEach((cell, colIndex) => {
        const x = startX + (colIndex * columnWidth);
        
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

  drawHeader();

  const row1StartY = doc.y;
  
  createSectionHeader('Información del Cliente', 'left');
  createInfoRow('Nombre', clienteInfo.nombre, 'left');
  createInfoRow('Dirección', reporte.direccion, 'left');
  createInfoRow('Ciudad', reporte.ciudad, 'left');
  createInfoRow('Teléfono', reporte.telefono || clienteInfo.telefono, 'left');
  createInfoRow('Encargado', reporte.encargado, 'left');
    createInfoRow('Correo', clienteInfo.correo, 'left');
    const leftColEndY = doc.y;
  
  doc.y = row1StartY;
  createSectionHeader('Técnico Responsable', 'right');
  createInfoRow('Nombre', `${tecnicoInfo.nombre} ${tecnicoInfo.apellido}`, 'right');
  createInfoRow('Teléfono', tecnicoInfo.telefono, 'right');
    createInfoRow('Correo', tecnicoInfo.correo, 'right');
    const rightColEndY = doc.y;
  
  doc.y = Math.max(leftColEndY, rightColEndY) + 15;

  const row2StartY = doc.y;
  
  createSectionHeader('Información del Generador', 'left');
  createInfoRow('Marca', reporte.marca_generador, 'left');
  createInfoRow('Modelo', reporte.modelo_generador, 'left');
  createInfoRow('KVA', reporte.kva || 'No especificado', 'left');
    createInfoRow('Serie', reporte.serie_generador || 'No especificado', 'left');
    const leftCol2EndY = doc.y;
  
  doc.y = row2StartY;
  if (parametros && parametros.length > 0) {
    createSectionHeader('Parámetros de Operación', 'right');
    
    parametros.forEach((param, index) => {
      if (index > 0) {
        doc.y += 5;
      }
      
      createInfoRow('Presión de Aceite', param.presion_aceite || 'No registrado', 'right');
      createInfoRow('Temperatura de Aceite', param.temperatura_aceite || 'No registrado', 'right');
      createInfoRow('Temperatura de Refrigerante', param.temperatura_refrigerante || 'No registrado', 'right');
      createInfoRow('Fugas de Aceite', param.fugas_aceite ? 'SÍ' : 'NO', 'right');
      createInfoRow('Fugas de Combustible', param.fugas_combustible ? 'SÍ' : 'NO', 'right');
      createInfoRow('Frecuencia/RPM', param.frecuencia_rpm || 'No registrado', 'right');
      createInfoRow('Voltaje de Salida', param.voltaje_salida || 'No registrado', 'right');
    });
  } else {
    createSectionHeader('Parámetros de Operación', 'right');
    doc.y += 20;
  }
  const rightCol2EndY = doc.y;
  
  doc.y = Math.max(leftCol2EndY, rightCol2EndY) + 15;

  if (verificaciones && verificaciones.length > 0) {
    if (doc.y > 600) {
      doc.addPage();
    }
    
    createSectionHeader('Verificación de Mantenimiento');
    
    const headers = ['Item', 'Estado', 'Observación'];
    const rows = verificaciones.map(v => [
      v.item,
      v.visto ? 'Verificado' : 'No verificado',
      v.observacion || 'Sin observaciones'
    ]);

    createTable(headers, rows);
  }

  if (reporte.observaciones_finales) {
    if (doc.y > 650) {
      doc.addPage();
    }
    
    createSectionHeader('Observaciones Finales');
    createParagraph(reporte.observaciones_finales);
  }

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