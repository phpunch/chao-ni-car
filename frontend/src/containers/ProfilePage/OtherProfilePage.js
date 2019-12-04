import React, { Component } from "react";
import axios from "axios";
import { withRouter } from "react-router";

import { Row, Col } from "react-bootstrap";
import "./ProfilePage.css";
import Spinner from "../../components/UI/Spinner/Spinner";
import {BACKEND_URL} from '../../utils'

class Profile extends Component {
  state = {
    current_user: null
  };
  componentDidMount() {
    this.getCurrentUser();
  }
  getCurrentUser = () => {
    axios
      .get(BACKEND_URL + "/api/user/" + this.props.match.params.id)
      .then(response => {
        console.log(response.data);
        this.setState({
          current_user: response.data
        });
      })
      .catch(err => {
        console.log("login error", err);
      });
  };
  render() {
    let display = (
      <div>
        <br />
        <Spinner />
      </div>
    );
    if (this.state.current_user) {
      display = (
        <Row>
          <Col>
            <h1 class="center">User Information </h1>
            <br />
            <b>
              Name :{" "}
              {this.state.current_user
                ? this.state.current_user.name
                : "Loading"}
            </b>
            <br />
            <br />
            <b>
              Surname :{" "}
              {this.state.current_user
                ? this.state.current_user.surname
                : "Loading"}
            </b>
            <br />
            <br />
            <b>
              E-mail :{" "}
              {this.state.current_user
                ? this.state.current_user.email
                : "Loading"}
            </b>
            <br />
            <br />
            <b>
              Tel :{" "}
              {this.state.current_user
                ? this.state.current_user.tel
                : "Loading"}
            </b>
            <br />
            <br />
          </Col>
        </Row>
      );
    }
    return (
      <div>
        <div class="profilebackground">
          <div className="profilecontainer">
            <div className="profilecontent">{display}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Profile);
