<template>
  <div class="shareBoot">
    <div class="mask" v-on:click="this.clickMask"></div>
    <div class="boot"></div>
  </div>
</template>

<script>
export default {
  props: {
    maskClick: {
      type: Function,
      default: null
    }
  },
  data: function () {
    return {
    };
  },
  mounted: function () {
  },
  methods: {
    clickMask: function () {
      this.$props.maskClick && this.$props.maskClick();
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../css/common/util.less";

.shareBoot {
  .mask {
    z-index: @zIndexBase;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: @bgColorTransparent;
  }
  .boot {
    z-index: @zIndexBase;
    position: fixed;
    top: 0px;
    right: 0px;
    width: 372px;
    height: 469px;
    background-repeat: no-repeat;
    background-image: url(./assets/boot.png);
  }
}
</style>