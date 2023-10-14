const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: "Genzy",
  tagline: "Focused on the domain.",
  url: "https://genzy.github.io",
  baseUrl: "/docs/",
  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",
  favicon: "images/logo-new-dark.svg",
  organizationName: "genzy",
  projectName: "docs",
  themeConfig: {
    navbar: {
      title: "Genzy",
      hideOnScroll: true,
      logo: {
        alt: "Genzy logo",
        src: "images/logo-new.svg",
        srcDark: "images/logo-new-dark.svg",
      },
      items: [
        {
          type: "doc",
          docId: "getting-started",
          position: "left",
          label: "Getting Started",
        },
        {
          type: "doc",
          docId: "categories/Introduction/index",
          position: "left",
          label: "Documentation",
        },
        {
          type: "doc",
          docId: "server-api",
          position: "left",
          label: "Server API",
        },
        {
          type: "doc",
          docId: "client-api",
          position: "left",
          label: "Client API",
        },
        {
          type: "docsVersionDropdown",
          position: "right",
        },
        {
          href: "https://github.com/genzy",
          position: "right",
          className: "header-github-link",
        },
      ],
    },
    footer: {
      style: "dark",
      copyright: `Copyright © ${new Date().getFullYear()} genzy`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          showLastUpdateTime: true,
          lastVersion: "current",
          versions: {
            current: {
              label: "1.x",
              path: "v1",
            },
          },
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
  plugins: [require.resolve("docusaurus-lunr-search")],
};
