import {
    CREATE_PROCESS_REQUEST,
    CREATE_PROCESS_FAILURE,
    CREATE_PROCESS_SUCCESS,
    CLEAR_CREATE_ERROR_MESSAGE,
    CLOSE_CREATE_MODAL
} from '../constants/createProcess';

const createProcessFailure = error => {
    return {
        type: CREATE_PROCESS_FAILURE,
        payload: error.message,
        // payload: "Wrong",
    };
};

const closeCreateModal = () => {
    return {
        type: CLOSE_CREATE_MODAL
    };
}

const clearCreateErrorMessage = () => {
    return {
        type: CLEAR_CREATE_ERROR_MESSAGE
    };
}

const createProcess = (service, dispatch) => (data, processKey, businessKey) => {
    dispatch({type: CREATE_PROCESS_REQUEST});
    service.postCreateProcess(data, processKey, businessKey).then((res) => {
        // console.log("res", res.status);
        dispatch({type: CREATE_PROCESS_SUCCESS});
    }).catch(err => {
            // console.log("err", err.data.message);
            dispatch(createProcessFailure(err.data));
            // dispatch(createProcessFailure(err));
        });
};

export {createProcess, clearCreateErrorMessage, closeCreateModal};
