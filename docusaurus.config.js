const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: "Nimbly",
  tagline: "Focused on the domain.",
  url: "https://bjelicaluka.github.io",
  baseUrl: "/nimbly/",
  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",
  favicon: "images/favicon.png",
  organizationName: "bjelicaluka",
  projectName: "nimbly",
  themeConfig: {
    navbar: {
      title: "Nimbly",
      hideOnScroll: true,
      logo: {
        alt: "Nimbly logo",
        src: "images/logo.svg",
        srcDark: "images/logo-dark.svg"
      },
      items: [
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
          position: "right"
        },
        {
          href: "https://github.com/bjelicaluka/nimbly",
          position: "right",
          className: "header-github-link",
        }
      ],
    },
    footer: {
      style: "dark",
      copyright: `Copyright © ${new Date().getFullYear()} isobar.ot`,
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
  plugins: [require.resolve('docusaurus-lunr-search')],
};
