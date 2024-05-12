<template>
  <div>
    <Hitokoto />
  </div>
  <div>
    <el-input style="width: fit-content" size="large" v-model="searchInput" placeholder="输入你想搜的任何东西"
      :prefix-icon="choosenOpt.icon">
      <template #append>
        <el-dropdown class="remove-padding margin-left-2" size="large">
          {{ choosenOpt.name }}
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
      <el-button type="primary" size="large" class="margin-left-2" @click="doSearch">GO</el-button>
    </span>
  </div>
</template>
<style>
  .search-icon {
    height: 15px;
    width: 15px;
    margin-right: 2px
  }

  .margin-left-2 {
    margin-left: 2px;
  }

  .remove-padding {
    padding: unset;
  }

  .ep-button {
    padding: 0px 8px;
  }
</style>
<script lang="ts" setup>
  import { ref } from 'vue'
  import { ElMessage } from 'element-plus'
  import { SiteNavData } from "~/../api/data/SiteNavData";

  const OPTs = SiteNavData.getSearchEngines();
  const searchInput = ref('')
  const choosenOpt = ref(OPTs[0])
  const optClick = (item: any) => {
    choosenOpt.value = item
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
    } else if (choosenOpt.value.qLink && searchInput.value) {
      window.open(`${choosenOpt.value.qLink}${searchInput.value}`, '_blank')
      searchInput.value = ''
    } else if (!choosenOpt.value.qLink) {
      showWarnMessage('我们将尽快支持站内搜索')
    }
  }
</script>