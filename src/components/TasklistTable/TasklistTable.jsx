import React, {useState} from "react";
import {Icon, Menu, Table, Input, Loader, Dimmer} from "semantic-ui-react";
import ModalCompleteContainer from "../../containers/ModalCompleteContainer/ModalCompleteContainer";
import ModalCreateContainer from "../../containers/ModalCreateContainer/ModalCreateContainer";
import {outputAmountString} from "../../utils/outputAmountString";

const TasklistTable = ({loading, list}) => {
    const [filterValue, setFilterValue] = useState('');

    const filterCells = l => {
        if (filterValue.length !== 0) {
            let lowerCaseFilterValue = filterValue.toLowerCase();
            let filteredList = l.filter(el => el.customerName.value.toLowerCase().includes(lowerCaseFilterValue, 0));
            if (filteredList.length > 0) {
                return filteredList.map((elem, idx) => renderCells(elem, idx));
            } else {
                return null;
            }
        } else {
            return l.map((element, index) => renderCells(element, index));
        }
    }

    const renderCells = (task, i) => {
        let processDefinition, formattedProcessDefinition;
        if (task) {
            processDefinition = task.processDefinitionId.substring(0, task.processDefinitionId.indexOf(':'));
            formattedProcessDefinition = processDefinition.split('_').join(' ');
        }
        let amount;
        if (task.warrantyAmount) {
            amount = outputAmountString(task.warrantyAmount.value);
        }
        return (
            <Table.Row key={i}>
                <Table.Cell>{task.name}</Table.Cell>
                <Table.Cell>{task.customerName && task.customerName.value}</Table.Cell>
                <Table.Cell>{formattedProcessDefinition[0].toUpperCase() + formattedProcessDefinition.slice(1)}</Table.Cell>
                <Table.Cell>{task.warrantyAmount && amount}</Table.Cell>
                <Table.Cell>{task.created && task.created.split('T')[0]}</Table.Cell>
                <Table.Cell>{task.due && task.due.split('T')[0]}</Table.Cell>
                <Table.Cell>
                    <ModalCompleteContainer customerName={task.customerName && task.customerName}
                                            warrantyAmount={task.warrantyAmount && task.warrantyAmount}
                                            warrantyApp={task.warrantyApplication && task.warrantyApplication}
                                            id={task.id}/>
                </Table.Cell>
            </Table.Row>
        )
    }

    return (
        <div className='TasklistTable'>
            <div className='flexBetween'>
                <ModalCreateContainer/>
                <Input value={filterValue} onChange={e => setFilterValue(e.target.value)} focus icon='search'
                       placeholder='Filter by customer'/>
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
                    {loading && <Table.Row><Table.Cell><Dimmer active inverted>
                        <Loader inverted size='large'/>
                    </Dimmer></Table.Cell></Table.Row>}
                    {list && filterCells(list)}
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
