import Chart from "chart.js/auto";
import { corsair } from "./corsair";
import zoomPlugin from "chartjs-plugin-zoom";
import { getData } from "./data";
import noUiSlider from 'nouislider';
import moment from 'moment';
import { parseISO } from "date-fns";
import config from "./config";

document.cookie = config.COOKIE;

Chart.register(zoomPlugin);
let ctx = document.createElement("canvas");
const names = {
  3: "Discharge Line Temperature ",
  50: "RMS Current of Outdoor Unit",
  60: "24V Power RMS Voltage",
};
// Initailize time trubber.
const slider = document.getElementById('slider');
noUiSlider.create(slider, {
  start: [10, 90],
  connect: true,
  range: {
    'min': 0,
    'max': 100
  },
  behaviour: 'drag'
});

function mapIntegerToDate(num) {
  const startEl = document.getElementById("start");
  const endEl = document.getElementById("end");
  const startDate = new Date(startEl.value);
  const endDate = new Date(endEl.value);
  const millisecondsSinceStart = (num - 0)/100 * moment.utc(endDate).diff(moment.utc(startDate), 'milliseconds');
  const date = moment.utc(startDate).add(millisecondsSinceStart, 'milliseconds').format('YYYY-MM-DD[T]HH:mm:ss[Z]');
  return date;
}
// Define the event handler when slider changes.
slider.noUiSlider.on('set', function (values, handle) {
  updateChart(parseISO(mapIntegerToDate(values[0])),parseISO(mapIntegerToDate(values[1])));
});

function updateChart(start, end) {
  //Get the data to display on chart.
  getData(start, end).then((series) => {
    const chartContainer = document.getElementById("chart");
    //Generate data.
    const data = {
      labels: series.data["0"],
      datasets: [
        {
          label: names[series.names["1"]],
          data: series.data["1"],
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          yAxisID: "y",
          pointRadius: 2,
        },
        {
          label: names[series.names["2"]],
          data: series.data["2"],
          fill: false,
          borderColor: "red",
          yAxisID: "y2",
          pointRadius: 2,
        },
        {
          label: names[series.names["3"]],
          data: series.data["3"],
          fill: false,
          borderColor: "yellow",
          yAxisID: "y3",
          pointRadius: 2,
        },
      ],
    };
    ctx.remove();
    ctx = document.createElement("canvas");
    chartContainer.appendChild(ctx);
    const chart = new Chart(ctx, {
      type: "line",
      data,
      plugins: [corsair],
      options: {
        responsive: true,
        stacked: false,

        plugins: {
          corsair: {
            color: "black",
          },
          zoom: {
            pan: {
              enabled: true,
              scaleMode: "y",
            },
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true,
              },
              mode: "y",
            },
          },
          legend: { labels: { usePointStyle: true } },
        },
        interaction: {
          mode: "index",
          intersect: false,
        },
        scales: {
          y: {
            type: "linear",
            display: true,
            position: "left",
            title: "fh",
            ticks: {
              callback: function (value, index, ticks) {
                return value.toFixed(2) + "FH";
              },
            },
          },
          y2: {
            type: "linear",
            display: true,

            position: "left",
            ticks: {
              callback: function (value, index, ticks) {
                return value.toFixed(2) + "AM";
              },
            },
          },
          y3: {
            type: "linear",
            display: true,
            position: "right",
            ticks: {
              callback: function (value, index, ticks) {
                return value.toFixed(2) + "V";
              },
            },
          },
        },
      },
    });
    chart.options.plugins.tooltip.position = "nearest";
    chart.update();
  });
}
// add the event when start and end dates are changed.
const startEl = document.getElementById("start");
const endEl = document.getElementById("end");

function onChange(e) {
  const start = new Date(startEl.value);
  const end = new Date(endEl.value);

  updateChart(start, end);
  startEl.max = endEl.value;
  endEl.min = startEl.value;
}
startEl.addEventListener("change", onChange);
endEl.addEventListener("change", onChange);

startEl.max = endEl.value;
endEl.min = startEl.value;

updateChart(new Date(startEl.value), new Date(endEl.value));
