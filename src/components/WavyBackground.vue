<template>
  <svg class="wavy-background" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
    <path class="wavy-background__shape"
      d="M6 0C11.72 0 11.28 8 17 8C22.72 8 22.28 0 28 0C33.72 0 33.28 8 39 8C44.72 8 44.28 0 50 0C55.72 0 55.28 8 61 8C66.72 8 66.28 0 72 0C77.72 0 77.28 8 83 8C88.72 8 88.28 0 94 0A6 6 0 0 1 100 6C100 11.72 92 11.28 92 17C92 22.72 100 22.28 100 28C100 33.72 92 33.28 92 39C92 44.72 100 44.28 100 50C100 55.72 92 55.28 92 61C92 66.72 100 66.28 100 72C100 77.72 92 77.28 92 83C92 88.72 100 88.28 100 94A6 6 0 0 1 94 100C88.28 100 88.72 92 83 92C77.28 92 77.72 100 72 100C66.28 100 66.72 92 61 92C55.28 92 55.72 100 50 100C44.28 100 44.72 92 39 92C33.28 92 33.72 100 28 100C22.28 100 22.72 92 17 92C11.28 92 11.72 100 6 100A6 6 0 0 1 0 94C0 88.28 8 88.72 8 83C8 77.28 0 77.72 0 72C0 66.28 8 66.72 8 61C8 55.28 0 55.72 0 50C0 44.28 8 44.72 8 39C8 33.28 0 33.72 0 28C0 22.28 8 22.72 8 17C8 11.28 0 11.72 0 6A6 6 0 0 1 6 0Z" />
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
