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
      copyright: `© ${year} <a href='http://expofp.com/'>ExpoFP.com</a> • <a href='https://expofp.com/#contact'>Support</a>`,
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
    { text: "Examples", collapsed: true, items: sidebarExamples() },
    { text: "SDK", collapsed: true, items: sidebarSdk() },
    { text: "JSON API", link: "/guide/json-api" },
    { text: "Webhooks", link: "/guide/webhooks" },
    { text: "data.js Schema", link: "/guide/data-js-schema" },
    {
      text: "JavaScript API Reference",
      link: "/guide/java-script-api-reference",
    },
    { text: "Query parameters", link: "/guide/query-parameters" },
  ];
}

function sidebarExamples() {
  return [
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
      text: "Wayfinding",
      link: `pathname://${base}examples/wayfinding.html?route%3Aundefined%3A414`,
    },
    {
      text: "Insert in container",
      link: `pathname://${base}examples/insert-in-container.html`,
    },
    {
      text: "Android App (Java)",
      link: "https://github.com/expofp/expofp-example-android",
    },
    {
      text: "iOS App (SwiftUI)",
      link: "https://github.com/expofp/expofp-swiftui-example",
    },
  ];
}

function sidebarSdk() {
  return [
    {
      text: "Android SDK (Java)",
      link: "https://expofp.github.io/expofp-mobile-sdk/android-sdk/",
    },
    { text: "GPS SDK (JS)", link: "https://github.com/expofp/gps-efp-app" },
    {
      text: "iOS SDK (SWIFT)",
      link: "https://expofp.github.io/expofp-mobile-sdk/ios-sdk/",
    },
  ];
}
