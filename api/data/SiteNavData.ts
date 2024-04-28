import { LocalStorage } from "./SiteNavStorage";
import webs_json from './webs.json'
import menus_json from './menu.json'
import ep_icons_json from './ep_icons.json'
import search_json from './search.json'

const MENUS_KEY = "MENUS"
const WEBS_KEY = "WEBS"

class SiteNavData {

  getSearchEngines() {
    return search_json;
  }

  getEpIcons() {
    return ep_icons_json;
  }

  getMenus() {
    const storage_menus = LocalStorage.get(MENUS_KEY);
    return storage_menus == undefined ? menus_json : storage_menus;
  }

  setMenus(value: any) {
    LocalStorage.set(MENUS_KEY, value);
  }

  getWebs() {
    const storage_webs = LocalStorage.get(WEBS_KEY)
    return storage_webs == undefined ? webs_json : storage_webs;
  }

  setWebs(value: any) {
    LocalStorage.set(WEBS_KEY, value);
  }
}

const Data = new SiteNavData()

export { Data as SiteNavData }