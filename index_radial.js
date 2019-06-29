import { roughCurve } from './graphite.js';
import * as tome from 'chromotome';

let frame_dim = 50;
let revolutions_per_loop = 2.8;
let number_of_loops = 17;
let initial_loop_size = 120;
let loop_distance = 40;

let palette = tome.getRandom();
let bg_color = palette.background ? palette.background : '#d5cda1';

let sketch = function(p) {
  let THE_SEED;

  p.setup = function() {
    p.createCanvas(1200, 1200);
    THE_SEED = p.floor(p.random(9999999));
    p.randomSeed(THE_SEED);
    p.noLoop();
    p.strokeWeight(4);
  };

  p.draw = function() {
    p.background(bg_color);
    p.push();
    p.translate(p.width / 2, p.height / 2);
    draw_radial_hatches();
    p.pop();
    draw_frame(frame_dim);
  };

  p.keyPressed = function() {
    if (p.keyCode === 80) p.saveCanvas('sketch_' + THE_SEED, 'jpeg');
  };

  function draw_radial_hatches() {
    p.noFill();
    p.stroke(palette.colors[p.floor(p.random(palette.colors.length))]);
    for (let j = 0; j < 1; j++) {
      for (let i = 0; i < number_of_loops; i++) {
        const points = roughCurve(
          [initial_loop_size + i * loop_distance, 0],
          [0, 0],
          revolutions_per_loop
        );
        p.strokeWeight(2 + Math.random() * 3);
        draw_hatch_line(points);
      }
    }
  }

  function draw_hatch_line(points) {
    for (let i = 1; i < points.length - 1; i++) {
      if (p.random() < 0.1)
        p.stroke(palette.colors[p.floor(p.random(palette.colors.length))]);
      let a1 = points[i - 1];
      let a2 = points[i];
      p.bezier(a1[0], a1[1], a1[4], a1[5], a2[2], a2[3], a2[0], a2[1]);
      p.ellipse(a1[0], a1[1], 20, 20);
      p.ellipse(a1[4], a1[5], 10, 10);
      p.ellipse(a2[2], a2[3], 10, 10);
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
