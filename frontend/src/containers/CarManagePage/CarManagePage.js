import React, { Component } from "react";
import { Container } from "react-bootstrap";
import classes from "./CarManagePage.module.css";
import axios from "axios";
import Spinner from "../../components/UI/Spinner/Spinner";
import Carlist from "../../components/Ownercar/Carlist";
import addcaricon from "../../images/addcar.png";
import {BACKEND_URL} from '../../utils'
class CarManage extends Component {
  state = {
    user: null,
    fromDate: null,
    toDate: null,
    loading: false,
    error: null,
    CARS: [],
    cars: [] //fetch from server
  };
  componentDidUpdate() {
    const url = BACKEND_URL + "/api/ownercars";
    axios
      .get(url)
      .then(res => {
        console.log({ res });
        const cars = [...res.data];
        console.log(cars);
        this.setState({
          cars: [...cars],
          CARS: [...cars],
          error: false,
          loading: false
        });
      })
      .catch(err => {
        console.log("error");
        this.setState({ loading: false, error: err });
      });
  }
  componentDidMount() {
    this.setState({ loading: true });
    console.log(this.state);
    const url = BACKEND_URL + "/api/ownercars";
    axios
      .get(url)
      .then(res => {
        console.log({ res });
        const cars = [...res.data];
        console.log(cars);
        this.setState({
          cars: [...cars],
          CARS: [...cars],
          error: false,
          loading: false
        });
      })
      .catch(err => {
        console.log("error");
        this.setState({ loading: false, error: err });
      });
  }
  render() {
    let carlist = <Spinner />;
    if (!this.state.loading && !this.state.error) {
      carlist = <Carlist cars={this.state.cars} />;
    } else if (this.state.error) {
      carlist = (
        <div style={{ textAlign: "center" }}>
          <strong>{this.state.error.message}</strong>
        </div>
      );
    }

    return (
      <div
        className={classes.carmanagebackground}
        style={{ overflow: "hidden" }}
      >
        <div className={classes.carmanagecontainer}>
            <div className={classes.titleName}>
              <p>Car List</p>
          </div>
          {carlist}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "40px"
          }}
        >
          <img
            src={addcaricon}
            style={{
              width: "80px",
              height: "80px",
              cursor: "pointer",
              marginBottom: "20px"
            }}
            onClick={() => (window.location = "addcar")}
          />
        </div>
      </div>
      </div>
    );
  }
}

export default CarManage;
