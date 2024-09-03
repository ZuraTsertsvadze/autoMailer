const { createCanvas} = require("canvas");
import Chart from 'chart.js/auto'
import { ChartConfiguration } from 'chart.js';

import fs from "fs";

interface Data {
  name: string;
  lastName: string;
  email: string;
  id: number | string;
  matrix: { [key: string]: string };
}


const chart=(data:Data|undefined)=>{
  if(!data)return
console.log(data,'from chart')

const dataKeys=Object.keys(data. matrix)
const dataValues=Object.values(data. matrix).map((el)=>{
  return parseInt(el)
})



    // Dimensions for the image
const width = 938;
const height =533;

// Instantiate the canvas object
const canvas = createCanvas(width, height);
const ctx = canvas.getContext("2d");


const backgroundColorPlugin = {
    id: 'custom_canvas_background_color',
    beforeDraw: (chart: Chart) => {
        const ctx = chart.canvas.getContext('2d');
        if (!ctx) return;
    
        // Save the current context state
        ctx.save();
        
        // Define the radial gradient
        const gradient = ctx.createRadialGradient(
          chart.width / 2, // Start X
          chart.height / 2, // Start Y
          0, // Start radius
          chart.width / 2, // End X
          chart.height / 2, // End Y
          Math.max(chart.width, chart.height) // End radius
        );
         
        gradient.addColorStop(0.4, 'rgba(45,45,45,1)');
        gradient.addColorStop(0, 'rgba(70,70,70,1)');
    
        // Set the gradient as the fill style
        ctx.globalCompositeOperation = 'destination-over';
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, chart.width, chart.height);
    
        // Restore the previous context state
        ctx.restore();
      },
  };


  const pointLabelPlugin = {
    id: 'pointLabelPlugin',
    afterDatasetsDraw: (chart:Chart) => {
      const ctx = chart.ctx;
      chart.data.datasets.forEach((dataset, datasetIndex) => {
        const meta = chart.getDatasetMeta(datasetIndex);
        meta.data.forEach((point, index) => {
          const { x, y } = point.tooltipPosition(true); // Pass true for useFinalPosition
          ctx.fillStyle = 'rgb(244, 177, 144)'; // Set the text color
          ctx.font = '13px Arial'; // Set the font style and size
          ctx.fillText(String(dataset.data[index]), x, y - 10); // Draw the value above the point
        });
      });
    },
  };


const configuration: ChartConfiguration<'radar'> = {
  type: "radar",
  data: {
    labels:dataKeys,
    datasets: [
      {
        label: "ბიზნეს პროცესების განვითარების დონეები",
        data: dataValues,
        backgroundColor: "rgba(54, 162, 235, 0.2)", // Area inside the radar line
        borderColor: "rgb(54, 162, 235)", // Color of the radar line itself
        pointBackgroundColor: "rgb(54, 162, 235)", // Color of the points on the radar line
        pointBorderColor: "rgb(54, 162, 235)",
      },
    ],
  },
  options: {
    responsive: true, // Ensure chart is responsive
    maintainAspectRatio: true,
    aspectRatio: 2,
    scales: {
      r: {
        angleLines: {
          display: false,
        },
        suggestedMin: 0,
        suggestedMax: 5,
        ticks: {
          stepSize: 1,
          color: "#ffffff",
          backdropColor: "rgba(0, 0, 0, 0)",
          font: {
            size: 15,
          },
        },
        pointLabels: {
          color: "#ffffff", // Color of the point labels (labels around the chart)
          font: {
            size: 13,
          },
        },
        grid: {
          color: "#ffffff", // Color of the grid lines
        },
      },
    },
    plugins: {
      legend: {
        display:false,
        position: "top",
        labels: {
          color: "#ffffff", // Color of the legend text
          font: {
            size: 16,
          },
        },
      },
      title: {
        display: true,
        color: "#ffffff",
        text: "ბიზნეს პროცესების განვითარების დონეები",
        font: {
          size: 20,
        },
      },
    },
 },
  plugins: [backgroundColorPlugin,pointLabelPlugin],
};



const chart = new Chart(ctx, configuration);



(() => {
    const imageBuffer = canvas.toBuffer('image/jpeg');
    fs.writeFileSync('./assets/chart.jpeg', imageBuffer);
    console.log('Chart saved as chart.jpeg');
})()

}


export default chart;