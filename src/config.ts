enum ShapeRendering {
  auto = "auto",
  speed = "optimizeSpeed",
  crisp = "crispEdges",
  precisise = "geometricPrecision"
}

export default {
  svgShapeRendering: ShapeRendering.speed,
  // asteroid level of detail. Higher number is more demaing
  asteroidPolygonModifier: 10,
  asteroidMaxCount: 100,
  spaceDepth: 100
};
