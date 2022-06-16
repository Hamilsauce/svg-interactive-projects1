// import {}from''

let lastSecond = 0
let lastMilli = 0
let activeEntity
let dest = { x: 4, y: 4 }
let curr = { x: 0, y: 0 }
let reqid
let done = false
let updates = [];
let counter = 0
const doUpdates = async (delta) => {
  for (var update of updates) {
    await update(delta)
    // console.log('do upfayes', update);
  }
}

async function animate(tstamp) {
  const date = new Date();
  const millis = date.getMilliseconds();
  let changedTime = (millis - lastMilli) / 60 || 0
  lastMilli = millis
  if (changedTime >= 0.1 || changedTime == 0) {
    // console.table([curr,dest]);
    // console.log({changedTime});
    // counter += 1
    if (++counter % 11.3) {
    console.log({ counter });
    await doUpdates(changedTime)
  }
  }
  else if (!changedTime) {
    counter = 0
    // reqid = requestAnimationFrame(animate);

  }
  reqid = requestAnimationFrame(animate);
  // if (activeEntity.inBounds == true) {
  //   // console.log('suk bounda');
  // }
}

export const instruct = async (el, p) => {
  dest = { x: p.x, y: p.y }
};


export const start = async (el, targetDest) => {
  // activeEntity = el
  // return (...points)=>  instruct(activeEntity,)
  // let x = dest.x >= p.x ? -(dest.x - p.x) : (dest.x - p.x)
  // let y = dest.y >= p.y ? -(dest.y - p.y) : (dest.y - p.y)
  // let { x, y } = targetDest
  // dest = { x, y }
  // console.log('leavinf atart');
  // console.log({ activeEntityDest });
  // instruct(activeEntity, dest)
  await requestAnimationFrame(animate);
  return true
};

export const engine = {
  start,
  addUpdate(update) { updates.push(update) }
}

// await requestAnimationFrame(animate);
