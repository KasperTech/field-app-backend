const { distance, point } = require("@turf/turf");

exports.getDistance = (lat1, lng1, lat2, lng2) => {
  const from = point([lng1, lat1]); // [lng, lat]
  const to = point([lng2, lat2]);

  const dist = distance(from, to, { units: "kilometers" });
  return dist;
};
