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

    // https://vitepress.dev/reference/default-theme-sidebar#multiple-sidebars
    sidebar: {
      "/guide/": sidebarGuide(),
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

function sidebarGuide() {
  return [
    {
      text: "APIs",
      collapsed: false,
      items: [
        { text: "JSON API", link: "/guide/json-api" },
        { text: "Offline Data API", link: "/guide/offline-api" },
        { text: "Webhooks", link: "/guide/webhooks" },
      ],
    },
    {
      text: "Guides",
      collapsed: false,
      items: [
        { text: "Easy Guide to Using Search", link: "/guide/search" },
        { text: "Set Kiosk", link: "/guide/setkiosk" },
        { text: "Blue dot & geolocation behavior", link: "/guide/ux-spec-blue-dot-and-geolocation-behavior" },
      ],
    },
  ];
}

function sidebarSdk() {
  return [
    {
      text: "JavaScript SDK v3",
      link: "https://js-sdk.expofp.com/",
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
