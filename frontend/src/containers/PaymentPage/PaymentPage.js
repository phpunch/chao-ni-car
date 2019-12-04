import React, { Component } from "react";
import { Row, Col, Modal, Button } from "react-bootstrap";
import Payment from "../../components/Payments/Payment";
import "./PaymentPage.css";
import axios from "axios";
import moment from "moment";
import { connect } from "react-redux";
import Spinner from '../../components/UI/Spinner/Spinner';
import { withRouter, Link } from "react-router-dom";
import {BACKEND_URL} from '../../utils'

class PaymentPage extends Component {
  state = {
    loading: false,
    //all of belows will be fetched from server
    providerName: "",
    providerSurname: "",
    providerEmail: "",
    providerTel: "",
    carId: "",
    brand: "None",
    type: "",
    LNumber: "",
    regYear: "",
    gear: "",
    seat: 0,
    equipment: "",
    toDate: null,
    fromDate: null,
    description: "",
    pricePerDay: null,
    deposit: null,
    error: null,
    totalprice: 0,
    //==========
    rentClicked: false,
    showMessage: false,
    errorReservation: null,
  };
  componentWillMount() {
    if (this.props.user === null) {
      window.location = '/'
    }
  }
  componentDidMount() {
    // Bug

    console.log(this.props.location.pathname);
    console.log(this.props.match.params.id);
    //console.log(this.props.match.params.id);
    this.setState({ loading: true });
    axios
      .get(BACKEND_URL + "/api/cars/" + this.props.match.params.id)
      .then(res => {
        console.log(res.data);
        var deposit = Number(res.data.deposit);
        var pricePerDay = Number(res.data.pricePerDay);
        var dateT = moment(this.props.rent.toDate);
        var dateF = moment(this.props.rent.fromDate);
        var diffdate = dateT.diff(dateF, "days");
        const totalprice = deposit + pricePerDay * diffdate;
        console.log("TOTAL", dateF, dateT, diffdate)
        const newState = {
          ...this.state,
          loading: false,
          providerName: res.data._owner.name,
          providerSurname: res.data._owner.surname,
          providerEmail: res.data._owner.email,
          providerTel: res.data._owner.tel,
          carId: res.data._id,
          brand: res.data.brand,
          type: res.data.type,
          LNumber: res.data.LNumber,
          regYear: res.data.regYear,
          gear: res.data.gear,
          seat: res.data.seat,
          equipment: res.data.equipment,
          picsPath: [res.data.photo],
          fromDate: this.props.rent.fromDate,
          toDate: this.props.rent.toDate,
          description: res.data.description,
          pricePerDay: res.data.pricePerDay,
          deposit: res.data.deposit,
          totalprice: totalprice,
          diffdate: diffdate
        };
        this.setState(newState);
      })
      .catch(err => {
        this.setState({ loading: false, error: err });
      });
  }

  handleToken = async (token) => {
    const request = {
      //requestID: this.state.requestID,
      amount: this.state.totalprice * 100,
      carId: this.state.carId,
      dateFrom: this.state.fromDate,
      dateTo: this.state.toDate,
      token: token
    };
    console.log(request);
    this.setState({
      showMessage: true,
    })
    try {
      const res = await axios.post(BACKEND_URL + "/api/stripe", request);
      console.log(res)
      console.log(this.state.providerName);
      // ***********************************
      // TODO: redirect to success page by using (res)
      // may be create new page (up to you what you think it's best)
      // the page will show success message and request id
      // ***********************************
      this.setState({
        errorReservation: false
      })
    } catch (err) {
      console.log(err)
      this.setState({
        errorReservation: true
      })
    }
  };

  handleRedirectToHome = () => {
    this.props.history.push('/')

  }
  handleRedirectToCarManage = () => {
    this.props.history.push('/managebooking')
  }

