import React, { Component } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import Userimg from "../../images/user.png";
import "../LoginPage/LoginPage.css";
import {BACKEND_URL} from '../../utils'
class LoginPage extends Component {
  state = {
    username: "",
    failed: false,
    password: "",
    validated: false,
    faillogin: false,
    failmessage: "No User ID or Password"
  };
  loginHandler = event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    this.setState({ validated: true });
    const data = { ...this.state };
    if (form.checkValidity()) {
      axios
        .post(BACKEND_URL + "/auth/login", data)
        .then(res => {
          console.log(res.user);
          window.location = "/";
        })
        .catch(e => {
          console.log(e);
          this.setState({
            faillogin: true,
            failed: true
          });
        }); // Handle Login failed
    }
  };

  // handleValidate = () => {
  //   this.setState({
  //     failed: true
  //   });
  // };

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };
  render() {
    const { validated } = this.state;
    let loginFailed = null;
    if (this.state.failed) {
      loginFailed = "Incorrect username or password."
    }
    return (
      <div className="loginbackground">
        <div class="wrapper fadeInDown">
          <div id="formContent">
            <h4 class="active"> LOG IN </h4>

            <div class="fadeIn first">
              <img src={Userimg} />
            </div>

            <form>
              <input
                type="text"
                id="username"
                class="fadeIn second"
                name="login"
                placeholder="login"
                style={this.state.failed ? { border: "2px solid red" } : {}}
                onChange={this.handleChange}
              />
              <div className="invalidtext">
                {/* {loginFailed} */}
              </div>
              <input
                type="password"
                id="password"
                class="fadeIn third"
                name="password"
                placeholder="password"
                style={this.state.failed ? { border: "2px solid red" } : {}}
                onChange={this.handleChange}
              />
              <div className="invalidtext">
                {loginFailed}
              </div>
              <input
                type="submit"
                class="fadeIn fourth"

                value="Log In"
                onClick={this.loginHandler}
              />
            </form>
            <div id="formFooter">
              <a class="inactive underlineHover" href="/regis">
                Sign Up{" "}
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(LoginPage);
