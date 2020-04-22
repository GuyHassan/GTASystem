import React from 'react';
import { Field, reduxForm } from 'redux-form';

const FormFields = ({ handleSubmit, FirstField, SecondField, children, buttonName, choosenType }) => {

    return (
        <form
            //handleSubmit is a function from redux form
            onSubmit={(event) => handleSubmit(event)}
            className='ui form error'>
            {choosenType ? choosenType() : null}
            <Field
                name={FirstField}
                component={renderInput}
                label={`Enter ${FirstField}`} >
            </Field>
            <Field
                name={SecondField}
                component={renderInput}
                label={`Enter ${SecondField}`}>
            </Field>
            <button className="ui button primary">{buttonName || 'Submit'}</button>
            {/* children coming as props from parent component */}
            {children}
            <br /><br />
        </form >
    );
};

// check if someone insert some text to the field, if not return a error message!
const renderError = ({ error, touched }) => {
    if (touched && error) {
        return (
            <div className='ui error message'>
                <div className="header"> {error} </div>
            </div>
        );
    }
}
/*  input - properties of the input from the form in render method
    label - is text with which label is call this function,
    meta -  is a validate function (get the error message)*/
const renderInput = ({ input, label, meta }) => {
    const className = `field ${meta.error && meta.touched ? 'error' : ''}`;
    return (
        <div className={className}>
            <label >{label}</label>
            <input {...input} />
            {renderError(meta)}

        </div>
    );
};
//validate fucntion check if someone write on the field (Enter Title / Enter Description)
const validate = (formValues, { FirstField, SecondField }) => {
    const errors = {};

    if (!formValues[FirstField])
        errors[FirstField] = `You must enter ${FirstField}`;

    if (!formValues[SecondField])
        errors[SecondField] = `You must enter ${SecondField}`;

    return errors;
};

export default reduxForm({
    form: 'SimpleForm',
    validate
})(FormFields);
