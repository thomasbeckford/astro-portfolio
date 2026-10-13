// A little hover robot, drawn by one fragment shader: signed distance fields, raymarched, with soft shadows and
// ambient occlusion. No three.js, no model file: the whole scene is this module, a few KB, cached like any other chunk.
// JS only runs the behaviour (follow the pointer, look at it, blink, wave, backflip on tap) and feeds uniforms.

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`

const FRAG = /* glsl */ `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes;
uniform vec3 uCam, uTa, uRoot, uEyeCol;
uniform float uYaw, uLean, uTilt, uFlip, uThrust;
uniform vec2 uHead, uArmL, uArmR, uAnt;
uniform vec4 uEye; // look x, look y, open (0..1), happy (0..1)

const vec3 SUN = normalize(vec3(-.3, 1., .3));
const float PIVOT = .62;

mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
float sdBox(vec3 p,vec3 b,float r){vec3 q=abs(p)-b+r;return length(max(q,0.))+min(max(q.x,max(q.y,q.z)),0.)-r;}
float sdCap(vec3 p,vec3 a,vec3 b,float r){vec3 pa=p-a,ba=b-a;float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.);return length(pa-ba*h)-r;}
float sdCyl(vec3 p,float h,float r){vec2 d=abs(vec2(length(p.xz),p.y))-vec2(r,h);return min(max(d.x,d.y),0.)+length(max(d,0.));}
float smin(float a,float b,float k){float h=clamp(.5+.5*(b-a)/k,0.,1.);return mix(b,a,h)-k*h*(1.-h);}
vec2 U(vec2 a,vec2 b){return a.x<b.x?a:b;}

// World point into the robot's body space: yaw, then lean/tilt/backflip around the torso.
vec3 toBody(vec3 p){
  p-=uRoot; p.xz=rot(uYaw)*p.xz; p.y-=PIVOT;
  p.yz=rot(uFlip+uTilt)*p.yz; p.xy=rot(uLean)*p.xy;
  p.y+=PIVOT; return p;
}
vec3 toHead(vec3 b){ b.y-=1.02; b.xz=rot(uHead.x)*b.xz; b.yz=rot(uHead.y)*b.yz; b.y-=.2; return b; }

vec3 hand(vec2 a,float side){
  vec3 d=vec3(sin(a.x)*side,-cos(a.x),0.); d.yz=rot(-a.y)*d.yz; return vec3(.37*side,.78,0.)+d*.42;
}

// x: distance, y: material (1 shell, 2 visor, 3 accent, 4 joint, 5 glow)
vec2 map(vec3 p){
  vec3 b=toBody(p);
  float torso=sdBox(b-vec3(0.,.55,0.),vec3(.27,.27,.22),.16);
  float hip=sdCyl(b-vec3(0.,.24,0.),.06,.15);
  vec2 r=vec2(smin(torso,hip,.08),1.);
  r=U(r,vec2(sdCyl(b-vec3(0.,.15,0.),.035,.13),5.));            // thruster ring
  r=U(r,vec2(sdBox(b-vec3(0.,.6,.215),vec3(.11,.07,.02),.02),3.)); // chest badge
  r=U(r,vec2(sdCyl(b-vec3(0.,.9,0.),.07,.07),4.));               // neck
  vec3 hl=vec3(.37,.78,0.),hr=vec3(-.37,.78,0.);
  vec3 el=hand(uArmL,1.),er=hand(uArmR,-1.);
  r=U(r,vec2(min(length(b-hl),length(b-hr))-.075,4.));           // shoulders
  r=U(r,vec2(min(sdCap(b,hl,el,.055),sdCap(b,hr,er,.055)),1.));  // arms
  r=U(r,vec2(min(length(b-el),length(b-er))-.085,3.));           // hands
  vec3 h=toHead(b);
  float head=sdBox(h,vec3(.4,.27,.3),.15);
  r=U(r,vec2(head,1.));
  r=U(r,vec2(sdBox(h-vec3(0.,0.,.28),vec3(.31,.17,.04),.08),2.)); // visor
  vec3 e=h; e.x=abs(e.x)-.42; e.xy=e.yx;
  r=U(r,vec2(sdCyl(e,.04,.11),3.));                               // ears
  vec3 a=h-vec3(.12,.27,0.); a.xy=rot(uAnt.x)*a.xy; a.zy=rot(uAnt.y)*a.zy;
  r=U(r,vec2(sdCap(a,vec3(0.),vec3(0.,.24,0.),.015),4.));         // antenna
  r=U(r,vec2(length(a-vec3(0.,.27,0.))-.045,5.));
  return r;
}

