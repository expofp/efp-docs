import { defineConfig } from "vitepress";

const base = process.env.BASE_PATH || "/";

const year = new Date().getFullYear();

/** Production origin. Canonical links always point here, whatever `base` a preview build uses. */
const SITE_URL = "https://developer.expofp.com/";

/**
 * The page's one canonical URL. GitHub Pages serves every page under several addresses — the
 * clean URL, its `.html` twin, the bare host with and without `/` — and inbound links add query
 * noise (`?ref=blog.expofp.com`), so search engines indexed them as duplicate content. The clean
 * form is the canonical one: it is what the nav and the sidebar link to.
 */
function canonicalUrl(relativePath: string): string {
  const path = relativePath.replace(/\.md$/, "").replace(/(^|\/)index$/, "$1");
  return SITE_URL + path;
}

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

  // https://vitepress.dev/reference/site-config#transformhead
  // The 404 page answers for every unknown path, so it has no address of its own to declare.
  transformHead: ({ page, pageData }) =>
    page === "404.md"
      ? []
      : [["link", { rel: "canonical", href: canonicalUrl(pageData.relativePath) }]],

  // Without its own `description`, a page inherits the site-wide one above, and every such page
  // ships the same meta description. Flag the gap at build time rather than in an SEO audit.
  transformPageData: (pageData) => {
    if (pageData.relativePath !== "404.md" && typeof pageData.frontmatter.description !== "string") {
      console.warn(`[seo] ${pageData.relativePath} has no frontmatter description`);
    }
  },

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
        { text: "Receiving Webhooks", link: "/guide/receiving-webhooks" },
      ],
    },
    {
      text: "Guides",
      collapsed: false,
      items: [
        {
          text: "Online, offline, preload & caching",
          link: "/guide/plan-loading-modes",
        },
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
