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
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                color: #000;
                font-size: 10px;
            }
            .container {
                width: 100%;
                margin: 0 auto;
            }
            .header-table {
                width: 100%;
                margin-bottom: 10px;
            }
            .header-table td {
                vertical-align: top;
            }
            .logo-section h1 {
                color: #1e3a8a;
                font-size: 32px;
                font-weight: 900;
                margin: 0;
                letter-spacing: 1px;
            }
            .logo-section p {
                color: #1e3a8a;
                margin: 2px 0;
                font-size: 13px;
                font-weight: bold;
            }
            .contact-info {
                text-align: right;
                color: #1e3a8a;
                font-size: 13px;
                font-weight: bold;
                line-height: 1.5;
            }
            .report-title {
                text-align: center;
                background-color: transparent;
                font-size: 16px;
                font-weight: 900;
                color: #1e3a8a;
                border-top: 2px solid #1e3a8a;
                border-bottom: 2px solid #1e3a8a;
                padding: 6px;
                margin-bottom: 15px;
                letter-spacing: 1px;
            }
            .client-table {
                width: 100%;
                margin-bottom: 15px;
                color: #1e3a8a;
                font-size: 12px;
                font-weight: bold;
                border-collapse: separate;
                border-spacing: 0 8px;
            }
            .client-table td {
                border-bottom: 1px solid #1e3a8a;
            }
            .client-val {
                color: #000;
                font-weight: normal;
                margin-left: 10px;
            }
            table.data-table {
                width: 100%;
                border-collapse: collapse;
                text-align: center;
                margin-bottom: 20px;
                border: 1px solid #1e3a8a;
            }
            table.data-table th, table.data-table td {
                border: 1px solid #1e3a8a;
                padding: 4px;
            }
            table.data-table th {
                color: #1e3a8a;
                font-size: 9px;
                font-weight: bold;
            }
            .obs-box {
                width: 100%;
                min-height: 80px;
                border: 1px solid #1e3a8a;
                padding: 8px;
                margin-bottom: 40px;
                font-size: 11px;
                color: #000;
                box-sizing: border-box;
            }
            .obs-title {
                color: #1e3a8a;
                font-weight: bold;
                font-size: 11px;
                margin-bottom: 5px;
            }
            .signatures {
                display: flex;
                flex-direction: column;
                margin-top: 40px;
                margin-bottom: 20px;
            }
            .signature-box {
                width: 250px;
                border-top: 1px solid #000;
                text-align: center;
            }
            .signature-box strong {
                color: #1e3a8a;
                font-size: 12px;
            }
            .footer-text {
                text-align: center;
                color: #1e3a8a;
                font-weight: bold;
                font-size: 11px;
                margin-top: 30px;
                line-height: 1.4;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <table class="header-table">
                <tr>
                    <td style="width: 50%;">
                        <div class="logo-section">
                            <h1>A&C</h1>
                            <p>SOLUCIONES</p>
                            <p>HIDROELÉCTRICAS SAS</p>
                        </div>
                    </td>
                    <td style="width: 50%;">
                        <div class="contact-info">
                            <div>Nit. 901269341-0</div>
                            <div>3168950832 / 3155763894</div>
                            <div>aycsolucioneshidroelectricas@gmail.com</div>
                            <div>2830205 CALLE 23 No. 28 - 11</div>
                        </div>
                    </td>
                </tr>
            </table>

            <div class="report-title">
                REPORTE MANTENIMIENTO DE EQUIPOS DE BOMBEO
            </div>

            <table class="client-table">
                <tr>
                    <td style="width: 60%;">CLIENTE: <span class="client-val">${clienteInfo.nombre || 'N/A'}</span></td>
                    <td style="width: 40%;">TELÉFONO: <span class="client-val">${reporte.telefono || 'N/A'}</span></td>
                </tr>
                <tr>
                    <td>FECHA: <span class="client-val">${new Date(reporte.fecha).toLocaleDateString('es-CO')}</span></td>
                    <td>ATENCIÓN: <span class="client-val">${reporte.encargado || 'N/A'}</span></td>
                </tr>
            </table>

            <table class="data-table">
                <thead>
                    <tr>
                        <th rowspan="2" style="width: 4%;">#</th>
                        <th rowspan="2" style="width: 10%;">PRESIÓN</th>
                        <th colspan="2" style="width: 18%;">EQUIPOS EN H.P<br>SUMERGIBLES</th>
                        <th colspan="2" style="width: 18%;">AMPERAJE</th>
                        <th colspan="2" style="width: 14%;">TEMPERATURA</th>
                        <th colspan="2" style="width: 12%;">RUIDOS</th>
                        <th colspan="2" style="width: 10%;">HUMEDAD</th>
                        <th colspan="2" style="width: 14%;">CONEXIONES ELÉCTRICAS</th>
                    </tr>
                    <tr>
                        <th>MEDIDA</th>
                        <th>PLACA</th>
                        <th>MEDIDA</th>
                        <th>PLACA</th>
                        <th>NORMAL</th>
                        <th>RECALENTADA</th>
                        <th>NORMAL</th>
                        <th>FALLAS</th>
                        <th>SI</th>
                        <th>NO</th>
                        <th>NORMAL</th>
                        <th>FALLAS</th>
                    </tr>
                </thead>
                <tbody>
                    ${equipos.map((equipo, index) => {
                        // Map amperaje_estado ("Normal" / "Recalentada") to TEMPERATURA since it's the requested layout proxy
                        const isTempNormal = equipo.amperaje_estado === 'Normal' ? 'X' : '';
                        const isTempRecalENTADA = equipo.amperaje_estado === 'Recalentada' ? 'X' : '';
                    
                        return `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${equipo.presion || ''}</td>
                            <td>${equipo.sumergibles_medida || ''}</td>
                            <td>${equipo.sumergibles_placa || ''}</td>
                            <td>${equipo.amperaje_medida || ''}</td>
                            <td>${equipo.amperaje_placa || ''}</td>
                            <td><strong>${isTempNormal}</strong></td>
                            <td><strong>${isTempRecalENTADA}</strong></td>
                            <td><strong>${equipo.ruidos === 'Normal' ? 'X' : ''}</strong></td>
                            <td><strong>${equipo.ruidos === 'Fallas' ? 'X' : ''}</strong></td>
                            <td><strong>${equipo.humedad === 'Si' ? 'X' : ''}</strong></td>
                            <td><strong>${equipo.humedad === 'No' ? 'X' : ''}</strong></td>
                            <td><strong>${equipo.conexiones === 'Normal' ? 'X' : ''}</strong></td>
                            <td><strong>${equipo.conexiones === 'Fallas' ? 'X' : ''}</strong></td>
                        </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>

            <table class="data-table" style="width: 70%;">
                <thead>
                    <tr>
                        <th colspan="3">TANQUE HIDRONEUMÁTICO</th>
                        <th rowspan="2">CONTROLADOR DE VELOCIDAD<br>MARCA</th>
                    </tr>
                    <tr>
                        <th>MARCA</th>
                        <th>CARGA DETERMINADA</th>
                        <th>CARGA MEDIA</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${parametrosLinea.tanque_marca || ''}</td>
                        <td>${parametrosLinea.tanque_carga_determinada || ''}</td>
                        <td>${parametrosLinea.tanque_carga_media || ''}</td>
                        <td>${parametrosLinea.controlador_marca || ''}</td>
                    </tr>
                </tbody>
            </table>

            <div class="obs-box">
                <div class="obs-title">OBSERVACIONES:</div>
                ${reporte.observaciones_finales || ''}
            </div>

            <div class="signatures">
                <div class="signature-box">
                    <strong>TÉCNICO</strong>
                </div>
            </div>

            <div class="footer-text">
                <div>MONTAJES Y MANTENIMIENTO DE EQUIPOS DE PRESIÓN - PLANTAS ELÉCTRICAS DE EMERGENCIA</div>
                <div>SISTEMA DE REDES CONTRA INCENDIO - ADECUACIONES ELÉCTRICAS</div>
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
        landscape: true,
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