vec3 nrm(vec3 p){
  const vec2 k=vec2(1.,-1.)*.0008;
  return normalize(k.xyy*map(p+k.xyy).x+k.yyx*map(p+k.yyx).x+k.yxy*map(p+k.yxy).x+k.xxx*map(p+k.xxx).x);
}

// Only march where the robot can be: inside a sphere around it.
vec2 sphere(vec3 ro,vec3 rd){
  vec3 oc=ro-(uRoot+vec3(0.,.75,0.)); float b=dot(oc,rd),c=dot(oc,oc)-1.5*1.5,h=b*b-c;
  if(h<0.) return vec2(-1.); h=sqrt(h); return vec2(-b-h,-b+h);
}

float shadow(vec3 ro,vec3 rd){
  vec2 s=sphere(ro,rd); if(s.y<0.) return 1.;
  float res=1.,t=max(s.x,.02);
  for(int i=0;i<28;i++){
    float h=map(ro+rd*t).x; res=min(res,10.*h/t); t+=clamp(h,.02,.25);
    if(res<.002||t>s.y) break;
  }
  return clamp(res,0.,1.);
}

float ao(vec3 p,vec3 n){
  float o=0.,w=1.;
  for(int i=1;i<5;i++){float h=.04*float(i);o+=(h-map(p+n*h).x)*w;w*=.7;}
  return clamp(1.-2.5*o,0.,1.);
}

// Glow from a point light seen along the ray (thruster, antenna tip).
float glow(vec3 ro,vec3 rd,vec3 c,float tmax,float k){
  float t=clamp(dot(c-ro,rd),0.,tmax); float d=length(ro+rd*t-c); return k/(d*d+k*6.);
}

vec3 eyes(vec3 h){
  vec2 uv=(h.xy-vec2(0.,-.01))/vec2(.3,.16);
  uv-=uEye.xy*vec2(.22,.25);
  float d=1e3;
  for(int i=0;i<2;i++){
    vec2 q=uv-vec2(i==0?-.42:.42,0.);
    // open eye: tall rounded pill that squashes when blinking
    vec2 s=vec2(.15,max(.38*uEye.z,.03));
    vec2 w=abs(q)-s+.12; float open=length(max(w,0.))+min(max(w.x,w.y),0.)-.12;
    q.y+=.08; float happy=abs(length(q*vec2(1.,1.4))-.22)-.06; // ^ ^
    happy=max(happy,-q.y+.02);
    d=min(d,mix(open,happy,uEye.w));
  }
  float core=1.-smoothstep(0.,.03,d);
  return uEyeCol*(core*2.2+.5*exp(-max(d,0.)*9.));
}

vec3 env(vec3 r){ return mix(vec3(.02,.025,.035),vec3(.5,.55,.65),smoothstep(-.1,.9,r.y)); }

