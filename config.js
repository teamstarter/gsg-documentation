const config = {
  gatsby: {
    pathPrefix: '/',
    siteUrl: 'https://hasura.io',
    gaTrackingId: null,
    trailingSlash: false,
  },
  header: {
    logo: '',
    logoLink: '',
    title: 'GSG - Documentation',
    githubUrl: 'https://github.com/teamstarter/graphql-sequelize-generator',
    helpUrl: '',
    tweetText: '',
    social: `<li>
		    <a href="https://twitter.com/teamstarterapp" target="_blank" rel="noopener">
		      <div class="twitterBtn">
		        <img src='https://graphql-engine-cdn.hasura.io/learn-hasura/assets/homepage/twitter-brands-block.svg' alt={'Discord'}/>
		      </div>
		    </a>
		  </li>`,
    links: [{ text: '', link: '' }],
    search: {
      enabled: false,
      indexName: '',
      algoliaAppId: process.env.GATSBY_ALGOLIA_APP_ID,
      algoliaSearchKey: process.env.GATSBY_ALGOLIA_SEARCH_KEY,
      algoliaAdminKey: process.env.ALGOLIA_ADMIN_KEY,
    },
  },
  sidebar: {
    forcedNavOrder: [
      '/gettingStarted', // add trailing slash if enabled above
      '/resolvers',
      '/server',
    ],
    collapsedNav: [
      // add trailing slash if enabled above
    ],
    links: [
      { text: 'GraphQL', link: 'https://graphql.org/' },
      { text: 'Apollo', link: 'https://www.apollographql.com/docs/apollo-server/' },
      { text: 'Sequelize', link: 'https://sequelize.org/' },
      { text: 'graphql-sequelize', link: 'https://github.com/mickhansen/graphql-sequelize' },
    ],
    frontline: false,
    ignoreIndex: true,
    title:
      "<a href='https://github.com/teamstarter/graphql-sequelize-generator'>graphql-sequelize-generator </a>",
  },
  siteMetadata: {
    title: 'GraphQL Sequelize Generator | Teamstarter',
    description: 'Documentation built with mdx',
    ogImage: null,
    docsLocation: 'https://github.com/teamstarter/gsg-site/tree/master/content',
    favicon: 'https://graphql-engine-cdn.hasura.io/img/hasura_icon_black.svg',
  },
  pwa: {
    enabled: false, // disabling this will also remove the existing service worker.
    manifest: {
      name: 'GraphQL Sequelize Generator',
      short_name: 'graphql-sequelize-generator',
      start_url: '/',
      background_color: '#6b37bf',
      theme_color: '#6b37bf',
      display: 'standalone',
      crossOrigin: 'use-credentials',
      icons: [
        {
          src: 'src/pwa-512.png',
          sizes: `512x512`,
          type: `image/png`,
        },
      ],
    },
  },
};

module.exports = config;
