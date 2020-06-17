import {
    COMPLETE_TASK_REQUEST,
    COMPLETE_TASK_FAILURE,
    COMPLETE_TASK_SUCCESS,
    CLEAR_ERROR_MESSAGE,
    CLOSE_TASK
} from '../constants/completeTask';

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
    service.postCompleteTask(id, warrantyAmount, customerName).then(() => dispatch({type: COMPLETE_TASK_SUCCESS}))
        .catch(err => {
            console.log("err", err.data.message);
            dispatch(completeTaskFailure(err.data));
        });
};

export {postCompleteTask, clearErrorMessage, closeTask};
