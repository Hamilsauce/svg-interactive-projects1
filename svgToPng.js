const rasterize = (imgElement, w, h, filename) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = w;
  canvas.height = h;
  ctx.drawImage(imgElement, 0, 0, w, h)
  download(canvas.toDataURL('image/png', 1),
    `${filename}.png`);
}

const download = function(href, name) {
  const link = document.createElement('a');
  link.download = name;
  link.style.opacity = "0";
  document.body.append(link);
  link.href = href;
  link.click();
  link.remove();
}

export const svgToPng = (svg, filename = 'svg-image') => {
  const { width, height } = svg.getBoundingClientRect();
  const clonedSvgHtml = svg.cloneNode(true).outerHTML

  const svgBlob = new Blob([clonedSvgHtml], {
    type: 'image/svg+xml;charset=utf-8'
  });

  const URL = window.URL || window.webkitURL || window;
  const blobURL = URL.createObjectURL(svgBlob);
  const imgElement = new Image()

  const doIt = () => rasterize(
    imgElement, width, height,
    filename
  )

  imgElement.addEventListener('load', doIt);
  imgElement.src = blobURL

  setTimeout(() => {
  imgElement.removeEventListener('load', doIt);
    console.log('image downloaded', imgElement.src);
  }, 200)
}
