export const toTrackPoint = (x,y) => {
  let domPoint = new DOMPoint(Math.round(x), Math.round(y));
  domPoint = domPoint.matrixTransform(trackpad.getScreenCTM().inverse());
  return {
    x:domPoint.x,
    y:domPoint.y,
  }
}
export const toScenePoint = ({ x, y }) => {
  let domPoint = new DOMPoint(x, y)
  domPoint = domPoint.matrixTransform(scene.getScreenCTM().inverse());
  return {
    x: Math.round(domPoint.x),
    y: Math.round(domPoint.y),
  }
}

export const addVectors = (a, b) => {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
  }
}
