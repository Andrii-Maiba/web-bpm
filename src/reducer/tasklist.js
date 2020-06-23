import {
    GET_TASKLIST_REQUEST,
    GET_TASKLIST_FAILURE,
    GET_TASKSDATA_SUCCESS,
    CREATE_TASK_SUCCESS,
    DELETE_TASK
} from '../constants/tasklist';

const addVariablesToTasks = ({tasklistData, tasksVariables}) => {
    tasklistData.forEach(task => {
        let chosenTask = tasksVariables.find(el => el.id === task.id);
        task.customerName = chosenTask.customerName;
        task.warrantyAmount = chosenTask.warrantyAmount;
        task.warrantyApplication = chosenTask.warrantyApplication;
        return task;
    })
    return [...tasklistData];
};

const deleteTaskById = (id, stateList) => {
    let filteredStateList = stateList.filter(el => el.id !== id);
    return [...filteredStateList];
}

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
        case CREATE_TASK_SUCCESS:
            return {
                loading: false,
                error: null,
                list: [...state.tasklist.list, action.payload],
            };
        case DELETE_TASK:
            return {
                loading: false,
                error: null,
                list: deleteTaskById(action.payload, state.tasklist.list),
            };
        case GET_TASKLIST_FAILURE:
            return {...state.tasklist, loading: false, error: action.payload};
        default:
            return state.tasklist;
    }
};

export default updateTasklist;
