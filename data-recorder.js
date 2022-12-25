// import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
// const { template, utils, download } = ham;
// console.log('download', download)

const download = (filename, text) => {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

export const dataRecorder =  (recordTime = 10000) => {
  let record = true;
  const data = [];

  setTimeout(() => {

    console.warn('recordTime', );
    record = false;

    download('path-point-data.json',JSON.stringify({ data }, null, 2))
  }, recordTime)

  return (item = {}) => {
    if (record) {

      data.push({ ...item, id: data.length === 0 ? 0 :  data.length - 1, time: performance.now() });
    }

    return data;
  }
};