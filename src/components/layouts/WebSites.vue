<script lang="ts" setup>
  import { ref } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { computed } from 'vue';
  import { fetchSiteInfo, SiteInfo } from '../../common/SiteFetcher';

  const props = defineProps({
    webs: {
      type: Array<any>,
      require: true,
    }
  })

  const webs = computed(() => {
    if (props.webs == undefined) {
      throw Error('require webs provide for component WebSites')
    }
    props.webs?.forEach((web: any) => { web.currentTabName = web.tags[0].id; });
    return props.webs;
  })

  const getRandomId = () => {
    return Math.random().toString(36).substring(2);
  }

  const addTab = (web: any, tag_arg: any) => {
    const foundWeb = webs.value?.find((w: any) => w == web);
    const tagLen = foundWeb.tags.length
    console.log(`going to add tag in ${foundWeb.label}`)
    ElMessageBox.prompt('', '请输入新的标签名',
      {
        inputValue: `标签${tagLen + 1}`,
        inputValidator: (value) => value.length < 1 ? '没标签名啦' : value.length > 6 ? '标签名太长啦' : true,
        cancelButtonText: '取消',
        confirmButtonText: '确定'
      }
    ).then(({ value }) => {
      const newTab = {
        label: value,
        id: getRandomId(),
        sites: []
      };
      const foundTagIdx = web.tags.findIndex((t: any) => t == tag_arg);
      // insert instead of push
      foundWeb.tags.splice(foundTagIdx + 1, 0, newTab);
      // foundWeb.tags.push(newTab);
      // switch to new tab
      foundWeb.currentTabName = newTab.id;
      ElMessage({
        type: 'success',
        message: `${value}`,
      })
      console.log(`successfully add tab ${newTab.label} in ${foundWeb.label}`)
    }).catch(() => {
      console.log(`cancelled add tab in: ${web.label}`)
    })
  }

  const removeTab = (web_arg: any, tag_arg: any) => {
    const web = webs.value?.find((w: any) => w == web_arg);
    const tags = web.tags;
    if (tags.length < 2) {
      ElMessage({
        type: 'error',
        message: `不可再删了，再删就没咯`,
      })
      return;
    }
    const foundTagIdx = tags.findIndex((t: any) => t == tag_arg)
    const foundTag = tags.find((t: any) => t == tag_arg);
    console.log('going to delete tag', foundTag)
    ElMessageBox.prompt(`确定删除 ${foundTag.label} ？删了可就再也没了！`, '重要提示', {
      showInput: false,
      icon: 'WarnTriangleFilled',
      cancelButtonText: '取消',
      confirmButtonText: '确定'
    }).then(() => {
      // delete the selected tab
      tags.splice(foundTagIdx, 1);

      // switch to previous tab if current tab deleted
      if (web.currentTabName == foundTag.id) {
        web.currentTabName = tags[foundTagIdx - 1].id;
      }
      console.log(`deleted tag : ${web.label} - ${foundTag.label}`)
      ElMessage({
        type: 'success',
        message: `${foundTag.label}`,
      })
    }).catch(() => {
      console.log(`cancelled delete tab : ${web.label} - ${foundTag.label}`)
    })
  }

  const editTabLabel = (web: any, tag: any) => {
    const foundTag = webs.value?.find((w: any) => w == web).tags.find((t: any) => t == tag);
    ElMessageBox.prompt('', '请输入新的标签名',
      {
        inputValue: foundTag.label,
        inputValidator: (value) => value.length <= 6,
        inputErrorMessage: '最多6个字符',
        cancelButtonText: '取消',
        confirmButtonText: '确定'
      }
    ).then(({ value }) => {
      foundTag.label = value;
      ElMessage({
        type: 'success',
        message: `${value}`,
      })
    }).catch(() => {
      console.log(`cancelled edit tab label: ${web.label}-${tag.label}`)
    })
  }

  const SITE_DIALOG = ref({
    show: false,
    type: '',
    webId: '',
    tagId: '',
    siteId: '',

    title: 'title',
    icon: '',
    iconLabel: '图标',
    iconPlaceholder: '网站图标链接',
    name: '',
    nameLabel: '名称',
    namePlaceholder: '网站名称',
    link: '',
    linkLabel: '链接',
    linkPlaceholder: '网站链接',
    description: '',
    descriptionLabel: '描述',
    descriptionPlaceholder: '给网站一些描述信息',
  })

  const hideSiteDialog = () => {
    SITE_DIALOG.value.show = false;
  }

  const confirmSiteDialog = () => {
    hideSiteDialog();
    if (SITE_DIALOG.value.type == 'edit') {
      const editingSite = webs.value?.find((w: any) => w.id == SITE_DIALOG.value.webId)
        .tags.find((t: any) => t.id == SITE_DIALOG.value.tagId)
        .sites.find((s: any) => s.id == SITE_DIALOG.value.siteId);
      editingSite.icon = SITE_DIALOG.value.icon;
      editingSite.name = SITE_DIALOG.value.name;
      editingSite.description = SITE_DIALOG.value.description;
      editingSite.link = SITE_DIALOG.value.link;
      ElMessage({
        type: 'success',
        message: `${editingSite.name}`,
      })
    } else if (SITE_DIALOG.value.type == 'add') {
      const foundTag = webs.value?.find((w: any) => w.id == SITE_DIALOG.value.webId)
        .tags.find((t: any) => t.id == SITE_DIALOG.value.tagId);
      const site = {
        id: getRandomId(),
        icon: SITE_DIALOG.value.icon,
        name: SITE_DIALOG.value.name,
        description: SITE_DIALOG.value.description,
        link: SITE_DIALOG.value.link
      }
      foundTag.sites.push(site);
      ElMessage({
        type: 'success',
        message: `${site.name}`,
      })
    }
  }

  const addSite = (web: any, tag: any) => {
    SITE_DIALOG.value.show = true;
    SITE_DIALOG.value.type = 'add';
    SITE_DIALOG.value.title = '添加新网站导航';
    SITE_DIALOG.value.icon = '';
    SITE_DIALOG.value.name = '';
    SITE_DIALOG.value.link = '';
    SITE_DIALOG.value.description = '';
    SITE_DIALOG.value.webId = web.id;
    SITE_DIALOG.value.tagId = tag.id;
  }

  const editSite = (web: any, tag: any, site: any) => {
    SITE_DIALOG.value.show = true;
    SITE_DIALOG.value.type = 'edit';
    SITE_DIALOG.value.title = '编辑网站导航';
    SITE_DIALOG.value.icon = site.icon;
    SITE_DIALOG.value.name = site.name;
    SITE_DIALOG.value.link = site.link;
    SITE_DIALOG.value.description = site.description;
    SITE_DIALOG.value.webId = web.id;
    SITE_DIALOG.value.tagId = tag.id;
    SITE_DIALOG.value.siteId = site.id;
  }

  const deleteSite = (web: any, tag: any, site: any) => {
    console.log(`current tab ${web.currentTabName}`)
    const _tag = webs.value?.find((w: any) => w == web).tags.find((t: any) => t == tag);
    ElMessageBox.prompt(`确定删除 ${site.name} ？删了可就再也没了！`, '重要提示', {
      showInput: false,
      icon: 'WarnTriangleFilled',
      cancelButtonText: '取消',
      confirmButtonText: '确定'
    }).then(() => {
      const s_idx = _tag.sites.findIndex((s: any) => s.id == site.id)
      if (s_idx < 0) return;
      _tag.sites.splice(s_idx, 1);
      console.log(`deleted site : ${site.name}`)
      ElMessage({
        type: 'success',
        message: `${site.name}`,
      })
    }).catch(() => {
      console.log(`cancelled delete site : ${site.name}`)
    })
  }

  const siteLinkChanged = (value: string) => {
    fetchSiteInfo(value)?.then((site_info: SiteInfo) => {
      console.log('site', site_info);
      SITE_DIALOG.value.icon = site_info.icon;
      SITE_DIALOG.value.name = site_info.name;
      SITE_DIALOG.value.description = site_info.description;
    })
  }
