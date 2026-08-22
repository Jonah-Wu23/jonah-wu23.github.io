(function () {
  'use strict';

  const container = document.getElementById('canvas-wrap');
  if (!container || typeof THREE === 'undefined') return;

  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let isReducedMotion = reducedMotionQuery.matches;

  reducedMotionQuery.addEventListener('change', function (e) {
    isReducedMotion = e.matches;
  });

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 8000);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  const pointsGroup = new THREE.Group();
  scene.add(pointsGroup);

  // Sizing & Grid Setup
  const gridHeight = 1600;
  const gridWidth = Math.max(2400, gridHeight * (window.innerWidth / window.innerHeight) * 1.35);
  const cols = 64;
  const rows = 64;
  const count = cols * rows;
  const spacingX = gridWidth / (cols - 1);
  const spacingY = gridHeight / (rows - 1);

  const ox = new Float32Array(count);
  const oy = new Float32Array(count);
  const px = new Float32Array(count);
  const py = new Float32Array(count);
  const pz = new Float32Array(count);
  const vx = new Float32Array(count);
  const vy = new Float32Array(count);
  const vz = new Float32Array(count);
  const sizes = new Float32Array(count);

  const geometry = new THREE.BufferGeometry();
  const posArr = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const c = i % cols;
    const r = Math.floor(i / cols);
    const x = -gridWidth / 2 + c * spacingX + (Math.random() - 0.5) * spacingX * 0.35;
    const y = -gridHeight / 2 + r * spacingY + (Math.random() - 0.5) * spacingY * 0.35;
    
    ox[i] = x;
    oy[i] = y;
    px[i] = x;
    py[i] = y;
    pz[i] = 0;
    vx[i] = 0;
    vy[i] = 0;
    vz[i] = 0;
    sizes[i] = 1.2 + Math.random() * 1.2;

    posArr[i * 3] = x;
    posArr[i * 3 + 1] = y;
    posArr[i * 3 + 2] = 0;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const particleMaterial = new THREE.ShaderMaterial({
    uniforms: {
      color: { value: new THREE.Color(0x1A63D8) },
      pixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
    },
    vertexShader: [
      'attribute float size;',
      'uniform float pixelRatio;',
      'void main() {',
      '  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);',
      '  gl_PointSize = size * pixelRatio;',
      '  gl_Position = projectionMatrix * mvPosition;',
      '}'
    ].join('\n'),
    fragmentShader: [
      'uniform vec3 color;',
      'void main() {',
      '  vec2 coord = gl_PointCoord - 0.5;',
      '  if (length(coord) > 0.5) discard;',
      '  gl_FragColor = vec4(color, 0.85);',
      '}'
    ].join('\n'),
    transparent: true,
    depthTest: true,
    depthWrite: false
  });

  const pointCloud = new THREE.Points(geometry, particleMaterial);
  pointsGroup.add(pointCloud);

  // Invisible interaction plane
  const planeGeo = new THREE.PlaneGeometry(gridWidth * 1.2, gridHeight * 1.2);
  const planeMat = new THREE.MeshBasicMaterial({ visible: false, side: THREE.DoubleSide });
  const planeMesh = new THREE.Mesh(planeGeo, planeMat);
  pointsGroup.add(planeMesh);

  pointsGroup.rotation.x = -Math.PI * 0.32;
  camera.position.set(0, 280, (gridHeight / 2) / Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * 1.15);
  camera.lookAt(0, 0, 0);

  // Blueprint Connecting Lines
  const pairs = [];
  for (let i = 0; i < count; i++) {
    const c = i % cols;
    const r = Math.floor(i / cols);
    if (c < cols - 1) pairs.push([i, i + 1]);
    if (r < rows - 1) pairs.push([i, i + cols]);
  }

  const maxSegments = Math.min(pairs.length, 9000);
  const lineGeo = new THREE.BufferGeometry();
  const linePos = new Float32Array(maxSegments * 6);
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3));
  lineGeo.setDrawRange(0, 0);

  const lineMat = new THREE.LineBasicMaterial({
    color: 0x1A63D8,
    transparent: true,
    opacity: 0.12,
    blending: THREE.NormalBlending,
    depthWrite: false
  });
  const lines = new THREE.LineSegments(lineGeo, lineMat);
  pointsGroup.add(lines);

  const threshold = Math.max(spacingX, spacingY) * 1.75;
  const thresholdSq = threshold * threshold;

  function updateLines() {
    let seg = 0;
    for (let k = 0; k < pairs.length && seg < maxSegments; k++) {
      const i = pairs[k][0];
      const j = pairs[k][1];
      const dx = px[i] - px[j];
      const dy = py[i] - py[j];
      const dz = pz[i] - pz[j];
      const d2 = dx * dx + dy * dy + dz * dz;
      if (d2 < thresholdSq) {
        const base = seg * 6;
        linePos[base] = px[i];
        linePos[base + 1] = py[i];
        linePos[base + 2] = pz[i];
        linePos[base + 3] = px[j];
        linePos[base + 4] = py[j];
        linePos[base + 5] = pz[j];
        seg++;
      }
    }
    lineGeo.setDrawRange(0, seg * 2);
    lineGeo.attributes.position.needsUpdate = true;
  }

  // Pointer Interaction
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2(-999, -999);
  const tmpPoint = new THREE.Vector3();
  let pointerActive = false;
  let prevPointer = { x: -999, y: -999, time: 0 };
  let pointerVelocity = 0;
  let burstTriggered = false;

  window.addEventListener('pointermove', function (e) {
    const now = performance.now();
    const currX = (e.clientX / window.innerWidth) * 2 - 1;
    const currY = -(e.clientY / window.innerHeight) * 2 + 1;

    if (prevPointer.time > 0) {
      const dtMs = Math.max(now - prevPointer.time, 8);
      const dist = Math.hypot(currX - prevPointer.x, currY - prevPointer.y);
      pointerVelocity = dist / (dtMs / 1000);
      if (pointerVelocity > 4.5) {
        burstTriggered = true;
      }
    }

    prevPointer.x = currX;
    prevPointer.y = currY;
    prevPointer.time = now;

    pointer.x = currX;
    pointer.y = currY;
    pointerActive = true;
  }, { passive: true });

  window.addEventListener('pointerdown', function () {
    burstTriggered = true;
  });

  window.addEventListener('pointerleave', function () {
    pointerActive = false;
    pointerVelocity = 0;
  });

  window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    particleMaterial.uniforms.pixelRatio.value = Math.min(window.devicePixelRatio, 2);
  });

  // Project hover boost
  let hoverBoost = false;
  document.querySelectorAll('.project-item').forEach(function (el) {
    el.addEventListener('mouseenter', function () { hoverBoost = true; });
    el.addEventListener('mouseleave', function () { hoverBoost = false; });
  });

  // Animation Loop (Frame-normalized physics)
  let lastTime = performance.now();
  let simTime = 0;

  function animate() {
    requestAnimationFrame(animate);

    const now = performance.now();
    const deltaSeconds = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    simTime += deltaSeconds;

    if (isReducedMotion) {
      // Reduced motion: static grid, no wave, no explosion
      for (let i = 0; i < count; i++) {
        posArr[i * 3] = ox[i];
        posArr[i * 3 + 1] = oy[i];
        posArr[i * 3 + 2] = 0;
      }
      geometry.attributes.position.needsUpdate = true;
      if (lineGeo.drawRange.count === 0) {
        updateLines();
      }
      renderer.render(scene, camera);
      return;
    }

    const waveAmp = hoverBoost ? 22 : 12;
    const waveSpeed = hoverBoost ? 1.8 : 0.9;
    const springK = 0.045;
    const damping = 0.88;
    const repelRadius = 260;
    const repelRadiusSq = repelRadius * repelRadius;
    const peakRepelForce = 1.35;
    const burstImpulse = 11.5;

    let cx = 0, cy = 0, cz = 0, hasCursor = false;
    if (pointerActive) {
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObject(planeMesh);
      if (hits.length) {
        tmpPoint.copy(hits[0].point);
        pointsGroup.worldToLocal(tmpPoint);
        cx = tmpPoint.x;
        cy = tmpPoint.y;
        cz = tmpPoint.z;
        hasCursor = true;
      }
    }

    const isBurst = burstTriggered;
    burstTriggered = false; // consume trigger

    for (let i = 0; i < count; i++) {
      // Base blueprint undulating wave target
      const targetZ = Math.sin(ox[i] * 0.0035 + simTime * waveSpeed) * waveAmp +
                      Math.cos(oy[i] * 0.003 + simTime * waveSpeed * 0.7) * (waveAmp * 0.55);

      // Spring restoring force towards (ox, oy, targetZ)
      let fx = (ox[i] - px[i]) * springK;
      let fy = (oy[i] - py[i]) * springK;
      let fz = (targetZ - pz[i]) * (springK * 1.5);

      if (hasCursor) {
        const dx = px[i] - cx;
        const dy = py[i] - cy;
        const dz = pz[i] - cz;
        const d2 = dx * dx + dy * dy + dz * dz;

        if (d2 < repelRadiusSq) {
          const d = Math.sqrt(Math.max(d2, 1.0));
          const norm = (1 - d / repelRadius);
          
          if (isBurst) {
            // High-intensity explosion with upward +z lift towards camera
            const impulse = norm * burstImpulse;
            const inv = 1 / d;
            vx[i] += dx * inv * impulse;
            vy[i] += dy * inv * impulse;
            vz[i] += impulse * 1.4; // upward lift
          } else {
            // Smooth continuous hover repulsion
            const force = norm * peakRepelForce;
            const inv = 1 / d;
            fx += dx * inv * force;
            fy += dy * inv * force;
            fz += force * 1.1; // mild +z lift
          }
        }
      }

      // Physics integration (World Units per Frame)
      vx[i] = (vx[i] + fx) * damping;
      vy[i] = (vy[i] + fy) * damping;
      vz[i] = (vz[i] + fz) * damping;

      // Velocity safety clamping
      vx[i] = Math.max(-20, Math.min(20, vx[i]));
      vy[i] = Math.max(-20, Math.min(20, vy[i]));
      vz[i] = Math.max(-25, Math.min(25, vz[i]));

      px[i] += vx[i];
      py[i] += vy[i];
      pz[i] += vz[i];

      posArr[i * 3] = px[i];
      posArr[i * 3 + 1] = py[i];
      posArr[i * 3 + 2] = pz[i];
    }

    geometry.attributes.position.needsUpdate = true;
    updateLines();

    renderer.render(scene, camera);
  }

  updateLines();
  animate();
})();