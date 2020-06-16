import {
    GET_TASKLIST_REQUEST,
    GET_TASKLIST_FAILURE,
    GET_TASKSDATA_SUCCESS
} from '../constants/tasklist';

const addVariablesToTasks = ({ tasklistData, tasksVariables }) => {
    // console.log("tasksVariables", tasksVariables);
    tasklistData.forEach(task => {
        let chosenTask = tasksVariables.find(el => el.id === task.id);
        task.customerName = chosenTask.customerName;
        task.warrantyAmount = chosenTask.warrantyAmount;
        return task;
    })
    return [...tasklistData];
};

const updateTasklist = (state, action) => {
    if (typeof state === 'undefined') {
        return {
            loading: false,
            error: null,
            list: [],
        };
    }
    switch (action.type) {
        case GET_TASKLIST_REQUEST:
            return {...state.tasklist, loading: true};
        case GET_TASKSDATA_SUCCESS:
            return {
                loading: false,
                error: null,
                list: addVariablesToTasks(action.payload),
            };
        case GET_TASKLIST_FAILURE:
            return {...state.tasklist, loading: false, error: action.payload};
        default:
            return state.tasklist;
    }
};

export default updateTasklist;
