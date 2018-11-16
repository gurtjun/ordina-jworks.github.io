import React from 'react'
import TeamMemberLinks from '../components/teamMemberLinks';
import TeamMemberImage from '../components/teamMemberImage';
import Layout from '../components/layout';
import { Link, graphql } from 'gatsby'
import Banner from '../components/banner';
import Navigation from '../components/navigation';

class AuthorTemplate extends React.Component {
  render() {
    const author = this.props.data.authorsYaml
    const posts = this.props.data.allMarkdownRemark.edges
    const postsByAuthor = posts.filter(p => p.node.frontmatter.authors.some(a => a.fields.slug === author.fields.slug));

    const fullName = `${author.first_name} ${author.last_name}`

    return (
      <Layout>
        <div id="page-wrapper">
          <Navigation/>
          <Banner
            title={fullName}
            content={<div className="banner-team-member-info">
                  <TeamMemberImage
                    firstName={author.first_name}
                    image={author.avatar.childImageSharp.fluid}
                    slug={author.fields.slug}
                    alumnus={author.inactive}
                  />
                  <div>
                    <div>
                      <span className="team-member-title">{author.title}</span><br/>
                      {author.title2 != null &&
                      <span className="team-member-title">{author.title2}</span>
                      }
                    </div>
                    <TeamMemberLinks
                      phone={author.phone}
                      email={author.email}
                      twitter={author.twitter}
                      github={author.github}
                      linkedin={author.linkedin}
                    />
                  </div>
                </div>}
          />
          <section id="wrapper">
            <div className="inner">
              <section className="wrapper style1">
                <div className="inner">
                  <h1>More information about {author.first_name}</h1>
                  <span dangerouslySetInnerHTML={{ __html: author.bio }}></span>
                </div>
              </section>

              <section className="wrapper alt style2">
                <div className="inner">
                  <h1>Articles</h1>
                  {postsByAuthor.map((post) => (
                    <div className="post">
                      <Link to={post.node.fields.slug}>{post.node.frontmatter.title}</Link>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </section>
        </div>
        <div id="over"></div>
      </Layout>
    )
  }
}

export default AuthorTemplate

export const pageQuery = graphql`
  query AuthorBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    authorsYaml(fields: { slug: { eq: $slug } }) {
      fields {
        slug
      }
      id
      first_name
      last_name
      title
      title2
      bio
      phone
      email
      twitter
      github
      linkedin
      inactive
      avatar {
        childImageSharp {
          fluid(maxWidth: 200, quality:100) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
    allMarkdownRemark(
        filter: { fields: {type: { eq: "blog" }}}
        sort: { fields: [frontmatter___date], order: DESC }
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            authors {
              fields {
                slug
              }
            }
          }
        }
      }
    }
  }
`
