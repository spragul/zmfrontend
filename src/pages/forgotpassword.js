import React from 'react';
import {
  MDBContainer,
  MDBBtn,
  MDBInput,
  MDBCardBody,
  MDBCard,
}
  from 'mdb-react-ui-kit';
import { useFormik } from "formik";
import { useHistory } from "react-router-dom";
import * as yup from 'yup'
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { toast } from "react-toastify";
import { mainurl } from '../App';
import { Link } from 'react-router-dom/cjs/react-router-dom';
const userSchemaValidation = yup.object({
  email: yup.string().required("Please fill in your Email"),
})


export function Forgot() {
  const history = useHistory();
  
  const forgotdata = async ({ forgotmail }) => {
    try {
      const response = await fetch(`${mainurl}/forgotpassword`, {
        method: "POST",
        body: JSON.stringify(forgotmail),
        headers: {
          "Content-Type": "application/json",
        },
      })
      const data = await response.json();
      console.log(data);
      history.push("/login")
      toast("link send your gmail")

    } catch (error) {
      console.log(error)
      toast("error")
    }
  }
  const { values, handleChange, handleSubmit, handleBlur, errors, touched } = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema: userSchemaValidation,
    onSubmit: (forgotmail) => {
      console.log(forgotmail)
      forgotdata({ forgotmail });
    }

  })
  return (
    <div className="bg-cl">
      <MDBContainer fluid className='d-flex align-items-center justify-content-center bg-image' style={{ backgroundColor: 'blue', height: '100vh' }}>      <MDBCard className='m-5' style={{ maxWidth: '600px' }}>
        <MDBCardBody className='px-5'>
          <h2 className="text-uppercase text-center mb-5">Forgot Your Password?</h2>
          <p>We get it, stuff happens. Just enter your email address below and we'll send you a link to reset your password!</p>
          <form onSubmit={handleSubmit} className="text-areas">         
           <MDBInput onChange={handleChange}
            onBlur={handleBlur}
            value={values.email}
            name='email'
            wrapperClass='mb-4 w-100'
            label='Email address'
            id='formControlLg'
            type='email'
            size="lg"
          />
           {touched.email && errors.email ? <p style={{ color: "crimson" }}>{errors.email}</p> : ""}
          <MDBBtn
          type='submit'
            className='mb-4 w-100 '
            style={{ borderRadius: "30px", backgroundColor: "#4e73df" }}
            size='lg'
          >Reset Password link</MDBBtn>
          <div>
            <Link to="/login">Already have an account? Login!</Link>
          </div>
          </form>
        </MDBCardBody>
      </MDBCard>
      </MDBContainer>
    </div>
  );
}
