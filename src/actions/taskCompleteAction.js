import {
    COMPLETE_TASK_REQUEST,
    COMPLETE_TASK_FAILURE,
    COMPLETE_TASK_SUCCESS,
    GET_TASK_APP_DATA_REQUEST,
    // GET_TASK_APP_DATA_SUCCESS,
    CLEAR_ERROR_MESSAGE,
    CLOSE_TASK
} from '../constants/completeTask';
import {DELETE_TASK} from '../constants/tasklist';
// import {defineFileType} from '../utils/defineFileType';
// import { saveAs } from 'file-saver';

const deleteTask = id => {
    return {
        type: DELETE_TASK,
        payload: id,
    };
};

const completeTaskFailure = error => {
    return {
        type: COMPLETE_TASK_FAILURE,
        payload: error.message,
    };
};

const closeTask = () => {
    return {
        type: CLOSE_TASK
    };
}

const clearErrorMessage = () => {
    return {
        type: CLEAR_ERROR_MESSAGE
    };
}

const postCompleteTask = (service, dispatch) => (id, warrantyAmount, customerName) => {
    dispatch({type: COMPLETE_TASK_REQUEST});
    service.postCompleteTask(id, warrantyAmount, customerName).then(() => {
        dispatch({type: COMPLETE_TASK_SUCCESS});
        dispatch(deleteTask(id));
    }).catch(err => {
        console.log("err", err.data.message);
        dispatch(completeTaskFailure(err.data));
    });
};

// const getFileData = fileUrl => {
//     return {
//         type: GET_TASK_APP_DATA_SUCCESS,
//         payload: fileUrl
//     }
// }

const getTaskAppData = (service, dispatch) => (id, appName) => {
    dispatch({type: GET_TASK_APP_DATA_REQUEST});
    service.getTaskFileContent(id).then(res => {
        // console.log("File content response", res.data);
        const URL = window.URL || window.webkitURL;
        let a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        // let mimeType = defineFileType(appName);
        // let blob = new Blob([res.data], {type: "octet/stream"});
        let blob = new Blob([res.data]);
        let url = URL.createObjectURL(blob);
        a.href = url;
        a.download = appName;
        a.click();
        URL.revokeObjectURL(url);
        // dispatch(getFileData(URL.createObjectURL(new Blob([res.data]))));
    }).catch(err => {
        err.data ? dispatch(completeTaskFailure(err.data)) : dispatch(completeTaskFailure(err));
    });
};

export {postCompleteTask, clearErrorMessage, closeTask, getTaskAppData};
