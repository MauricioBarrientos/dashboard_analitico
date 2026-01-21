import React, { useMemo } from 'react';

interface HeatmapData {
  x: string;
  y: string;
  value: number;
}

interface HeatmapChartProps {
  data: HeatmapData[];
}

const HeatmapChart: React.FC<HeatmapChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-gray-500 dark:text-gray-400">
        No hay datos disponibles
      </div>
    );
  }

  // Calcular el valor máximo y mínimo para normalizar los colores
  const maxValue = Math.max(...data.map(d => d.value), 1);
  const minValue = Math.min(...data.map(d => d.value), 0);

  // Calcular la escala de colores
  const colorScale = useMemo(() => {
    // Obtener valores únicos en x e y para dimensionar el heatmap
    const uniqueX = [...new Set(data.map(d => d.x))].sort();
    const uniqueY = [...new Set(data.map(d => d.y))].sort();

    // Crear un mapa de datos para acceso rápido
    const dataMap = new Map();
    data.forEach(item => {
      dataMap.set(`${item.x}-${item.y}`, item);
    });

    return { uniqueX, uniqueY, dataMap };
  }, [data]);

  // Función para obtener color basado en el valor
  const getColor = (value: number) => {
    // Normalizar el valor entre 0 y 1
    const normalized = minValue === maxValue ? 0.5 : (value - minValue) / (maxValue - minValue);

    // Crear una escala de color profesional (de azul oscuro a rojo claro)
    // con gradientes suaves para una apariencia más profesional
    const hue = 240 - (normalized * 240); // 240=azul, 0=rojo
    return `hsl(${hue}, 100%, ${50 - (normalized * 20)}%)`;
  };

  // Calcular el valor medio para mostrar números selectivamente
  const averageValue = data.reduce((sum, entry) => sum + entry.value, 0) / data.length;

  return (
    <div className="w-full p-2">
      {/* Título y metadatos */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Mapa de Calor</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">Actividad por producto y horario</p>
      </div>

      <div className="flex">
        {/* Eje Y (filas) - Etiquetas de productos */}
        <div className="flex flex-col items-end mr-2">
          <div className="h-6"></div> {/* Espacio para encabezado de X */}
          {colorScale.uniqueY.map((y, yIndex) => (
            <div
              key={yIndex}
              className="h-12 w-24 text-right pr-2 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 truncate"
              style={{ lineHeight: '1.2' }}
            >
              {y}
            </div>
          ))}
        </div>

        {/* Cuerpo del heatmap */}
        <div className="flex-1">
          {/* Eje X (columnas) - Etiquetas de tiempo */}
          <div className="flex mb-1">
            <div className="w-24"></div> {/* Espacio para etiquetas Y */}
            {colorScale.uniqueX.map((x, xIndex) => (
              <div
                key={xIndex}
                className="flex-1 text-center text-xs font-medium text-gray-600 dark:text-gray-400 py-1 truncate"
              >
                {x}
              </div>
            ))}
          </div>

          {/* Celdas del heatmap */}
          <div className="relative">
            {colorScale.uniqueY.map((y, yIndex) => (
              <div key={yIndex} className="flex h-12">
                <div className="w-24"></div> {/* Espacio para etiquetas Y */}
                {colorScale.uniqueX.map((x, xIndex) => {
                  const dataKey = `${x}-${y}`;
                  const cellData = colorScale.dataMap.get(dataKey);
                  const hasData = !!cellData;
                  const value = hasData ? cellData.value : 0;
                  const color = hasData ? getColor(value) : '#e5e7eb';
                  const displayValue = hasData && value > averageValue * 0.5 ? value : '';

                  return (
                    <div
                      key={xIndex}
                      className={`
                        flex-1 border border-gray-200 dark:border-gray-700 flex items-center justify-center
                        transition-all duration-200 ease-in-out transform hover:scale-105 hover:z-10
                        hover:shadow-lg relative
                        ${!hasData ? 'bg-gray-100 dark:bg-gray-800' : ''}
                      `}
                      style={{
                        backgroundColor: color,
                        minHeight: '48px'
                      }}
                      title={`${y} - ${x}: ${value}`}
                    >
                      {displayValue && (
                        <span className="text-xs font-bold text-white drop-shadow-sm z-10">
                          {displayValue}
                        </span>
                      )}
                      {/* Efecto de brillo en hover */}
                      <div className="absolute inset-0 bg-white opacity-0 hover:opacity-20 transition-opacity rounded-sm"></div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Leyenda profesional */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Bajo</span>
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Alto</span>
        </div>
        <div className="h-4 w-full rounded-full overflow-hidden flex">
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={i}
              className="h-full"
              style={{
                width: '1%',
                backgroundColor: getColor(minValue + (maxValue - minValue) * (i / 100))
              }}
            ></div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>{minValue}</span>
          <span>{maxValue}</span>
        </div>
      </div>

      {/* Indicador de estado */}
      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
        {data.length} datos • Rango: {minValue} - {maxValue}
      </div>
    </div>
  );
};

export default HeatmapChart;