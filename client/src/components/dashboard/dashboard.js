import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCurrentProfile } from "./../../actions/profileAction";
import Spinner from "./../comman/Spinner";
// import TwitterLogin from 'react-twitter-auth';
import TwitterLogin from 'react-twitter-auth/lib/react-twitter-auth-component.js';

class Dashboard extends Component {
  constructor(){
    super();
    this.state = { isAuthenticated: false, twitter: null, token: ''};
  }
  componentDidMount() {
    this.props.getCurrentProfile();
    this.getToken()
  }

getToken(){
 return this.token = localStorage.getItem('jwtToken')
}

onSuccess = (response) => {
  // const token = response.headers.get('x-auth-token');
  // response.json().then(twitter => {
  //   if (token) {
  //     this.setState({isAuthenticated: true, twitter: twitter, token: token});
  //   }
  // });
  this.props.getCurrentProfile();
};



onFailed = (error) => {
  // alert(error);
  console.log('errdddddddddddddddd',error)
};

  render() {
    const { user } = this.props.auth;
    const { profile, loading } = this.props.profile;
    const customHeader = {};
    customHeader['Authorization'] = this.token;

    let dashboardContent;

    if (profile == null || loading) {
      dashboardContent = <Spinner />;
    } else {
      if (profile.twitterHandle.token === null) {
        dashboardContent = (
          <div>
            <p className="lead text-muted">
              Welcome {user.name}
            </p>
            <p>You have not yet setup a profile, please add some info</p>
            <TwitterLogin loginUrl="http://localhost:9000/api/auth/twitter"
                      onFailure={this.onFailed}
                      onSuccess={this.onSuccess}
                      requestTokenUrl="http://localhost:9000/api/auth/twitterCallback"
                      showIcon={true}
                      customHeaders={customHeader}
                      forceLogin={true}
                      >
          <b>Twitter</b> 
        </TwitterLogin>

          
          </div>
        );
      } else {
        dashboardContent = (
          <div>
            <p className="lead text-muted">Welcome {user.name}</p>
            <p>You have not yet setup a profile, please add some info</p>
           
          </div>
        );
      }
    }
    return (
      <div className="dashboard">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              {dashboardContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.prototypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
});

export default connect(mapStateToProps, { getCurrentProfile })(Dashboard);