  render() {
    let previousPage = "/car/" + this.props.match.params.id;
    let fromDate = new Date(this.state.fromDate);
    let readableDateFrom = fromDate.toDateString();
    let toDate = new Date(this.state.toDate);
    let readableDateTo = toDate.toDateString();

    let modalMessage = <div>
      <Modal.Header>
        <Modal.Title>Alert</Modal.Title>
      </Modal.Header>
      <Modal.Footer>
        <p style={{ marginRight: "auto" }}>
          {this.state.errorReservation ? <span>Sorry, This car has been rented.</span> : <span>Your reservation has been successful.</span>}
        </p>
        {this.state.errorReservation ? <Button
          variant="secondary"
          onClick={() => this.handleRedirectToHome()}
        >
          Close
            </Button> : <Button
            variant="success"
            onClick={() => this.handleRedirectToCarManage()}
          >
            Close
            </Button>}

      </Modal.Footer>
    </div>

    if (this.state.errorReservation === null) {
      modalMessage = <Spinner />
    }

    let renderItem = (
      <div className="paymentpagebackground">
        <Modal show={this.state.showMessage}>
          {modalMessage}
        </Modal>
        <div className="paymentcontainer">
          <div className="header">
            <p className="headertext">
              <b>Payment Detail</b>
            </p>
            <div className="paymentcontent">
              <Row>
                <Col>
                  <p className="highlight">
                    <b>INVOICE</b>
                  </p>
                </Col>
              </Row>
              <Row>
                <Col>
                  <p><b>Bill from</b></p>
                  <p>Name : {this.props.user.username}</p>
                  <p>Surname : {this.props.user.surname}</p>
                  <p>E-mail : {this.props.user.email}</p>
                  <p>Tel : {this.props.user.tel}</p>
                </Col>
                <Col>
                  <p><b>Bill to</b></p>
                  <p>Name : {this.state.providerName}</p>
                  <p>Surname : {this.state.providerSurname}</p>
                  <p>E-mail : {this.state.providerEmail}</p>
                  <p>Tel : {this.state.providerTel}</p>
                </Col>
              </Row>
              <Row>
                <Col>
                  <p className="highlight">
                    <b>CAR DETAIL</b>
                  </p>
                  <p>
                    <b>BRAND :</b> {this.state.brand}
                  </p>
                  <p>
                    <b>CAR NUMBER :</b> {this.state.LNumber}
                  </p>
                  <p>
                    <b>GEAR TYPE : </b>
                    {this.state.gear}
                  </p>
                  <p>
                    <b>SEAT :</b> {this.state.seat}
                  </p>
                  <p>
                    <b>EQUIPMENT :</b> {this.state.equipment}
                  </p>
                </Col>
                <Col>
                  <p className="highlight">
                    <b>DATE</b>
                  </p>
                  <p>
                    <b>AVAILABLE DATE FROM:</b>
                  </p>
                  <p>{readableDateFrom}</p>
                  <p>
                    <b>AVAILABLE DATE TO:</b>
                  </p>
                  <p>{readableDateTo}</p>
                </Col>
              </Row>
              <Row>
                <Col>
                  <p className="highlight">
                    <b>TOTAL PRICE</b>
                  </p>
                  <p>
                    {" "}
                    <b>DEPOSIT :</b> {this.state.deposit} bath
                  </p>
                  <p>
                    {" "}
                    <b>PRICEPERDAY :</b> {this.state.pricePerDay} bath
                  </p>
                  <p>
                    {" "}
                    <b>RENT DAY :</b> {this.state.diffdate} days{" "}
                  </p>
                  <p className="bottomline" />
                  <p>
                    {" "}
                    <b>Total :</b> {this.state.totalprice} bath
                  </p>
                  <p className="bottomline" />
                </Col>
              </Row>
              <Row>
                <Col className="btnwrapper">
                  <a href={previousPage}>
                    <button className="backbtn">BACK</button>
                  </a>
                  <Payment
                    //carId={this.state.carId}
                    price={this.state.totalprice}
                    handleToken={this.handleToken}
                  />
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </div>
    );

    return this.state.loading ? <Spinner /> : renderItem;
  }
}
const mapStateToProps = state => {
  return {
    user: state.login.user,
    rent: state.rent
  };
};

export default withRouter(connect(mapStateToProps)(PaymentPage));
