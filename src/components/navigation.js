import React from 'react'
import { Link } from 'gatsby'

class Navigation extends React.Component {
  constructor(props) {
    super(props)

    this.handleNavClick = this.handleNavClick.bind(this)
    this.handleOutsideNavClick = this.handleOutsideNavClick.bind(this)


    this.state = { navActive: false }
  }

  componentDidMount() {
    document.body.classList.remove('is-menu-visible');
  }

  handleNavClick = () => {
    if (!this.state.navActive) {
      document.body.classList.add('is-menu-visible');
      document.addEventListener('click', this.handleOutsideNavClick, false)
    } else {
      document.body.classList.remove('is-menu-visible');
      document.removeEventListener('click', this.handleOutsideNavClick, false)
    }

    this.setState(prevState => ({
      navActive: !prevState.navActive
    }))
  }

  handleOutsideNavClick = (e) => {
    if (this.node.contains(e.target)) {
      return
    }

    this.handleNavClick()
  }

  render() {
    return (


      <>
        <header id="header" className={this.props.transparant ? 'alt' : ''}>
          <h1>
            <Link to={`/`}>
              JWorks Tech Blog
            </Link>
          </h1>

          <nav>
            <span onClick={this.handleNavClick}>Menu</span>
          </nav>
        </header>

        <nav id="menu">
          <div className="inner" ref={node => this.node = node}>
            <h2>Menu</h2>
            <ul className="links">
              <li className="menu-item"><Link to={`/`}>Home</Link></li>
              <li className="menu-item"><Link to={`/about`}>About Us</Link></li>
              <li className="menu-item"><Link to={`/jobs`}>Jobs</Link></li>
              <li className="menu-item"><Link to={`/carreer`}>Career</Link></li>
              <li className="menu-item"><Link to={`/tech-radar`}>Tech Radar</Link></li>
              <li className="menu-item"><Link to={`/search`}>Search</Link></li>
              <li className="menu-item"><Link to={`/contact`}>Contact Us</Link></li>
            </ul>
            <a href="#" className="close" onClick={this.handleNavClick}>Close</a>
          </div>
        </nav>
      </>
    )
  }
}

export default Navigation