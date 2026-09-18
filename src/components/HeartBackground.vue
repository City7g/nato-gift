<template>
  <svg class="heart-background" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <path
      class="heart-background__shape"
      d="M50 94C22 76 4 58 4 36C4 20 16 8 32 8C41 8 47 13 50 22C53 13 59 8 68 8C84 8 96 20 96 36C96 58 78 76 50 94Z"
    />
  </svg>
</template>

<style scoped lang="scss">
.heart-background {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
}

.heart-background__shape {
  fill: #fff;
  stroke: #f3c1ce;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  vector-effect: non-scaling-stroke;
}
</style>
