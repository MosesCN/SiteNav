<template>
  <!-- menu dialog -->
  <el-dialog v-model="MENU_DIALOG.show" :title="MENU_DIALOG.title" width="18%" style="border-radius: 0.6rem">
    <el-form>
      <el-form-item :label="MENU_DIALOG.iconLabel">
        <el-select size="large" style="width: 80%" filterable v-model="MENU_DIALOG.icon">
          <el-option v-for="item in ep_icons" :key="item" :label="item" :value="item" />
        </el-select>
        <el-icon size="2.5rem">
          <component :is="MENU_DIALOG.icon" />
        </el-icon>
      </el-form-item>
      <el-form-item :label="MENU_DIALOG.nameLabel">
        <el-input v-model="MENU_DIALOG.name" maxlength="6" style="width: 80%" show-word-limit
          :placeholder="MENU_DIALOG.namePlaceholder" />
      </el-form-item>

      <el-form-item :label="MENU_DIALOG.addSubMenuLabel" v-if="MENU_DIALOG.showAddSubMenu">
        <el-switch v-model="MENU_DIALOG.addSubMenu" />
      </el-form-item>
      <el-form-item :label="MENU_DIALOG.subIconLabel" v-if="MENU_DIALOG.showAddSubMenu && MENU_DIALOG.addSubMenu">
        <el-select size="large" style="width: 80%" filterable v-model="MENU_DIALOG.subIcon">
          <el-option v-for="item in ep_icons" :key="item" :label="item" :value="item" />
        </el-select>
        <el-icon size="2.5rem">
          <component :is="MENU_DIALOG.subIcon" />
        </el-icon>
      </el-form-item>
      <el-form-item :label="MENU_DIALOG.subNameLabel" v-if="MENU_DIALOG.showAddSubMenu && MENU_DIALOG.addSubMenu">
        <el-input v-model="MENU_DIALOG.subName" maxlength="6" style="width: 80%" show-word-limit
          :placeholder="MENU_DIALOG.subNamePlaceholder" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div>
        <el-button @click="hideMenuDialog">取消</el-button>
        <el-button type="primary" @click="confirmMenuDialog">确定</el-button>
      </div>
    </template>
  </el-dialog>

  <div id="SiteNavSide" :class="{'hidden-aside':isCollapse}">
    <!--  icon  -->
    <div style="margin: 0.6vh 0">
      <SiteNavIcon style="width: 3rem; height: 3rem" />
    </div>

    <!-- menu -->
    <el-menu unique-opened :collapse="isCollapse" class="remove-border-right" @select="handleSelect">
      <template v-for="menu in menus">
        <el-sub-menu :index="menu.id" v-if="menu.subMenus && menu.subMenus.length > 0">
          <template #title>
            <DropdownAction @add="addMenu(menu, undefined)" @delete="delMenu(menu, undefined)"
              @edit="editMenu(menu, undefined)">
              <el-icon>
                <component :is="menu.icon" />
              </el-icon>
            </DropdownAction>
            <span>{{ menu.name }}</span>
          </template>
          <el-menu-item :index="subMenus.id" v-for="subMenus in menu.subMenus">
            <DropdownAction @add="addMenu(menu, subMenus)" @delete="delMenu(menu, subMenus)"
              @edit="editMenu(menu, subMenus)">
              <el-icon>
                <component :is="subMenus.icon" />
              </el-icon>
            </DropdownAction>
            <template #title>{{ subMenus.name }}</template>
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item :index="menu.id" v-else>
          <DropdownAction @add="addMenu(menu, undefined)" @delete="delMenu(menu, undefined)"
            @edit="editMenu(menu, undefined)">
            <el-icon>
              <component :is="menu.icon" />
            </el-icon>
          </DropdownAction>
          <template #title>{{ menu.name }}</template>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<style>
  #SiteNavSide {
    text-align: center;
  }

  .remove-border-right {
    border-right: unset;
  }

  @media only screen and (max-width: 768px) {
    #SiteNavSide {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      width: fit-content;
      height: 100vh;
      z-index: 999;
      background: var(--ep-bg-color);
    }

    .hidden-aside {
      visibility: hidden;
    }
  }
</style>

