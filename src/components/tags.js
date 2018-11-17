import React from 'react'
import { StaticQuery, graphql, Link } from 'gatsby'
import _ from 'lodash'

import '../sass/main.scss'

const Tags = ({ title }) => (
  <StaticQuery
    query={graphql`
      query TagsQuery {
        allMarkdownRemark(
          filter:{fields:{type:{eq:"blog"}}}
        ) {
          edges {
            node {
              frontmatter {
                tags
              }
            }
          }
        }
      }
    `}
    render={data => {
      const posts = data.allMarkdownRemark.edges

      let tags = []
      _.each(posts, edge => {
        if (_.get(edge, "node.frontmatter.tags")) {
          tags = tags.concat(edge.node.frontmatter.tags)
        }
      })
      tags = _.uniq(tags)

      return (
        <>
          <h2 className="major">{title}</h2>
          <div className="category-list left">
            {tags.map(tag => (
              <Link to={`/`} key={tag}><i className="fa fa-tag fa-fw"></i>{tag}</Link>
            ))}
          </div>
        </>
      )
    }}
  />
)

export default Tags