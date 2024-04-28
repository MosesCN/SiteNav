<template>
  <el-config-provider namespace="ep">
    <el-container>
      <el-aside width="fit-content" class="site-nav-aside">
        <SiteNavSide @add-site-nav="addSiteNav" @delete-site-nav="deleteSiteNav" @edit-site-nav="editSiteNav" />
      </el-aside>
      <el-container>
        <el-header>
          <SiteNavHeader />
        </el-header>
        <el-main class="site-nav-main">
          <SiteNavSearch />
          <WebSites :webs="webs" />
        </el-main>
        <el-footer>
          <SiteNavCopyright />
        </el-footer>
      </el-container>
    </el-container>
  </el-config-provider>
</template>

<script lang="ts" setup>
  import { ref } from "vue";
  import webs_json from '/api/data/webs.json'
  const webs = ref(webs_json);

  const addSiteNav = (new_site_nav: any, previous_site_nav: any) => {
    console.log('addSiteNav', new_site_nav.name, new_site_nav, previous_site_nav)
    const foundIdx = webs.value.findIndex((web: any) => web.id == previous_site_nav.id)

    const newWeb = {
      id: new_site_nav.id,
      label: new_site_nav.name,
      tags: [
        {
          id: `${new_site_nav.id}_0`,
          label: "TAG",
          sites: []
        }
      ]
    };
    if (foundIdx > 0) {
      webs.value.splice(foundIdx + 1, 0, newWeb);
    } else {
      webs.value.push(newWeb);
    }
    console.log('added new web', newWeb);
  }

  const deleteSiteNav = (site_nav: any) => {
    console.log('deleteSiteNav', site_nav.name, site_nav);
    const foundIdx = webs.value.findIndex((web: any) => web.id == site_nav.id)
    console.log('deleled web', webs.value[foundIdx])
    if (foundIdx > -1) {
      webs.value.splice(foundIdx, 1);
    }
  }
  const editSiteNav = (site_nav: any) => {
    console.log('editSiteNav', site_nav.name, site_nav)
    const foundWeb = webs.value.find((web: any) => web.id == site_nav.id);
    if (foundWeb) {
      foundWeb.label = site_nav.name;
      console.log('edited web', foundWeb)
    }
  }
</script>

<style>
  #app {
    color: var(--ep-text-color-primary);
  }

  .site-nav-aside {
    text-align: center;
    position: relative;
  }

  .site-nav-main {
    background: #9e9e9e0f;
    text-align: center;
    /* https://www.colorzilla.com/zh-cn/gradient-editor/ */
    /* background: linear-gradient(135deg, rgba(252, 255, 244, 1) 0%, rgba(223, 229, 215, 1) 40%, rgba(179, 190, 173, 1) 100%); */
    /* background-image: url('./../../assets/images/bg/6.jpg') */
  }
</style>
