import Cookies from 'js-cookie'
import {Link, withRouter} from 'react-router-dom'
import './index.css'

const Header = props => {
  const {history} = props
  const onClickLogoutBtn = () => {
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="navbar-container">
      <ul className="logo-header-container">
        <li>
          <Link to="/" className="nav-link">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="website-logo-header"
            />
          </Link>
        </li>
        <li>
          <Link to="/" className="nav-link">
            <h1 className="nav-link-text">Home</h1>
          </Link>
        </li>
        <li>
          <Link to="/jobs" className="nav-link">
            <h1 className="nav-link-text">Jobs</h1>
          </Link>
        </li>
      </ul>
      <button type="button" className="logout-btn" onClick={onClickLogoutBtn}>
        Logout
      </button>
    </nav>
  )
}

export default withRouter(Header)
