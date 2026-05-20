import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import puppeteer from 'puppeteer';
import {
  ITEMS_VERIFICACION_MANTENIMIENTO,
  normalizarItemVerificacion
} from '../utils/reporte_mantenimiento.constants.js';

export const generarPDFReporte = async (reporte, clienteInfo, tecnicoInfo, parametros, verificaciones) => {
  const randomString = crypto.randomBytes(8).toString('hex');
  const filename = `reporte_mantenimiento_${randomString}.pdf`;
  const folderPath = path.join('uploads', 'reportes');
  const filePath = path.join(folderPath, filename);

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  const verificacionesPorItem = new Map();
  (verificaciones || []).forEach((v) => {
    verificacionesPorItem.set(normalizarItemVerificacion(v?.item), v);
  });

  const verificacionesOrdenadas = ITEMS_VERIFICACION_MANTENIMIENTO.map((item) => {
    const actual = verificacionesPorItem.get(normalizarItemVerificacion(item));
    return {
      item,
      visto: actual?.visto ?? true,
      observacion: actual?.observacion || ''
    };
  });

  const fechaFormat = reporte?.fecha ? new Date(reporte.fecha).toLocaleDateString('es-CO') : 'N/A';

  // Helper para manejar las firmas en base64
  const renderSignature = (firmaDataUrl) => {
    if (firmaDataUrl && firmaDataUrl.startsWith('data:image')) {
      return `<img src="${firmaDataUrl}" alt="Firma" style="max-height: 50px; max-width: 150px; object-fit: contain;">`;
    }
    return '';
  };

  const htmlTemplate = `
  <!DOCTYPE html>
  <html lang="es">
  <head>
      <meta charset="UTF-8">
      <title>Reporte de Mantenimiento</title>
      <style>
          @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
          
          body {
              font-family: 'Roboto', sans-serif;
              margin: 0;
              padding: 10px;
              color: #000;
              font-size: 11px;
              line-height: 1.2;
          }
          
          .container {
              width: 100%;
              max-width: 800px;
              margin: 0 auto;
              border: 1px solid #1f4e79;
              padding: 15px;
              box-sizing: border-box;
          }

          /* Header Styling */
          .header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-bottom: 20px;
          }
          .logo-area {
              width: 40%;
          }
          .logo-area h1 {
              color: #1f4e79;
              font-size: 18px;
              margin: 0;
              line-height: 1.1;
          }
          .logo-area h2 {
              color: #1f4e79;
              font-size: 14px;
              margin: 0;
          }
          .contact-area {
              width: 55%;
              text-align: right;
              color: #1f4e79;
              font-weight: bold;
              font-size: 12px;
          }
          .contact-area p {
              margin: 3px 0;
          }

          /* Title */
          .title-box {
              border: 1px solid #1f4e79;
              text-align: center;
              padding: 5px;
              margin-bottom: 10px;
              font-weight: bold;
              color: #1f4e79;
              font-size: 14px;
          }

          /* Tables */
          table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 10px;
          }
          th, td {
              border: 1px solid #1f4e79;
              padding: 4px 6px;
              vertical-align: middle;
          }
          th {
              background-color: #f0f4f8;
              color: #1f4e79;
              font-weight: bold;
              text-align: center;
              font-size: 10px;
          }
          .label-cell {
              font-weight: bold;
              width: 15%;
          }
          .value-cell {
              width: 35%;
          }

          /* Signature Area */
          .signatures-container {
              display: flex;
              justify-content: space-between;
              margin-top: 30px;
          }
          .signature-box {
              width: 45%;
          }
          .sign-line {
              border-top: 1px solid #000;
              margin-top: 40px;
              padding-top: 5px;
              text-align: center;
              font-weight: bold;
              font-size: 10px;
          }
          
          .observations-box {
              border: none;
              padding: 5px;
              min-height: 50px;
          }

          /* Footer */
          .footer {
              text-align: center;
              font-weight: bold;
              color: #1f4e79;
              font-size: 10px;
              margin-top: 20px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <!-- Header -->
          <div class="header">
              <div class="logo-area">
                  <h1>A&C</h1>
                  <h2>SOLUCIONES HIDROELÉCTRICAS SAS</h2>
              </div>
              <div class="contact-area">
                  <p>Nit. 901269341-0</p>
                  <p>3168950832 / 3155763894</p>
                  <p>aycsolucioneshidroelectricas@gmail.com</p>
                  <p>2830205 CALLE 23 No. 28 - 11</p>
              </div>
          </div>

          <!-- Title -->
          <div class="title-box">
              MANTENIMIENTO DE EQUIPOS
          </div>

          <!-- General Info Table -->
          <table>
              <tr>
                  <td class="label-cell">FECHA</td>
                  <td class="value-cell">${fechaFormat}</td>
                  <td class="label-cell">ENCARGADO(A):</td>
                  <td class="value-cell">${reporte?.encargado || 'N/A'}</td>
              </tr>
              <tr>
                  <td class="label-cell">CLIENTE</td>
                  <td class="value-cell">${clienteInfo?.nombre || 'N/A'}</td>
                  <td class="label-cell">DIRECCIÓN:</td>
                  <td class="value-cell">${reporte?.direccion || 'N/A'}</td>
              </tr>
              <tr>
                  <td class="label-cell">CIUDAD</td>
                  <td class="value-cell">${reporte?.ciudad || 'N/A'}</td>
                  <td class="label-cell">TELÉFONO:</td>
                  <td class="value-cell">${reporte?.telefono || clienteInfo?.telefono || 'N/A'}</td>
              </tr>
          </table>

          <!-- Generator Info Table -->
          <table>
              <tr>
                  <td class="label-cell">GENERADOR:</td>
                  <td>${reporte?.generador || ''}</td>
                  <td class="label-cell">MARCA:</td>
                  <td>${reporte?.marca_generador || ''}</td>
                  <td class="label-cell">KVA:</td>
                  <td>${reporte?.kva || ''}</td>
              </tr>
              <tr>
                  <td class="label-cell">MOTOR:</td>
                  <td>${reporte?.motor || ''}</td>
                  <td class="label-cell">MODELO:</td>
                  <td>${reporte?.modelo_generador || ''}</td>
                  <td class="label-cell">SERIE:</td>
                  <td>${reporte?.serie_generador || ''}</td>
              </tr>
          </table>

          <!-- Verifications Table -->
          <table>
              <tr>
                  <th style="width: 40%;">VERIFICACION</th>
                  <th style="width: 10%;">VISTO</th>
                  <th style="width: 50%;">OBSERVACIONES</th>
              </tr>
              ${verificacionesOrdenadas.map(v => `
                  <tr>
                      <td style="font-weight: bold; font-size: 10px;">${v.item}</td>
                      <td style="text-align: center; color: ${v.visto ? 'green' : 'red'};">
                          ${v.visto ? 'OK' : 'NO'}
                      </td>
                      <td>${v.observacion || ''}</td>
                  </tr>
              `).join('')}
          </table>

          <!-- Signatures & Observations -->
          <div class="signatures-container" style="page-break-before: always; padding-top: 20px;">
              <div class="signature-box">
                  <div style="height: 40px; display: flex; justify-content: center; align-items: end;">
                      ${renderSignature(reporte?.firma_tecnico)}
                  </div>
                  <div class="sign-line">TÉCNICO</div>
                  <div class="observations-box">
                      <strong>OBSERVACIONES Y RECOMENDACIONES:</strong>
                      <p>${reporte?.observaciones_finales || ''}</p>
                  </div>
              </div>
              
              <div class="signature-box" style="display: flex; flex-direction: column; justify-content: flex-end;">
                  <div style="height: 40px; display: flex; justify-content: center; align-items: end;">
                      ${renderSignature(reporte?.firma_recibido)}
                  </div>
                 <div class="sign-line">RECIBIDO</div>
              </div>
          </div>

          <div class="footer">
              MONTAJES Y MANTENIMIENTO DE EQUIPOS DE PRESIÓN - PLANTAS ELÉCTRICAS DE EMERGENCIA<br>
              SISTEMA DE REDES CONTRA INCENDIO - ADECUACIONES ELÉCTRICAS
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