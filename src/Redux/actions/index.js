import { server } from "../../Apis/server";
import history from '../../history';
export const SignIn = (userDetails) => {
    return {
        type: 'SIGN_IN',
        payload: userDetails
    }
}
export const SignOut = () => {
    return {
        type: 'SIGN_OUT',
    }
}
// const renameKey = (object, key, newKey) => {
//     const clone = (obj) => Object.assign({}, obj);
//     const clonedObj = clone(object);
//     const targetKey = clonedObj[key];
//     delete clonedObj[key];
//     clonedObj[newKey] = targetKey;
//     return clonedObj;
// };

// export const createStudent = (studentDetails) => async (dispatch) => {
//     const newKeys = ['username', 'password'];
//     Object.keys(studentDetails).forEach((oldKey, index) => { studentDetails = renameKey(studentDetails, oldKey, newKeys[index]) });
//     const response = await server.post('/users', { ...studentDetails, isLecturer: false });
//     dispatch({ type: 'CREATE_MATERIAL', payload: response.data });
//     history.push('/LecturerView');
// }

export const getClasses = (professionName) => async (dispatch, getState) => {
    const { userID } = getState().whoIsOnline;
    const response = await server.get(`/getClasses/${userID}/${professionName}`);
    dispatch({ type: 'GET_CLASSES', payload: response.data });
};
export const getProfessions = () => async (dispatch, getState) => {
    const { userID, isLecturer } = getState().whoIsOnline;
    const response = await server.get(`/getProfession/${userID}/${isLecturer}`);
    dispatch({ type: 'GET_PROFESSIONS', payload: response.data });
};

export const getStudents = (details) => async (dispatch) => {
    const { profession, className } = details;
    const response = await server.get(`/getStudentsClass?professionName=${profession}&className=${className}`);
    dispatch({ type: 'GET_STUDENTS', payload: response.data });
}

export const createClassroom = (details) => (dispatch, getState) => {
    const { userID } = getState().whoIsOnline;
    server.post('/LecturerView/createClassroom', { ...details, lecturerName: userID })
        .then((response) => {
            alert(response.data);
            history.push("/LecturerView/Profession");
        }, (error) => {
            alert("This Classroom is exists in your list!");
        })
}

export const getMaterials = ({ profession, className }) => async (dispatch, getState) => {
    const { userID, isLecturer } = getState().whoIsOnline;
    const response = await server.get(`/getMaterials?professionName=${profession}&className=${className}&username=${userID}&isLecturer=${isLecturer}`);
    dispatch({ type: 'GET_MATERIALS', payload: response.data });
};

export const createNewMaterial = (material) => async (dispatch, getState) => {
    const { loggedInUser } = getState();
    const response = await server.post('/studyMaterials', { ...material, ...loggedInUser });
    dispatch({ type: 'CREATE_MATERIAL', payload: response.data });
    history.push('/LecturerView');
}
export const getMaterialPages = (keyCollection) => async (dispatch) => {
    const response = await server.get(`/getTopicMaterials?keyCollection=${keyCollection}&type=pages`);
    dispatch({ type: 'GET_MATERIAL_PAGES', payload: response.data });

}
export const getMaterialQuestions = (keyCollection) => async (dispatch) => {
    const response = await server.get(`/getTopicMaterials?keyCollection=${keyCollection}&type=questions`);
    dispatch({ type: 'GET_MATERIAL_QUESTIONS', payload: response.data });
}
export const getMaterialExamQuestions = (details) => async (dispatch) => {
    const { user, profession, indexTopic } = details;
    const response = await server.get(`/getTestQuestions?studentName=${user}&professionName=${profession}&topicIndex=${indexTopic}`);
    dispatch({ type: 'GET_MATERIAL_TEST_QUESTIONS', payload: response.data });
}

// delete didnt return nothing, only the id beacuse the server didnt give back response
export const deleteMaterial = (id) => async (dispatch) => {
    await server.delete(`/ studyMaterials / ${id} `);
    dispatch({ type: 'DELETE_MATERIAL', payload: id });
    history.push("/LecturerView");
};