/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const _ = require('lodash')
const Promise = require('bluebird')
const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')

exports.createPages = ({ actions, graphql }) => {
  const { createPage, createRedirect } = actions

  return new Promise((resolve, reject) => {
    const blogPostTemplate = path.resolve('./src/templates/blog-post.js')
    const blogPaginatedTemplate = path.resolve('./src/templates/blog-paginated.js')
    const jobTemplate = path.resolve('./src/templates/job.js')
    const authorTemplate = path.resolve('./src/templates/author.js')
    const categoryTemplate = path.resolve('./src/templates/category.js')
    const tagTemplate = path.resolve('./src/templates/tag.js')
    resolve(
      graphql(
        `
          {
            allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }, limit: 1000) {
              edges {
                node {
                  fields {
                    slug
                    type
                  }
                  frontmatter {
                    title
                    category
                    tags
                  }
                }
              }
            }
          
            allAuthorsYaml {
              edges {
                node {
                  fields {
                    slug
                  }
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          console.log(result.errors)
          reject(result.errors)
        }

        const md = result.data.allMarkdownRemark.edges

        // Create blog posts pages.
        const posts = md.filter(post => post.node.fields.type === 'blog')

        let categories = []
        let tags = []

        _.each(posts, post => {
          createPage({
            path: post.node.fields.slug,
            component: blogPostTemplate,
            context: {
              slug: post.node.fields.slug,
            },
          })

          _.each(post.node.frontmatter.tags, tag => {
            tags.push(_.toLower(tag))
          })

          categories.push(_.toLower(post.node.frontmatter.category))
        })

        // Create category pages
        categories = _.uniq(categories)

        _.each(categories, category => {
          createPage({
            path: `categories/${_.kebabCase(category)}`,
            component: categoryTemplate,
            context: {
              category: category,
              categoryRegex: `/${category}/i` // case-insensitive matching in regex
            }
          })
        })

        // Create tag pages
        tags = _.uniq(tags)

        _.each(tags, tag => {
          createPage({
            path: `tags/${_.kebabCase(tag)}`,
            component: tagTemplate,
            context: {
              tag: tag,
              tagRegex: `/${tag}/i`
            }
          })
        })

        // Create job pages.
        const jobs = md.filter(post => post.node.fields.type === 'job')

        _.each(jobs, job => {
          createPage({
            path: job.node.fields.slug,
            component: jobTemplate,
            context: {
              slug: job.node.fields.slug,
            },
          })
        })

        // Create author pages.
        const authors = result.data.allAuthorsYaml.edges;

        _.each(authors, author => {
          createPage({
            path: author.node.fields.slug,
            component: authorTemplate,
            context: {
              slug: author.node.fields.slug,
            },
          })
        })

        const postsPerPage = 10
        const numPages = Math.ceil(posts.length / postsPerPage)

        Array.from({ length: numPages }).forEach((_, i) => {
          createPage({
            path: i === 0 ? `/` : `/${i + 1}`,
            component: blogPaginatedTemplate,
            context: {
              limit: postsPerPage,
              skip: i * postsPerPage,
              numPages,
              currentPage: i + 1
            },
          })
        })
      })
    )
  })

  let redirectBatch = [
    { from: `/authors`, to: `/about/` },
    { from: `/authors/`, to: `/about/` },
    { from: `/blog`, to: `/` },
    { from: `/blog/`, to: `/` },
  ]

  redirectBatch.forEach(({ from, to }) => {
    if (to === ``) {
      to = page2Path
    }
    createRedirect({
      fromPath: from,
      redirectInBrowser: true,
      toPath: to,
    })
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `AuthorsYaml`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })

    let id = value
    id = _.replace(id, '/authors/', '')
    id = _.replace(id, '/', '')

    createNodeField({
      name: `id`,
      node,
      value: id,
    })
  }

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })

    if (_.startsWith(value, '/blog')) {
      createNodeField({
        name: `type`,
        node,
        value: 'blog',
      })
    }

    if (_.startsWith(value, '/jobs')) {
      createNodeField({
        name: `type`,
        node,
        value: 'job',
      })
    }
  }
}
