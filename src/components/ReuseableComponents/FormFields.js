import React from 'react';
import { Field, reduxForm } from 'redux-form';

const FormFields = ({ handleSubmit, propertiesName, children, extraField }) => {
    // console.log(handleSubmit)
    return (
        <form
            //handleSubmit is a function from redux form
            onSubmit={(event) => handleSubmit(event)}
            className='ui form error'>
            {extraField ? extraField(renderInput) : null}
            <Field
                name={propertiesName.firstField}
                component={renderInput}
                label={`Enter ${propertiesName.firstLabel}`}
            >
            </Field>
            <Field
                name={propertiesName.secondField}
                component={renderInput}
                label={`Enter ${propertiesName.secondLabel}`}>
            </Field>
            <button className="ui button primary">{propertiesName.buttonName}</button>
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
    const type = input.name === 'Password' ? 'password' : null;
    return (
        <div className={className}>
            <label >{label}</label>
            <input {...input} type={type} />
            {renderError(meta)}

        </div>
    );
};
//validate fucntion check if someone write on the field (Enter Title / Enter Description)
const validate = (formValues, { propertiesName: { firstField, secondField } }) => {
    const errors = {};
    if (!formValues[firstField])
        errors[firstField] = `You must enter ${firstField}`;
    if (!formValues[secondField])
        errors[secondField] = `You must enter ${secondField}`;
    // used only when profession component is called
    if (!formValues['professionName'])
        errors['professionName'] = 'You must enter Profession';

    return errors;
};

export default reduxForm({
    form: 'SimpleForm',
    validate
})(FormFields);
