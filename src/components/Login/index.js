import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {
    usernameInput: '',
    passwordInput: '',
    showSubmitError: false,
    errorMsg: '',
  }

  onChangerUsername = event => {
    this.setState({usernameInput: event.target.value})
  }

  onChangePassword = event => {
    this.setState({passwordInput: event.target.value})
  }

  onSubmitLoginForm = async event => {
    event.preventDefault()
    const {usernameInput, passwordInput} = this.state
    const userDetails = {username: usernameInput, password: passwordInput}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    console.log('Working/...')
    console.log(data.jwt_token)
    if (response.ok === true) {
      const {history} = this.props
      Cookies.set('jwt_token', data.jwt_token, {
        expires: 30,
        secure: true,
        sameSite: 'strict',
      })
      history.replace('/')
      console.log('Cookie is ', Cookies.get('jwt_token'))
    } else {
      this.setState({showSubmitError: true, errorMsg: data.error_msg})
    }
  }

  render() {
    const {usernameInput, passwordInput, showSubmitError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="bg-page">
        <div className="login-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="app-logo"
          />
          <form
            className="login-form-container"
            onSubmit={this.onSubmitLoginForm}
          >
            <label htmlFor="user-input" className="label-text">
              USERNAME
            </label>
            <br />
            <input
              type="text"
              placeholder="Username"
              className="input-text"
              id="user-input"
              value={usernameInput}
              onChange={this.onChangerUsername}
            />
            <br />
            <label htmlFor="pwd-input" className="label-text">
              PASSWORD
            </label>
            <br />
            <input
              type="password"
              placeholder="Password"
              className="input-text"
              id="pwd-input"
              value={passwordInput}
              onChange={this.onChangePassword}
            />
            <br />
            <button type="submit" className="login-btn">
              Login
            </button>
            {showSubmitError && <p className="error-msg">*{errorMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}

export default Login
