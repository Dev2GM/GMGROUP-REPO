import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface ClientData {
  nombre: string;
  apellido: string;
  cedula: string;
  fecha_nacimiento: string;
  departamento: string;
  ciudad: string;
  domicilio: string;
  telefono: string;
  email: string;
  puntos: string;
  es_cliente: boolean;
}

interface Activity {
  fecha: string;
  actividad: string;
  mensaje: string;
  usuario: string;
}

interface Policy {
  numero: string;
  compania: string;
  estado: string;
  inicio: string;
  fin: string;
  moneda: string;
  precio: string;
}

// Función para generar el HTML del reporte
const generateReportHTML = (
  clientData: ClientData,
  activities: Activity[],
  policies: Policy[],
  observations: string
): string => {
  return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="utf-8">
        <title>Reporte de Cliente - ${clientData.nombre} ${
    clientData.apellido
  }</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body { 
            font-family: 'Nunito', 'Roboto', sans-serif;
            line-height: 1.6;
            color: #1e1e1e;
            background: #fff;
            padding: 60px;
            max-width: 700px;
            margin: 0 auto;
          }
          
          .header {
            text-align: center;
            margin-bottom: 50px;
            padding-bottom: 30px;
            border-bottom: 2px solid #0096ff;
          }
          
          .header h1 {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 15px;
            text-transform: uppercase;
            color: #0096ff;
          }
          
          .header .subtitle {
            font-size: 14px;
            color: #1e1e1e;
          }
          
          .client-info {
            background: #e6f0fa;
            padding: 30px;
            margin-bottom: 40px;
            border-left: 4px solid #0096ff;
            border-radius: 8px;
          }
          
          .client-name {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 20px;
            text-align: center;
            color: #0096ff;
          }
          
          .basic-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            font-size: 12px;
          }
          
          .info-row {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
          }
          
          .info-label {
            font-weight: bold;
            width: 120px;
            color: #0096ff;
          }
          
          .info-value {
            flex: 1;
            text-align: left;
            color: #1e1e1e;
          }
          
          .section {
            margin-bottom: 40px;
          }
          
          .section-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 20px;
            padding-bottom: 8px;
            border-bottom: 2px solid #0096ff;
            text-transform: uppercase;
            color: #0096ff;
          }
          
          .two-column {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
          }
          
          .subsection {
            margin-bottom: 25px;
            background: #e6f0fa;
            padding: 15px;
            border-radius: 6px;
            border-left: 3px solid #0096ff;
          }
          
          .subsection-title {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 12px;
            color: #0096ff;
          }
          
          .simple-list {
            font-size: 12px;
            line-height: 1.6;
          }
          
          .simple-list li {
            margin-bottom: 6px;
            list-style-type: disc;
            margin-left: 20px;
            color: #1e1e1e;
          }
          
          .simple-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11px;
            margin-top: 15px;
            border-radius: 6px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }
          
          .simple-table th {
            background: #0096ff;
            color: white;
            padding: 12px 8px;
            text-align: left;
            font-weight: bold;
            border: none;
            text-transform: uppercase;
            font-size: 10px;
            letter-spacing: 0.5px;
          }
          
          .simple-table td {
            padding: 10px 8px;
            border: 1px solid #e6f0fa;
            vertical-align: top;
            color: #1e1e1e;
          }
          
          .simple-table tr:nth-child(even) {
            background: #e6f0fa;
          }
          
          .simple-table tr:hover {
            background: #e6f0fa;
          }
          
          .status-active {
            font-weight: bold;
            background: #4caf50;
            color: white;
            padding: 3px 8px;
            border-radius: 4px;
          }
          
          .status-inactive {
            font-weight: bold;
            background: #1e1e1e;
            color: white;
            padding: 3px 8px;
            border-radius: 4px;
          }
          
          .observations-text {
            background: #e6f0fa;
            padding: 20px;
            border: 2px solid #0096ff;
            border-left: 4px solid #0096ff;
            font-size: 12px;
            white-space: pre-line;
            margin-top: 15px;
            line-height: 1.6;
            color: #1e1e1e;
            border-radius: 6px;
          }
          
          .footer {
            margin-top: 50px;
            padding-top: 25px;
            border-top: 2px solid #0096ff;
            font-size: 10px;
            color: #1e1e1e;
            text-align: center;
            background: #e6f0fa;
            padding: 20px;
            border-radius: 6px;
          }
          
          .empty-content {
            font-style: italic;
            color: #1e1e1e;
            font-size: 12px;
            text-align: center;
            padding: 25px;
            background: #e6f0fa;
            border: 2px dashed #0096ff;
            border-radius: 6px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Informe de Cliente</h1>
          <div class="subtitle">Generado el ${new Date().toLocaleDateString(
            "es-UY"
          )} - ${new Date().toLocaleTimeString("es-UY")}</div>
        </div>

        <div class="client-info">
          <div class="client-name">${clientData.nombre} ${
    clientData.apellido
  }</div>
          <div class="basic-info">
            <div class="info-row">
              <span class="info-label">Documento:</span>
              <span class="info-value">${clientData.cedula}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Teléfono:</span>
              <span class="info-value">${clientData.telefono}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Email:</span>
              <span class="info-value">${clientData.email}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Ciudad:</span>
              <span class="info-value">${clientData.ciudad}, ${
    clientData.departamento
  }</span>
            </div>
            <div class="info-row">
              <span class="info-label">Domicilio:</span>
              <span class="info-value">${clientData.domicilio}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Puntos:</span>
              <span class="info-value">${clientData.puntos}</span>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Información General</div>
          <div class="two-column">
            <div class="subsection">
              <div class="subsection-title">Datos del Cliente</div>
              <ul class="simple-list">
                <li>Fecha de nacimiento: ${
                  clientData.fecha_nacimiento || "No especificado"
                }</li>
                <li>Estado: ${
                  clientData.es_cliente ? "Cliente activo" : "Prospecto"
                }</li>
                <li>Pólizas activas: ${
                  policies.filter((p) => p.estado === "Activa").length
                }</li>
                <li>Total de pólizas: ${policies.length}</li>
              </ul>
            </div>
            
            <div class="subsection">
              <div class="subsection-title">Resumen de Actividad</div>
              <ul class="simple-list">
                <li>Registros de actividad: ${activities.length}</li>
                <li>Última actividad: ${
                  activities.length > 0 ? activities[0].fecha : "Sin actividad"
                }</li>
                <li>Puntos acumulados: ${clientData.puntos}</li>
                <li>Observaciones registradas: ${
                  observations ? "Sí" : "No"
                }</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Pólizas de Seguros</div>
          ${
            policies.length > 0
              ? `
            <table class="simple-table">
              <thead>
                <tr>
                  <th>Número</th>
                  <th>Compañía</th>
                  <th>Estado</th>
                  <th>Vigencia</th>
                  <th>Precio</th>
                </tr>
              </thead>
              <tbody>
                ${policies
                  .map(
                    (policy) => `
                  <tr>
                    <td>${policy.numero}</td>
                    <td>${policy.compania}</td>
                    <td class="${
                      policy.estado === "Activa" ? "status-active" : ""
                    }">${policy.estado}</td>
                    <td>${policy.inicio} - ${policy.fin}</td>
                    <td>${policy.precio}</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          `
              : '<div class="empty-content">No hay pólizas registradas</div>'
          }
        </div>

        <div class="section">
          <div class="section-title">Registro de Actividades</div>
          ${
            activities.length > 0
              ? `
            <table class="simple-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Tipo</th>
                  <th>Descripción</th>
                  <th>Usuario</th>
                </tr>
              </thead>
              <tbody>
                ${activities
                  .map(
                    (activity) => `
                  <tr>
                    <td>${activity.fecha}</td>
                    <td>${activity.actividad}</td>
                    <td>${activity.mensaje}</td>
                    <td>${activity.usuario}</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          `
              : '<div class="empty-content">No hay actividades registradas</div>'
          }
        </div>

        ${
          observations
            ? `
          <div class="section">
            <div class="section-title">Observaciones</div>
            <div class="observations-text">${observations}</div>
          </div>
        `
            : ""
        }

        <div class="footer">
          <p>Sistema de Gestión de Clientes</p>
          <p>Documento generado automáticamente - ${new Date().toLocaleDateString(
            "es-UY"
          )} ${new Date().toLocaleTimeString("es-UY")}</p>
        </div>
      </body>
    </html>
  `;
};

// Función principal para generar PDF
export const generateClientReport = async (
  clientData: ClientData,
  activities: Activity[],
  policies: Policy[],
  observations: string
) => {
  try {
    // Generar el HTML del reporte
    const htmlContent = generateReportHTML(
      clientData,
      activities,
      policies,
      observations
    );

    // Crear elemento temporal con el HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    tempDiv.style.position = "fixed";
    tempDiv.style.top = "-9999px";
    tempDiv.style.left = "-9999px";
    tempDiv.style.width = "794px"; // A4 width
    tempDiv.style.background = "white";
    tempDiv.style.zIndex = "-1000";

    // Agregar al DOM temporalmente
    document.body.appendChild(tempDiv);

    // Esperar un momento para que se renderice
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Convertir HTML a canvas
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      width: 794,
      height: tempDiv.scrollHeight,
      windowWidth: 794,
      windowHeight: tempDiv.scrollHeight,
    });

    // Remover elemento temporal
    document.body.removeChild(tempDiv);

    // Crear PDF
    const pdf = new jsPDF("p", "mm", "a4");
    const imgData = canvas.toDataURL("image/png", 1.0);

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(
      pdfWidth / (imgWidth * 0.264583),
      pdfHeight / (imgHeight * 0.264583)
    );

    const finalWidth = imgWidth * 0.264583 * ratio;
    const finalHeight = imgHeight * 0.264583 * ratio;

    // Calcular posición centrada
    const x = (pdfWidth - finalWidth) / 2;
    const y = 10; // Margen superior

    pdf.addImage(imgData, "PNG", x, y, finalWidth, finalHeight);

    // Generar blob y abrir en nueva pestaña
    const pdfBlob = pdf.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);

    // Abrir en nueva pestaña
    window.open(pdfUrl, "_blank");

    // Limpiar URL después de un tiempo
    setTimeout(() => URL.revokeObjectURL(pdfUrl), 30000);
  } catch (error) {
    console.error("Error generando PDF:", error);

    // Fallback: abrir HTML en nueva pestaña
    const htmlContent = generateReportHTML(
      clientData,
      activities,
      policies,
      observations
    );
    const newWindow = window.open("", "_blank");
    if (newWindow) {
      newWindow.document.write(htmlContent);
      newWindow.document.close();
    }
  }
};
