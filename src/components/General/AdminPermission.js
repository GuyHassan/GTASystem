import React from 'react';
import AddNewUser from '../ReuseableComponents/AddNewUser';
/** Only Admin user can use this component, them can register a lecturer to the system */
const AdminPermission = () => {
    return (
        <div>
            <AddNewUser titleMessage={"Add New Lecturer"} />
        </div>
    )
}

export default AdminPermission;