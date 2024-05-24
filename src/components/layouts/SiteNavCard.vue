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
        <el-text class="title">{{ title }}</el-text>
        <el-popover trigger="hover" :content="description">
          <template #reference>
            <el-text class="description" truncated>
              {{ description }}
            </el-text>
          </template>
        </el-popover>
      </div>
    </div>
    <div id="arrow">
      <el-popover trigger="hover" :content="link">
        <template #reference>
          <el-icon @click="openLink">
            <DArrowRight />
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

  .card-box #arrow {
    position: absolute;
    top: 50%;
    right: 0;
    margin-right: .6rem;
    color: darkgray;
    cursor: pointer;
  }

  .pointer {
    cursor: pointer;
  }

  .card-inner {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: flex-start;
    align-items: center;
  }

  .card-inner img {
    width: 3rem;
    height: 3rem;
    border-radius: 0.6rem;
    cursor: pointer;
  }

  .card-inner #details {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-left: .3rem;
    cursor: pointer;
    width: 100%;
  }

  .card-inner .title {
    align-self: flex-start;
    font-weight: bold;
    text-align: left;
    max-width: 75%;
  }

  .card-inner .description {
    color: #6c757d;
    text-align: left;
    margin-top: .6rem;
    align-self: flex-start;
    max-width: 78%;
  }
</style>