vec4 shade(vec3 p,vec3 rd,float m){
  vec3 n=nrm(p),v=-rd,b=toBody(p);
  float sh=shadow(p+n*.004,SUN),o=ao(p,n);
  float dif=max(dot(n,SUN),0.)*sh;
  float hemi=.5+.5*n.y;
  float fre=pow(1.-max(dot(n,v),0.),4.);
  float spe=pow(max(dot(reflect(-SUN,n),v),0.),48.)*sh;
  vec3 rim=normalize(vec3(.7,.35,-1.));
  float rd2=pow(max(dot(n,rim),0.),2.);
  vec3 alb=vec3(.86,.86,.84); float gloss=.5;
  if(m==2.){ alb=vec3(.012); gloss=1.6; }
  else if(m==3.){ alb=vec3(.95,.38,.12); gloss=.6; }
  else if(m==4.){ alb=vec3(.12,.13,.15); gloss=.4; }
  vec3 col=alb*(dif*vec3(1.,.95,.88)*1.9+hemi*vec3(.24,.28,.36)*o+rd2*vec3(.35,.55,1.)*.9*o);
  col+=spe*gloss*vec3(1.,.97,.9)+fre*o*(m==2.?env(reflect(rd,n))*.8:vec3(.25,.35,.55)*.35);
  if(m==2.) col+=eyes(toHead(b));
  if(m==5.) col=uEyeCol*(1.2+uThrust*1.5)+fre*.2;
  return vec4(col,1.);
}

