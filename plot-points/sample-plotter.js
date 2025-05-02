import { sampleDataRaw } from './note-data-tony-pitch.js';
const sourcePath = './data/path-point-data-default.json'

const plotData = await (await fetch(sourcePath)).json();

const samples = plotData.split('\n')
  .map((line, index) => {
    const [time, left, right] = line.split(',');

    return {
      index,
      time: +time,
      left: +left,
      right: +right
    }
  });

console.log('samples', samples)

const startTime = samples[0].time;
const endTime = samples[samples.length - 1].time;
const duration = endTime - startTime

console.log('duration', duration);

const objectsLayer = document.querySelector('#objects-layer');

samples.forEach(({ time, left }, i) => {
  const point = document.createElementNS(SVG_NS, 'circle');
  point.classList.add('point')
  point.setAttribute('r', 10);
  point.setAttribute('cx', (time-17)*100);
  point.setAttribute('cy', left);
  objectsLayer.append(point)
});