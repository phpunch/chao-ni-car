import React, { Component } from 'react';
import classes from './CarDetail.module.css';
import { Row, Col } from 'react-bootstrap';
import { carPic as CarPic, carDetailR as CarDetailR, carDetailMiddle as CarDetailMiddle } from './CarDetailComponents/CarDetailComponents';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import testPic1 from './test/img.jpg';
import testPic2 from './test/img2.jpg';
import Spinner from '../../components/UI/Spinner/Spinner';
import Rent from '../Rent/Rent';
import {BACKEND_URL} from '../../utils'

class CarDetail extends Component {
    state = {
        loading: false,
        //all of belows will be fetched from server
        picsPath: [testPic1, testPic2],
        brand: 'None',
        type: '',
        LNumber: '',
        regYear: '',
        gear: '',
        seat: 0,
        equipment: '',
        availFrom: null,
        availTo: null,
        description: '',
        pricePerDay: null,
        deposit: null,
        error: null,
        //==========
        rentClicked: false,


        isProvider: null
    }

    componentWillUnmount() {
        console.log('unmount')
    }
    componentDidMount() {
        // Bug
        console.log(this.props.user)
        console.log(this.props.location.pathname)
        //console.log(this.props.match.params.id);
        this.setState({ loading: true });
        axios.get(BACKEND_URL + '/api/cars/' + this.props.match.params.id)
            .then(res => {
                console.log(res.data);
                const newState = {
                    ...this.state,
                    loading: false,
                    brand: res.data.brand,
                    type: res.data.type,
                    LNumber: res.data.LNumber,
                    regYear: res.data.regYear,
                    gear: res.data.gear,
                    seat: res.data.seat,
                    equipment: res.data.equipment,
                    picsPath: [res.data.photo],
                    availFrom: res.data.availFrom,
                    availTo: res.data.availTo,
                    description: res.data.description,
                    pricePerDay: res.data.pricePerDay,
                    deposit: res.data.deposit,
                    location: res.data.location
                }
                this.setState(newState);
            })
            .catch(err => {
                this.setState({ loading: false, error: err })
            });
    }

    rentHandler = () => {
        //console.log(this.props.match.path + '/rent')
        //this.props.history.replace('/payment/' + this.props.match.params.id );
        this.setState({ rentClicked: true });
    }

    render() {
        let item = <Spinner />;
        let providerDisplay = null
        /*
        if (this.props.user) {
            if (!this.props.user.isProvider) {
                providerDisplay = <button className={classes.rent} onClick={this.rentHandler}>Rent</button>
            }
        }
        */
        if (!this.state.loading && !this.state.error) {
            item = (
                <><div className={classes.cardetailbackground}>
                    <div className={classes.Div}>
                        <Row>
                            <Col sm={6} xs={12}><CarPic imagesPath={this.state.picsPath} /></Col>
                            <Col sm={6} xs={12}>
                                <Row><Col><CarDetailR brand={this.state.brand} type={this.state.type} /></Col></Row>
                                <CarDetailMiddle payload={this.state} />
                            </Col>
                        </Row>
                        {this.state.rentClicked ? null : <div style={{ textAlign: 'left' }}>
                            {providerDisplay}
                            
                        </div>}
                    </div>
                </div>
                    {this.state.rentClicked ? <Rent pricePerDay={this.state.pricePerDay} deposit={this.state.deposit} /> : null}
                </>
            );
        } else if (this.state.error) {
            item = (
                <div className={classes.Div} style={{ textAlign: 'center' }}>
                    <strong>Something went wrong!</strong>
                </div>
            );
        }

        return (
            <>
                {item}
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.login.user
    }
};


export default connect(mapStateToProps)(withRouter(CarDetail));