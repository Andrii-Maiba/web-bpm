import React, {useState} from "react";
import {Icon, Menu, Table, Input} from "semantic-ui-react";
import ModalCompleteContainer from "../../containers/ModalCompleteContainer/ModalCompleteContainer";
import ModalCreateContainer from "../../containers/ModalCreateContainer/ModalCreateContainer";

const TasklistTable = ({list}) => {
    const [filterValue, setFilterValue] = useState('');
    let arrayOfTaskNames = list.map(task => task.name);
    const filterCells = () => {
        if (filterValue.length !== 0) {
            return arrayOfTaskNames.map(name => {
                let lowerCaseFilterValue = filterValue.toLowerCase();
                if (name.toLowerCase().includes(lowerCaseFilterValue, 0)) {
                    let filteredList = list.filter(el => el.name === name);
                    return filteredList.map((task, idx) => renderCells(task, idx));
                } else {
                    return null;
                }
            })
        } else {
            return list.map((task, idx) => renderCells(task, idx));
        }
    }

    const renderCells = (task, idx) => {
        let processDefinition, formattedProcessDefinition;
        if (task.processDefinitionId) {
            processDefinition = task.processDefinitionId.substring(0, task.processDefinitionId.indexOf(':'));
            formattedProcessDefinition = processDefinition.split('_').join(' ');
        }
        return (
            <Table.Row key={idx}><Table.Cell>{task.name && task.name}</Table.Cell>
                <Table.Cell>{task.customerName && task.customerName.value}</Table.Cell>
                <Table.Cell>{task.processDefinitionId && formattedProcessDefinition[0].toUpperCase() + formattedProcessDefinition.slice(1)}</Table.Cell>
                <Table.Cell>{task.warrantyAmount && task.warrantyAmount.value}</Table.Cell>
                <Table.Cell>{task.created && task.created.split('T')[0]}</Table.Cell>
                <Table.Cell>{task.due && task.due.split('T')[0]}</Table.Cell>
                <Table.Cell>
                    <ModalCompleteContainer customerName={task.customerName && task.customerName.value}
                                   warrantyAmount={task.warrantyAmount && task.warrantyAmount.value}
                                   id={task.id} />
                </Table.Cell>
            </Table.Row>)
    }

    return (
        <div className='TasklistTable'>
            <div className='flexBetween'>
                <ModalCreateContainer />
                <Input value={filterValue} onChange={e => setFilterValue(e.target.value)} focus icon='search'
                       placeholder='Filter by task name'/>
            </div>
            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Task Name</Table.HeaderCell>
                        <Table.HeaderCell>Customer</Table.HeaderCell>
                        <Table.HeaderCell>Process Definition</Table.HeaderCell>
                        <Table.HeaderCell>Amount</Table.HeaderCell>
                        <Table.HeaderCell>Created</Table.HeaderCell>
                        <Table.HeaderCell>Due</Table.HeaderCell>
                        <Table.HeaderCell>Launch Task</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {list && filterCells()}
                </Table.Body>
                <Table.Footer>
                    <Table.Row>
                        <Table.HeaderCell colSpan='7'>
                            <Menu floated='right' pagination>
                                <Menu.Item as='a' icon>
                                    <Icon name='chevron left'/>
                                </Menu.Item>
                                <Menu.Item as='a'>1</Menu.Item>
                                <Menu.Item as='a'>2</Menu.Item>
                                <Menu.Item as='a'>3</Menu.Item>
                                <Menu.Item as='a'>4</Menu.Item>
                                <Menu.Item as='a' icon>
                                    <Icon name='chevron right'/>
                                </Menu.Item>
                            </Menu>
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Footer>
            </Table>
        </div>
    );
};

export default TasklistTable;
TasklistTable.displayName = 'Tasklist Table';
