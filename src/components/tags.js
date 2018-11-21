import React from 'react'
import {graphql, Link, StaticQuery} from 'gatsby'
import _ from 'lodash'

import '../sass/main.scss'

const Tags = ({title}) => (
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
          _.each(edge.node.frontmatter.tags, tag => {
            if (!tags.map(t => t.toLowerCase()).includes(tag.toLowerCase())) {
              tags = tags.concat(tag)
            }
          })
        }
      })

      return (
        <>
          <h2 className="major">{title}</h2>
          <div className="category-list left">
            {tags.map(tag => (
              <Link to={`/tags/${_.kebabCase(_.toLower(tag))}`} key={tag}><i className="fa fa-tag fa-fw"></i>{tag}</Link>
            ))}
          </div>
        </>
      )
    }}
  />
)

export default Tags