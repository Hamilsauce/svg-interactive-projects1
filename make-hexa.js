const plotPoints = (radius, numberOfPoints) => {

  /* step used to place each point at equal distances */
  const angleStep = (Math.PI * 2) / numberOfPoints

  const points = []

  for (let i = 1; i <= numberOfPoints; i++) {
    /* x & y coordinates of the current point */
    const x = Math.cos(i * angleStep) * radius
    const y = Math.sin(i * angleStep) * radius

    /* push the point to the points array */
    points.push({ x, y })
  }

  return points
}
