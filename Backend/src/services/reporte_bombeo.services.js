import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import puppeteer from 'puppeteer';
import * as reporteRepo from '../repository/reporte_bombeo.repository.js';

export const generarPDFReporteBombeo = async (reporte, equipos, parametrosLinea, clienteInfo, tecnicoInfo) => {
    const randomString = crypto.randomBytes(8).toString('hex');
    const filename = `reporte_bombeo_${randomString}.pdf`;
    const folderPath = path.join('uploads', 'reportes_bombeo');
    const filePath = path.join(folderPath, filename);

    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }

    const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>Reporte de Bombeo</title>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
        <style>
            body {
                font-family: 'Roboto', sans-serif;
                margin: 0;
                padding: 0;
                color: #333;
                font-size: 11px;
                line-height: 1.5;
            }
            .container {
                width: 100%;
                margin: 0 auto;
            }
            .header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                border-bottom: 2px solid #0056b3;
                padding-bottom: 15px;
                margin-bottom: 25px;
            }
            .logo-section h1 {
                color: #0056b3;
                font-size: 22px;
                font-weight: 700;
                margin: 0 0 5px 0;
                letter-spacing: 0.5px;
            }
            .logo-section p {
                color: #666;
                margin: 2px 0;
                font-size: 11px;
            }
            .report-title-box {
                background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                border-left: 5px solid #0056b3;
                border-radius: 4px;
                padding: 18px;
                margin-bottom: 30px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            }
            .report-title-box h2 {
                color: #0056b3;
                font-size: 16px;
                text-align: center;
                margin: 0 0 15px 0;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            .info-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                column-gap: 30px;
                row-gap: 12px;
            }
            .info-item {
                display: flex;
                border-bottom: 1px dashed #ddd;
                padding-bottom: 4px;
            }
            .info-item strong {
                color: #555;
                width: 90px;
                font-weight: 600;
            }
            .info-item span {
                color: #222;
                font-weight: 500;
            }
            .section-title {
                background-color: #0056b3;
                color: white;
                padding: 8px 15px;
                font-size: 13px;
                font-weight: 500;
                border-radius: 4px;
                margin-bottom: 15px;
                margin-top: 30px;
                display: inline-block;
                box-shadow: 0 2px 4px rgba(0,86,179,0.2);
            }
            table {
                width: 100%;
                border-collapse: separate;
                border-spacing: 0;
                margin-bottom: 25px;
                border: 1px solid #e0e0e0;
                border-radius: 6px;
                overflow: hidden;
            }
            th {
                background-color: #f1f5f9;
                color: #0056b3;
                font-size: 10px;
                padding: 10px 8px;
                text-align: center;
                font-weight: 600;
                border-bottom: 2px solid #cbd5e1;
                text-transform: uppercase;
            }
            td {
                padding: 10px 8px;
                font-size: 10px;
                text-align: center;
                border-bottom: 1px solid #eee;
                color: #444;
            }
            .td-left {
                text-align: left;
            }
            tr:last-child td {
                border-bottom: none;
            }
            tr:nth-child(even) td {
                background-color: #fafbfc;
            }
            .params-box {
                background-color: #fff;
                border: 1px solid #e2e8f0;
                border-radius: 6px;
                padding: 15px;
            }
            .params-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
            }
            .param-item {
                display: flex;
                align-items: center;
                background-color: #f8fafc;
                padding: 8px 12px;
                border-radius: 4px;
            }
            .param-item strong {
                color: #0056b3;
                width: 130px;
                font-weight: 600;
            }
            .param-item span {
                font-weight: 500;
                color: #333;
            }
            .obs-box {
                background-color: #fff;
                border: 1px solid #e2e8f0;
                border-radius: 6px;
                padding: 15px;
                margin-bottom: 20px;
                text-align: justify;
                color: #444;
                line-height: 1.6;
            }
            .signatures {
                margin-top: 70px;
                display: flex;
                justify-content: space-around;
                page-break-inside: avoid;
            }
            .signature-box {
                width: 35%;
                text-align: center;
            }
            .signature-line {
                border-top: 1px solid #999;
                margin-bottom: 8px;
                padding-top: 8px;
            }
            .signature-box p {
                margin: 3px 0;
                color: #555;
            }
            .signature-box strong {
                color: #222;
                font-size: 12px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo-section">
                    <h1>A&C SOLUCIONES HIDROELÉCTRICAS SAS</h1>
                    <p><strong>NIT:</strong> 901269341-0</p>
                    <p><strong>Teléfonos:</strong> 3108950832 / 3153763994</p>
                    <p><strong>Email:</strong> acsolucioneshidroelectricas@gmail.com</p>
                    <p><strong>Dirección:</strong> CARRERA 23 NO. 28 - 11</p>
                </div>
            </div>

            <div class="report-title-box">
                <h2>Reporte de Mantenimiento / Equipos de Bombeo</h2>
                <div class="info-grid">
                    <div class="info-item"><strong>CLIENTE:</strong> <span>${clienteInfo.nombre || 'N/A'}</span></div>
                    <div class="info-item"><strong>FECHA:</strong> <span>${new Date(reporte.fecha).toLocaleDateString('es-CO')}</span></div>
                    <div class="info-item"><strong>DIRECCIÓN:</strong> <span>${reporte.direccion || 'N/A'}</span></div>
                    <div class="info-item"><strong>TELÉFONO:</strong> <span>${reporte.telefono || 'N/A'}</span></div>
                    <div class="info-item"><strong>ENCARGADO:</strong> <span>${reporte.encargado || 'N/A'}</span></div>
                    <div class="info-item"><strong>CIUDAD:</strong> <span>${reporte.ciudad || 'N/A'}</span></div>
                </div>
            </div>

            <div class="section-title">Equipos de Bombeo</div>
            <table>
                <thead>
                    <tr>
                        <th style="width: 15%;">Equipo</th>
                        <th style="width: 12%;">Marca</th>
                        <th style="width: 10%;">Amperaje</th>
                        <th style="width: 10%;">Presión</th>
                        <th style="width: 12%;">Temperatura</th>
                        <th style="width: 12%;">Estado</th>
                        <th style="width: 29%;">Observaciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${equipos.map(equipo => `
                        <tr>
                            <td><strong>${equipo.equipo || 'N/A'}</strong></td>
                            <td>${equipo.marca || 'N/A'}</td>
                            <td>${equipo.amperaje || 'N/A'}</td>
                            <td>${equipo.presion || 'N/A'}</td>
                            <td>${equipo.temperatura || 'N/A'}</td>
                            <td>
                                <span style="background-color: ${equipo.estado === 'Bueno' ? '#dcfce7' : '#fef08a'}; color: ${equipo.estado === 'Bueno' ? '#166534' : '#854d0e'}; padding: 3px 8px; border-radius: 12px; font-weight: 500;">
                                    ${equipo.estado || 'N/A'}
                                </span>
                            </td>
                            <td class="td-left">${equipo.observacion || 'N/A'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <div class="section-title">Parámetros Eléctricos y de Presión</div>
            <div class="params-box">
                <div class="params-grid">
                    <div class="param-item"><strong>Voltaje Línea:</strong> <span>${parametrosLinea.voltaje_linea || 'N/A'}</span></div>
                    <div class="param-item"><strong>Corriente Línea:</strong> <span>${parametrosLinea.corriente_linea || 'N/A'}</span></div>
                    <div class="param-item"><strong>Presión Succión:</strong> <span>${parametrosLinea.presion_succion || 'N/A'}</span></div>
                    <div class="param-item"><strong>Presión Descarga:</strong> <span>${parametrosLinea.presion_descarga || 'N/A'}</span></div>
                </div>
            </div>

            <div class="section-title">Observaciones de Parámetros</div>
            <div class="obs-box">
                ${parametrosLinea.observaciones || 'Sin observaciones registradas en los parámetros operativos.'}
            </div>

            <div class="section-title">Observaciones y Recomendaciones Finales</div>
            <div class="obs-box">
                ${reporte.observaciones_finales || 'No se registraron observaciones o recomendaciones adicionales para este reporte.'}
            </div>

            <div class="signatures">
                <div class="signature-box">
                    <div class="signature-line"></div>
                    <p><strong>TÉCNICO:</strong> ${tecnicoInfo.nombre || ''} ${tecnicoInfo.apellido || ''}</p>
                    <p>C.C./ID: ${tecnicoInfo.identificacion || 'N/A'}</p>
                </div>
                <div class="signature-box">
                    <div class="signature-line"></div>
                    <p><strong>CLIENTE / ENCARGADO</strong></p>
                    <p>${reporte.encargado || 'N/A'}</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;


    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setContent(htmlTemplate, { waitUntil: 'networkidle0' });
    await page.pdf({
        path: filePath,
        format: 'Letter',
        printBackground: true,
        margin: {
            top: '40px',
            bottom: '40px',
            left: '40px',
            right: '40px'
        }
    });

    await browser.close();

    return filePath;
};