</script>

<template>
  <el-dialog v-model="SITE_DIALOG.show" :title="SITE_DIALOG.title" width="20%" style="border-radius:.6rem">
    <el-form>
      <el-form-item :label="SITE_DIALOG.linkLabel">
        <el-input v-model="SITE_DIALOG.link" :placeholder="SITE_DIALOG.linkPlaceholder" @change="siteLinkChanged" />
      </el-form-item>
      <el-form-item :label="SITE_DIALOG.iconLabel">
        <el-input v-model="SITE_DIALOG.icon" :placeholder="SITE_DIALOG.iconPlaceholder" />
      </el-form-item>
      <el-form-item :label="SITE_DIALOG.nameLabel">
        <el-input v-model="SITE_DIALOG.name" maxlength="10" minlength="1" show-word-limit
          :placeholder="SITE_DIALOG.namePlaceholder" />
      </el-form-item>
      <el-form-item :label="SITE_DIALOG.descriptionLabel">
        <el-input type="textarea" rows="6" maxlength="300" :placeholder="SITE_DIALOG.descriptionPlaceholder"
          show-word-limit v-model="SITE_DIALOG.description" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div>
        <el-button @click="hideSiteDialog">取消</el-button>
        <el-button type="primary" @click="confirmSiteDialog">确定</el-button>
      </div>
    </template>
  </el-dialog>
  <div class="site-box" v-for="web in webs" :id="web.id">
    <div class="site-tag text-gray text-lg mb-4">
      <TagIcon />
      <text>{{ web.label }}</text>
    </div>
    <el-tabs type="border-card" v-model="web.currentTabName">
      <el-tab-pane v-for="tag in web.tags" :name="tag.id" :label="tag.label">
        <template #label>
          <DropdownAction @edit="editTabLabel(web, tag)" @delete="removeTab(web, tag)" @add="addTab(web, tag)">
            <span>{{ tag.label }}</span>
          </DropdownAction>
        </template>
        <div class="sites-container">
          <SiteNavCard v-for="site in tag.sites" :title="site.name" :description="site.description" :icon="site.icon"
            :link="site.link" @edit-site="editSite(web, tag, site)" @delete-site="deleteSite(web, tag, site)"
            @add-site="addSite(web, tag)" />
          <el-icon class="add-site" @click="addSite(web, tag)">
            <CirclePlus />
          </el-icon>
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

  .add-site {
    font-size: 2rem;
    text-align: center;
    margin: 0px 1rem;
    color: darkgray;
    cursor: pointer;
  }

  .add-site:active {
    color: beige;
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