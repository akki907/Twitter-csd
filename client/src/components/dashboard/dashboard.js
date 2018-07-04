import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCurrentProfile } from "./../../actions/profileAction";
import Spinner from "./../comman/Spinner";
import TwitterLogin from 'react-twitter-auth';

class Dashboard extends Component {
  constructor(){
    super();
    this.state = { isAuthenticated: false, twitter: null, token: ''};
  }
  componentDidMount() {
      console.log('run')
    this.props.getCurrentProfile();
  }


onSuccess = (response) => {
  const token = response.headers.get('x-auth-token');
  response.json().then(twitter => {
    if (token) {
      this.setState({isAuthenticated: true, twitter: twitter, token: token});
    }
  });
};

onFailed = (error) => {
  // alert(error);
  console.log('err',error)
};

  render() {
    const { user } = this.props.auth;
    const { profile, loading } = this.props.profile;
    
    let dashboardContent;

    if (profile == null || loading) {
      dashboardContent = <Spinner />;
    } else {
      if (profile.twitterHandle == null) {
        dashboardContent = (
          <div>
            <p className="lead text-muted">
              Welcome {user.name}
            </p>
            <p>You have not yet setup a profile, please add some info</p>
           

            <TwitterLogin loginUrl="http://localhost:3000/api/v1/auth/twitter"
                    onFailure={this.onFailed} onSuccess={this.onSuccess}
                    requestTokenUrl="http://localhost:3000/api/v1/auth/twitter/reverse"/>
          </div>
        );
      } else {
        dashboardContent = (
          <div>
            <p className="lead text-muted">Welcome {user.name}</p>
            <p>You have not yet setup a profile, please add some info</p>
            <Link to="/create-profile" className="btn btn-lg btn-info">
              Create Profile
            </Link>
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