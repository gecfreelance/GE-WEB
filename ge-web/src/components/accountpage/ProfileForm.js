import { Formik } from 'formik'
import React, { useContext, useEffect, useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import './styles/ProfileForm.css'
import * as Yup from 'yup'
import { doc, updateDoc } from 'firebase/firestore'
import { auth, db, } from '../../Firebase'
import { ModalContext } from '../../States'


const UpdateSchema = Yup.object().shape({
    firstName: Yup.string(),
    lastName: Yup.string(),
    email: Yup.string().email('Invalid Email'),
    phoneNumber: Yup.number().min(11, 'Error').max(11, 'Error'),
    aboutMe: Yup.string().max(500, 'Character limit reached'),
    file: Yup.mixed()
})

const ProfileForm = () => {   
    const context = useContext(ModalContext)
    const { currentLoggedInUser } = context
    const [state, setState] = useState({ file: null})
    const Thumb = (file) => {
        function checkForFile(){
            if(state.file === null){return;}
            else {
                setState(() => {
                    let reader = new FileReader()
                    reader.onloadend = () => {
                        setState({file: reader.result})
                    }
                    reader.readAsDataURL(file)
                })
            }
        }
        useEffect(() => {
            checkForFile()
        })
    }

    const uploadUpdateToFirebase = (firstName, lastName) => {
        updateDoc( doc(db, 'ExpertUsers', auth.currentUser.email), {
                firstName: firstName,
                lastName: lastName
            }
        ).then(() => {})
        .catch( error => {
            console.log(error.message)
        })
    }
  return (
    <div className='ProfileForm_Body'>
    <Formik
    validationSchema={UpdateSchema}
    validateOnMount
    initialValues={{ firstName: '', lastName: '', phoneNumber: '', aboutMe: '', file: null}}
    onSubmit={values => uploadUpdateToFirebase(
        values.firstName, values.lastName
    )}
    >
         {({handleBlur, handleChange, values, setFieldValue, handleSubmit, errors}) => (
            <div className="Form">
            <div className="ProfileForm_Name">
            <Form.Group style={{ display: 'flex', flexDirection: 'column'}}>
                <Form.Label className='Name'> First Name</Form.Label>
                <Form.Control 
                type='name' 
                placeholder='First name'
                value={values.firstName}
                onChange={handleChange('firstName')}
                ></Form.Control>
            </Form.Group>
            <Form.Group style={{ display: 'flex', flexDirection: 'column'}}>
                <Form.Label className='Name'> Last Name</Form.Label>
                <Form.Control type='name' placeholder='Last name'
                value={values.lastName}
                onChange={handleChange('lastName')}
                ></Form.Control>
            </Form.Group>
            </div>
            <div className="ProfileForm_Number_Email">
            <Form.Group style={{ display: 'flex', flexDirection: 'column'}}>
                <Form.Label className='Number_Email'> Phone Number</Form.Label>
                <Form.Control type='number' placeholder='Phone Number'
                value={values.phoneNumber}
                onChange={handleChange('phoneNumber')}
                ></Form.Control>
            </Form.Group>
            <Form.Group style={{ display: 'flex', flexDirection: 'column'}}>
                <Form.Label className='Number_Email'> Email Address</Form.Label>
                <Form.Control type='email' placeholder={currentLoggedInUser.email}
                value={values.email} disabled
                onChange={handleChange('email')}></Form.Control>
            </Form.Group>
            </div>
            <Form.Group style={{ display: 'flex', flexDirection: 'column'}}>
                <Form.Label className='Description'> About Me</Form.Label>
                <Form.Control as="textarea" className='Textarea' placeholder='Tell us about yourself' rows={4} 
                value={values.aboutMe}
                onChange={handleChange('aboutMe')}
                ></Form.Control>
            </Form.Group>
            <Form.Group style={{ display: 'flex', flexDirection: 'column'}}>
                <label htmlFor='file' className='CVupload'>Upload CV / Resume</label>
                <input type="file" id="file" name="file"
                onChange={
                    (event) => {
                        setFieldValue("file", event.currentTarget.files[0])
                    }
                } />
                <Thumb file={values.file} />
            </Form.Group>
            <div className='Form_Submit'>
            <Button type='submit' onClick={handleSubmit}> Update</Button>
            </div>
            </div>
         )}
    </Formik>
    </div>
  )
}

export default ProfileForm