<script lang="ts" setup>
  import { ref, computed } from "vue";
  import { ElMessage, ElMessageBox } from "element-plus";
  import { SiteNavData } from "~/../api/data/SiteNavData";
  import { getWindowSize, WindowSize } from "~/common/Windows";

  const ep_icons = SiteNavData.getEpIcons();

  const emit = defineEmits(['addSiteNav', 'deleteSiteNav', 'editSiteNav', 'shouldCollapse']);

  const props = defineProps({
    menus: {
      type: Array<any>,
      require: true,
    },
    isCollapse: {
      type: Boolean,
      require: true
    }
  })

  const menus = computed(() => {
    if (props.menus == undefined) {
      throw Error('require [menus] provided for component WebSites')
    }
    return props.menus;
  });

  const isCollapse = computed(() => {
    return props.isCollapse || false;
  });

  const handleSelect = (key: string) => {
    console.log(`menu click ${key}`);
    window.location.hash = ''
    window.location.hash = key;
    if (getWindowSize() < WindowSize.MD && !isCollapse.value) {
      emit("shouldCollapse", true)
    }
  };

  const getRandomId = () => {
    return Math.random().toString(36).substring(2);
  };

  const ACTION_TYPE_ADD = "add";
  const ACTION_TYPE_EDIT = "edit";
  const DEFAULT_MENU_NAME = "MENU";
  const DEFAULT_MENU_ICON = "StarFilled";

  const MENU_DIALOG = ref({
    show: false,
    type: "",
    menuId: "",
    subMenuId: "",
    title: "title",

    iconLabel: "图标",
    iconPlaceholder: "导航图标",
    nameLabel: "名称",
    namePlaceholder: "导航名称",

    icon: "",
    name: "",

    // if add sub-menu
    showAddSubMenu: false,
    addSubMenu: false,
    addSubMenuLabel: "副导航",
    subIconLabel: "图标",
    subIconPlaceholder: "副导航图标",
    subNameLabel: "名称",
    subNamePlaceholder: "副导航名称",
    subIcon: "",
    subName: "",
  });

  const hideMenuDialog = () => {
    if (MENU_DIALOG.value.show == true) {
      MENU_DIALOG.value.show = false;
    }
  };

  const showMenuDialog = () => {
    if (MENU_DIALOG.value.show == false) {
      MENU_DIALOG.value.show = true;
    }
  };

  const delMenu = (menu_arg: any, subMenus: any) => {
    const delSubMenu: boolean = subMenus != undefined;
    if (!delSubMenu && menus.value.length < 2) {
      ElMessage({
        type: "error",
        message: `不可再删了，再删就没咯`,
      });
      return;
    }
    const foundMenu = delSubMenu ? subMenus : menu_arg;
    const foundMenuIdx = delSubMenu
      ? menu_arg.subMenus.findIndex((s: any) => s == subMenus)
      : menus.value.findIndex((m: any) => m == menu_arg);
    console.log("going to delete menu", foundMenu.name);
    ElMessageBox.prompt(
      `确定删除 ${foundMenu.name} 吗？删了可就再也没了！`,
      "重要提示",
      {
        showInput: false,
        icon: "WarnTriangleFilled",
        cancelButtonText: "取消",
        confirmButtonText: "确定",
      }
    )
      .then(() => {
        // delete the selected tab
        if (delSubMenu) {
          menu_arg.subMenus.splice(foundMenuIdx, 1);
        } else {
          menus.value.splice(foundMenuIdx, 1);
        }
        console.log(`deleted menu : ${foundMenu.name}`);
        // publish delete menu event
        emit("deleteSiteNav", foundMenu)
        ElMessage({
          type: "success",
          message: `${foundMenu.name}`,
        });
      })
      .catch((e) => {
        console.warn(e);
        console.log(`cancelled delete menu : ${foundMenu.name}`);
      });
  };

  const addMenu = (menu_arg: any, subMenus: any) => {
    showMenuDialog();
    MENU_DIALOG.value.title = "添加导航";
    MENU_DIALOG.value.type = ACTION_TYPE_ADD;
    MENU_DIALOG.value.menuId = menu_arg.id;
    MENU_DIALOG.value.subMenuId = subMenus && subMenus.id;
    MENU_DIALOG.value.icon = DEFAULT_MENU_ICON;
    MENU_DIALOG.value.name = "";

    const eidtingSubMenu: boolean = subMenus != undefined;
    MENU_DIALOG.value.showAddSubMenu = !eidtingSubMenu;
    MENU_DIALOG.value.addSubMenu = false;
    MENU_DIALOG.value.subIcon = DEFAULT_MENU_ICON;
    MENU_DIALOG.value.subName = "";
  };

  const editMenu = (menu_arg: any, subMenus: any) => {
    showMenuDialog();
    MENU_DIALOG.value.title = "编辑导航";
    MENU_DIALOG.value.type = ACTION_TYPE_EDIT;
    MENU_DIALOG.value.menuId = menu_arg.id;

    const eidtingSubMenu: boolean = subMenus != undefined;
    MENU_DIALOG.value.menuId = menu_arg.id;
    MENU_DIALOG.value.subMenuId = subMenus && subMenus.id;
    MENU_DIALOG.value.icon = eidtingSubMenu ? subMenus.icon : menu_arg.icon;
    MENU_DIALOG.value.name = eidtingSubMenu ? subMenus.name : menu_arg.name;

    // if editing sub menu or the exist sub menus, could not add or remove sub menu any more
    MENU_DIALOG.value.showAddSubMenu = !(eidtingSubMenu || (menu_arg.subMenus && menu_arg.subMenus.length > 0));
    MENU_DIALOG.value.addSubMenu = false;
    MENU_DIALOG.value.subIcon = DEFAULT_MENU_ICON;


  };

  const confirmMenuDialog = () => {
    hideMenuDialog();
    const eidtingSubMenu: boolean = MENU_DIALOG.value.subMenuId != undefined;
    const foundMenu = menus.value.find((m: any) => m.id == MENU_DIALOG.value.menuId);

    if (MENU_DIALOG.value.type == ACTION_TYPE_EDIT) {
      const editingMenu = eidtingSubMenu
        ? foundMenu.subMenus.find((m: any) => m.id == MENU_DIALOG.value.subMenuId)
        : foundMenu;
      const edited = editingMenu.icon != MENU_DIALOG.value.icon || editingMenu.name != MENU_DIALOG.value.name;
      if (edited) {
        const newMenu = {
          id: editingMenu.id,
          icon: MENU_DIALOG.value.icon || DEFAULT_MENU_ICON,
          name: MENU_DIALOG.value.name || DEFAULT_MENU_NAME
        }
        editingMenu.icon = newMenu.icon;
        editingMenu.name = newMenu.name;
        // publish edit menu event
        emit("editSiteNav", newMenu, editingMenu)
      }
      if (!eidtingSubMenu && MENU_DIALOG.value.addSubMenu) {
        editingMenu.subMenus = []
        const newSubMenu = {
          id: getRandomId(),
          icon: MENU_DIALOG.value.subIcon || DEFAULT_MENU_ICON,
          name: MENU_DIALOG.value.subName || DEFAULT_MENU_NAME,
        };
        editingMenu.subMenus.push(newSubMenu);
        // publish edit menu event
        emit("editSiteNav", newSubMenu, editingMenu);
      }
      ElMessage({
        type: "success",
        message: `${editingMenu.name}`,
      });
    } else if (MENU_DIALOG.value.type == ACTION_TYPE_ADD) {
      const addingIdx = eidtingSubMenu
        ? foundMenu.subMenus.findIndex((m: any) => m.id == MENU_DIALOG.value.subMenuId)
        : menus.value.findIndex((m: any) => m.id == MENU_DIALOG.value.menuId);
      const newMenu = {
        id: getRandomId(),
        icon: MENU_DIALOG.value.icon,
        name: MENU_DIALOG.value.name || DEFAULT_MENU_NAME,
        subMenus: [{}] // need to set it as an object array, other wise could not push an object
      };
      if (eidtingSubMenu) {
        foundMenu.subMenus.splice(addingIdx + 1, 0, newMenu);
        // publish add menu event
        emit("addSiteNav", newMenu, foundMenu.subMenus[addingIdx]);
      } else {
        menus.value.splice(addingIdx + 1, 0, newMenu);
        if (MENU_DIALOG.value.addSubMenu) {
          const newSubMenu = {
            id: getRandomId(),
            icon: MENU_DIALOG.value.subIcon || DEFAULT_MENU_ICON,
            name: MENU_DIALOG.value.subName || DEFAULT_MENU_NAME,
          }
          newMenu.subMenus = []; // need to clear first due to set an empty object above
          newMenu.subMenus.push(newSubMenu)
          // publish add sub menu event
          emit("addSiteNav", newSubMenu, newMenu);
        } else {
          newMenu.subMenus = []; // need to clear first due to set an empty object above
          const previous_menu = menus.value[addingIdx];
          const previous = previous_menu.subMenus && previous_menu.subMenus.length > 0 ? previous_menu.subMenus[previous_menu.subMenus.length - 1] : previous_menu;
          // publish add menu event
          emit("addSiteNav", newMenu, previous);
        }
      }
      ElMessage({
        type: "success",
        message: `${newMenu.name}`,
      });
    }
  };
</script>
