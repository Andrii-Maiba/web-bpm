import {
    COMPLETE_TASK_REQUEST,
    COMPLETE_TASK_FAILURE,
    COMPLETE_TASK_SUCCESS,
    CLEAR_ERROR_MESSAGE,
    CLOSE_TASK,
    GET_XML_SUCCESS,
} from '../constants/completeTask';
import {DELETE_TASK} from '../constants/tasklist';
// import {saveAs} from 'file-saver';
// import {Blob} from 'blob-polyfill';

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
};

const clearErrorMessage = () => {
    return {
        type: CLEAR_ERROR_MESSAGE
    };
};

const getXmlSuccess = xml => {
    return {
        type: GET_XML_SUCCESS,
        payload: xml
    };
};

const postCompleteTask = (service, dispatch) => (id, formData) => {
    dispatch({type: COMPLETE_TASK_REQUEST});
    service.postCompleteTask(id, formData).then(res => {
        dispatch({type: COMPLETE_TASK_SUCCESS});
        dispatch(deleteTask(id));
    }).catch(err => {
        console.log("err", err.data.message);
        dispatch(completeTaskFailure(err.data));
    });
};

// const getTaskAppData = (service, dispatch) => (id, appName) => {
//     dispatch({type: COMPLETE_TASK_REQUEST});
//     service.getTaskFileContent(id).then(res => {
//         let blob = new Blob([res.data]);
//         saveAs(blob, appName);
//     }).catch(err => {
//         err.data ? dispatch(completeTaskFailure(err.data)) : dispatch(completeTaskFailure(err));
//     });
// };

const getXml = (service, dispatch) => (procDefinitionKey, taskDefinitionKey) => {
    dispatch({type: COMPLETE_TASK_REQUEST});
    service.getXml(procDefinitionKey).then(res => {
        // console.log("getXml response", res.data.bpmn20Xml);
        let oParser = new DOMParser();
        let oDOM = oParser.parseFromString(res.data.bpmn20Xml, "application/xml");
        let taskFormData = [...oDOM.documentElement.firstElementChild.children]
            .filter(el => el.nodeName === "bpmn:userTask" && el.id === taskDefinitionKey)[0].children;
        dispatch(getXmlSuccess(taskFormData));
    }).catch(err => {
        err.data ? dispatch(completeTaskFailure(err.data)) : dispatch(completeTaskFailure(err));
    });
};

export {postCompleteTask, clearErrorMessage, closeTask, getXml};