void main(){
  vec2 uv=(2.*gl_FragCoord.xy-uRes)/uRes.y;
  vec3 ta=uTa;
  vec3 ww=normalize(ta-uCam),uu=normalize(cross(ww,vec3(0.,1.,0.))),vv=cross(uu,ww);
  vec3 rd=normalize(uv.x*uu+uv.y*vv+3.73*ww); // 3.73 ~ 30deg vertical fov
  vec3 ro=uCam;

  vec4 c=vec4(0.);
  float tHit=1e9;
  vec2 s=sphere(ro,rd);
  if(s.y>0.){
    float t=max(s.x,0.);
    for(int i=0;i<90;i++){
      vec2 h=map(ro+rd*t);
      if(h.x<.0015*t){ c=shade(ro+rd*t,rd,h.y); tHit=t; break; }
      t+=h.x; if(t>s.y) break;
    }
  }
  // Ground: a lit pool under the robot over the transparent page, the soft shadow cut out of it.
  if(c.a==0.&&rd.y<0.){
    float t=-ro.y/rd.y; vec3 p=ro+rd*t;
    vec2 d=p.xz-uRoot.xz;
    float pool=exp(-(d.x*d.x*.25+d.y*d.y*.5));
    float sh=shadow(p+vec3(0.,.002,0.),SUN);
    float lift=uRoot.y-.15;
    float contact=1.-.55*exp(-dot(d,d)*(6./(1.+lift*2.)))/(1.+lift);
    float g=exp(-dot(d,d)*(3./(1.+lift)))*uThrust/(1.+lift*1.5);
    // Fade out before the canvas edges, so the pool never shows the canvas as a box.
    vec2 f=gl_FragCoord.xy/uRes;
    float edge=smoothstep(0.,.22,f.x)*smoothstep(0.,.22,1.-f.x)*smoothstep(0.,.35,f.y);
    c=vec4(vec3(.085)*pool*sh*contact+uEyeCol*g*.12,.5*pool)*edge;
  }
  vec3 th=uRoot+vec3(0.,.08,0.);
  float gl=glow(ro,rd,th,tHit,.004)*uThrust;
  c.rgb+=uEyeCol*gl; c.a=max(c.a,min(gl,1.));

  // Tone map and gamma on straight colour, then premultiply again: gamma on premultiplied colour washes faint glow to white.
  vec3 col=c.a>1e-4?c.rgb/c.a:vec3(0.);
  col=col/(1.+col)*1.25;  // soft shoulder
  col=min(pow(col,vec3(.4545)),1.);
  gl_FragColor=vec4(col*c.a,c.a);
}`

const spring = (x: number, v: number, to: number, k: number, damp: number, dt: number) => {
  v += ((to - x) * k - v * damp) * dt
  return [x + v * dt, v]
}

// One program on a canvas. Exported so the Boti stills (src/assets/boti) can be re-baked from devtools: import this
// module, set the uniforms, render at 4x with preserveDrawingBuffer and downscale.
// failIfMajorPerformanceCaveat: on a software renderer the raymarch would run on the CPU, better no robot.
export function program(canvas: HTMLCanvasElement, preserveDrawingBuffer = false) {
  const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: true, powerPreference: 'low-power', failIfMajorPerformanceCaveat: true, preserveDrawingBuffer })
  if (!gl) throw new Error('no webgl')

  const sh = (type: number, src: string) => {
    const s = gl.createShader(type)!
    gl.shaderSource(s, src)
    gl.compileShader(s)
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? 'shader')
    return s
  }
  const prog = gl.createProgram()!
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT))
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG))
  gl.bindAttribLocation(prog, 0, 'p')
  gl.linkProgram(prog)
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) ?? 'link')
  gl.useProgram(prog)
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  gl.enableVertexAttribArray(0)
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
  const u = (n: string) => gl.getUniformLocation(prog, n)
  const U = Object.fromEntries(['uRes', 'uCam', 'uTa', 'uRoot', 'uEyeCol', 'uYaw', 'uLean', 'uTilt', 'uFlip', 'uThrust', 'uHead', 'uArmL', 'uArmR', 'uAnt', 'uEye'].map((n) => [n, u(n)]))
  return { gl, U }
}

export function mount(stage: HTMLElement, reduced: boolean, area: HTMLElement = stage) {
  const canvas = stage.querySelector('canvas')!
  const { gl, U } = program(canvas)

  // The eyes glow in the page's accent, which the hero changes per trade.
  const probe = document.createElement('i')
  probe.style.cssText = 'display:none;color:var(--color-accent)'
  stage.append(probe)
  let eyeCol = [0.98, 0.8, 0.08]
  const readAccent = () => {
    const m = getComputedStyle(probe).color.match(/[\d.]+/g)
    if (m && m.length >= 3) eyeCol = m.slice(0, 3).map((x) => (Number(x) / 255) ** 2.2)
  }
  readAccent()

  // Camera sits at z=DIST looking at y~1; halfW is the visible half-width on the robot's plane.
  const DIST = 6.8
  const coarse = matchMedia('(pointer: coarse)').matches
  let halfW = 4, range = 3
  const resize = () => {
    // ponytail: fixed DPR caps, adaptive resolution from frame time if phones still struggle.
    const dpr = Math.min(devicePixelRatio, coarse ? 1 : 1.5)
    const w = Math.round(stage.clientWidth * dpr), h = Math.round(stage.clientHeight * dpr)
    if (!w || !h) return // hidden: a 0 height would put NaN in every spring for good
    canvas.width = w
    canvas.height = h
    gl.viewport(0, 0, canvas.width, canvas.height)
    halfW = (DIST / 3.73) * (canvas.width / canvas.height)
    range = Math.max(halfW - 1, 0.3)
  }
  resize()

  // State: position and velocity springs for everything that moves.
  let x = range * 0.45, vx = 0, y = reduced ? 0.5 : 4.5, vy = 0
  let yaw = 0, vyaw = 0, lean = 0, tilt = 0, flip = 0, flipping = false
  let hx = 0, hy = 0, vhx = 0, vhy = 0
  let antX = 0, antVX = 0, antZ = 0, antVZ = 0
  let armL = 0.25, armR = 0.25, wave = 0
  let open = 1, happy = 0, happyUntil = 0, nextBlink = 2
  let tx = x, lookX = 0, lookY = 1.2, pointerAt = -1e9, wanderAt = 0, now = 0, last = performance.now()
  let waved = false, still = 0, thrust = 1
  let accentAt = 0
  let lift = 0, scrollAt = -1e9 // lift: 0 with the hero in place, 1 once it has scrolled mostly away
  const IDLE = 15

  const draw = () => {
    gl.uniform2f(U.uRes, canvas.width, canvas.height)
    gl.uniform3f(U.uCam, x * 0.12, 2.4, DIST)
    gl.uniform3f(U.uTa, x * 0.102, 0.9, 0)
    gl.uniform3f(U.uRoot, x, y + Math.sin(now * 2.1) * 0.04, 0)
    gl.uniform3fv(U.uEyeCol, eyeCol)
    gl.uniform1f(U.uYaw, yaw)
    gl.uniform1f(U.uLean, lean)
    gl.uniform1f(U.uTilt, tilt)
    gl.uniform1f(U.uFlip, flip)
    gl.uniform1f(U.uThrust, thrust)
    gl.uniform2f(U.uHead, hx, hy)
    gl.uniform2f(U.uArmL, armL + Math.sin(now * 1.7) * 0.04, -vx * 0.25)
    gl.uniform2f(U.uArmR, wave ? 2.7 + Math.sin(now * 14) * 0.35 : armR + Math.sin(now * 1.7 + 1) * 0.04, wave ? 0.3 : -vx * 0.25)
    gl.uniform2f(U.uAnt, antX, antZ)
    gl.uniform4f(U.uEye, Math.max(-1, Math.min(1, -hx * 2.2)), Math.max(-1, Math.min(1, -hy * 2.5)), open, happy)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }

  if (reduced) {
    yaw = -0.25
    draw()
    new ResizeObserver(() => (resize(), draw())).observe(stage)
    // A lost context would leave an empty box still announced as an image.
    canvas.addEventListener('webglcontextlost', () => stage.replaceChildren())
    // Picking a trade changes the accent; repaint so the eyes follow.
    document.addEventListener('input', () => setTimeout(() => (readAccent(), draw()), 50))
    let back = 0
    return {
      cheer() {
        happy = 1
        draw()
        clearTimeout(back)
        back = window.setTimeout(() => ((happy = 0), draw()), 1400)
      },
    }
  }

  const frame = () => {
    const t = performance.now()
    const dt = Math.min((t - last) / 1000, 0.05)
    last = t
    now += dt
    if (now - accentAt > 0.5) ((accentAt = now), readAccent())

    const following = now - pointerAt < 2.5
    const idle = now - Math.max(pointerAt, scrollAt) > IDLE && now > IDLE
    if (!following && !idle && now > wanderAt) {
      tx = (Math.random() * 2 - 1) * range
      wanderAt = now + 3 + Math.random() * 4
      lookX = tx
      lookY = 1 + Math.random() * 0.6
    }
    const target = Math.max(-range, Math.min(range, tx))
    ;[x, vx] = spring(x, vx, target, 6, 4.2, dt)
    // Scrolling away: it takes off, thruster up, and looks down at where you're headed. Back up: it lands.
    ;[y, vy] = spring(y, vy, 0.5 + (flipping ? 0.5 : 0) + lift * lift * 2.4, 14, 5, dt)
    thrust += ((0.6 + Math.min(Math.abs(vx) * 0.5 + Math.abs(vy) * 0.3 + lift * 1.2 + (flipping ? 1 : 0), 1.6)) - thrust) * Math.min(dt * 6, 1)

    // Lean into the move, turn slightly toward it, settle facing the visitor.
    lean += (-vx * 0.12 - lean) * Math.min(dt * 8, 1)
    tilt += (Math.abs(vx) * 0.06 - tilt) * Math.min(dt * 8, 1)
    ;[yaw, vyaw] = spring(yaw, vyaw, Math.max(-0.6, Math.min(0.6, -vx * 0.18)), 30, 9, dt)
    if (flipping) {
      flip -= dt * 9
      if (flip < -Math.PI * 2) ((flip = 0), (flipping = false))
    }

    // Head (and pupils) look at the pointer, or wherever it is going.
    const gx = Math.atan2(lookX - x, 2.2), gy = Math.atan2(lookY - (y + 1.2), 2.6)
    ;[hx, vhx] = spring(hx, vhx, Math.max(-0.7, Math.min(0.7, -gx)) - yaw, 60, 12, dt)
    ;[hy, vhy] = spring(hy, vhy, Math.max(-0.35, Math.min(0.4, -gy + lift * 0.6)), 60, 12, dt)
    // Antenna lags behind the body like a spring on a stick.
    ;[antX, antVX] = spring(antX, antVX, vx * 0.25 + lean * 2, 90, 6, dt)
    ;[antZ, antVZ] = spring(antZ, antVZ, vy * 0.08, 90, 6, dt)

    if (now > nextBlink) {
      open = 0
      nextBlink = now + 2 + Math.random() * 3.5
    }
    open = Math.min(1, open + dt * 9)
    happy += ((now < happyUntil ? 1 : 0) - happy) * Math.min(dt * 10, 1)

    // Pointer parked near it for a beat: it waves, once per visit.
    still = following && Math.abs(vx) < 0.15 && Math.abs(target - x) < 0.3 ? still + dt : 0
    if (still > 0.8 && !waved) ((waved = true), (wave = 1), (happyUntil = now + 1.6))
    if (wave && now > happyUntil) wave = 0

    draw()
    // Nobody around for a while: once it has settled, stop for good until the next pointer (WCAG 2.2.2).
    return idle && !flipping && open === 1 && Math.abs(vx) < 0.01 && Math.abs(vy) < 0.01 && Math.abs(target - x) < 0.01
  }

  const worldX = (e: PointerEvent) => {
    const r = stage.getBoundingClientRect()
    return (((e.clientX - r.left) / r.width) * 2 - 1) * halfW
  }
  const worldY = (e: PointerEvent) => {
    const r = stage.getBoundingClientRect()
    return 0.95 + (1 - ((e.clientY - r.top) / r.height) * 2) * (DIST / 3.73)
  }
  area.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return
    if (now - pointerAt > 2.5) waved = false
    pointerAt = now
    wake()
    lookX = worldX(e)
    lookY = worldY(e)
    tx = lookX - Math.sign(lookX - x) * 0.9
  })
  const onScroll = () => {
    const r = area.getBoundingClientRect()
    const l = Math.max(0, Math.min(1, -r.top / r.height))
    if (l === lift) return
    lift = l
    scrollAt = now
    wake()
  }
  addEventListener('scroll', onScroll, { passive: true })
  // Tap or click: it comes over; on the robot itself, a backflip.
  stage.addEventListener('pointerdown', (e) => {
    const wx = worldX(e), wy = worldY(e)
    pointerAt = now
    wake()
    lookX = wx
    lookY = wy
    if (Math.abs(wx - x) < 0.7 && wy > y - 0.2 && wy < y + 1.7) {
      if (!flipping) ((flipping = true), (vy = 6), (happyUntil = now + 1.4))
    } else {
      tx = wx
      waved = false
    }
  })

  // Only animates while on screen; the first time in view it drops in from above.
  let raf = 0, visible = false, dead = false
  const loop = () => {
    raf = frame() ? 0 : requestAnimationFrame(loop)
  }
  function wake() {
    if (raf || !visible || dead) return
    last = performance.now()
    readAccent() // the trade may have changed while it was stopped
    loop()
  }
  new IntersectionObserver(([e]) => {
    cancelAnimationFrame(raf)
    raf = 0
    visible = e.isIntersecting
    wake()
  }).observe(stage)
  // Mobile browsers drop the context under memory pressure; an empty stage beats a frozen blank box.
  canvas.addEventListener('webglcontextlost', () => (cancelAnimationFrame(raf), (dead = true), stage.replaceChildren()))
  // Resizing clears the canvas; repaint when the loop isn't running to do it.
  new ResizeObserver(() => (resize(), raf || dead || draw())).observe(stage)
  onScroll() // after raf/visible exist: wake() reads them
  // Something on the page went well: happy eyes and a wave.
  return {
    cheer() {
      happyUntil = now + 1.4
      wave = 1
      wake()
    },
  }
}
