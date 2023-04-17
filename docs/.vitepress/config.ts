import { defineConfig } from "vitepress";

// https://vitepress.dev/guide/getting-started#the-config-file
// https://github.com/vuejs/vitepress/blob/main/docs/.vitepress/config.ts
export default defineConfig({
  // https://vitepress.dev/reference/site-config#base
  base: process.env.BASE_PATH || "/efp-docs/",

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
    logo: "/site-header-logo-inverse.svg",

    nav: nav(),

    // https://vitepress.dev/reference/default-theme-sidebar#multiple-sidebars
    sidebar: {
      "/guide/": sidebarGuide(),
      "/examples/": sidebarExamples(),
      "/sdk/": sidebarSdk(),
    },

    // https://vitepress.dev/reference/default-theme-edit-link#site-level-config
    editLink: {
      pattern: "https://github.com/expofp/efp-docs/edit/main/docs/:path",
      text: "Edit this page on GitHub",
    },

    socialLinks: [{ icon: "github", link: "https://github.com/expofp" }],

    // https://vitepress.dev/reference/default-theme-footer#footer
    footer: {
      copyright: `© 2023 <a href='http://expofp.com/'>ExpoFP.com</a> • <a href='https://expofp.com/#contact'>Support</a>`,
    },

    // https://vitepress.dev/reference/default-theme-search#local-search
    search: {
      provider: "local",
    },
  },
});

function nav() {
  return [
    {
      text: "Guide",
      link: "/guide/",
      activeMatch: "/guide/",
    },
    {
      text: "SDK",
      items: sidebarSdk(),
      activeMatch: "/sdk/",
    },
    {
      text: "Examples",
      items: sidebarExamples(),
      activeMatch: "/examples/",
    },
  ];
}

function sidebarGuide() {
  return [
    { text: "Examples", collapsed: false, items: sidebarExamples() },
    { text: "SDK", collapsed: false, items: sidebarSdk() },
    { text: "JSON API", link: "/guide/json-api" },
    { text: "Webhooks", link: "/guide/webhooks" },
    { text: "data.js Schema", link: "/guide/data-js-schema" },
    {
      text: "JavaScript API Reference",
      link: "/guide/java-script-api-reference",
    },
  ];
}

function sidebarExamples() {
  return [
    { text: "Simple Floor Plan", link: "/examples/simple-floor-flan" },
    { text: "No Overlay", link: "/examples/no-overlay" },
    { text: "Wayfinding", link: "/examples/wayfinding" },
    { text: "Android App (Java)", link: "/examples/android-java" },
    { text: "iOS App (SwiftUI)", link: "/examples/ios-swift" },
  ];
}

function sidebarSdk() {
  return [
    { text: "Android SDK (Java)", link: "/sdk/android-sdk-java" },
    { text: "GPS SDK (JS)", link: "/sdk/gps-sdk-js" },
    { text: "iOS SDK (SWIFT)", link: "/sdk/ios-sdk-swift" },
  ];
}
