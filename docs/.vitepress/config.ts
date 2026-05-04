import { defineConfig } from "vitepress";

const base = process.env.BASE_PATH || "/";

const year = new Date().getFullYear();
// https://vitepress.dev/guide/getting-started#the-config-file
// https://github.com/vuejs/vitepress/blob/main/docs/.vitepress/config.ts
export default defineConfig({
  // https://vitepress.dev/reference/site-config#base
  base,

  lang: "en-US",
  title: "Documentation",
  description: "ExpoFP Documentation",

  // https://vitepress.dev/reference/site-config#titletemplate
  titleTemplate: "ExpoFP",

  // https://vitepress.dev/reference/default-theme-last-updated#last-updated
  lastUpdated: true,

  // https://vitepress.dev/reference/site-config#cleanurls
  cleanUrls: true,

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-nav#site-title-and-logo
    siteTitle: false,
    logo: {
      light: "/dev-logo-light.svg",
      dark: "/dev-logo-dark.svg",
    },

    nav: nav(),

    // https://vitepress.dev/reference/default-theme-sidebar#multiple-sidebars
    sidebar: {
      "/guide/": sidebarGuide(),
      "/sdk/": sidebarSdk(),
    },

    socialLinks: [{ icon: "github", link: "https://github.com/expofp" }],

    // https://vitepress.dev/reference/default-theme-footer#footer
    footer: {
      copyright: `© ${year} <a href='http://expofp.com/'>ExpoFP.com</a> • <a href='https://expofp.com/#contact'>Support</a> • <a target='_blank' href='https://statuspage.incident.io/expofp'>Status</a>`,
    },

    // https://vitepress.dev/reference/default-theme-search#local-search
    search: {
      provider: "local",
    },
  },
  // https://vitepress.dev/reference/site-config#markdown
  markdown: {
    lineNumbers: true,
  },
});

function nav() {
  return [
    {
      text: "Documentation",
      link: "/guide/",
      activeMatch: "/guide/",
    },
    {
      text: "SDK",
      items: sidebarSdk(),
      activeMatch: "/sdk/",
    }
  ];
}

function sidebarGuide() {
  return [
    { text: "General Documentation", collapsed: true, items: [
      { text: "JSON API", link: "/guide/json-api" },
      { text: "Offline Data API", link: "/guide/offline-api" },
      { text: "Webhooks", link: "/guide/webhooks" },
      { text: "Easy Guide to Using Search", link: "/guide/search" },
      { text: "Set Kiosk", link: "/guide/setkiosk" },
      { text: "UX specification: Blue dot and geolocation behavior", link: "/guide/ux-spec-blue-dot-and-geolocation-behavior" },
    ] },
    { text: "Platform SDKs", collapsed: true, items: sidebarSdk() },
    { text: "JS SDK v2 (legacy) Examples", collapsed: true, items: sidebarExamples() },
  ];
}

function sidebarExamples() {
  return [
    { text: "Map integration", link: "/guide/map-integration" },
    {
      text: "Simple Floor Plan",
      // https://vitepress.dev/guide/asset-handling#the-public-directory
      link: `pathname://${base}examples/simple.html`,
    },
    {
      text: "No Overlay",
      link: `pathname://${base}examples/no-overlay.html`,
    },
    {
      text: "ZoomTo",
      link: `pathname://${base}examples/zoom-to.html`,
    },
    {
      text: "ZoomTo Guide",
      link: "/guide/zoomto-guide",
    },
	  {
      text: "No Overlay with background",
      link: `pathname://${base}examples/no-overlay-with-background.html`,
    },	
    {
      text: "Wayfinding",
      link: `pathname://${base}examples/wayfinding.html?route%3Aundefined%3A414`,
    },
    {
      text: "Wayfinding Guide",
      link: "/guide/wayfinding-guide",
    },
    {
      text: "Insert in container",
      link: `pathname://${base}examples/insert-in-container.html`,
    },
    {
      text: "Preview mode",
      link: `pathname://${base}examples/preview-mode.html`,
    },
    {
      text: "Preview mode container",
      link: `pathname://${base}examples/preview-mode-container.html`,
    },
    {
      text: "Bookmarks Guide",
      link: "/guide/bookmarks",
    },
    {
      text: "Bookmarks Example",
      link: `pathname://${base}examples/bookmarks.html`,
    },
    {
      text: "OnInit Example",
      link: `pathname://${base}examples/on-init.html`,
    },
    {
      text: "ignoreQuery Example",
      link: `pathname://${base}examples/ignore-query.html`,
    },
    { text: "Configuring Map Settings via URL Parameters", link: "/guide/configuring-map-guide" },
    { text: "Query parameters", link: "/guide/query-parameters" },
  ];
}

function sidebarSdk() {
  return [
    {
      text: "JavaScript SDK v3",
      link: "https://js-sdk.expofp.com/",
    },
    {
      text: "JavaScript SDK v2 (legacy)",
      link: "/guide/java-script-api-reference",
    },    
    {
      text: "iOS Swift SDK v5",
      link: "https://expofp.github.io/expofp-sdk-ios/documentation/expofp/",
    },
    {
      text: "iOS Swift SDK v4 (legacy)",
      link: "https://expofp.github.io/expofp-mobile-sdk/ios-sdk/",
    },
    {
      text: "Android Kotlin SDK v5",
      link: "https://expofp.github.io/expofp-fplan-android/",
    },
    {
      text: "Android Java SDK v4 (legacy)",
      link: "https://expofp.github.io/expofp-mobile-sdk/android-sdk/",
    },
    {
      text: "ReactNative SDK",
      link: "https://expofp.github.io/react-native-efp-sdk/",
    },
  ];
}
