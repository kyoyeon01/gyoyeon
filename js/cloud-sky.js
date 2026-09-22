const CLOUD_SKY_MAX_DPR = 2;

const CLOUD_SKY_VERTEX = `
attribute vec2 a_pos;
void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const CLOUD_SKY_FRAGMENT = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 uRes;
uniform float uNearX, uFarX, uCirrusX;
uniform float uCoverage, uSize, uSoftness, uShadow, uCirrus;
uniform vec3 uZenith, uHorizon, uCloud;
uniform vec4 uGlow;
uniform vec2 uSun;
uniform vec2 uParallax;

vec2 hash22(vec2 p){
  vec3 q = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  q += dot(q, q.yzx + 33.33);
  return fract((q.xx + q.yz) * q.zy);
}

float hash12(vec2 p){
  vec3 q = fract(vec3(p.xyx) * 0.1031);
  q += dot(q, q.yzx + 33.33);
  return fract((q.x + q.y) * q.z);
}

float vnoise(vec2 x){
  vec2 i = floor(x), f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash12(i), hash12(i + vec2(1.0, 0.0)), f.x),
    mix(hash12(i + vec2(0.0, 1.0)), hash12(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

float fbm(vec2 p){
  float a = 0.5, s = 0.0;
  for (int i = 0; i < 4; i++){
    s += a * vnoise(p);
    p *= 2.03;
    a *= 0.5;
  }
  return s;
}

vec2 blobs(vec2 uv, float seed){
  vec2 id = floor(uv), f = fract(uv);
  float best = -1e4;
  float wsum = 0.0, ysum = 0.0;
  float wMax = min(2.15, 0.72 * uSize);
  float reach = min(2.0, ceil(wMax + 0.85) - 1.0);

  for (int j = -2; j <= 2; j++){
    for (int i = -2; i <= 2; i++){
      vec2 o = vec2(float(i), float(j));
      if (max(abs(o.x), abs(o.y)) > reach) continue;
      vec2 h = hash22(id + o + seed);
      if (fract(h.x * 37.1) > uCoverage) continue;

      vec2 c = o + 0.15 + h * 0.7;
      float w = min(2.15, (0.30 + 0.42 * fract(h.y * 19.7)) * uSize);
      vec2 d = f - c;
      float ry = (d.y > 0.0 ? 0.34 : 0.19) * uSize
        * (0.8 + 0.5 * fract(h.y * 7.3));
      float e = length(vec2(d.x / max(w, 1e-3), d.y / max(ry, 1e-3)));
      float val = 1.0 - e;
      float yN = d.y / max(ry, 1e-3);

      if (val > best){
        float k = exp(12.0 * (best - val));
        wsum = wsum * k + 1.0;
        ysum = ysum * k + yN;
        best = val;
      } else {
        float g = exp(12.0 * (val - best));
        wsum += g;
        ysum += g * yN;
      }
    }
  }
  return vec2(best, ysum / max(wsum, 1e-4));
}

vec2 cloudField(vec2 uv, float seed, float detailScale){
  vec2 b = blobs(uv, seed);
  float n = fbm(uv * detailScale + seed * 3.1) * 0.72
    + fbm(uv * detailScale * 3.3 + seed * 7.7) * 0.28;
  return vec2(b.x - (1.0 - n) * 0.7, b.y);
}

vec3 shadeCloud(float dyNorm, vec3 sky){
  float t = smoothstep(-0.95, 0.25, dyNorm);
  vec3 base = mix(uCloud * 0.52, sky, 0.34);
  return mix(mix(uCloud, base, uShadow), uCloud, t);
}

void main(){
  vec2 frag = gl_FragCoord.xy / max(uRes.y, 1.0);
  float aspect = uRes.x / max(uRes.y, 1.0);
  vec2 p = vec2(frag.x, frag.y);
  vec3 sky = mix(uHorizon, uZenith, smoothstep(-0.15, 1.05, p.y));
  vec2 sunP = vec2(uSun.x * aspect, uSun.y);
  float sd = length(p - sunP);
  sky += uGlow.rgb * uGlow.a * exp(-sd * 3.4) * 0.30;
  vec3 col = sky;

  if (uCirrus > 0.0) {
    vec2 cuv = vec2(p.x * 1.4 + uCirrusX, p.y * 5.5);
    float veil = fbm(cuv) * fbm(cuv * 2.3 + 9.0);
    veil = smoothstep(0.24, 0.55, veil) * smoothstep(0.15, 0.7, p.y);
    col = mix(col, uCloud, veil * uCirrus * 0.5);
  }

  vec2 fuv = vec2(p.x + uFarX, p.y) * 2.15 + uParallax * 0.4;
  vec2 fd = cloudField(fuv, 17.0, 11.0);
  float fa = clamp(fd.x * uSoftness, 0.0, 1.0);
  if (fa > 0.0) {
    vec3 lit = shadeCloud(fd.y, sky);
    col = mix(col, mix(lit, sky, 0.55), fa);
  }

  vec2 nuv = vec2(p.x + uNearX, p.y) * 1.05 + uParallax;
  vec2 nd = cloudField(nuv, 3.0, 8.5);
  float na = clamp(nd.x * uSoftness, 0.0, 1.0);
  if (na > 0.0) {
    vec3 lit = shadeCloud(nd.y, sky);
    float above = clamp(
      cloudField(nuv + vec2(0.0, 0.085), 3.0, 8.5).x * uSoftness,
      0.0,
      1.0
    );
    lit *= 1.0 - 0.18 * uShadow * above;
    lit += uGlow.rgb * uGlow.a * 0.22
      * exp(-length(p - sunP) * 1.6);
    col = mix(col, lit, na);
  }

  gl_FragColor = vec4(col, 1.0);
}
`;

