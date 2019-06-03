import Highcharts from 'highcharts';
import { Interval } from './calculations';

export type Point = [number, number];

/* Should be called when the consuming component is mounted */
function createIntervalsFrequenciesHistogram(intervals: Array<Interval>, intervalsRelativeFrequencies: Array<number>, domElementId: string): void {
  const intervalLength = intervals[0][1] - intervals[0][0];
  const chartPoints: Array<Point> = [];

  intervals.forEach((interval: Interval, currentIndex: number) => {
    chartPoints.push([interval[0], 0]);
    chartPoints.push([interval[0], intervalsRelativeFrequencies[currentIndex]]);

    chartPoints.push([interval[1], intervalsRelativeFrequencies[currentIndex]]);
  });

  chartPoints.push([intervals[intervals.length - 1][1], 0]);

  Highcharts.chart(domElementId, {
    title: {text: 'Гистограмма относительных частот'}, 

    xAxis: {
      minPadding: 0.05,
      maxPadding: 0.05
    },

    yAxis: {
      tickInterval: intervalLength
    },

    plotOptions: {
      series: {
        color: '#000000'
      }
    },

    series: [{
      type: 'line',
      data: chartPoints as Highcharts.SeriesLineDataOptions
    } as Highcharts.SeriesLineOptions]
  });
}

function createIntervalsFrequenciesPolygon() {

}

export { createIntervalsFrequenciesHistogram as FrequenciesHistogram };
export { createIntervalsFrequenciesPolygon as FrequenciesPolygon };