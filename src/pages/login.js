import React from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput
}
from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';

import { useFormik } from "formik";
import { useHistory } from "react-router-dom";
import * as yup from 'yup';



const userSchemaValidation = yup.object({
  email: yup.string().required("Please fill in your Email"),
  password: yup.string().required("please write proper password"),
 
})


export function Login() {
  const history =useHistory();
  const log = async ({ loginuser }) => {
    try {
      const response = await fetch("https://zoom-metting-backend.onrender.com/login", {
        method: "POST",
        body: JSON.stringify(loginuser),
        headers: {
          "Content-Type": "application/json",
        },
      })
      const data = await response.json();
      if(data.token){
      console.log(data);
       sessionStorage.setItem('token',data.token)
      sessionStorage.setItem('value',data.value)
        history.push("/mymeetings")

      }else{
        console.log("invalide userId password")
      }
    } catch (error) {
      console.log(error)
    }
  }
  const { values, handleChange, handleSubmit, handleBlur, errors, touched } = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: userSchemaValidation,
    onSubmit: (loginuser) => {
      log({ loginuser });
    }

  })


  return (
    <div className="bg-cl back">
    <MDBContainer fluid style={{height:"100vh"}}>

      <MDBRow className='d-flex justify-content-center align-items-center h-100' >
        <MDBCol col='12'>

          <MDBCard className='bg-dark text-white my-5 mx-auto' style={{borderRadius: '1rem', maxWidth: '400px'}}>
            <MDBCardBody className='p-5 d-flex flex-column align-items-center mx-auto w-100'>

              <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
              <p className="text-white-50 mb-5">Please enter your login and password!</p>
            <div>
              <form onSubmit={handleSubmit} className="text-areas">
              <MDBInput onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
               wrapperClass='mb-4 mx-5 w-100' 
               labelClass='text-white'
                label='Email address' 
                id="fullWidth"
                type='email'
                name='email'
                 size="lg"/>
                 {touched.email && errors.email ? <p style={{ color: "crimson" }}>{errors.email}</p> : ""}
          
              <MDBInput onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
              wrapperClass='mb-4 mx-5 w-100' 
              labelClass='text-white' 
              label='Password' 
              id='formControlLg' 
              type='password' 
              name='password'
              size="lg"/>
              {touched.password && errors.password ? <p style={{ color: "crimson" }}>{errors.password}</p> : ""}
          
              <div>
               <p className="mb-0"><a style={{color:'white'}} href="/forgotpassword">Forgot password?</a></p>
               </div>
              <MDBBtn 
              outline 
              className='mx-2 px-5' 
              style={{color:'#fff'}} 
              size='lg' 
              type="submit"
              >
                Login
              </MDBBtn>
          </form>
          </div>


              <div>
                <p className="mb-0">Don't have an account? <a href="/signup" class="text-white-50 fw-bold">Sign Up</a></p>

              </div>
            </MDBCardBody>
          </MDBCard>

        </MDBCol>
      </MDBRow>

    </MDBContainer>
    </div>
  );
}



