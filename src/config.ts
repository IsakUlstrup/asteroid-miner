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
  asteroidMaxCount: 10,
  spaceDepth: 100,
  resolutionScaling: window.devicePixelRatio
};
