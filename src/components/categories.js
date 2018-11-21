import React from 'react'
import { StaticQuery, graphql, Link } from 'gatsby'
import _ from 'lodash'

import '../sass/main.scss'

const Categories = ({ title }) => (
  <StaticQuery
    query={graphql`
      query CategoriesQuery {
        allMarkdownRemark(
          filter:{fields:{type:{eq:"blog"}}}
        ) {
          edges {
            node {
              frontmatter {
                category
              }
            }
          }
        }
      }
    `}
    render={data => {
      const posts = data.allMarkdownRemark.edges

      let categories = []
      _.each(posts, edge => {
        if (_.get(edge, "node.frontmatter.category")) {
          if (!categories.map(c => c.toLowerCase()).includes((edge.node.frontmatter.category).toLowerCase())) {
            categories = categories.concat(edge.node.frontmatter.category)
          }
        }
      })
      categories = _.uniq(categories)

      return (
        <>
          <h2 className="major">{title}</h2>
          <div className="category-list left">
            {categories.map(category => (
              <Link to={`/categories/${category.toLowerCase()}`} key={category}><i className="fa fa-folder-o fa-fw"></i>{category}</Link>
            ))}
          </div>
        </>
      )
    }}
  />
)

export default Categories