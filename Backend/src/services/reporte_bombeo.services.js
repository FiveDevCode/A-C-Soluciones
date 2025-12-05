import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import crypto from 'crypto';
import * as reporteRepo from '../repository/reporte_bombeo.repository.js';



export const generarPDFReporteBombeo = async (reporte, equipos, parametrosLinea, clienteInfo, tecnicoInfo) => {
    const doc = new PDFDocument({ margin: 40, size: 'LETTER' });
    const randomString = crypto.randomBytes(8).toString('hex');
    const filename = `reporte_bombeo_${randomString}.pdf`;
    const folderPath = path.join('uploads', 'reportes_bombeo');
    const filePath = path.join(folderPath, filename);
    const subtleGray = '#DDDDDD';
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    const mainColor = '#0b5394'; // Un azul institucional
    const headerBgColor = '#f2f2f2';
    const pageWidth = 612; // Ancho Letter
    const marginLeft = 40;
    const marginRight = 40;
    const contentWidth = pageWidth - marginLeft - marginRight;

    
  
    const drawHeader = () => {
        // Logo/Título empresa
        doc.fillColor(mainColor)
           .fontSize(16)
           .font('Helvetica-Bold')
           .text('A&C SOLUCIONES HIDROELÉCTRICAS SAS', marginLeft, 40, { width: contentWidth, align: 'left' });

        doc.fillColor('#000000')
           .fontSize(9)
           .font('Helvetica')
           .text('NIT: 901269341-0', marginLeft, 58)
           .text('3108950832 / 3153763994', marginLeft, 70)
           .text('acsolucioneshidroelectricas@gmail.com', marginLeft, 82)
           .text('CARRERA 23 NO. 28 - 11', marginLeft, 94);
        
        doc.y = 110; // Posición fija después del header
    };

    const drawReportTitle = () => {
        const boxY = doc.y;
        const boxHeight = 75;
        
        // Cuadro del título
        doc.rect(marginLeft, boxY, contentWidth, boxHeight)
           .fillAndStroke(headerBgColor, mainColor);
        
        doc.fillColor(mainColor)
           .fontSize(13)
           .font('Helvetica-Bold')
           .text('REPORTE MANTENIMIENTO DE EQUIPOS DE BOMBEO', marginLeft + 10, boxY + 8, { 
               width: contentWidth - 20, 
               align: 'center' 
           });
        
        doc.fillColor('#000000')
           .fontSize(9)
           .font('Helvetica');
        
        const infoY = boxY + 28;
        const col1X = marginLeft + 10;
        const col2X = marginLeft + 300;
        
        doc.text(`CLIENTE: ${clienteInfo.nombre}`, col1X, infoY, { width: 280 });
        doc.text(`FECHA: ${new Date(reporte.fecha).toLocaleDateString('es-CO')}`, col2X, infoY, { width: 260 });
        
        doc.text(`DIRECCIÓN: ${reporte.direccion || 'N/A'}`, col1X, infoY + 12, { width: 280 });
        doc.text(`TELÉFONO: ${reporte.telefono || 'N/A'}`, col2X, infoY + 12, { width: 260 });

        doc.text(`ENCARGADO: ${reporte.encargado || 'N/A'}`, col1X, infoY + 24, { width: 280 });
        doc.text(`CIUDAD: ${reporte.ciudad || 'N/A'}`, col2X, infoY + 24, { width: 260 });
        
        doc.y = boxY + boxHeight + 15; // Espacio después del cuadro
    };

    const drawEquiposTable = (equipos) => {
        const checkPageBreak = (requiredSpace) => {
            if (doc.y + requiredSpace > 720) { // 720 es cerca del final de la página
                doc.addPage();
                doc.y = 40;
            }
        };

        checkPageBreak(40);
        
        doc.fillColor(mainColor)
           .fontSize(11)
           .font('Helvetica-Bold')
           .text('EQUIPOS DE BOMBEO', marginLeft, doc.y);
        
        doc.y += 10;
        
        const tableTop = doc.y;
        const rowHeight = 25; // Aumentado para más espacio
        const colWidths = [90, 60, 65, 55, 70, 60, 132]; // Total: 532
        
        // Headers
        doc.fillColor(mainColor)
           .rect(marginLeft, tableTop, contentWidth, rowHeight)
           .fill();
        
        doc.fillColor('#FFFFFF')
           .fontSize(8)
           .font('Helvetica-Bold');
        
        const headers = ['EQUIPO', 'MARCA', 'AMPERAJE', 'PRESIÓN', 'TEMPERATURA', 'ESTADO', 'OBSERVACIONES'];
        let currentX = marginLeft;
        
        headers.forEach((header, i) => {
            doc.text(header, currentX + 3, tableTop + 8, { 
                width: colWidths[i] - 6, 
                align: 'center' 
            });
            currentX += colWidths[i];
        });

        let currentY = tableTop + rowHeight;
        doc.font('Helvetica');

        equipos.forEach((equipo, index) => {
            checkPageBreak(rowHeight + 10);
            
            // Alternar colores de fila
            const fillColor = index % 2 === 0 ? '#FFFFFF' : subtleGray;
            doc.fillColor(fillColor)
               .rect(marginLeft, currentY, contentWidth, rowHeight)
               .fill();
            
            // Bordes de celda
            doc.strokeColor('#CCCCCC').lineWidth(0.5);
            currentX = marginLeft;
            colWidths.forEach(width => {
                doc.rect(currentX, currentY, width, rowHeight).stroke();
                currentX += width;
            });
            
            doc.fillColor('#000000').fontSize(8);
            
            const fields = [
                equipo.equipo || 'N/A',
                equipo.marca || 'N/A',
                equipo.amperaje || 'N/A',
                equipo.presion || 'N/A',
                equipo.temperatura || 'N/A',
                equipo.estado || 'N/A',
                equipo.observacion || 'N/A'
            ];

            currentX = marginLeft;
            fields.forEach((field, i) => {
                const textY = currentY + 8;
                doc.text(field, currentX + 3, textY, { 
                    width: colWidths[i] - 6, 
                    align: i < 6 ? 'center' : 'left',
                    ellipsis: true,
                    lineBreak: false
                });
                currentX += colWidths[i];
            });
            
            currentY += rowHeight;
        });

        doc.y = currentY + 15; // Espacio después de la tabla
    };

    const drawParametrosLinea = (parametros) => {
        const checkPageBreak = (requiredSpace) => {
            if (doc.y + requiredSpace > 720) {
                doc.addPage();
                doc.y = 40;
            }
        };

        checkPageBreak(80);
        
        doc.fillColor(mainColor)
           .fontSize(11)
           .font('Helvetica-Bold')
           .text('PARÁMETROS ELÉCTRICOS Y DE PRESIÓN', marginLeft, doc.y);
        
        doc.y += 10;
        doc.fillColor('#000000')
           .fontSize(9)
           .font('Helvetica');
        
        const params = [
            { label: 'Voltaje Línea', value: parametros.voltaje_linea || 'N/A' },
            { label: 'Corriente Línea', value: parametros.corriente_linea || 'N/A' },
            { label: 'Presión Succión', value: parametros.presion_succion || 'N/A' },
            { label: 'Presión Descarga', value: parametros.presion_descarga || 'N/A' },
        ];
        
        const startY = doc.y;
        const colWidth = (contentWidth / 2) - 5;
        
        params.forEach((param, index) => {
            const col = index % 2;
            const row = Math.floor(index / 2);
            const xPos = marginLeft + (col * (colWidth + 10));
            const yPos = startY + (row * 15);
            
            doc.font('Helvetica-Bold')
               .text(`${param.label}:`, xPos, yPos, { continued: true, width: 100 });
            doc.font('Helvetica')
               .text(` ${param.value}`, { width: colWidth - 100 });
        });

        doc.y = startY + 40;
        
        checkPageBreak(60);
        
        doc.fillColor(mainColor)
           .fontSize(10)
           .font('Helvetica-Bold')
           .text('OBSERVACIONES DE PARÁMETROS:', marginLeft, doc.y);
        
        doc.y += 8;
        doc.fillColor('#000000')
           .fontSize(9)
           .font('Helvetica')
           .text(parametros.observaciones || 'Sin observaciones.', marginLeft, doc.y, { 
               width: contentWidth, 
               align: 'justify' 
           });
        
        doc.y += 20;
    };

    // Generar el documento
    drawHeader();
    drawReportTitle();
    drawEquiposTable(equipos);
    drawParametrosLinea(parametrosLinea);

    // Observaciones Generales
    const checkPageBreak = (requiredSpace) => {
        if (doc.y + requiredSpace > 720) {
            doc.addPage();
            doc.y = 40;
        }
    };

    checkPageBreak(80);
    
    doc.fillColor(mainColor)
       .fontSize(11)
       .font('Helvetica-Bold')
       .text('OBSERVACIONES Y RECOMENDACIONES FINALES', marginLeft, doc.y);
    
    doc.y += 8;
    doc.fillColor('#000000')
       .fontSize(9)
       .font('Helvetica')
       .text(reporte.observaciones_finales || 'Sin observaciones/recomendaciones finales.', marginLeft, doc.y, { 
           width: contentWidth, 
           align: 'justify' 
       });
    
    // Firmas
    doc.y += 40;
    checkPageBreak(80);
    
    const yFirma = doc.y;
    const firmaWidth = 200;
    const firma1X = marginLeft + 30;
    const firma2X = pageWidth - marginRight - firmaWidth - 30;

    // Línea firma técnico
    doc.moveTo(firma1X, yFirma).lineTo(firma1X + firmaWidth, yFirma).stroke();
    doc.fontSize(9)
       .font('Helvetica-Bold')
       .text(`TÉCNICO: ${tecnicoInfo.nombre} ${tecnicoInfo.apellido}`, firma1X, yFirma + 5, { 
           align: 'center', 
           width: firmaWidth 
       });
    doc.font('Helvetica')
       .fontSize(8)
       .text(`C.C./ID: ${tecnicoInfo.identificacion || 'N/A'}`, firma1X, yFirma + 18, { 
           align: 'center', 
           width: firmaWidth 
       });

    // Línea firma cliente
    doc.moveTo(firma2X, yFirma).lineTo(firma2X + firmaWidth, yFirma).stroke();
    doc.fontSize(9)
       .font('Helvetica-Bold')
       .text('CLIENTE / ENCARGADO', firma2X, yFirma + 5, { 
           align: 'center', 
           width: firmaWidth 
       });
    doc.font('Helvetica')
       .fontSize(8)
       .text(`NOMBRE: ${reporte.encargado || 'N/A'}`, firma2X, yFirma + 18, { 
           align: 'center', 
           width: firmaWidth 
       });


    doc.end();

    return new Promise((resolve, reject) => {
        stream.on('finish', () => resolve(filePath));
        stream.on('error', reject);
    });
};

