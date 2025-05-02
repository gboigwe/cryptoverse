import React, { useMemo } from 'react';
import { Col, Row, Typography } from 'antd';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import millify from 'millify';

const { Title } = Typography;

// Register Chart.js components we need (for better tree-shaking)
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
  Tooltip,
  Legend,
  Filler
);

const LineChart = ({ coinHistory, currentPrice, coinName }) => {
  // Use memoization to avoid recalculating chart data on every render
  const { coinPrice, coinTimestamp, data, options } = useMemo(() => {
    const coinPrice = [];
    const coinTimestamp = [];

    // Process history data
    for (let i = 0; i < coinHistory?.data?.history?.length; i += 1) {
      coinPrice.push(coinHistory?.data?.history[i].price);
      
      // Format the timestamp to a readable date
      const timestamp = new Date(coinHistory?.data?.history[i].timestamp * 1000); // Convert to milliseconds if needed
      coinTimestamp.push(timestamp.toLocaleDateString());
    }

    // Reverse arrays for chronological order
    coinPrice.reverse();
    coinTimestamp.reverse();

    // Chart configuration
    const data = {
      labels: coinTimestamp,
      datasets: [
        {
          label: 'Price in USD',
          data: coinPrice,
          fill: true,
          backgroundColor: 'rgba(0, 113, 189, 0.1)',
          borderColor: '#0071bd',
          pointRadius: 2,
          pointHoverRadius: 5,
          tension: 0.4, // Smooth curve
          borderWidth: 2,
        },
      ],
    };

    // Chart options
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          align: 'end',
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD'
                }).format(context.parsed.y);
              }
              return label;
            }
          }
        },
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
      },
      scales: {
        x: {
          grid: {
            display: false,
            drawBorder: false,
          },
          ticks: {
            maxRotation: 0,
            maxTicksLimit: 8,
          },
        },
        y: {
          beginAtZero: false,
          ticks: {
            callback: function(value) {
              return '$' + millify(value);
            },
          },
          grid: {
            borderDash: [5, 5],
          },
        },
      },
    };

    return { coinPrice, coinTimestamp, data, options };
  }, [coinHistory]);

  return (
    <>
      <Row className="chart-header">
        <Title level={2} className="chart-title">
          {coinName} Price Chart
        </Title>
        <Col className="price-container">
          <Title level={5} className="price-change">
            Change: <span style={{ color: coinHistory?.data?.change > 0 ? 'green' : 'red' }}>
              {coinHistory?.data?.change}%
            </span>
          </Title>
          <Title level={5} className="current-price">
            Current {coinName} Price: ${millify(currentPrice)}
          </Title>
        </Col>
      </Row>
      
      <div style={{ height: '400px', width: '100%' }}>
        <Line data={data} options={options} />
      </div>
    </>
  );
};

export default LineChart;























// import React from 'react';
// import { Line } from 'react-chartjs-2';
// import { Col, Row, Typography } from 'antd';

// const { Title } = Typography;

// const LineChart = ({ coinHistory, currentPrice, coinName }) => {
//   const coinPrice = [];
//   const coinTimestamp = [];

//   for (let i = 0; i < coinHistory?.data?.history?.length; i += 1) {
//     coinPrice.push(coinHistory?.data?.history[i].price);
//   }

//   for (let i = 0; i < coinHistory?.data?.history?.length; i += 1) {
//     coinTimestamp.push(new Date(coinHistory?.data?.history[i].timestamp).toLocaleDateString());
//   }
//   const data = {
//     labels: coinTimestamp,
//     datasets: [
//       {
//         label: 'Price In USD',
//         data: coinPrice,
//         fill: false,
//         backgroundColor: '#0071bd',
//         borderColor: '#0071bd',
//       },
//     ],
//   };

//   const options = {
//     scales: {
//       yAxes: [
//         {
//           ticks: {
//             beginAtZero: true,
//           },
//         },
//       ],
//     },
//   };

//   return (
//     <>
//       <Row className="chart-header">
//         <Title level={2} className="chart-title">{coinName} Price Chart </Title>
//         <Col className="price-container">
//           <Title level={5} className="price-change">Change: {coinHistory?.data?.change}%</Title>
//           <Title level={5} className="current-price">Current {coinName} Price: $ {currentPrice}</Title>
//         </Col>
//       </Row>
//       <Line data={data} options={options} />
//     </>
//   );
// };

// export default LineChart;
