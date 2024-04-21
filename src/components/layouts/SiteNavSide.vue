<template>
  <div id="SiteNavSide">
    <div style="margin: 0.6vh 0;">
      <SiteNavIcon style="width: 50px; height: 50px" />
    </div>
    <el-menu :collapse="isCollapse" class="remove-border-right" @select="handleSelect">
      <div v-for="(item, idx) in menu">
        <el-sub-menu :index="idx.toString()" v-if="item.child && item.child.length > 0">
          <template #title>
            <el-icon>
              <component :is="item.icon" />
            </el-icon>
            <span>{{ item.name }}</span>
          </template>
          <el-menu-item :index="idx.toString() + '_' + cIdx.toString()" v-for="(cItem, cIdx) in item.child">
            <el-icon>
              <component :is="cItem.icon" />
            </el-icon>
            <template #title>{{ cItem.name }}</template>
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item :index="idx.toString()" v-else>
          <el-icon>
            <component :is="item.icon" />
          </el-icon>
          <template #title>{{ item.name }}</template>
        </el-menu-item>
      </div>

    </el-menu>
  </div>
</template>

<style>
  .remove-border-right {
    border-right: unset
  }

  @media only screen and (max-width: 768px) {
    #SiteNavSide {
      display: none;
    }
  }
</style>

<script lang="ts" setup>
  import { ref } from "vue";

  import menu from '/api/data/menu.json'

  const isCollapse = ref(false);

  const toggle = () => {
    isCollapse.value = !isCollapse.value
  }

  // const handleSelect = (key: string, keyPath: string[]) => {
  //   console.log(key, keyPath);
  // };
  const handleSelect = (key: string) => {
    const indexs = key.split('_');
    const item = indexs.length > 1 ? menu[indexs[0]].child[indexs[1]] : menu[indexs[0]];
    const anchor = item.anchor;
    window.location.hash = anchor
  };
</script>
