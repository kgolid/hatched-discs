import { roughLine } from './graphite.js';
import * as tome from 'chromotome';

let n = 70;
let number_of_rings = 10;
let rings = [];
let ring_dimensions;
let frame_dim = 80;
let ticks;

let noise_radius_init = 0.06;
let noise_radius_delta = 0.02;

let draw_radius_init = 80;
let draw_radius_delta = 80;

let draw_variance_init = 400;
let draw_variance_delta = 300;

let palette;
let bg_color;

let sketch = function(p) {
  let THE_SEED;

  p.setup = function() {
    const canv = p.createCanvas(2100, 2970);
    canv.style('height', '1000px');
    canv.style('width', 'auto');
    THE_SEED = p.floor(p.random(9999999));
    p.randomSeed(THE_SEED);
    p.frameRate(2);
    p.strokeWeight(3);
    p.noFill();
    initial_state();
  };

  p.draw = function() {
    if (ticks >= 8) {
      initial_state();
    }
    draw_v1(ticks);
    draw_frame(frame_dim);
    ticks++;
  };

  function initial_state() {
    palette = tome.get();
    bg_color = palette.background ? palette.background : '#d5cda1';
    ticks = 0;

    p.fill(bg_color);
    p.rect(0, 0, p.width, p.height);
  }

  function draw_v1(i) {
    p.push();
    p.translate(0, 1350 + i * 350);
    if (i % 2 == 0) {
      setup_disc();
      draw_disc(0, 0);
      setup_disc();
      draw_disc(p.width / 2, 0);
      setup_disc();
      draw_disc(p.width, 0);
    } else {
      setup_disc();
      draw_disc((3 * p.width) / 4, 0);
      setup_disc();
      draw_disc(p.width / 4, 0);
    }
    p.pop();
  }

  function draw_v2() {
    p.push();
    p.translate(0, 500);
    setup_disc();
    draw_disc(0, 0);
    setup_disc();
    draw_disc(p.width, 0);
    setup_disc();
    draw_disc(p.width / 2, 0);

    p.translate(0, 500);
    setup_disc();
    draw_disc((3 * p.width) / 4, 0);
    setup_disc();
    draw_disc(p.width / 4, 0);

    p.translate(0, 1500);
    setup_disc();
    draw_disc(0, 0);
    setup_disc();
    draw_disc(p.width, 0);
    setup_disc();
    draw_disc(p.width / 2, 0);

    p.translate(0, -500);
    setup_disc();
    draw_disc((3 * p.width) / 4, 0);
    setup_disc();
    draw_disc(p.width / 4, 0);

    p.translate(0, -500);
    setup_disc();
    draw_disc(0, 0);
    setup_disc();
    draw_disc(p.width, 0);
    setup_disc();
    draw_disc(p.width / 2, 0);
    p.pop();
  }

  function draw_disc(cx, cy) {
    p.push();
    p.translate(cx, cy);

    draw_rings();
    draw_hatches();
    p.pop();
  }

  p.keyPressed = function() {
    if (p.keyCode === 80) p.saveCanvas('sketch_' + THE_SEED, 'jpeg');
  };

  function setup_disc() {
    p.noiseSeed(p.random(99999));
    ring_dimensions = get_ring_dimensions(
      number_of_rings + 1,
      draw_radius_init,
      draw_radius_delta,
      0.5
    );

    rings = [];
    for (let j = 0; j < number_of_rings; j++) {
      const number_of_points = 10 + p.floor(n * (j + 1) * p.random(0.5, 2));
      const inner = get_ring_coordinates(j, number_of_points);
      const outer = get_ring_coordinates(j + 1, number_of_points);
      const ring = inner.map((_, i) => [...inner[i], ...outer[i]]);
      rings.push(ring);
    }
  }

  function get_ring_dimensions(n, init, delta, variance) {
    const dims = [];
    let total = init;
    for (let i = 0; i < n; i++) {
      dims.push(total);
      total += delta * p.random(1 - variance, 1 + variance);
    }
    return dims;
  }

  function get_ring_coordinates(ring, number_of_points) {
    const noise_radius = noise_radius_init + noise_radius_delta * ring;
    const draw_var = draw_variance_init + draw_variance_delta * ring;
    const draw_radius = ring_dimensions[ring];

    const x0 = p.noise(9 + noise_radius_init, 9, noise_radius);
    const y0 = p.noise(19 + noise_radius_init, 19, noise_radius);

    let pts = [];
    for (let t = 0; t <= number_of_points; t++) {
      const i = t + p.random(-0.25, 0.25);
      const rx = p.cos((i / number_of_points) * p.TWO_PI);
      const ry = p.sin((i / number_of_points) * p.TWO_PI);

      const nx = p.noise(
        9 + rx * noise_radius_init,
        9 + ry * noise_radius_init,
        noise_radius
      );
      const ny = p.noise(
        19 + rx * noise_radius_init,
        19 + ry * noise_radius_init,
        noise_radius
      );

      const cx = rx * draw_radius + (nx - x0) * draw_var;
      const cy = ry * draw_radius + (ny - y0) * draw_var;

      pts.push([cx, cy]);
    }
    return pts;
  }

  function draw_rings() {
    p.fill(bg_color);
    p.noStroke();
    const pts = rings[rings.length - 1];

    p.beginShape();
    for (let i = 1; i < pts.length; i++) {
      p.vertex(pts[i][0], pts[i][1]);
    }
    p.endShape(p.CLOSE);
  }

  function draw_hatches() {
    p.noFill();
    p.stroke(palette.colors[p.floor(p.random(palette.colors.length))]);
    for (let j = 1; j < rings.length; j++) {
      if (p.random() < 0.3)
        p.stroke(palette.colors[p.floor(p.random(palette.colors.length))]);
      const inner = rings[j - 1];
      for (let i = 1; i < inner.length; i++) {
        const points = roughLine(
          [inner[i][0], inner[i][1]],
          [inner[i][2], inner[i][3]]
        );
        draw_hatch_line(points);
      }
    }
  }

  function draw_hatch_line(points) {
    for (let i = 1; i < points.length; i++) {
      let a1 = points[i - 1];
      let a2 = points[i];
      p.bezier(a1[0], a1[1], a1[4], a1[5], a2[2], a2[3], a2[0], a2[1]);
    }
  }

  function draw_frame(dim) {
    p.fill(bg_color);
    p.noStroke(0);
    p.rect(0, 0, p.width, dim);
    p.rect(0, p.height - dim, p.width, dim);
    p.rect(0, 0, dim, p.height);
    p.rect(p.width - dim, 0, dim, p.height);
  }
};
new p5(sketch);
