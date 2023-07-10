'use client'

import { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

export default function Home() {
  const [selectedOption, setSelectedOption] = useState('');
  const [chart, setChart] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (chart && canvasRef.current) {
      const feminicidioSum = chart.data.datasets[0].data[0];
      const tentativaFeminicidioSum = chart.data.datasets[0].data[1];

      chart.data.datasets[0].data = [feminicidioSum, tentativaFeminicidioSum];
      chart.update();
    }
  }, [chart]);

  useEffect(() => {
    if (chart) {
      chart.destroy();
    }

    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');

      const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              display: false,
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      };

      const newChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Feminicídio', 'Tentativa de Feminicídio'],
          datasets: [
            {
              label: 'Total',
              data: [0, 0],
              backgroundColor: ['rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.5)'],
              borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
              borderWidth: 1,
            },
          ],
        },
        options: options,
      });

      setChart(newChart);
    }
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const data = await fetchData(selectedOption);
    updateChartData(data);
  };

  const updateChartData = (data) => {
    if (chart && canvasRef.current) {
      const feminicidioSum = data.reduce((acc, item) => acc + parseInt(item.feminicidio), 0);
      const tentativaFeminicidioSum = data.reduce((acc, item) => acc + parseInt(item.feminicidio_tentativa), 0);

      chart.data.datasets[0].data = [feminicidioSum, tentativaFeminicidioSum];
      chart.update();
    }
  };

  const fetchData = async (option) => {
    const response = await fetch(`https://isp-project-server.onrender.com/ano/${option}`);
    const data = await response.json();
    return data;
  };

  const options = [
    { label: '2016', value: '2016' },
    { label: '2017', value: '2017' },
    { label: '2018', value: '2018' },
    { label: '2019', value: '2019' },
    { label: '2020', value: '2020' },
    { label: '2021', value: '2021' },
    { label: '2022', value: '2022' },
  ];

  const handleChange = (e) => {
    setSelectedOption(e.target.value);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white py-4 px-8 shadow-md">
        <h1 className="text-2xl font-bold text-gray-800">ISP Gráfico de Feminicídio Anual</h1>
      </header>
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center mb-4">
          <form onSubmit={handleFormSubmit} className="flex items-center space-x-4">
            <select
              value={selectedOption}
              onChange={handleChange}
              className="block appearance-none py-2 px-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Selecione uma opção</option>
              {options &&
                options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
            </select>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Enviar
            </button>
          </form>
        </div>
        <div className="w-full bg-white p-4 rounded-md shadow-md">
          <canvas ref={canvasRef} className="w-full h-72"></canvas>
        </div>
      </div>
    </div>
  );
}
