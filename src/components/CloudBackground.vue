<template>
  <div class="cloud-background">
    <div class="cloud-background__stage">
      <svg
        class="cloud-background__shape"
        viewBox="0 0 400 640"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <g fill="#ffffff" fill-opacity="0.55">
          <ellipse cx="200" cy="320" rx="152" ry="248" />
          <ellipse cx="200" cy="78" rx="118" ry="62" />
          <ellipse cx="82" cy="168" rx="90" ry="78" />
          <ellipse cx="318" cy="162" rx="86" ry="74" />
          <ellipse cx="68" cy="320" rx="78" ry="108" />
          <ellipse cx="332" cy="328" rx="76" ry="112" />
          <ellipse cx="102" cy="500" rx="96" ry="80" />
          <ellipse cx="290" cy="508" rx="100" ry="76" />
          <ellipse cx="200" cy="572" rx="124" ry="58" />
        </g>
      </svg>

      <div class="cloud-background__content">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cloud-background {
  min-height: 100svh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background:
    radial-gradient(circle at 16% 10%, #ffffff 0, transparent 26%),
    radial-gradient(circle at 86% 8%, #ffeef4 0, transparent 32%),
    radial-gradient(circle at 50% 100%, #ffd0e1 0, transparent 44%),
    linear-gradient(180deg, #fff6f8 0%, #ffdce8 52%, #ffd0e0 100%);
}

.cloud-background__stage {
  position: relative;
  width: min(440px, 94vw);
}

.cloud-background__shape {
  position: absolute;
  inset: -6% -10%;
  width: 120%;
  height: 112%;
  pointer-events: none;
}

.cloud-background__content {
  position: relative;
  z-index: 1;
  padding: 36px 24px 48px;
}
</style>
