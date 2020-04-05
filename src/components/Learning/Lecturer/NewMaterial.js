import React from 'react';
import { useHistory } from 'react-router';
import FormField from '../../ReuseableStuff/FormFields';
import { createNewMaterial } from '../../../Redux/actions';
import { connect } from 'react-redux';

const NewMaterial = ({ createNewMaterial }) => {
    /* useHistory is a function from react-router, he have alot of function that help us arrange the components */
    const history = useHistory();
    const onSubmit = (formValues) => {
        createNewMaterial(formValues);
    }
    return (
        <div>
            <h1>New Materials</h1>
            <FormField
                FirstField='type'
                SecondField='description'
                onSubmit={onSubmit}
                buttonName={'Add'}>
                <button onClick={history.goBack} className="ui button green">Back</button>
            </FormField>
        </div>
    )
}

export default connect(null, { createNewMaterial })(NewMaterial);