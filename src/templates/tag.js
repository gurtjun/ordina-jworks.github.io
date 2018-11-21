import React from 'react'
import Layout from '../components/layout';
import { graphql } from 'gatsby'
import Banner from '../components/banner';
import Navigation from '../components/navigation';
import Card from '../components/card';
import Tags from "../components/tags";


const TagTemplate = ({pageContext, data}) => {
    const posts = data.allMarkdownRemark.edges
    const {tag} = pageContext

    return (
      <Layout>
        <div id="header-image" className="header-image"></div>
        <div id="page-wrapper">
          <Navigation/>

          <Banner title={tag} subtitle="Posts by tag"/>
          <section id="wrapper">
            <div className="inner">
              <section id="one" className="wrapper spotlight style1">
                <div className="inner">
                  <div className="content" style={{ textAlign: "left" }}>
                    <section className="features">
                      {posts.map(({ node }) => {
                        return (
                          <Card
                            title={node.frontmatter.title}
                            subtitle={node.frontmatter.date}
                            action="Read more"
                            slug={node.fields.slug}
                            image={node.frontmatter.image.childImageSharp.fluid}
                            key={node.id}
                          />
                        )
                      })}
                    </section>
                  </div>
                </div>
              </section>

              <section id="two" className="wrapper alt style3">
                <div className="inner">
                  <div className="content">
                    <Tags title={`Other Tags`}/>
                  </div>
                </div>
              </section>
            </div>
          </section>
        </div>
        <div id="over"></div>
      </Layout>
    )
  }

export default TagTemplate

export const pageQuery = graphql`
  query BlogPostsByTag($tagRegex: String!) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(filter: {fields: {type: {eq: "blog"}} frontmatter: { tags: {regex:$tagRegex}}}, sort: {fields: frontmatter___date, order: DESC}, limit: 10) {
      edges {
        node {
          id
          fields {
            slug
          }
          frontmatter {
            title
            date(formatString: "DD MMM YYYY")
            image {
              childImageSharp {
                fluid(maxWidth: 500, quality: 100) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    }
  }
`
