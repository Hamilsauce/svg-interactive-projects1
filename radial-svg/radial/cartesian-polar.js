let RADIAL_TO_DEGREE = 180 / Math.PI
let DEGREE_TO_RADIAL = Math.PI / 180

/**
 * Convert [lat,lon] polar coordinates to [x,y,z] cartesian coordinates
 * @param {Number} lon
 * @param {Number} lat
 * @param {Number} radius
 * @return {Vector3}
 */
export const polarToCartesian = (lon, lat, radius) => {
  let phi = (90 - lat) * DEGREE_TO_RADIAL
  let theta = (lon + 180) * DEGREE_TO_RADIAL

  return {
    x: -(radius * Math.sin(phi) * Math.sin(theta)),
    y: radius * Math.cos(phi),
    // z: radius * Math.sin(phi) * Math.cos(theta),
  }
}

/**
 * Convert [x,y,z] cartesian coordinates to polar [lat,lon]
 * @param {Vector3} coord
 * @return {Array<Number>}
 */
export const cartesianToPolar = (coord, radius) => {
  let lon = Math.atan2(coord.x, -coord.z) * RADIAL_TO_DEGREE
  let length = Math.sqrt(coord.x * coord.x + coord.z * coord.z)
  let lat = Math.atan2(coord.y, length) * RADIAL_TO_DEGREE

  return [lon, lat]
}
