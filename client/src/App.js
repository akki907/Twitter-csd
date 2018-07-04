import React, { Component } from "react";
import { BrowserRouter as Router, Route,Switch } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import setAuthToken from './utility/setAuthToken'
import { setCurrentUser, logoutUser } from './actions/authActions';
import jwt_decode from 'jwt-decode'
import "./App.css";
import Navbar from "./components/layout/navbar";
import Footer from "./components/layout/footer";
import Landing from "./components/layout/landing";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import PrivateRoute from './components/comman/PrivateRoute';
// import NotFound from './components/notFound/notFound'
import Dashboard from './components/dashboard/dashboard';

if(localStorage.jwtToken){
  setAuthToken(localStorage.jwtToken);
  const decoded = jwt_decode(localStorage.jwtToken)
  store.dispatch(setCurrentUser(decoded))

  const currentTime = Date.now()/1000;
  if(decoded.exp < currentTime){
    store.dispatch(logoutUser());
    window.location.href = '/login';
  }

}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Route exact path="/" component={Landing} />
            <div className="container">
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
              <Switch>
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              </Switch>
            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
