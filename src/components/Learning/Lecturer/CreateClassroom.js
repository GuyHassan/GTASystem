import React, { Fragment } from 'react';
import { useHistory } from 'react-router';
import FormField from '../../ReuseableComponents/FormFields';
import { createClassroom } from '../../../Redux/actions';
import { connect } from 'react-redux';
import { Field } from 'redux-form';


const CreateClassroom = ({ createClassroom }) => {
    /* useHistory is a function from react-router, he have alot of function that help us arrange the components */
    const history = useHistory();
    const propertiesName = {
        firstLabel: 'Class Name', secondLabel: 'Description',
        firstField: 'className', secondField: 'description', buttonName: 'Add Classroom'
    }
    const onSubmit = (formValues) => {
        createClassroom(formValues)
    }
    const extraField = (renderInput) => {
        return (
            <Fragment>
                <Field
                    name={"professionName"}
                    component={renderInput}
                    label='Enter Profession' >
                </Field>
            </Fragment >
        )
    }
    return (
        <div>
            <h1>New Classroom</h1>
            <FormField
                propertiesName={propertiesName}
                onSubmit={onSubmit}
                extraField={extraField}>
                <button onClick={history.goBack} className="ui button green">Back</button>
            </FormField>
        </div>
    )
}

export default connect(null, { createClassroom })(CreateClassroom);