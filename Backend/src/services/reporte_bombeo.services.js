import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import crypto from 'crypto';
import * as reporteRepo from '../repository/reporte_bombeo.repository.js';



export const generarPDFReporteBombeo = async (reporte, equipos, parametrosLinea, clienteInfo, tecnicoInfo) => {
    const doc = new PDFDocument({ margin: 30, size: 'LETTER' });
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

    
  
    const drawHeader = () => {
        
        doc.fillColor(mainColor)
           .fontSize(16)
           .font('Helvetica-Bold')
           .text('A&C SOLUCIONES HIDROELÉCTRICAS SAS', 30, 40);

        doc.fillColor('#000000')
           .fontSize(9)
           .font('Helvetica')
           .text('NIT: 901269341-0', 30, 55)
           .text('3108950832 / 3153763994', 30, 67)
           .text('acsolucioneshidroelectricas@gmail.com', 30, 79)
           .text('CARRERA 23 NO. 28 - 11', 30, 91);
        
        doc.moveDown(1);
    };

    const drawReportTitle = (x = 200, y = 30) => {
        doc.rect(x, y, 350, 60).fill(headerBgColor).stroke(mainColor);
        doc.fillColor(mainColor)
           .fontSize(14)
           .font('Helvetica-Bold')
           .text('REPORTE MANTENIMIENTO DE EQUIPOS DE BOMBEO', x + 5, y + 5, { width: 340, align: 'center' });
        
        doc.fillColor('#000000')
           .fontSize(8)
           .font('Helvetica');
        
        const clientY = y + 25;
        doc.text(`CLIENTE: ${clienteInfo.nombre}`, x + 5, clientY)
           .text(`FECHA: ${new Date(reporte.fecha).toLocaleDateString('es-CO')}`, x + 180, clientY);
        
        doc.text(`DIRECCIÓN: ${reporte.direccion || ''}`, x + 5, clientY + 10)
           .text(`TELÉFONO: ${reporte.telefono || ''}`, x + 180, clientY + 10);

        doc.text(`ENCARGADO: ${reporte.encargado || ''}`, x + 5, clientY + 20)
           .text(`CIUDAD: ${reporte.ciudad || ''}`, x + 180, clientY + 20);
        
        doc.y = y + 70; // Mover el cursor después del cuadro
    };

    const drawEquiposTable = (equipos) => {
        doc.moveDown(0.5);
        doc.fillColor(mainColor).fontSize(10).font('Helvetica-Bold').text('EQUIPOS DE BOMBEO', 30);
        doc.moveDown(0.5);

        const tableTop = doc.y;
        const colWidths = [120, 60, 60, 60, 60, 60, 150]; // Marca, Amperaje, Presión, Temperatura, Estado, Observación
        let currentX = 30;

        doc.fillColor(headerBgColor).rect(currentX, tableTop, 550, 15).fill();
        doc.fillColor('#000000').fontSize(8).font('Helvetica-Bold');
        
        const headers = ['EQUIPO', 'MARCA', 'AMPERAJE (A)', 'PRESIÓN', 'TEMPERATURA', 'ESTADO', 'OBSERVACIONES'];
        currentX = 30;
        headers.forEach((header, i) => {
            doc.text(header, currentX, tableTop + 4, { width: colWidths[i], align: 'center' });
            currentX += colWidths[i];
        });

        doc.font('Helvetica');
        let currentY = tableTop + 15;

        equipos.forEach(equipo => {
            currentX = 30;
            const rowHeight = 20;
            
            doc.fillColor(currentY % 40 === tableTop + 15 ? '#ffffff' : subtleGray)
               .rect(currentX, currentY, 550, rowHeight)
               .fill();
            
            doc.fillColor('#000000').fontSize(8);
            
            const fields = [
                equipo.equipo || '',
                equipo.marca || '',
                equipo.amperaje || '',
                equipo.presion || '',
                equipo.temperatura || '',
                equipo.estado || '',
                equipo.observacion || ''
            ];

            fields.forEach((field, i) => {
                doc.text(field, currentX + 5, currentY + 7, { width: colWidths[i] - 10, align: 'left', ellipsis: true });
                currentX += colWidths[i];
            });
            currentY += rowHeight;
        });

        doc.moveDown(1);
        doc.y = currentY + 10;
    };

    const drawParametrosLinea = (parametros) => {
        doc.moveDown(0.5);
        doc.fillColor(mainColor).fontSize(10).font('Helvetica-Bold').text('PARÁMETROS ELÉCTRICOS Y DE PRESIÓN', 30);
        doc.moveDown(0.5);

        doc.fillColor('#000000').fontSize(8).font('Helvetica');
        
        const params = [
            { label: 'Voltaje Línea', value: parametros.voltaje_linea || 'N/A' },
            { label: 'Corriente Línea', value: parametros.corriente_linea || 'N/A' },
            { label: 'Presión Succión', value: parametros.presion_succion || 'N/A' },
            { label: 'Presión Descarga', value: parametros.presion_descarga || 'N/A' },
        ];
        
        let currentX = 30;
        const colWidth = 130;
        
        params.forEach((param, index) => {
            if (index % 4 === 0 && index !== 0) {
                doc.moveDown(0.5);
                currentX = 30;
            }
            doc.font('Helvetica-Bold').text(`${param.label}:`, currentX, doc.y, { continued: true });
            doc.font('Helvetica').text(` ${param.value}`, { continued: false, align: 'left' });
            currentX += colWidth;
        });

        doc.moveDown(1);
        
        doc.fillColor(mainColor).fontSize(10).font('Helvetica-Bold').text('OBSERVACIONES DE PARÁMETROS:', 30);
        doc.fillColor('#000000').fontSize(8).font('Helvetica').text(parametros.observaciones || 'Sin observaciones.', 30, doc.y + 10, { width: 550, align: 'justify' });
    };

    drawHeader();
    drawReportTitle(200, 30);
    doc.moveDown(1);

    drawEquiposTable(equipos);
    doc.moveDown(1);

    drawParametrosLinea(parametrosLinea);
    doc.moveDown(1);

    // Observaciones Generales
    doc.fillColor(mainColor).fontSize(10).font('Helvetica-Bold').text('OBSERVACIONES Y RECOMENDACIONES FINALES', 30);
    doc.fillColor('#000000').fontSize(8).font('Helvetica').text(reporte.observaciones_finales || 'Sin observaciones/recomendaciones finales.', 30, doc.y + 10, { width: 550, align: 'justify' });
    
    // Firmas
    doc.moveDown(4);
    const yFirma = doc.y;

    doc.moveTo(80, yFirma).lineTo(280, yFirma).stroke();
    doc.text(`TÉCNICO: ${tecnicoInfo.nombre} ${tecnicoInfo.apellido}`, 80, yFirma + 5, { align: 'center', width: 200 });
    doc.text(`C.C./ID: ${tecnicoInfo.identificacion || 'N/A'}`, 80, yFirma + 15, { align: 'center', width: 200 });

    doc.moveTo(350, yFirma).lineTo(550, yFirma).stroke();
    doc.text(`CLIENTE / ENCARGADO`, 350, yFirma + 5, { align: 'center', width: 200 });
    doc.text(`NOMBRE: ${reporte.encargado || 'N/A'}`, 350, yFirma + 15, { align: 'center', width: 200 });


    doc.end();

    return new Promise((resolve, reject) => {
        stream.on('finish', () => resolve(filePath));
        stream.on('error', reject);
    });
};

