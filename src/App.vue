<template>
  <el-config-provider namespace="ep">
    <el-container>
      <el-aside width="fit-content">
        <SiteNavSide :menus="menus" :is-collapse="collapseMenu" @add-site-nav="addSiteNav" @delete-site-nav="deleteSiteNav"
          @edit-site-nav="editSiteNav" @should-collapse="(val: boolean) => collapseMenu = val" />
      </el-aside>
      <el-container class="main-container">
        <el-header class="override-padding">
          <!-- aside menu switch -->
          <div :class="{'collapseBtn':!collapseMenu}" class="menu-switch cursor-pointer" @click="collapseSideMenu">
            <Expand v-if="collapseMenu" size="6"/>
            <Fold v-else size="6" />
          </div>

          <SiteNavHeader />
        </el-header>
        <el-main class="site-nav-main">
          <SiteNavSearch />
          <WebSites :webs="webs" @updated="updatedWebs" />
          <!-- back to top component,  must config the 'target' attribute  -->
          <el-backtop target=".site-nav-main" :right="100" :bottom="100" />
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
  import { SiteNavData } from "../api/data/SiteNavData";
  import { Fold, Expand } from "@element-plus/icons-vue";
  import { getWindowSize, WindowSize } from "~/common/Windows";

  const webs = ref(SiteNavData.getWebs());
  const menus = ref(SiteNavData.getMenus());

  const collapseMenu = ref(getWindowSize() < WindowSize.MD);

  window.onresize = ()=>{
    if (WindowSize.SM === getWindowSize()){
      collapseMenu.value = true;
    }else if (getWindowSize() > WindowSize.MD){
      collapseMenu.value = false;
    }
  }

  const collapseSideMenu = () => {
    console.log('click collapse')
    collapseMenu.value = !collapseMenu.value;
  }

  const updatedWebs = () => {
    SiteNavData.setWebs(webs.value);
  }

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
    SiteNavData.setWebs(webs.value);
    SiteNavData.setMenus(menus.value);
  }

  const deleteSiteNav = (site_nav: any) => {
    console.log('deleteSiteNav', site_nav.name, site_nav);
    const foundIdx = webs.value.findIndex((web: any) => web.id == site_nav.id)
    console.log('deleled web', webs.value[foundIdx])
    if (foundIdx > -1) {
      webs.value.splice(foundIdx, 1);
    }
    SiteNavData.setWebs(webs.value);
    SiteNavData.setMenus(menus.value);
  }

  const editSiteNav = (new_site_nav: any, old_site_nav: any) => {
    console.log('editSiteNav', new_site_nav)
    const foundWeb = webs.value.find((web: any) => web.id == old_site_nav.id);
    if (foundWeb) {
      foundWeb.id = new_site_nav.id;
      foundWeb.label = new_site_nav.name;
      console.log('edited web', foundWeb)
      SiteNavData.setWebs(webs.value);
      SiteNavData.setMenus(menus.value);
    }
  }
</script>
<style>
  @media only screen and (max-width: 768px) {
    .collapseBtn {
     margin-left: 150px;
    }
  }

  .override-padding {
    padding: unset;
    padding-right: 20px;
  }

  .menu-switch {
    float: left;
    text-align: center;
    line-height: var(--ep-header-height);
    width:var(--ep-header-height);
  }

  .menu-switch:hover {
    background: rgba(0, 0, 0, .025);
  }

  .main-container {
    position: relative;
    overflow: hidden;
    height: 100vh;
  }

  .site-nav-main {
    background: #9e9e9e0f;
    text-align: center;
    overflow-y: scroll;
    /* https://www.colorzilla.com/zh-cn/gradient-editor/ */
    /* background: linear-gradient(135deg, rgba(252, 255, 244, 1) 0%, rgba(223, 229, 215, 1) 40%, rgba(179, 190, 173, 1) 100%); */
    /* background-image: url('./../../assets/images/bg/6.jpg') */
  }
</style>