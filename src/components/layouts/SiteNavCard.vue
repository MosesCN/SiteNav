<script lang="ts" setup>
  import { ref, computed } from 'vue'
  const emit = defineEmits(['editSite', 'deleteSite', 'addSite'])
  import { ElMessage } from 'element-plus'
  const props = defineProps({
    icon: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    link: {
      type: String,
      required: true
    }
  })
  const imgSrc = computed(() => `${props.icon}`)
  const title = computed(() => `${props.title}`)
  const description = computed(() => `${props.description}`)
  const link = computed(() => `${props.link}`)

  const openLink = () => {
    if (link.value) {
      window.open(link.value, '_blank');
    } else {
      ElMessage.warning('请补充链接')
    }
  }
</script>

<template>
  <el-card shadow="hover" class="m-10px card-box">
    <div id="action">
      <DropdownAction @add="emit('addSite')" @delete="emit('deleteSite')" @edit="emit('editSite')">
        <el-icon>
          <Setting color="darkgray" />
        </el-icon>
      </DropdownAction>
    </div>
    <div class="card-inner">
      <img :src="imgSrc" @click="openLink" />
      <div id="details" @click="openLink">
        <div class="title">{{ title }}</div>
        <el-popover trigger="hover" :content="description">
          <template #reference>
            <el-text class="description w-10vw" truncated>
              {{ description }}
            </el-text>
          </template>
        </el-popover>
      </div>
      <el-popover trigger="hover" :content="link">
        <template #reference>
          <el-icon @click="openLink">
            <DArrowRight id="arrow" />
          </el-icon>
        </template>
      </el-popover>
    </div>
  </el-card>
</template>
<style scoped>
  .card-box {
    position: relative;
  }

  .card-box #action {
    position: absolute;
    top: 0;
    right: 0;
    color: #cdcccc;
    cursor: pointer;
    margin-top: .3rem;
    margin-right: .3rem;
  }

  .card-box #edit {
    position: absolute;
    bottom: 0;
    right: 0;
    color: #cdcccc;
    cursor: pointer;
  }

  .pointer {
    cursor: pointer;
  }

  .card-inner {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: center;
    justify-content: space-between;
    align-items: center;
  }

  .card-inner img {
    width: 5vw;
    height: 5vw;
    border-radius: 3dvh;
    cursor: pointer;
  }

  .card-inner .title {
    font-weight: bold;
    text-align: left;
  }

  .card-inner .description {
    color: #6c757d;
    text-align: left;
    margin-top: 8px;
  }

  .card-inner #details {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 10px;
    cursor: pointer;
  }

  .card-inner #arrow {
    color: darkgray;
    cursor: pointer;
  }
</style>