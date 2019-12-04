import React, { Component } from "react";
import { Form, Col, Row } from "react-bootstrap";
import axios from "axios";
import FieldUploadFile from "../../components/FieldFileInput/FieldUploadFile";
import classes from "./AddCarPage.module.css";
import { Formik, FormikProps, Field } from "formik";
import * as yup from 'yup';
import {BACKEND_URL} from '../../utils'
class AddCarPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fileUrl: null
    };
  }
  handleSubmit = (values, {
    props = this.props,
    setSubmitting
  }) => {
    if (this.state.fileUrl != null) {
      const data = {
        brand: values.brand,
        type: values.type,
        seat: values.seat,
        regYear: values.regYear,
        gear: values.transmission,
        equipment: values.equipment,
        LNumber: values.lnumber,
        availFrom: values.availFrom,
        availTo: values.availTo,
        location: values.location,
        description: values.description,
        deposit: values.deposit,
        pricePerDay: values.pricePerDay,
        photo: this.state.fileUrl
      };
      console.log(data);
      axios
      .post(BACKEND_URL + "/api/cars", data)
      .then(res => {
        console.log(res);
        this.props.history.push("/carmanage");
      })
      .catch(err => {
        console.log(err);
      });
    }
    else{
      alert('No photo.');
    }
    setSubmitting(false);
    return;
  }

  addFileURLToState = fileUrl => {
    this.setState({
      fileUrl: fileUrl
    });
  };

  render() {
    function greater(ref, msg) {
      return this.test({
        name: 'greater',
        exclusive: false,
        message: msg || 'Must be greater than initial date.',
        params: {
          reference: ref.path
        },
        test: function (value) {
          return value > this.resolve(ref)
        }
      })
    };
    yup.addMethod(yup.date, 'greater', greater);

    const min = new Date().toDateString();
    const schema = yup.object({
      brand: yup.string()
        .required("Required!!"),
      type: yup.string()
        .required("Required!!"),
      regYear: yup.number("Must be number.")
        .min(1900, "Year in A.C. format ex.19xx.")
        .max(new Date().getFullYear(), "Year in A.C. format ex.19xx.")
        .required("Required!!"),
      deposit: yup.number("Must be number.")
        .min(100, "Minimum is 100.")
        .required("Required!!"),
      pricePerDay: yup.number("Must be number.")
        .min(100, "Minimum is 100.")
        .required("Required!!"),
      seat: yup.number("Must be number.")
        .min(0, "Minimum is 0.")
        .max(20, "Maximum is 20.")
        .required("Required!!"),
      lnumber: yup.string()
        .required("Required!!"),
      location: yup.string()
        .required("Required!!"),
      transmission: yup.string()
        .oneOf(["auto", "manual"])
        .required("Required!!"),
      availFrom: yup.date()
        .min(min, "Minimum time is " + min)
        .required("Required!!"),
      availTo: yup.date()
        .greater(yup.ref("availFrom"))
        .required("Required!!"),
      description: yup.string(),
      equipment: yup.string(),
    });
    return (
      <div className={classes.addcarbackground}>
        <div className={classes.wrapper}>
          <Formik
            initialValues={{
              brand: "",
              type: "",
              regYear: "",
              seat: "",
              transmission: "",
              pricePerDay: "",
              equipment: "",
              lnumber: "",
              availFrom: "",
              availTo: "",
              location: "",
              description: "",
              deposit: "",
            }}
            validationSchema={schema}
            onSubmit={this.handleSubmit}
          >
            {({
              handleSubmit,
              handleChange,
              values,
              touched,
              errors,
            }) => (
                <Form
                  noValidate
                  onSubmit={handleSubmit}
                >
                  <h1>Add Car</h1>
                  <Row>
                    <Col>
                      <FieldUploadFile classname={classes.uploadimgwrapper} addFileURLToState={this.addFileURLToState} />
                    </Col>
                    <Col>
                      <Form.Row>
                        <Form.Group as={Col} controlId="brand">
                          <Form.Label>Brand</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Brand"
                            value={values.brand}
                            onChange={handleChange}
                            isValid={touched.brand && !errors.brand}
                            isInvalid={touched.brand && errors.brand}
                          />
                          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            {errors.brand}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Form.Row>
                      <Form.Row>
                        <Form.Group as={Col} controlId="type">
                          <Form.Label>type</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Type"
                            value={values.type}
                            onChange={handleChange}
                            isValid={touched.type && !errors.type}
                            isInvalid={touched.type && errors.type}
                          />
                          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            {errors.type}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Form.Row>
                      <Form.Row>
                        <Form.Group as={Col} controlId="regYear">
                          <Form.Label>Register Year</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Register Year"
                            value={values.regYear}
                            onChange={handleChange}
                            isValid={touched.regYear && !errors.regYear}
                            isInvalid={touched.regYear && errors.regYear}
                          />
                          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            {errors.regYear}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Form.Row>
                    </Col>
                  </Row>
                  <Form.Row>
                    <Form.Group as={Col} controlId="deposit">
                      <Form.Label>Deposit</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Deposit"
                        value={values.deposit}
                        onChange={handleChange}
                        isValid={touched.deposit && !errors.deposit}
                        isInvalid={touched.deposit && errors.deposit}
                      />
                      <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                      <Form.Control.Feedback type="invalid">
                        {errors.deposit}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col} controlId="pricePerDay">
                      <Form.Label>Price Per Day</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Price per Day"
                        value={values.pricePerDay}
                        onChange={handleChange}
                        isValid={touched.pricePerDay && !errors.pricePerDay}
                        isInvalid={touched.pricePerDay && errors.pricePerDay}
                      />
                      <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                      <Form.Control.Feedback type="invalid">
                        {errors.pricePerDay}
                      </Form.Control.Feedback>
                    </Form.Group>

                  </Form.Row>
                  <Form.Row>
                    <Form.Group as={Col} controlId="seat">
                      <Form.Label>Seat</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Number of Seat"
                        value={values.seat}
                        onChange={handleChange}
                        isValid={touched.seat && !errors.seat}
                        isInvalid={touched.seat && errors.seat}
                      />
                      <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                      <Form.Control.Feedback type="invalid">
                        {errors.seat}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} controlId="lnumber">
                      <Form.Label>License number</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter License Number"
                        value={values.lnumber}
                        onChange={handleChange}
                        isValid={touched.lnumber && !errors.lnumber}
                        isInvalid={touched.lnumber && errors.lnumber}
                      />
                      <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                      <Form.Control.Feedback type="invalid">
                        {errors.lnumber}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group as={Col} controlId="location">
                      <Form.Label>Location</Form.Label>
                      <Form.Control
                        as="select"
                        value={values.location}
                        onChange={handleChange}
                        isValid={touched.location && !errors.location}
                        isInvalid={touched.location && errors.location}
                      >
                        <option value="">Select</option>
                        <option value="Suvarnabhumi Airport">
                          Suvarnabhumi Airport
                      </option>
                        <option value="Don Mueang Airport">
                          Don Mueang Airport
                      </option>
                        <option value="BTS Morchit">BTS Morchit</option>
                        <option value="BTS Siam">BTS Siam</option>
                        <option value="BTS Asok">BTS Asok</option>
                        <option value="BTS Onnut">BTS Onnut</option>
                        <option value="BTS Bang Wa">BTS Bang Wa</option>
                      </Form.Control>
                      <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                      <Form.Control.Feedback type="invalid">
                        {errors.location}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} controlId="transmission">
                      <Form.Label>Transmission</Form.Label>
                      <Form.Control
                        as="select"
                        value={values.transmission}
                        onChange={handleChange}
                        isValid={touched.transmission && !errors.transmission}
                        isInvalid={touched.transmission && errors.transmission}
                      >
                        <option>Select</option>
                        <option value="manual">Manual</option>
                        <option value="auto">Auto</option>
                      </Form.Control>
                      <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                      <Form.Control.Feedback type="invalid">
                        {errors.transmission}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group as={Col} controlId="availFrom">
                      <Form.Label>available from</Form.Label>
                      <Form.Control
                        type="Date"
                        onChange={handleChange}
                        value={values.availFrom}
                        isValid={touched.availFrom && !errors.availFrom}
                        isInvalid={touched.availFrom && errors.availFrom}
                      />
                      <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                      <Form.Control.Feedback type="invalid">
                        {errors.availFrom}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} controlId="availTo">
                      <Form.Label>available to</Form.Label>
                      <Form.Control
                        type="Date"
                        onChange={handleChange}
                        value={values.availTo}
                        isValid={touched.availTo && !errors.availTo}
                        isInvalid={touched.availTo && errors.availTo}
                      />
                      <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                      <Form.Control.Feedback type="invalid">
                        {errors.availTo}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group as={Col} controlId="description">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Description"
                        value={values.description}
                        onChange={handleChange}
                        isValid={touched.description && !errors.description}
                        isInvalid={touched.description && errors.description}
                      />
                      <Form.Control.Feedback>It's okay!</Form.Control.Feedback>
                      <Form.Control.Feedback type="invalid">
                        {errors.description}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group as={Col} controlId="equipment">
                      <Form.Label>Equipment</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Equipment"
                        value={values.equipment}
                        onChange={handleChange}
                        isValid={touched.equipment && !errors.equipment}
                        isInvalid={touched.equipment && errors.equipment}
                      />
                      <Form.Control.Feedback>It's okay!</Form.Control.Feedback>
                      <Form.Control.Feedback type="invalid">
                        {errors.equipment}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Form.Row>
                  <Form.Row className={classes.buttonwrapper}>
                    <button className={classes.submit} type="submit">Submit</button>
                  </Form.Row>
                </Form>
              )}
          </Formik>
        </div>
      </div>
    );
  }
}
export default AddCarPage;
