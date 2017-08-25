<template>
  <span class="musicControl">
    <i v-bind:class="['musicIcon', {playing: this.$data.isPlaying}]" v-on:click="this.switchMusicState"></i>
    <audio class="musicAudio" ref="musicAudio" loop v-bind:autoplay="this.$props.autoplay" v-bind:src="this.$props.musicAudio"></audio>
  </span>
</template>

<script>
export default {
  props: {
    autoplay: {
      type: Boolean,
      default: false
    },
    musicAudio: {
      type: String,
      default: __uri('./assets/bgm.mp3')
    }
  },
  data: function () {
    return {
      isPlaying: this.$props.autoplay
    };
  },
  mounted: function () {
    if (this.$props.autoplay) {
      // 微信自动播放
      if (window.wx) {
        wx.ready(() => {
          this.$refs.musicAudio.load();
          this.playMusic();
        });
      }
    }
  },
  methods: {
    playMusic: function () {
      this.$refs.musicAudio.play();
      this.$data.isPlaying = true;
    },
    pauseMusic: function () {
      this.$refs.musicAudio.pause();
      this.$data.isPlaying = false;
    },
    switchMusicState: function () {
      if (this.$data.isPlaying) {
        this.pauseMusic();
      }
      else {
        this.playMusic();
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../css/common/util.less";

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.musicControl {
  .musicIcon {
    display: inline-block;
    width: 66px;
    height: 66px;
    background-repeat: no-repeat;
    background-image: url(./assets/music.png?__inline);
    &.playing {
      animation: rotate 2s linear infinite;
    }
  }
  .musicAudio {
    width: 0px;
    height: 0px;
  }
}
</style>