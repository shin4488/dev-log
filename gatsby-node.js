const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        '~': __dirname,
        '@': path.resolve(__dirname, 'src'),
      },
    },
  });
};

exports.createPages = async ({ graphql, actions, reporter }) => {
  // Get all markdown blog posts sorted by date
  const result = await graphql(
    `
      query markdownPosts {
        posts: allMarkdownRemark(
          sort: { fields: [frontmatter___createdDate], order: ASC }
          limit: 1000
          filter: { fileAbsolutePath: { regex: "/content/blog/" } }
        ) {
          nodes {
            id
            fields {
              slug
            }
          }
        }
        tags: allMarkdownRemark(
          sort: { fields: [frontmatter___createdDate], order: ASC }
          limit: 1000
          filter: { fileAbsolutePath: { regex: "/content/blog/" } }
        ) {
          group(field: frontmatter___tags) {
            tag: fieldValue
            nodes {
              id
              fields {
                slug
              }
            }
          }
        }
      }
    `,
  );

  if (result.errors) {
    reporter.panicOnBuild(
      `There was an error loading your blog posts`,
      result.errors,
    );
    return;
  }

  const posts = result.data.posts.nodes;
  const { createPage } = actions;

  // Create blog posts pages
  // But only if there's at least one markdown file found at "content/blog" (defined in gatsby-config.js)
  // `context` is available in the template as a prop and as a variable in GraphQL

  if (posts.length > 0) {
    const blogPost = path.resolve('src', 'templates', 'blog-post.tsx');
    posts.forEach((post, index) => {
      const previousPostId = index === 0 ? null : posts[index - 1].id;
      const nextPostId =
        index === posts.length - 1 ? null : posts[index + 1].id;

      createPage({
        path: post.fields.slug,
        component: blogPost,
        context: {
          id: post.id,
          previousPostId,
          nextPostId,
        },
      });
    });
  }

  // TODO:タグの実装
  // const tags = result.data.tags.group;

  // if (tags.length > 0) {
  //   const indexPage = path.resolve('src', 'pages', 'index.tsx');
  //   tags.forEach((tag) => {
  //     createPage({
  //       path: `/tags/${tag.tag}`,
  //       component: indexPage,
  //       context: {
  //         tag: tag.tag,
  //       },
  //     });
  //   });
  // }

  const aboutPage = path.resolve('src', 'pages', 'about.tsx');
  createPage({
    path: '/about/',
    component: aboutPage,
  });
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode });

    createNodeField({
      name: `slug`,
      node,
      value,
    });
  }
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;

  // Explicitly define the siteMetadata {} object
  // This way those will always be defined even if removed from gatsby-config.js

  // Also explicitly define the Markdown frontmatter
  // This way the "MarkdownRemark" queries will return `null` even when no
  // blog posts are stored inside "content/blog" instead of returning an error
  createTypes(`
    type SiteSiteMetadata {
      author: Author
      siteUrl: String
      social: Social
    }

    type Author {
      name: String
      summary: String
    }

    type Social {
      twitter: String
    }

    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }

    type Frontmatter {
      title: String
      description: String
      createdDate: Date @dateformat
      updatedDate: Date @dateformat
      tags: [String]
    }

    type Fields {
      slug: String
    }
  `);
};
