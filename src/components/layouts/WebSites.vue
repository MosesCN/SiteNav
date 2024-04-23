<script lang="ts" setup>
  import { ref, h } from 'vue'
  import webs_json from '/api/data/webs.json'
  import { TabPaneName, ElMessage, ElMessageBox } from 'element-plus'

  const webs = ref(webs_json)

  const addTab = (webs: Array<any>, index: number, web: any) => {
    ElMessage({
      type: 'info',
      message: `going to add tab in ${web.label}`,
    })
  }
  const removeTab = (name: TabPaneName) => {
    const anchors = name.toLocaleString().split('$_$')
    const web = webs.value.filter((w: any) => w.anchor == anchors[0])[0];
    const tags = web.tags;
    if (tags.length < 2) {
      ElMessage({
        type: 'error',
        message: `不可再删了，再删就没咯`,
      })
      return;
    }
    const deletedTagIdx = tags.findIndex((t: any) => t.anchor == anchors[1])
    const foundTag = tags.filter((t: any) => t.anchor == anchors[1])[0];
    console.log('going to delete tag', foundTag)
    ElMessageBox.prompt(`确定删除 ${foundTag.label} ？，删了可就再也没了！`, '重要提示', {
      showInput: false,
      icon: 'WarnTriangleFilled',
      cancelButtonText: '取消',
      confirmButtonText: '确定'
    }).then(() => {
      tags.splice(deletedTagIdx, 1);
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
    const foundTag = webs.value.filter((w: any) => w == web)[0].tags.filter((t: any) => t == tag)[0];
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

  const addSite = () => {
    ElMessageBox({
      title: 'New Site',
      message: h('p', null, [
        h('span', null, 'ON THE WAY'),
      ]),
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Confirm',
      beforeClose: (action, instance, done) => {
        if (action === 'confirm') {
          instance.confirmButtonLoading = true
          setTimeout(() => {
            done()
            setTimeout(() => {
              instance.confirmButtonLoading = false
            }, 300)
          }, 3000)
        } else {
          done()
        }
      },
    }).then((action) => {
      ElMessage({
        type: 'info',
        message: `action: ${action}`,
      })
    })
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
        <template #label>
          <span @dblclick="editTabLabel(web, tag)">{{ tag.label }}</span>
        </template>
        <div class="sites-container">
          <SiteNavCard v-for="site in tag.sites" :title="site.title" :description="site.description" :icon="site.icon"
            :link="site.link" />
          <el-icon class="add-site" @click="addSite">
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