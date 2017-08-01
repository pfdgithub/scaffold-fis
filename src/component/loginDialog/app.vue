<template>
  <div class="dialog" v-bind:style="{zIndex: zIndex}">
    <div class="mask" v-bind:style="{zIndex: zIndex}"></div>
    <div class="container" v-bind:style="{zIndex: zIndex}">
      <div class="close" v-on:click="closeDialog"></div>
      <div class="title"></div>
      <div class="content">
        <div class="username" v-if="step == 1">
          <i class="icon"></i>
          <input type="text" class="input" placeholder="输入手机号" v-model.trim="username">
        </div>
        <div class="password" v-if="step == 2">
          <i class="icon"></i>
          <input type="password" class="input" placeholder="请输入密码" v-model.trim="password">
        </div>
        <div class="error">
          {{errorMsg}}
        </div>
        <input type="button" class="next" value="下一步" v-if="step == 1" v-on:click="checkUsername">
        <input type="button" class="login" value="登录" v-if="step == 2" v-on:click="checkPassword">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    defaultZIndex: {
      type: Number,
      default: 1
    },
    destroyCb: Function,
    checkCb: Function,
    loginCb: Function
  },
  data: function () {
    return {
      zIndex: this.defaultZIndex,
      step: 1,
      username: '',
      password: '',
      errorMsg: ''
    };
  },
  methods: {
    closeDialog: function () {
      this.destroyCb && this.destroyCb();
    },
    checkUsername: function () {
      this.checkCb && this.checkCb(
        this.username,
        (errorMsg) => {
          if (errorMsg) {
            this.errorMsg = errorMsg;
          }
          else {
            this.errorMsg = '';
            this.step = 2;
          }
        }
      );
    },
    checkPassword: function () {
      this.loginCb && this.loginCb(
        this.username,
        this.password,
        (errorMsg) => {
          if (errorMsg) {
            this.errorMsg = errorMsg;
          }
          else {
            this.errorMsg = '';
            this.destroyCb && this.destroyCb();
          }
        }
      );
    }
  }
}
</script>

<style lang="less" scoped>
.dialog {
  .mask {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 2;
  }
  .container {
    position: fixed;
    top: 15%;
    left: 50%;
    z-index: 2;

    width: 650px;
    margin-left: -345px;
    padding: 20px;
    border-radius: 10px;
    background-color: #fff;
    .close {
      position: absolute;
      top: 20px;
      right: 20px;
      width: 36px;
      height: 36px;
      cursor: pointer;
      background-repeat: no-repeat;
      background-image: url('./assets/close.png?__inline');
    }
    .title {
      height: 70px;
      padding: 10px;
      border-bottom: 2px solid #F7F7F7;
      background-repeat: no-repeat;
      background-position: center;
      background-clip: content-box;
      background-image: url('./assets/logo.png?__inline');
    }
    .content {
      padding: 10px 0px;
      .username,
      .password {
        position: relative;
        .icon {
          position: absolute;
          top: 40px;
          left: 50px;
          width: 36px;
          height: 36px;
          background-repeat: no-repeat;
        }
        .input {
          width: 450px;
          height: 100px;
          margin: 10px 0;
          padding: 0 100px;
          outline: 0;
          border: 0;
          border-radius: 50px;
          font-size: 30px;
          color: #000;
          background-color: #F7F7F7;
        }
      }
      .username {
        .icon {
          background-image: url('./assets/username.png?__inline');
        }
      }
      .password {
        .icon {
          background-image: url('./assets/password.png?__inline');
        }
      }
      .error {
        text-align: center;
        font-size: 30px;
        color: #F43530;
      }
      .next,
      .login {
        width: 650px;
        height: 100px;
        margin: 10px 0;
        border: 0;
        border-radius: 50px;
        font-size: 30px;
        color: #fff;
        background-color: #3db1fa;
      }
    }
  }
}
</style>