/* eslint-disable react/prop-types */
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Colors,
} from "chart.js";
import { Line } from "react-chartjs-2";
import useTheme from "../../hooks/Themehook";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Colors
);

export default function LineGraph({ dataSet }) {
  let theme = useTheme();

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        ticks: {
          color: theme.textColor,
        },
      },
      x: {
        ticks: {
          color: theme.textColor,
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: theme.textColor,
          font: {
            size: 14,
          },
        },
      },
    },
  };
  return <Line options={options} data={dataSet} className="min-h-[400px]" />;
}
