// WebSocket server with realistic simulated data for analytics dashboard
// Run with: node websocket-server.js

import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

console.log('WebSocket server running on ws://localhost:8080');

// Helper functions for generating realistic data
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min, max) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

function generateDateRange(daysBack) {
  const dates = [];
  for (let i = daysBack; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
}

// Function to generate realistic time series data
function generateTimeSeriesData(days = 30) {
  const dates = generateDateRange(days);
  return dates.map(date => {
    // Base values with some realistic patterns
    const baseRevenue = 5000 + Math.sin(dates.indexOf(date) / 5) * 2000; // Periodic pattern
    const baseUsers = 1000 + Math.cos(dates.indexOf(date) / 7) * 800; // Different periodic pattern
    const baseConversion = 2 + Math.random() * 8; // 2-10%

    return {
      date: date,
      revenue: Math.max(0, Math.floor(baseRevenue + (Math.random() - 0.5) * 1000)),
      users: Math.max(0, Math.floor(baseUsers + (Math.random() - 0.5) * 200)),
      conversion: parseFloat((baseConversion + (Math.random() - 0.5) * 2).toFixed(2))
    };
  });
}

// Function to generate realistic bar chart data
function generateBarData(months = 12) {
  const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const currentMonth = new Date().getMonth();

  return Array.from({ length: months }, (_, i) => {
    const monthIndex = (currentMonth + i) % 12;
    const monthName = monthNames[monthIndex];

    // Base seasonal patterns
    const seasonalFactor = 1 + Math.sin((monthIndex / 12) * 2 * Math.PI) * 0.3; // Seasonal variation

    return {
      name: monthName,
      revenue: Math.max(1000, Math.floor(8000 * seasonalFactor + (Math.random() - 0.3) * 3000)),
      users: Math.max(500, Math.floor(2000 * seasonalFactor + (Math.random() - 0.3) * 800)),
      conversion: parseFloat((3 + Math.random() * 7 + seasonalFactor * 2).toFixed(2))
    };
  });
}

// Function to generate realistic heatmap data
function generateHeatmapData() {
  const categories = ['Producto A', 'Producto B', 'Producto C', 'Producto D', 'Producto E'];
  const timeSlots = ['00-04', '04-08', '08-12', '12-16', '16-20', '20-24'];
  const data = [];

  categories.forEach(cat => {
    timeSlots.forEach(time => {
      data.push({
        x: time, // Time of day
        y: cat,  // Product category
        value: getRandomInt(5, 100) // Activity level
      });
    });
  });

  return data;
}

wss.on('connection', (ws) => {
  console.log('New client connected');

  // Send initial data with realistic values
  const initialData = {
    type: 'initial',
    data: {
      timeSeries: generateTimeSeriesData(30), // Last 30 days
      barData: generateBarData(12), // Last 12 months
      heatmapData: generateHeatmapData()
    }
  };

  ws.send(JSON.stringify(initialData));

  // Send periodic updates
  const interval = setInterval(() => {
    // Update only the latest data point to simulate real-time changes
    const latestTimeSeries = {
      date: new Date().toISOString().split('T')[0],
      revenue: Math.max(0, Math.floor(5000 + (Math.random() - 0.5) * 2000)),
      users: Math.max(0, Math.floor(1000 + (Math.random() - 0.5) * 400)),
      conversion: parseFloat((2 + Math.random() * 8).toFixed(2))
    };

    const updateData = {
      type: 'update',
      data: {
        timeSeries: [latestTimeSeries]
      }
    };

    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(updateData));
    }
  }, 5000); // Send update every 5 seconds

  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(interval);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});