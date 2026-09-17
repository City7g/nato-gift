const COLORS = ['#ff4d94', '#ff7eb6', '#f43f86', '#ff9ec0', '#e85a8c', '#ff5ea8']
const MAX_PARTICLES = 260
const GRAVITY = 160
const DRAG = 0.7

type HeartParticle = {
  x: number
  y: number
  vx: number
  vy: number
  rotation: number
  vr: number
  size: number
  color: string
  born: number
  ttl: number
}

function createParticle(x: number, y: number, now: number): HeartParticle {
  const angle = Math.random() * Math.PI * 2
  const speed = 260 + Math.random() * 520
  const offset = 16 + Math.random() * 28

  return {
    x: x + Math.cos(angle) * offset,
    y: y + Math.sin(angle) * offset,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    rotation: Math.random() * Math.PI * 2,
    vr: (Math.random() - 0.5) * 8,
    size: 14 + Math.random() * 18,
    color: COLORS[(Math.random() * COLORS.length) | 0],
    born: now,
    ttl: 1100 + Math.random() * 700,
  }
}

function drawHeart(ctx: CanvasRenderingContext2D, particle: HeartParticle, progress: number) {
  const fade = progress > 0.65 ? 1 - (progress - 0.65) / 0.35 : 1
  const scale = particle.size * (0.85 + Math.sin(progress * Math.PI) * 0.25)

  ctx.save()
  ctx.translate(particle.x, particle.y)
  ctx.rotate(particle.rotation)
  ctx.scale(scale / 18, scale / 18)
  ctx.globalAlpha = Math.max(0, fade)
  ctx.fillStyle = particle.color
  ctx.beginPath()
  ctx.moveTo(0, 6)
  ctx.bezierCurveTo(-14, -6, -8, -16, 0, -9)
  ctx.bezierCurveTo(8, -16, 14, -6, 0, 6)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

export function createHeartBurst(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('2d context is not available')
  }

  const particles: HeartParticle[] = []
  let width = 0
  let height = 0
  let rafId = 0
  let running = false
  let lastTime = 0

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    width = window.innerWidth
    height = window.innerHeight
    canvas.width = Math.floor(width * dpr)
    canvas.height = Math.floor(height * dpr)
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  function burst(x: number, y: number, count = 32) {
    const now = performance.now()
    const room = MAX_PARTICLES - particles.length
    const spawnCount = Math.min(count, room)

    for (let i = 0; i < spawnCount; i++) {
      particles.push(createParticle(x, y, now))
    }

    if (!running && particles.length > 0) {
      running = true
      lastTime = now
      rafId = requestAnimationFrame(tick)
    }
  }

  function tick(now: number) {
    const dt = Math.min(0.032, (now - lastTime) / 1000)
    lastTime = now

    ctx.clearRect(0, 0, width, height)

    for (let i = particles.length - 1; i >= 0; i--) {
      const particle = particles[i]
      const age = now - particle.born

      if (age >= particle.ttl) {
        particles.splice(i, 1)
        continue
      }

      particle.vy += GRAVITY * dt
      particle.vx *= 1 - DRAG * dt
      particle.vy *= 1 - DRAG * 0.35 * dt
      particle.x += particle.vx * dt
      particle.y += particle.vy * dt
      particle.rotation += particle.vr * dt

      drawHeart(ctx, particle, age / particle.ttl)
    }

    if (particles.length === 0) {
      running = false
      ctx.clearRect(0, 0, width, height)
      return
    }

    rafId = requestAnimationFrame(tick)
  }

  function destroy() {
    running = false
    cancelAnimationFrame(rafId)
    particles.length = 0
    ctx.clearRect(0, 0, width, height)
  }

  resize()

  return { burst, resize, destroy }
}