function compileCloudShader(gl, type, source) {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("CloudSky shader:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function parseCloudColor(input, fallback) {
  const match = String(input).match(/[\d.]+/g);
  if (!match || match.length < 3) return fallback;

  return [
    Math.min(255, Number(match[0])) / 255,
    Math.min(255, Number(match[1])) / 255,
    Math.min(255, Number(match[2])) / 255,
    match.length >= 4 ? Math.min(1, Number(match[3])) : 1,
  ];
}

function parseCloudHex(input, fallback) {
  const value = String(input).replace("#", "");
  if (!/^[\da-f]{6}$/i.test(value)) return fallback;

  return [
    parseInt(value.slice(0, 2), 16) / 255,
    parseInt(value.slice(2, 4), 16) / 255,
    parseInt(value.slice(4, 6), 16) / 255,
    1,
  ];
}

function initCloudSky() {
  const canvas = document.querySelector("[data-cloud-sky]");
  const hero = canvas?.closest(".hero");
  if (!canvas || !hero) return;

  const gl =
    canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      failIfMajorPerformanceCaveat: false,
    }) ||
    canvas.getContext("experimental-webgl", {
      alpha: false,
      antialias: false,
      depth: false,
    }) ||
    canvas.getContext("webgl");
  if (!gl) return;

  const vertex = compileCloudShader(gl, gl.VERTEX_SHADER, CLOUD_SKY_VERTEX);
  const fragment = compileCloudShader(gl, gl.FRAGMENT_SHADER, CLOUD_SKY_FRAGMENT);
  if (!vertex || !fragment) return;

  const program = gl.createProgram();
  if (!program) return;

  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("CloudSky link:", gl.getProgramInfoLog(program));
    return;
  }
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW,
  );

  const position = gl.getAttribLocation(program, "a_pos");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const locations = {};
  const uniform = (name) => {
    if (!(name in locations)) locations[name] = gl.getUniformLocation(program, name);
    return locations[name];
  };

  const zenith = parseCloudHex("#0075FF", [0, 0.46, 1, 1]);
  const horizon = parseCloudHex("#AFDBFA", [0.69, 0.86, 0.98, 1]);
  const cloud = parseCloudHex("#FFFFFF", [1, 1, 1, 1]);
  const glow = parseCloudColor("rgba(255, 255, 255, 1)", [1, 1, 1, 1]);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pointer = { x: 0, y: 0, inside: false };

  let width = 1;
  let height = 1;
  let nearX = 0;
  let farX = 0;
  let cirrusX = 0;
  let leanX = 0;
  let leanY = 0;
  let last = performance.now();
  let raf = 0;
  let inView = true;

  const resize = () => {
    const rect = hero.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
  };

  const draw = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const damping = 50;
    const k = 1 - Math.exp(-damping * 0.12 * dt);

    leanX += ((pointer.inside ? pointer.x : 0) - leanX) * k;
    leanY += ((pointer.inside ? pointer.y : 0) - leanY) * k;

    if (!reducedMotion) {
      const rate = 1.28 * (1 + leanX * 3);
      nearX = (nearX - 0.055 * rate * dt) % 1000;
      farX = (farX - 0.026 * rate * dt) % 1000;
      cirrusX = (cirrusX - 0.014 * rate * dt) % 1000;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, CLOUD_SKY_MAX_DPR);
    const bufferWidth = Math.max(1, Math.round(width * dpr));
    const bufferHeight = Math.max(1, Math.round(height * dpr));

    if (canvas.width !== bufferWidth || canvas.height !== bufferHeight) {
      canvas.width = bufferWidth;
      canvas.height = bufferHeight;
    }

    gl.viewport(0, 0, bufferWidth, bufferHeight);
    gl.uniform2f(uniform("uRes"), bufferWidth, bufferHeight);
    gl.uniform1f(uniform("uNearX"), nearX);
    gl.uniform1f(uniform("uFarX"), farX);
    gl.uniform1f(uniform("uCirrusX"), cirrusX);
    gl.uniform1f(uniform("uCoverage"), 1);
    gl.uniform1f(uniform("uSize"), 1.3);
    gl.uniform1f(uniform("uSoftness"), 2.25);
    gl.uniform1f(uniform("uShadow"), 0.7);
    gl.uniform1f(uniform("uCirrus"), 1);
    gl.uniform2f(uniform("uSun"), 1, 1);
    gl.uniform2f(uniform("uParallax"), -leanX * 0.21, -leanY * 0.15);
    gl.uniform3f(uniform("uZenith"), zenith[0], zenith[1], zenith[2]);
    gl.uniform3f(uniform("uHorizon"), horizon[0], horizon[1], horizon[2]);
    gl.uniform3f(uniform("uCloud"), cloud[0], cloud[1], cloud[2]);
    gl.uniform4f(uniform("uGlow"), glow[0], glow[1], glow[2], glow[3]);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const render = (now) => {
    draw(now);
    if (!reducedMotion && inView && !document.hidden) {
      raf = requestAnimationFrame(render);
    }
  };

  const start = () => {
    if (reducedMotion || raf || document.hidden || !inView) return;
    last = performance.now();
    raf = requestAnimationFrame(render);
  };

  const stop = () => {
    cancelAnimationFrame(raf);
    raf = 0;
  };

  const trackPointer = (event) => {
    const rect = hero.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = 1 - ((event.clientY - rect.top) / rect.height) * 2;
    pointer.inside = true;
  };

  const leavePointer = () => {
    pointer.inside = false;
  };

  const handleVisibility = () => {
    if (document.hidden) stop();
    else start();
  };

  const resizeObserver = new ResizeObserver(() => {
    resize();
    if (reducedMotion) draw(performance.now());
  });

  const viewObserver = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    if (inView) start();
    else stop();
  });

  resize();
  resizeObserver.observe(hero);
  viewObserver.observe(hero);
  hero.addEventListener("pointermove", trackPointer, { passive: true });
  hero.addEventListener("pointerenter", trackPointer, { passive: true });
  hero.addEventListener("pointerleave", leavePointer);
  document.addEventListener("visibilitychange", handleVisibility);

  draw(performance.now());
  start();

  window.addEventListener(
    "pagehide",
    () => {
      stop();
      resizeObserver.disconnect();
      viewObserver.disconnect();
      hero.removeEventListener("pointermove", trackPointer);
      hero.removeEventListener("pointerenter", trackPointer);
      hero.removeEventListener("pointerleave", leavePointer);
      document.removeEventListener("visibilitychange", handleVisibility);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    },
    { once: true },
  );
}

document.addEventListener("DOMContentLoaded", initCloudSky);
