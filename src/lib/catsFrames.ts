const modules = import.meta.glob('../assets/cats-frame-*.png', {
  eager: true,
  import: 'default',
}) as Record<string, string>

export const catFrames = Object.keys(modules)
  .sort((a, b) => Number(a.match(/(\d+)\.png$/)?.[1]) - Number(b.match(/(\d+)\.png$/)?.[1]))
  .map((path) => modules[path])

export function preloadCatFrames() {
  return Promise.all(
    catFrames.map(
      (src) =>
        new Promise<void>((resolve) => {
          const image = new Image()
          image.onload = () => resolve()
          image.onerror = () => resolve()
          image.src = src
        }),
    ),
  )
}
