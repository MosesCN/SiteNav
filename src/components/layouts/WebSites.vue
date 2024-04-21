<script lang="ts" setup>
  import { ref } from 'vue'
  import webs from '/api/data/webs.json'
  import type { TabPaneName, TabsPaneContext } from 'element-plus'

  const addTab = (webs: Array<any>, index: number, web: any) => {
    console.log('add tab', webs, index, web)
  }
  const removeTab = (name: TabPaneName) => {
    console.log('remove tab', name)
  }
</script>

<template>
  <div class="site-box" v-for="(web, webIdx) in webs">
    <div class="site-tag text-gray text-lg mb-4">
      <TagIcon />
      <text>{{ web.label }}</text>
    </div>
    <el-tabs type="border-card" :model-value="web.anchor + '$_$' + web.tags[0].anchor" editable @tab-remove="removeTab"
      @tab-add="addTab(webs, webIdx, web)">
      <el-tab-pane v-for="(tag, tagIdx) in web.tags" :name="web.anchor + '$_$' + tag.anchor" :label="tag.label">
        <div class="sites-container">
          <SiteNavCard v-for="site in tag.sites" :title="site.title" :description="site.description" :icon="site.icon"
            :link="site.link" />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<style scoped>

  /* x>>>y --> :deep() y */
  :deep() .ep-tabs__new-tab {
    margin: 10px;
  }

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