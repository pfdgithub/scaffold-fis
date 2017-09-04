<template>
  <div class="toast">
    <div class="mask" v-if="this.$props.mask"></div>
    <div class="container">
      <i v-bind:class="['icon', this.$props.type]" v-if="this.$props.type"></i>
      <div class="text" v-text="this.$props.content"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: '',
      validator: function (value) {
        let arr = ['', 'success', 'fail', 'offline', 'loading'];
        return arr.indexOf(value) > -1;
      }
    },
    content: {
      type: String,
      default: ''
    },
    mask: {
      type: Boolean,
      default: true
    }
  },
  data: function () {
    return {
    };
  },
  mounted: function () {
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
@import "../../css/common/util.less";

@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}

.toast {
  .mask {
    z-index: @zIndexBase;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .container {
    z-index: @zIndexBase;
    position: fixed;
    top: 50%;
    left: 50%;
    max-width: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(0, 0, 0, 0.7);
    text-align: center;
    padding: 10px;
    border-radius: 10px;
    .icon {
      display: inline-block;
      margin: 10px;
      width: 80px;
      height: 80px;
      background-position: center;
      background-repeat: no-repeat;
      &.success {
        background-image: url(./assets/success.png?__inline);
      }
      &.fail {
        background-image: url(./assets/fail.png?__inline);
      }
      &.offline {
        background-image: url(./assets/dislike.png?__inline);
      }
      &.loading {
        background-image: url(./assets/loading.png?__inline);
        animation: rotate 1s linear infinite;
      }
    }
    .text {
      color: #fff;
      font-size: 28px;
      line-height: 1.5;
      word-break: break-all;
    }
  }
}
</style>