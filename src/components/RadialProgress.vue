<template>
  <svg class="radial-progress" preserveAspectRatio="xMidYMid meet"  x="0"   y="0"  :viewBox="'0 0 ' + radius*2 + ' ' + radius*2" width="100" height="100">
    <defs>
      <filter id="inset-shadow">
        <feFlood flood-color="black"/>
        <feComposite operator="out" in2="SourceGraphic"/>
        <feGaussianBlur :stdDeviation="stroke * 0.35"/>
        <feComposite operator="atop" in2="SourceGraphic"/>
      </filter>
    </defs>

    <circle
      name="track"
      filter="url(#inset-shadow)"
      stroke="#fff"
      fill="transparent"
      :transform="'rotate('+ rotation +', '+ radius +', ' + radius + ')'"
      :stroke-dasharray="(circumference * cutoff)"
      :stroke-width="stroke + stroke * 0.15"
      stroke-linecap="round"
      :r="normalizedRadius"
      :cx="radius"
      :cy="radius"
    />

    <!-- <circle
      ref="delayedProgress"
      name="delayedProgress"
      stroke="yellow"
      fill="transparent"
      :transform="'rotate('+ rotation +', '+ radius +', ' + radius + ')'"
      :stroke-dasharray="(circumference * cutoff) + ' ' + circumference"
      :stroke-dashoffset="strokeDashoffset"
      :stroke-width="stroke"
      stroke-linecap="round"
      :r="normalizedRadius"
      :cx="radius"
      :cy="radius"
    >
    </circle> -->

    <circle
      name="progress"
      :stroke="color"
      fill="transparent"
      :transform="'rotate('+ rotation +', '+ radius +', ' + radius + ')'"
      :stroke-dasharray="(circumference * cutoff) + ' ' + circumference"
      :stroke-dashoffset="strokeDashoffset"
      :stroke-width="stroke"
      stroke-linecap="round"
      :r="normalizedRadius"
      :cx="radius"
      :cy="radius"
    />
    <text x="50%" y="50%" text-anchor="middle" alignment-baseline="middle" font-size="600%" fill="#333"><slot></slot></text>
  </svg>
</template>

<script>
export default {
  props: {
    progress: {
      type: Number,
      default: 0
    },
    stroke: {
      type: Number,
      default: 10
    },
    cutoff: {
      type: Number,
      default: 0.8
    },
    color: {
      type: String,
      default: '#f80759'
    },
    animationLength: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      radius: 100
    }
  },
  computed: {
    strokeDashoffset() {
      return (this.circumference - this.progress / 100 * this.circumference) * this.cutoff;
    },
    normalizedRadius() {
      return this.radius - this.stroke;
    },
    circumference() {
      return (this.normalizedRadius * 2) * Math.PI;
    },
    rotation(){
      return ( (1 - this.cutoff) * 180) + 90
    }
  }
};
</script>
<style scoped>
.radial-progress {
  width: 100%;
  height: auto;
}
</style>