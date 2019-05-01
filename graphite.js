import {
  dist,
  angle_of_direction,
  point_at_distance_and_angle,
  point_at_distance_towards_direction
} from './utils';

const init_accuracy = Math.PI / 30;
const step_length = 0.2;
const cutoff = 10;
const max = 100;
let radial_offset;

export function roughCurve(a, center, rounds) {
  radial_offset = Math.random() * Math.PI * 2;
  const radius = dist(a, center);
  const lineLength = radius * Math.PI * rounds * 2;
  let rline = roughCurveLine([radius, 0], [radius, lineLength]);
  return rline.map(pnts => pointOnCircle(pnts, radius, [a[0] - radius, a[1]]));
}

function pointOnCircle(pnts, radius, offset) {
  pnts.cp1 = pnts.cp1 || pnts.a;
  pnts.cp2 = pnts.cp2 || pnts.a;

  const radiansA = radial_offset + pnts.a[1] / radius;
  const radiansCP1 = radial_offset + pnts.cp1[1] / radius;
  const radiansCP2 = radial_offset + pnts.cp2[1] / radius;

  const cp1dist = Math.sqrt(
    Math.pow(pnts.a[1] - pnts.cp1[1], 2) + Math.pow(pnts.cp1[0], 2)
  );
  const cp2dist = Math.sqrt(
    Math.pow(pnts.a[1] - pnts.cp2[1], 2) + Math.pow(pnts.cp2[0], 2)
  );
  return [
    Math.cos(radiansA) * pnts.a[0] + offset[0],
    Math.sin(radiansA) * pnts.a[0] + offset[1],
    Math.cos(radiansCP1) * cp1dist + offset[0],
    Math.sin(radiansCP1) * cp1dist + offset[1],
    Math.cos(radiansCP2) * cp2dist + offset[0],
    Math.sin(radiansCP2) * cp2dist + offset[1]
  ];
}

export function roughCurveLine(a, b) {
  let start = { a: a, cp1: null, cp2: null };
  const points = [start];

  while (dist(points[points.length - 1].a, b) != 0 && points.length < max) {
    points.push(getNextPoint(points, 200, b));
  }

  return points;
}

function getNextPoint(points, step_dist, goal) {
  let current = points[points.length - 1].a;
  let remaining_distance = dist(current, goal);

  let start = points[0].a;
  let total_distance = dist(start, goal);

  let remaining_ratio = remaining_distance / total_distance;
  let step = step_dist * (Math.random() * 0.5 + 1);
  if (remaining_distance <= step * 1.5)
    return { a: goal, cp1: null, cp2: null };

  let accuracy = remaining_ratio * init_accuracy;
  let direction_offset = Math.random() * accuracy - accuracy / 2;
  let ideal_direction = angle_of_direction(current, goal);
  let direction = ideal_direction + direction_offset;

  let next_a = point_at_distance_and_angle(current, step, direction);
  let next_cp1 = point_at_distance_towards_direction(next_a, -step / 2.9, goal);
  let next_cp2 = point_at_distance_towards_direction(
    next_a,
    Math.min(step, dist(next_a, goal)) / 2.9,
    goal
  );

  return { a: next_a, cp1: next_cp1, cp2: next_cp2 };
}

export function roughLine(a, b) {
  let points = [[...a, ...a, ...a]];

  while (dist(points[points.length - 1], b) > cutoff && points.length < max) {
    points = progress(points, b);
  }

  return points;
}

function progress(points, goal) {
  let start = points[0];
  let current = points[points.length - 1];
  let progress = dist(start, current) / dist(start, goal);

  let remaining = dist(current, goal);
  let step = remaining * step_length * (Math.random() * 2 + 1);

  let accuracy = (1 - progress) * init_accuracy;
  let ideal_direction = angle_of_direction(current, goal);
  let direction_offset = Math.random() * accuracy;
  let direction = ideal_direction + direction_offset - accuracy / 2;

  let next_a = point_at_distance_and_angle(current, step, direction);
  let next_cp1 = point_at_distance_towards_direction(next_a, -step / 3, goal);
  let next_cp2 = point_at_distance_towards_direction(next_a, step / 3, goal);

  points.push([...next_a, ...next_cp1, ...next_cp2]);

  return points;
}
