<script lang="ts" setup>
  import { ref, computed } from 'vue'

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
    window.open(link.value, '_blank');
  }
</script>

<template>
  <div class="m-10px pointer">
    <el-card shadow="hover" @click="openLink">
      <div class="card-inner">
        <img :src="imgSrc" />
        <el-popover trigger="hover" :content="description">
          <template #reference>
            <div id="details">
              <div class="title">{{ title }}</div>
              <el-text class="description w-10vw" truncated>
                {{ description }}
              </el-text>
            </div>
          </template>
        </el-popover>
        <el-popover trigger="hover" :content="link">
          <template #reference>
            <el-icon @click="openLink">
              <DArrowRight id="arrow" />
            </el-icon>
          </template>
        </el-popover>
      </div>
    </el-card>
  </div>
</template>
<style scoped>
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
  }

  .card-inner #arrow {
    color: darkgray;
  }
</style>