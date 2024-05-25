<template>
  <div>
    <Hitokoto />
  </div>
  <div>
    <el-input style="width: 60%" size="large" v-model="searchInput" :placeholder="search_placeholder">
      <template #prepend>
        <el-dropdown size="large">
          <el-icon size="28">
            <component :is="chosenOpt.icon"></component>
          </el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="optClick(item)" v-for="item in OPTs">
                <el-icon>
                  <component :is="item.icon"></component>
                </el-icon>
                <span>{{ item.name }}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </el-input>

    <span>
      <el-button type="primary" size="large" class="ml-2" @click="doSearch">GO</el-button>
    </span>
  </div>
</template>
<style scoped>

  :deep(.ep-input-group__prepend){
    padding: 0 10px;
  }

  .ml-2 {
    margin-left: .2rem;
  }

</style>
<script lang="ts" setup>
  import { ref } from 'vue'
  import { ElMessage } from 'element-plus'
  import { SiteNavData } from "~/../api/data/SiteNavData";

  const OPTs = SiteNavData.getSearchEngines();
  const searchInput = ref('')
  const chosenOpt = ref(OPTs[0])

  const placeholder_suffix = ": 输入想搜的任何事物";
  const search_placeholder = ref(chosenOpt.value.name + placeholder_suffix)
  const optClick = (item: any) => {
    chosenOpt.value = item
    search_placeholder.value = item.name + placeholder_suffix;
  }
  const showWarnMessage = (message: string) => {
    ElMessage({
      message: message,
      type: 'warning',
    })
  }
  const doSearch = () => {
    if (!searchInput.value) {
      showWarnMessage('请输入您想搜索的东西')
    } else if (chosenOpt.value.qLink && searchInput.value) {
      window.open(`${chosenOpt.value.qLink}${searchInput.value}`, '_blank')
      searchInput.value = ''
    } else if (!chosenOpt.value.qLink) {
      showWarnMessage('我们将尽快支持站内搜索')
    }
  }
</script>