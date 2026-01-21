import { useState } from 'react';

// Hook para manejar la exportación de reportes
export const useReportExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Función para exportar a CSV
  const exportToCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) return;

    // Obtener los encabezados
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');

    // Crear y descargar el archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Función para exportar a Excel (simulando con CSV)
  const exportToExcel = (data: any[], filename: string) => {
    exportToCSV(data, filename);
    // Nota: Para una verdadera exportación a Excel, se necesitaría una biblioteca como xlsx
  };

  // Función para exportar a PDF (muy simplificada, en una implementación real usarías jsPDF o similar)
  const exportToPDF = (data: any[], title: string, includeCharts: boolean, includeTables: boolean) => {
    // En una implementación real, usarías jsPDF o similar para crear un PDF real
    // Por ahora, simulamos creando un archivo de texto con la información
    
    let content = `Reporte: ${title}\n\n`;
    content += `Fecha: ${new Date().toLocaleString()}\n\n`;
    
    if (includeTables && data) {
      content += 'Datos:\n';
      content += JSON.stringify(data, null, 2);
    }
    
    // En una implementación real, esto usaría jsPDF para crear un PDF con gráficos y tablas
    const blob = new Blob([content], { type: 'application/pdf' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${title.replace(/\s+/g, '_')}.pdf`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportReport = async (data: any, title: string, options: any) => {
    setIsExporting(true);

    try {
      // Simular un pequeño delay para mostrar el estado de carga
      await new Promise(resolve => setTimeout(resolve, 500));

      switch (options.format) {
        case 'csv':
          exportToCSV(data, title.replace(/\s+/g, '_'));
          break;
        case 'excel':
          exportToExcel(data, title.replace(/\s+/g, '_'));
          break;
        case 'pdf':
          exportToPDF(data, title, options.includeCharts, options.includeTables);
          break;
        default:
          throw new Error('Formato de exportación no soportado');
      }
    } catch (error) {
      console.error('Error al exportar el reporte:', error);
      alert('Hubo un error al exportar el reporte. Por favor, inténtalo de nuevo.');
    } finally {
      setIsExporting(false);
    }
  };

  return {
    isExporting,
    showExportModal,
    setShowExportModal,
    exportReport
  };
};