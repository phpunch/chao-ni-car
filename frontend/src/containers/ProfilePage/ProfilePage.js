import React, { Component } from "react";
import { Row, Col } from "react-bootstrap";
import "./ProfilePage.css";
import { connect } from "react-redux";
import Spinner from "../../components/UI/Spinner/Spinner";

class ProfilePage extends Component {
  render() {
    let display = <Spinner />;
    if (this.props.user) {
      display = (
        <Row>
          <Col>
            <h1 class="center">Profile </h1>
            <br />
            <b>Name : {this.props.user ? this.props.user.name : "Loading"}</b>
            <br />
            <br />
            <b>
              Surname : {this.props.user ? this.props.user.surname : "Loading"}
            </b>
            <br />
            <br />
            <b>
              E-mail : {this.props.user ? this.props.user.email : "Loading"}
            </b>
            <br />
            <br />
            <b>Tel : {this.props.user ? this.props.user.tel : "Loading"}</b>
            <br />
            <br />
            <b>
              ID number :
              {this.props.user ? this.props.user.idCardNum : "Loading"}
            </b>
            <br />
            <br />
            <b>
              Credits :{" "}
              {this.props.user ? this.props.user.credits / 100 : "Loading"}
            </b>
            <br />
            <br />
          </Col>
        </Row>
      );
    }
    console.log(this.props.user);
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
const mapStateToProps = state => {
  return {
    user: state.login.user
  };
};

export default connect(mapStateToProps)(ProfilePage);
