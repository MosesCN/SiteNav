<template>
  <el-dropdown trigger="contextmenu" @command="handleCommand">
    <slot></slot>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item icon="Plus" command="add">添加</el-dropdown-item>
      </el-dropdown-menu>
      <el-dropdown-menu>
        <el-dropdown-item icon="Close" command="delete">删除</el-dropdown-item>
      </el-dropdown-menu>
      <el-dropdown-menu>
        <el-dropdown-item icon="Edit" command="edit">编辑</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup>
  const emit = defineEmits(['add', 'delete', 'edit'])
  const handleCommand = (command: 'add' | 'delete' | 'edit') => {
    emit(command);
  }
</script>