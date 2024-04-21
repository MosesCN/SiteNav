<script lang="ts" setup>
  import { ref } from 'vue'
  import webs from '/api/data/webs.json'
</script>

<template>
  <div class="site-box" v-for="web in webs">
    <div class="site-tag text-gray text-lg mb-4">
      <TagIcon />
      <text>{{ web.label }}</text>
    </div>
    <el-tabs type="border-card">
      <el-tab-pane v-for="tag in web.tags" :label="tag.label">
        <div class="sites-container">
          <SiteNavCard v-for="site in tag.sites" :title="site.title" :description="site.description" :icon="site.icon"
            :link="site.link" />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>

</template>
<style scoped>

  .site-box {
    margin: 2rem 1rem;
  }

  .site-tag {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: flex-start;
    align-items: center;
  }

  .site-tag .icon {
    width: 2rem;
    height: 2rem
  }

  .site-tag text {
    margin-left: 1rem;
  }


  .sites-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: center;
    justify-content: flex-start;
    align-items: center;
  }
</style>