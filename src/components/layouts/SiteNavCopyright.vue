<template>
  <div class="footer-copyright hidden-content">
    &copy; 2019-{{ year }} &nbsp; <strong>SiteNav</strong>&nbsp;
    design&nbsp;by&nbsp; <a href="https://github.com/MosesCN" target="_blank"><strong>Moses</strong></a>,
    power&nbsp;by&nbsp;<a href="https://vuejs.org/">Vue</a>&nbsp;and&nbsp;<a
      href="https://element-plus.org/">Element+</a>
  </div>
</template>

<style>
  .footer-copyright {
    height: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: center;
    align-items: center;
  }

  @media only screen and (max-width: 768px) {
    .hidden-content {
      display: none;
    }
  }
</style>

<script lang="ts" setup>
  const year = new Date().getUTCFullYear();
</script>