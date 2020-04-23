import React from 'react';
import FormFields from '../../ReuseableComponents/FormFields';


const NewClassroom = () => {

    const onSubmitClass = () => {

    }

    return (
        <div>
            <h1>New Classroom</h1><br />
            <FormFields
                onSubmit={onSubmitClass}
                FirstField={"name"}
                SecondField={"description"}
                buttonName={"Add Classroom"}
            />
        </div>
    )
}
export default NewClassroom;