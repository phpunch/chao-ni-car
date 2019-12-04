import React, { Component } from "react";
import { Container } from "react-bootstrap";
import classes from "./HomePage.module.css";
import QueryFilter from "../../components/QueryFilter/QueryFilter";
import CarCards from "../../components/CarCard/CarCards";
import axios from "axios";
import Spinner from "../../components/UI/Spinner/Spinner";
import SubQueryFilter from "../../components/QueryFilter/SubQueryFilter/SubQueryFilter";
import Banner from "../../images/Banner.png";
import {BACKEND_URL} from '../../utils'

class HomePage extends Component {
  constructor() {
    super();
    this.state = {
      fromDate: null,
      toDate: null,
      loading: false,
      error: null,
      CARS: [],
      cars: [], //fetch from server
      //====SubQuery======
      fromLoc: "",
      toLoc: "",
      gear: "",
      seat: 0,
      scroll: false
    };
    this.buttonHandler = this.buttonHandler.bind(this);
    this.myDivToFocus = React.createRef();
  }

  componentDidMount() {
    this.setState({ loading: true });
    console.log(this.state);
    const url =
      BACKEND_URL + 
      "/api/cars?fromDate=" +
      this.state.fromDate +
      "&toDate=" +
      this.state.toDate;
    axios
      .get(url)
      .then(res => {
        console.log("OK");
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

  subQueryHandler = payload => {
    console.log(payload);
    const newState = {
      ...this.state,
      ...payload
    };
    this.setState(newState, ()=>{this.filterItem()});
    console.log(this.state)
    //Query ต่อ
  };

  filterItem = () => {
    console.log(this.state)
    const updatedCars = this.state.CARS.filter(element => {
      console.log(element);
      const answer = []
      if (!this.state.gear == "") {
        //return element.gear.includes(this.state.gear);
        answer.push(element.gear.includes(this.state.gear))
      }
      if (!this.state.seat == 0) {
        //return element.seat >= this.state.seat;
        answer.push(element.seat >= this.state.seat)
      }
      if (element.location&&!this.state.fromLoc == "") {
        //return element.isRented
        //return element.location.includes(this.state.fromLoc);
        answer.push(element.location.includes(this.state.fromLoc))
      }
      // if (!this.state.toLoc == "") {
      //   return element.toLoc.includes(this.state.toLoc);
      // }

      if (answer !== [] && answer.includes(false)) {
        return false
      }
      return true;
    });
    this.setState({ cars: updatedCars });
  };

  onChangeHandler = payload => {
    const newState = {
      ...this.state,
      fromDate: payload.fromDate,
      toDate: payload.toDate,
      gear: payload.gear
    };
    this.setState(newState, () => this.searchHandler()); //make search after set the state
  };

  buttonHandler() {
    if (this.myDivToFocus.current) {
      this.myDivToFocus.current.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  }

  searchHandler() {
    //ยิง GET request
    this.setState({ loading: true });
    console.log(this.state);
    const url =
      BACKEND_URL + 
      "/api/cars?fromDate=" +
      this.state.fromDate +
      "&toDate=" +
      this.state.toDate;
    axios
      .get(url)
      .then(res => {
        console.log("OK");
        const cars = [...res.data];
        console.log(cars);
        this.setState({
          cars: [...cars],
          CARS: [...cars],
          error: false,
          loading: false
        },()=>this.filterItem());
      })
      .catch(err => {
        console.log("error");
        this.setState({ loading: false, error: err });
      });
  }

  render() {
    let cards = <Spinner />;
    let centerClass = [classes.center];
    if (!this.state.loading && !this.state.error) {
      cards = <CarCards cars={this.state.cars} />;
    } else if (this.state.error) {
      cards = (
        <div style={{ textAlign: "center" }}>
          <strong>{this.state.error.message}</strong>
        </div>
      );
    }

    return (
      <>
        <div className={classes.Banner}>
          <div className={centerClass.join(" ")}>
            <h1 className={classes.texteffect}>RENTAL CAR SERVICE</h1>
            <img style={{ width: "60%", paddingTop: "0" }} src={Banner} />
            <div>
              <button className={classes.button} onClick={this.buttonHandler}>
                EXPLORE
                {process.env.NODE_ENV}
              </button>
            </div>
          </div>
        </div>
        <div className={classes.sec2} ref={this.myDivToFocus}>
          <div className={classes.center}>
            <h2>SEARCH</h2>
            <div className={classes.Filter} style={{ textAlign: "center" }}>
              <QueryFilter change={this.onChangeHandler} />
            </div>
            <div className={classes.Filter}>
              <SubQueryFilter handler={this.subQueryHandler} />
            </div>
          </div>
        </div>
        <div className={classes.sec3}>
          <div className={classes.Div}>
            <Container>{cards}</Container>
          </div>
        </div>
      </>
    );
  }
}

export default HomePage;
