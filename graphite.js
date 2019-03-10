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

export default function roughLine(a, b) {
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
