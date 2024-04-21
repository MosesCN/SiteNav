<template>
  <div style="margin: 10px 0;">
    <!-- https://symbl.cc/cn/ -->
    <el-text :type="type" size="large" class="hitokoto"> &#8220;{{ slogan.hitokoto }}&#8221; {{ slogan.who ? ' - ' +
      slogan.who : '' }}</el-text>
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue'
  import axios from 'axios'
  const TYPES = ['primary', 'success', 'info', 'warning']
  const idx = Math.floor(Math.random() * 10) % TYPES.length;
  const type = TYPES[idx]

  const slogan = ref({
    hitokoto: 'To Be Better',
    who: 'Moses'
  })

  axios.get('https://v1.hitokoto.cn')
    .then((response) => response.data)
    .then((data) => {
      slogan.value = {
        hitokoto: data.hitokoto,
        who: data.from_who || ''
      }
    })
    .catch(function (error) {
      console.log(error);
    })
</script>

<style scoped>
  .hitokoto {
    background-color: var(--ep-menu-text-color);
    border-radius: 5px;
    padding: 5px;
    position: relative
  }

  .hitokoto::before {
    content: "";
    width: 0;
    height: 0;
    border: 4px solid var(--ep-menu-text-color);
    border-color: var(--ep-menu-text-color) transparent transparent transparent;
    position: absolute;
    top: 100%;
    left: 50%;
  }

  @media only screen and (max-width: 768px) {
    .hitokoto {
      display: none;
    }
  }
</style>