import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from "react-redux";
import { logoutUser } from "./../../actions/authActions";
import PropTypes from "prop-types";

class Navbar extends Component {
  onLogOutClick(e){
    this.props.logoutUser();
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;
    
    const authlinks = (
      <ul className="navbar-nav ml-auto">
          <li className="nav-item">
          <a
          href=""
          onClick={this.onLogOutClick.bind(this)}
          className="nav-link"
        >
          <img
            className="rounded-circle"
            src={user.avatar}
            alt={user.name}
            style={{ width: '25px', marginRight: '5px' }}
            title="You must have a Gravatar connected to your email to display an image"
          />{' '}
          Logout
        </a>
          </li>
        </ul>
    )

    const guestLinks =(
      <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/register">Sign Up</Link>
          </li>
          <li className="nav-item">
          <Link className="nav-link" to="/login">Login</Link>
          </li>
        </ul>
    )

    return (
      <div>
        <nav className="navbar navbar-expand-sm navbar-dark bg-dark mb-4">
    <div className="container">
    <Link className="navbar-brand" to="/">Twitter CSD</Link>

      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#mobile-nav">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="mobile-nav">
        
      {isAuthenticated ? authlinks: guestLinks}
        
      </div>
    </div>
  </nav>

      </div>
    )
  }
}

Navbar.prototypes ={
  logoutUser : PropTypes.func.required,
  auth:PropTypes.object.required
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps,{logoutUser})(Navbar);
