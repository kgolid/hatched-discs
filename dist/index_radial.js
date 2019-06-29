(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}(function () { 'use strict';

  function dist(p1, p2) {
    return Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2));
  }

  function angle_of_direction(p1, p2) {
    return Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);
  }

  function point_at_distance_and_angle(p1, dist, rad) {
    return [p1[0] + dist * Math.cos(rad), p1[1] + dist * Math.sin(rad)];
  }

  function point_at_distance_towards_direction(p1, dist, pdir) {
    return point_at_distance_and_angle(p1, dist, angle_of_direction(p1, pdir));
  }

  const init_accuracy = Math.PI / 30;
  const max = 100;
  let radial_offset;

  function roughCurve(a, center, rounds) {
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

  function roughCurveLine(a, b) {
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

  var misc = [
    {
      name: 'frozen-rose',
      colors: ['#29368f', '#e9697b', '#1b164d', '#f7d996'],
      background: '#f2e8e4'
    },
    {
      name: 'winter-night',
      colors: ['#122438', '#dd672e', '#87c7ca', '#ebebeb'],
      background: '#ebebeb'
    },
    {
      name: 'saami',
      colors: ['#eab700', '#e64818', '#2c6393', '#eecfca'],
      background: '#e7e6e4'
    },
    {
      name: 'knotberry1',
      colors: ['#20342a', '#f74713', '#686d2c', '#e9b4a6'],
      background: '#e5ded8'
    },
    {
      name: 'knotberry2',
      colors: ['#1d3b1a', '#eb4b11', '#e5bc00', '#f29881'],
      background: '#eae2d0'
    },
    {
      name: 'tricolor',
      colors: ['#ec643b', '#56b7ab', '#f8cb57', '#1f1e43'],
      background: '#f7f2df'
    },
    {
      name: 'foxshelter',
      colors: ['#ff3931', '#007861', '#311f27', '#bab9a4'],
      background: '#dddddd'
    },
    {
      name: 'hermes',
      colors: ['#253852', '#51222f', '#b53435', '#ecbb51'],
      background: '#eeccc2'
    },
    {
      name: 'olympia',
      colors: ['#ff3250', '#ffb33a', '#008c36', '#0085c6', '#4c4c4c'],
      stroke: '#0b0b0b',
      background: '#faf2e5'
    },
    {
      name: 'byrnes',
      colors: ['#c54514', '#dca215', '#23507f'],
      stroke: '#0b0b0b',
      background: '#e8e7d4'
    }
  ];

  var colourscafe = [
    {
      name: 'cc239',
      colors: ['#e3dd34', '#78496b', '#f0527f', '#a7e0e2'],
      background: '#e0eff0'
    },
    {
      name: 'cc234',
      colors: ['#ffce49', '#ede8dc', '#ff5736', '#ff99b4'],
      background: '#f7f4ed'
    },
    {
      name: 'cc232',
      colors: ['#5c5f46', '#ff7044', '#ffce39', '#66aeaa'],
      background: '#e9ecde'
    },
    {
      name: 'cc238',
      colors: ['#553c60', '#ffb0a0', '#ff6749', '#fbe090'],
      background: '#f5e9de'
    },
    {
      name: 'cc242',
      colors: ['#bbd444', '#fcd744', '#fa7b53', '#423c6f'],
      background: '#faf4e4'
    },
    {
      name: 'cc245',
      colors: ['#0d4a4e', '#ff947b', '#ead3a2', '#5284ab'],
      background: '#f6f4ed'
    },
    {
      name: 'cc273',
      colors: ['#363d4a', '#7b8a56', '#ff9369', '#f4c172'],
      background: '#f0efe2'
    }
  ];

  var ranganath = [
    {
      name: 'rag-mysore',
      colors: ['#ec6c26', '#613a53', '#e8ac52', '#639aa0'],
      background: '#d5cda1'
    },
    {
      name: 'rag-gol',
      colors: ['#d3693e', '#803528', '#f1b156', '#90a798'],
      background: '#f0e0a4'
    },
    {
      name: 'rag-belur',
      colors: ['#f46e26', '#68485f', '#3d273a', '#535d55'],
      background: '#dcd4a6'
    },
    {
      name: 'rag-bangalore',
      colors: ['#ea720e', '#ca5130', '#e9c25a', '#52534f'],
      background: '#f9ecd3'
    },
    {
      name: 'rag-taj',
      colors: ['#ce565e', '#8e1752', '#f8a100', '#3ac1a6'],
      background: '#efdea2'
    },
    {
      name: 'rag-virupaksha',
      colors: ['#f5736a', '#925951', '#feba4c', '#9d9b9d'],
      background: '#eedfa2'
    }
  ];

  var roygbivs = [
    {
      name: 'retro',
      colors: [
        '#69766f',
        '#9ed6cb',
        '#f7e5cc',
        '#9d8f7f',
        '#936454',
        '#bf5c32',
        '#efad57'
      ]
    },
    {
      name: 'retro-washedout',
      colors: [
        '#878a87',
        '#cbdbc8',
        '#e8e0d4',
        '#b29e91',
        '#9f736c',
        '#b76254',
        '#dfa372'
      ]
    },
    {
      name: 'roygbiv-warm',
      colors: [
        '#705f84',
        '#687d99',
        '#6c843e',
        '#fc9a1a',
        '#dc383a',
        '#aa3a33',
        '#9c4257'
      ]
    },
    {
      name: 'roygbiv-toned',
      colors: [
        '#817c77',
        '#396c68',
        '#89e3b7',
        '#f59647',
        '#d63644',
        '#893f49',
        '#4d3240'
      ]
    },
    {
      name: 'present-correct',
      colors: [
        '#fd3741',
        '#fe4f11',
        '#ff6800',
        '#ffa61a',
        '#ffc219',
        '#ffd114',
        '#fcd82e',
        '#f4d730',
        '#ced562',
        '#8ac38f',
        '#79b7a0',
        '#72b5b1',
        '#5b9bae',
        '#6ba1b7',
        '#49619d',
        '#604791',
        '#721e7f',
        '#9b2b77',
        '#ab2562',
        '#ca2847'
      ]
    }
  ];

  var tundra = [
    {
      name: 'tundra1',
      colors: ['#40708c', '#8e998c', '#5d3f37', '#ed6954', '#f2e9e2']
    },
    {
      name: 'tundra2',
      colors: ['#5f9e93', '#3d3638', '#733632', '#b66239', '#b0a1a4', '#e3dad2']
    },
    {
      name: 'tundra3',
      colors: [
        '#87c3ca',
        '#7b7377',
        '#b2475d',
        '#7d3e3e',
        '#eb7f64',
        '#d9c67a',
        '#f3f2f2'
      ]
    },
    {
      name: 'tundra4',
      colors: [
        '#d53939',
        '#b6754d',
        '#a88d5f',
        '#524643',
        '#3c5a53',
        '#7d8c7c',
        '#dad6cd'
      ]
    }
  ];

  var rohlfs = [
    {
      name: 'rohlfs_1R',
      colors: ['#004996', '#567bae', '#ff4c48', '#ffbcb3'],
      stroke: '#004996',
      background: '#fff8e7'
    },
    {
      name: 'rohlfs_1Y',
      colors: ['#004996', '#567bae', '#ffc000', '#ffdca4'],
      stroke: '#004996',
      background: '#fff8e7'
    },
    {
      name: 'rohlfs_1G',
      colors: ['#004996', '#567bae', '#60bf3c', '#d2deb1'],
      stroke: '#004996',
      background: '#fff8e7'
    },
    {
      name: 'rohlfs_2',
      colors: ['#4d3d9a', '#f76975', '#ffffff', '#eff0dd'],
      stroke: '#211029',
      background: '#58bdbc'
    },
    {
      name: 'rohlfs_3',
      colors: ['#abdfdf', '#fde500', '#58bdbc', '#eff0dd'],
      stroke: '#211029',
      background: '#f76975'
    },
    {
      name: 'rohlfs_4',
      colors: ['#fde500', '#2f2043', '#f76975', '#eff0dd'],
      stroke: '#211029',
      background: '#fbbeca'
    }
  ];

  var ducci = [
    {
      name: 'ducci_jb',
      colors: ['#395e54', '#e77b4d', '#050006', '#e55486'],
      stroke: '#050006',
      background: '#efe0bc'
    },
    {
      name: 'ducci_a',
      colors: ['#809498', '#d3990e', '#000000', '#ecddc5'],
      stroke: '#ecddc5',
      background: '#863f52'
    },
    {
      name: 'ducci_b',
      colors: ['#ecddc5', '#79b27b', '#000000', '#ac6548'],
      stroke: '#ac6548',
      background: '#d5c08e'
    },
    {
      name: 'ducci_d',
      colors: ['#f3cb4d', '#f2f5e3', '#20191b', '#67875c'],
      stroke: '#67875c',
      background: '#433d5f'
    },
    {
      name: 'ducci_e',
      colors: ['#c37c2b', '#f6ecce', '#000000', '#386a7a'],
      stroke: '#386a7a',
      background: '#e3cd98'
    },
    {
      name: 'ducci_f',
      colors: ['#596f7e', '#eae6c7', '#463c21', '#f4cb4c'],
      stroke: '#f4cb4c',
      background: '#e67300'
    },
    {
      name: 'ducci_g',
      colors: ['#c75669', '#000000', '#11706a'],
      stroke: '#11706a',
      background: '#ecddc5'
    },
    {
      name: 'ducci_h',
      colors: ['#6b5c6e', '#4a2839', '#d9574a'],
      stroke: '#d9574a',
      background: '#ffc34b'
    },
    {
      name: 'ducci_i',
      colors: ['#e9dcad', '#143331', '#ffc000'],
      stroke: '#ffc000',
      background: '#a74c02'
    },
    {
      name: 'ducci_j',
      colors: ['#c47c2b', '#5f5726', '#000000', '#7e8a84'],
      stroke: '#7e8a84',
      background: '#ecddc5'
    },
    {
      name: 'ducci_o',
      colors: ['#c15e1f', '#e4a13a', '#000000', '#4d545a'],
      stroke: '#4d545a',
      background: '#dfc79b'
    },
    {
      name: 'ducci_q',
      colors: ['#4bae8c', '#d0c1a0', '#2d3538'],
      stroke: '#2d3538',
      background: '#d06440'
    },
    {
      name: 'ducci_u',
      colors: ['#f6d700', '#f2d692', '#000000', '#5d3552'],
      stroke: '#5d3552',
      background: '#ff7426'
    },
    {
      name: 'ducci_v',
      colors: ['#c65f75', '#d3990e', '#000000', '#597e7a'],
      stroke: '#597e7a',
      background: '#f6eccb'
    },
    {
      name: 'ducci_x',
      colors: ['#dd614a', '#f5cedb', '#1a1e4f'],
      stroke: '#1a1e4f',
      background: '#fbb900'
    }
  ];

  var judson = [
    {
      name: 'jud_playground',
      colors: ['#f04924', '#fcce09', '#408ac9'],
      stroke: '#2e2925',
      background: '#ffffff'
    },
    {
      name: 'jud_horizon',
      colors: ['#f8c3df', '#f2e420', '#28b3d0', '#648731', '#ef6a7d'],
      stroke: '#030305',
      background: '#f2f0e1'
    },
    {
      name: 'jud_mural',
      colors: ['#ca3122', '#e5af16', '#4a93a2', '#0e7e39', '#e2b9bd'],
      stroke: '#1c1616',
      background: '#e3ded8'
    },
    {
      name: 'jud_cabinet',
      colors: ['#f0afb7', '#f6bc12', '#1477bb', '#41bb9b'],
      stroke: '#020508',
      background: '#e3ded8'
    }
  ];

  var iivonen = [
    {
      name: 'iiso_zeitung',
      colors: ['#ee8067', '#f3df76', '#00a9c0', '#f7ab76'],
      stroke: '#111a17',
      background: '#f5efcb'
    },
    {
      name: 'iiso_curcuit',
      colors: ['#f0865c', '#f2b07b', '#6bc4d2', '#1a3643'],
      stroke: '#0f1417',
      background: '#f0f0e8'
    },
    {
      name: 'iiso_airlines',
      colors: ['#fe765a', '#ffb468', '#4b588f', '#faf1e0'],
      stroke: '#1c1616',
      background: '#fae5c8'
    },
    {
      name: 'iiso_daily',
      colors: ['#e76c4a', '#f0d967', '#7f8cb6', '#1daeb1', '#ef9640'],
      stroke: '#000100',
      background: '#e2ded2'
    }
  ];

  var kovecses = [
    {
      name: 'kov_01',
      colors: ['#d24c23', '#7ba6bc', '#f0c667', '#ede2b3', '#672b35', '#142a36'],
      stroke: '#132a37',
      background: '#108266'
    },
    {
      name: 'kov_02',
      colors: ['#e8dccc', '#e94641', '#eeaeae'],
      stroke: '#e8dccc',
      background: '#6c96be'
    },
    {
      name: 'kov_03',
      colors: ['#e3937b', '#d93f1d', '#090d15', '#e6cca7'],
      stroke: '#090d15',
      background: '#558947'
    },
    {
      name: 'kov_04',
      colors: ['#d03718', '#292b36', '#33762f', '#ead7c9', '#ce7028', '#689d8d'],
      stroke: '#292b36',
      background: '#deb330'
    },
    {
      name: 'kov_05',
      colors: ['#de3f1a', '#de9232', '#007158', '#e6cdaf', '#869679'],
      stroke: '#010006',
      background: '#7aa5a6'
    }
  ];

  const pals = misc.concat(
    ranganath,
    roygbivs,
    tundra,
    colourscafe,
    rohlfs,
    ducci,
    judson,
    iivonen,
    kovecses
  );

  var palettes = pals.map(p => {
    p.size = p.colors.length;
    return p;
  });

  function getRandom() {
    return palettes[Math.floor(Math.random() * palettes.length)];
  }

  let n = 70;
  let number_of_rings = 10;
  let rings = [];
  let ring_dimensions;
  let frame_dim = 50;

  let noise_radius_init = 0.06;
  let noise_radius_delta = 0.02;

  let draw_radius_init = 80;
  let draw_radius_delta = 80;

  let draw_variance_init = 400;
  let draw_variance_delta = 300;

  let palette = getRandom();
  let bg_color = palette.background ? palette.background : '#d5cda1';

  let sketch = function(p) {
    let THE_SEED;

    p.setup = function() {
      p.createCanvas(1200, 1200);
      THE_SEED = p.floor(p.random(9999999));
      p.randomSeed(THE_SEED);
      p.noLoop();
      p.strokeWeight(4);
      //p.noFill();
    };

    p.draw = function() {
      p.background(bg_color);
      draw_v2();
      draw_frame(frame_dim);
    };

    function draw_v2() {
      p.push();
      p.translate(p.width / 2, p.height / 2);
      setup_disc();
      draw_disc(0, 0);
      p.pop();
    }

    function draw_disc(cx, cy) {
      p.push();
      p.translate(cx, cy);

      draw_rings();
      draw_radial_hatches();
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
        const rx = (i / number_of_points) * p.TWO_PI;
        const ry = 0;

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

    function draw_radial_hatches() {
      p.noFill();
      p.stroke(palette.colors[p.floor(p.random(palette.colors.length))]);
      for (let j = 0; j < 1; j++) {
        for (let i = 0; i < 17; i++) {
          const points = roughCurve([800 - i * 40, 0], [0, 0], 2.8);
          draw_hatch_line(points);
        }
      }
    }

    function draw_hatch_line(points) {
      //p.fill(244, 100, 100, 100);
      //p.beginShape();
      for (let i = 1; i < points.length - 1; i++) {
        if (p.random() < 0.1)
          p.stroke(palette.colors[p.floor(p.random(palette.colors.length))]);
        let a1 = points[i - 1];
        let a2 = points[i];
        p.bezier(a1[0], a1[1], a1[4], a1[5], a2[2], a2[3], a2[0], a2[1]);
        //p.curveVertex(a2[0], a2[1]);
        p.ellipse(a1[0], a1[1], 20, 20);
        //p.line(a1[0], a1[1], a1[4], a1[5]);
        p.ellipse(a1[4], a1[5], 10, 10);
        p.ellipse(a2[2], a2[3], 10, 10);
        //p.line(a2[2], a2[3], a2[0], a2[1]);
      }
      //p.endShape();
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

}));
