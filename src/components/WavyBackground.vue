<template>
  <svg class="wavy-background" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
    <path class="wavy-background__shape"
      d="M6 0C10 0 13 8 17 8S24 0 28 0 35 8 39 8 46 0 50 0 57 8 61 8 68 0 72 0 79 8 83 8 90 0 94 0A6 6 0 0 1 100 6C100 10 92 13 92 17S100 24 100 28 92 35 92 39 100 46 100 50 92 57 92 61 100 68 100 72 92 79 92 83 100 90 100 94A6 6 0 0 1 94 100C90 100 87 92 83 92S76 100 72 100 65 92 61 92 54 100 50 100 43 92 39 92 32 100 28 100 21 92 17 92 10 100 6 100A6 6 0 0 1 0 94C0 90 8 87 8 83S0 76 0 72 8 65 8 61 0 54 0 50 8 43 8 39 0 32 0 28 8 21 8 17 0 10 0 6A6 6 0 0 1 6 0Z" />
  </svg>
</template>

<style scoped lang="scss">
.wavy-background {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
}

.wavy-background__shape {
  fill: #fff;
  stroke: #f3c1ce;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  vector-effect: non-scaling-stroke;
}
</style>
