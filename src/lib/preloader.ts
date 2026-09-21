export function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

export function hidePreloader() {
  const el = document.getElementById('preloader')
  if (!el) return Promise.resolve()

  el.classList.add('preloader--leave')
  el.setAttribute('aria-busy', 'false')

  return new Promise<void>((resolve) => {
    let settled = false

    const done = () => {
      if (settled) return
      settled = true
      el.remove()
      resolve()
    }

    el.addEventListener('transitionend', done, { once: true })
    window.setTimeout(done, 500)
  })
}
