<template>
  <el-config-provider namespace="ep">
    <div class="flex main-container">
      <el-container>
        <el-aside style="width: fit-content;">
          <SiteNavSide />
        </el-aside>
        <el-container>
          <el-header>
            <SiteNavHeader />
          </el-header>
          <el-main>
            <SiteNavMain />
          </el-main>
          <el-footer>
            <SiteNavCopyright />
          </el-footer>
        </el-container>
      </el-container>
    </div>
  </el-config-provider>
</template>

<style>
  #app {
    text-align: center;
    color: var(--ep-text-color-primary);
  }

  .main-container {
    height: calc(100vh);
  }
</style>
