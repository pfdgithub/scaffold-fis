<template>
  <div class="test">
    <span class="date">{{date}}</span>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      date: Date.now()
    };
  }
}
</script>

<style lang="less" scoped>
.test {
  border: 1px solid red;
  .date {
    border: 1px solid green;
  }
}
</style>