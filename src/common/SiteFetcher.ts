import axios from 'axios'

type SiteInfo = {
  name: string,
  url: string,
  description: string,
  icon: string
}

const fetchSiteInfo = (url: string) => {
  if (!url) return undefined;
  console.log(`fetching url info, url: ${url}`)
  const proxyUrl = 'https://cors.atmoses.uk/?url='
  return axios.get(`${proxyUrl}${url}`)
    .then((response) => response.data)
    .then((data) => {
      const site_info: SiteInfo = {
        name: '',
        url: url,
        description: '',
        icon: ''
      }
      let DOM = new DOMParser();
      const dom = DOM.parseFromString(data, 'text/html')
      console.log('head info:', dom.head.children)
      const len = dom.head.children.length;
      for (let i = 0; i < len; i++) {
        const item = dom.head.children.item(i)
        if (item?.nodeName == 'TITLE') {
          // console.log(item?.nodeName, '--', item?.name, '--', item?.content)
          const innerText = item?.innerText;
          const idx = innerText.indexOf('-');
          if (idx > -1) {
            site_info.name = innerText.substring(0, idx).trim();
          } else {
            site_info.name = innerText;
          }

        }
        if (item?.nodeName == 'META' && 'description' == item?.name) {
          // console.log(item?.nodeName, '--', item?.name, '--', item?.content)
          site_info.description = item?.content;
        }
        if (item?.nodeName == 'LINK' && 'icon' == item?.rel) {
          // console.log(item?.nodeName, '--', item?.rel, '--', item?.href)
          var icon_url = new URL(item?.href);
          try {
            const _url = new URL(url);
            site_info.icon = `${_url.protocol}//${_url.hostname}${_url.port ? ':' + _url.port : ''}${icon_url.pathname}`
          } catch (e) {
            site_info.icon = icon_url.href;
          }

        }
      }
      console.log(`fetched url info:`, site_info)
      return site_info;
    })
}

export { fetchSiteInfo, SiteInfo }
