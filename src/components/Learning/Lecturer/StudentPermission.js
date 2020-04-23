import React, { Fragment } from 'react';
import AddNewUser from '../../ReuseableComponents/AddNewUser';

const StudentPermission = () => {
    const className = (handleChange, className, errClassName) => {
        return (
            <Fragment>
                <label>Class Name:</label>
                <input placeholder="Class Name" name="className" type="text" value={className} onChange={handleChange} />
                <div className='ui error message header' style={{ width: '25vw', fontSize: '1em' }}>
                    {errClassName}
                </div>
            </Fragment>
        )
    }
    return (
        <div>
            <AddNewUser titleMessage={"Add New Student"} classNameJsx={className} />
        </div>
    )
}

export default StudentPermission;