// const rasterize = async (imgElement, w, h, filename) => {
//   const canvas = document.createElement('canvas');
//   const ctx = canvas.getContext('2d');
//   canvas.width = w;
//   canvas.height = h;
//   ctx.drawImage(imgElement, 0, 0, w, h)
//   await download(canvas.toDataURL('image/png', 1),
//     `${filename}.png`);
// }

const download = async function(href, name) {
  const link = document.createElement('a');
  link.download = name;
  link.style.opacity = "0";
  await document.body.append(link);
  link.href = href;
  await link.click();
  link.remove();
}

export const svgToPng = async (svg, filename = 'svg-image') => {
 svg = document.querySelector('svg');
  const { width, height } = svg.getBoundingClientRect();
  const clonedSvgHtml = svg.cloneNode(true).outerHTML
  console.log('clonedSvgHtml', { clonedSvgHtml })
  const svgBlob = new Blob([clonedSvgHtml], {
    type: 'image/svg+xml;charset=utf-8'
  });
console.log('svgBlob', svgBlob)
  const URL = window.URL || window.webkitURL || window;
  const blobURL = URL.createObjectURL(svgBlob);
  const imgElement = new Image()
  console.warn('width, height', width, height);
  // const doIt = async () => 
  // await rasterize(
  //   imgElement, width, height,
  //   filename
  // )

  // imgElement.addEventListener('load', async () => {
   imgElement.src =await   blobURL;
console.log('imgElement ', imgElement )
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = width
  canvas.height = height
  console.log('imgElement, 0, 0, canvas.width, canvas.height', imgElement, 0, 0, canvas.width, canvas.height);

  ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height)
  await download(canvas.toDataURL('image/png', 1),
    `${filename}.png`);

  // });
  setTimeout(async () => {
    // imgElement.removeEventListener('load', await doIt);

    console.log('image downloaded', imgElement.src);
  }, 200)


}
