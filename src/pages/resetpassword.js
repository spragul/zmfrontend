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
    import { useHistory, useParams } from "react-router-dom";
    import * as yup from 'yup'
    import 'mdb-react-ui-kit/dist/css/mdb.min.css';
    
    const userSchemaValidation = yup.object({
        password: yup.string().required("Please fill in your password"),
    })

export function Reset() {
    const history = useHistory();
    let {id,token}=useParams();
    console.log(id,token);
    const restdata = async ({ newpassword }) => {
        try {
            const response = await fetch(`https://zoom-metting-backend.onrender.com/resetpassword/${id}/${token}`, {
                method: "POST",
                body: JSON.stringify(newpassword),
                headers: {
                    "Content-Type": "application/json",
                },
            })
        
            const data = await response.json();
            sessionStorage.setItem('token',token)
            history.push("/login")


        } catch (error) {
            console.log(error)

        }
    }
    const { values, handleChange, handleSubmit, handleBlur, errors, touched } = useFormik({
        initialValues: {
            password: '',
        },
        validationSchema: userSchemaValidation,
        onSubmit: (newpassword) => {
            restdata({ newpassword });
        }

    })
    return (
        <div className="bg-cl">
            <MDBContainer fluid className='d-flex align-items-center justify-content-center bg-image' style={{ backgroundColor: 'blue', height: '100vh' }}>      <MDBCard className='m-5' style={{ maxWidth: '600px' }}>
                <MDBCardBody className='px-5'>
                    <h2 className="text-uppercase text-center mb-5">Reset Passwors</h2>
                    <form onSubmit={handleSubmit} className="text-areas">
                        <MDBInput onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.password}
                            name='password'
                            wrapperClass='mb-4 w-100'
                            label='New Password'
                            id='formControlLg'
                            type='password'
                            size="lg" />
                            {touched.password && errors.password ? <p style={{ color: "crimson" }}>{errors.password}</p> : ""}
                        <MDBBtn
                            className='mb-4 w-100 '
                            style={{ borderRadius: "30px", backgroundColor: "#4e73df" }}
                            size='lg'
                            type='submit'
                        >
                            Reset Password</MDBBtn>
                    </form>
                </MDBCardBody>
            </MDBCard>
            </MDBContainer>
        </div>
    );
}
