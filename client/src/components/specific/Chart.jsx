import React from 'react'
import {Line,Doughnut} from "react-chartjs-2"
import {
  Chart as Chartjs,
  Tooltip,
  Filler,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Legend,
  scales,} from "chart.js"
import { orange, purple, purplelight } from '../../constants/Color';
import { getLast7Days } from '../../lib/Filefeature';
import { ContentCutOutlined } from '@mui/icons-material';

Chartjs.register(Tooltip,
  Filler,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Legend)


  const labels=getLast7Days();

  const lineChartOptions = {
    responsive: true,
    plugins: {
        legend: {
            display: false,
        },
        title: {
            display: false,
        },
    },
    scales:{
      x:{
        grid:{
          display:false
        }
      },
      y:{
        beginAtZero:true,
        grid:{
          display:false
        }
      }
    }
};


const LineChart = ({value=[]}) => {
  const data = {
  labels,
  datasets: [
    {
    data: value,
    label: "Revenue",
    fill: false,
    backgroundColor:{purplelight},
    borderColor: {purple},
    }
    ],
  };
  return <Line data={data} options={lineChartOptions} />;
  };

  const DoughtnutChartOptions = {
    responsive: true,
    plugins: {
        legend: {
            display: false,
        },
        title: {
            display: false,
        },
    },
    cutout:120
    
};

const DoughnutChart=({labels=[],value=[]})=>{
  const data = {
    labels,
    datasets: [
      {
      data: value,
      label: "Revenue",
      fill: false,
      backgroundColor: [purplelight,orange],
      borderColor: [purple,orange],
      offset:10
      }
      ],
    };
    return (
        <Doughnut style={{
          zIndex:10
        }} data={data} options={DoughtnutChartOptions}/>
      )
}
export {LineChart,DoughnutChart}