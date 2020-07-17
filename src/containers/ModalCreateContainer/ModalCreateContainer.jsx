import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux';
import {Form, Input, Button, Header, Modal, Message, Dimmer, Loader} from 'semantic-ui-react';
import {injectIntl} from "react-intl";
import FileBase64 from 'react-file-base64';
import compose from '../../utils/compose';
import withServices from '../../components/hocs/withServices';
import {
    createProcess,
    clearCreateErrorMessage,
    closeCreateModal,
    getStartEventXml
} from '../../actions/createProcessAction';
import {takeChangedFormValues} from '../../utils/takeChangedDynamicFormValues';
import {createModalMessages} from './ModalCreateContainerMessages';
import {validationMessages} from '../../utils/validationFormMessages';

class ModalCreateContainer extends Component {
    state = {modalCreateOpen: false, isCreatingValidationError: false}
    creatingFormFields

    shouldComponentUpdate(nextProps) {
        if (nextProps.isCreated) {
            this.setState({modalCreateOpen: false, isCreatingValidationError: false});
            this.props.closeModal();
            return false;
        }
        return true;
    }

    getCreatingFormFieldsData = (formDataFields, formData = []) => {
        Array.from(formDataFields).filter(el => el.nodeName === "camunda:formField").forEach(el => {
            let attributes = Array.from(el.attributes);
            let type = attributes.find(el => el.nodeName === "type").nodeValue;
            let id = attributes.find(el => el.nodeName === "id").nodeValue;
            let label = attributes.find(el => el.nodeName === "label").nodeValue;
            let defaultValueString = attributes.find(el => el.nodeName === "defaultValue");
            let fieldData = {};
            fieldData.type = type;
            fieldData.id = id;
            fieldData.label = label;
            if (type === "string") {
                fieldData.value = defaultValueString !== undefined ? defaultValueString.nodeValue : '';
            }
            if (type === "long") {
                fieldData.value = defaultValueString !== undefined ? Number(defaultValueString.nodeValue) : 0;
            }
            if (type === "double") {
                fieldData.value = defaultValueString !== undefined ? Number(defaultValueString.nodeValue) : 0.00;
            }
            if (type === "file") {
                fieldData.fileName = "";
            }
            if (type === "boolean") {
                let booleanDefaultValue;
                if (defaultValueString !== undefined) {
                    const defaultNodeValue = defaultValueString.nodeValue;
                    // eslint-disable-next-line
                    booleanDefaultValue = (defaultNodeValue == String(defaultNodeValue ? true : false)) ? (defaultNodeValue ? true : false) : (!defaultNodeValue ? true : false);
                }
                fieldData.value = defaultValueString !== undefined ? booleanDefaultValue : false;
            }
            if (type === "enum") {
                const enumValues = Array.from(attributes.find(el => el.nodeName === "id").ownerElement.childNodes).filter(el => el.nodeName === "camunda:value");
                fieldData.values = [];
                enumValues.forEach(el => {
                    let enumValueName = Array.from(el.attributes).find(el => el.nodeName === "name").nodeValue;
                    let enumValueId = Array.from(el.attributes).find(el => el.nodeName === "id").nodeValue;
                    fieldData.values.push({enumValueId, enumValueName});
                    // console.dir(enumValue.nodeValue)
                })
                fieldData.value = defaultValueString !== undefined ? defaultValueString.nodeValue : fieldData.values[0].enumValueId;
            }
            formData.push(fieldData);
        });
        // console.dir(formData);
        return formData;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.xmlStartEventData !== this.props.xmlStartEventData && prevProps.xmlStartEventData === null) {
            this.creatingFormFields = Array.from(this.props.xmlStartEventData).find(el => el.nodeName === "bpmn:extensionElements").childNodes[1].childNodes;
            // console.dir(this.creatingFormFields)
            this.setState({
                modalCreateOpen: true,
                data: this.getCreatingFormFieldsData(this.creatingFormFields),
                isCreatingValidationError: false
            });
        }
    }

    handleCreateModalOpen = () => {
        this.props.getStartEventXml();
        this.setState({modalCreateOpen: true, isCreatingValidationError: false})
    }

    handleCreateModalClose = () => {
        this.setState({modalCreateOpen: false, isCreatingValidationError: false});
        this.props.closeModal();
    }

    handleChange = (event, id, type, value) => {
        const [isValidationError, formFields] = takeChangedFormValues(this.state.data, event, id, type, value);
        this.setState({...this.state, isCreatingValidationError: isValidationError, data: [...formFields]});
    }

    handleCreatingFileInputChange = (e, id) => {
        const fileValueBase64 = e.base64.split(',')[1];
        const formFieldsData = this.state.data;
        formFieldsData.forEach(field => {
            if (field.id === id) {
                field.value = fileValueBase64;
                field.fileName = e.name;
            }
            return field;
        });
        this.setState({...this.state, data: [...formFieldsData]});
    }

    handleSubmit = event => {
        this.props.createProcess(this.state.data);
        event.preventDefault();
    }

    render() {
        const {loading, createProcessError, clearErrorMessage, intl} = this.props;
        if (createProcessError) {
            setTimeout(() => clearErrorMessage(), 4000);
        }
        // console.log("state.data", this.state.data)
        return (
            <Modal trigger={<Button color="blue"
                                    onClick={this.handleCreateModalOpen}>{intl.formatMessage(createModalMessages["button-open"])}</Button>}
                   open={this.state.modalCreateOpen}
                   onClose={this.handleCreateModalClose} closeIcon>
                <Header color="blue" icon='add' content={intl.formatMessage(createModalMessages.header)}/>
                <Modal.Content>
                    {loading && <Dimmer active inverted><Loader inverted/></Dimmer>}
                    {this.state.data && <Form onSubmit={this.handleSubmit} error>
                        {this.state.data.map(el => {
                            if (el.type === "string" && el.id.toLowerCase().includes("comment")) {
                                return (<Form.TextArea key={el.id}
                                                       label={el.label}
                                                       name={el.type}
                                    // placeholder={el.label}
                                                       placeholder={el.value}
                                                       value={el.value}
                                                       onChange={e => this.handleChange(e, el.id)}/>)
                            } else if (el.type === "string") {
                                return (<Form.Field key={el.id} required fluid width={8}
                                                    control={Input}
                                                    label={el.label}
                                                    name={el.type}
                                    // placeholder={el.label}
                                                    placeholder={el.value}
                                                    value={el.value}
                                                    onChange={e => this.handleChange(e, el.id)}
                                />)
                            } else if (el.type === "long") {
                                return (<Form.Field key={el.id} required fluid width={8}
                                                    control={Input}
                                                    label={el.label}
                                                    name={el.type}
                                    // placeholder="0"
                                                    placeholder={el.value}
                                                    value={el.value}
                                                    error={el.longValidationErr && intl.formatMessage(validationMessages[`${el.longValidationErr}`])}
                                                    onChange={e => this.handleChange(e, el.id)}
                                />)
                            } else if (el.type === "double") {
                                return (<Form.Field key={el.id} required fluid width={8}
                                                    control={Input}
                                                    label={el.label}
                                                    name={el.type}
                                    // placeholder="0.00"
                                                    placeholder={el.value}
                                                    value={el.value}
                                                    error={el.doubleValidationErr && intl.formatMessage(validationMessages[`${el.doubleValidationErr}`])}
                                                    onChange={e => this.handleChange(e, el.id)}
                                />)
                            } else if (el.type === "boolean") {
                                return (<Form.Checkbox key={el.id}
                                                       checked={el.value}
                                                       label={el.label[0].toUpperCase() + el.label.slice(1)}
                                                       onChange={e => this.handleChange(e, el.id, el.type, el.value)}
                                />)
                            } else if (el.type === "file") {
                                return (<Fragment key={el.id}>
                                    <label className="label">{el.label}</label>
                                    <label key={el.id} className="form__file-input-label">
                                        <FileBase64 multiple={false}
                                                    onDone={e => this.handleCreatingFileInputChange(e, el.id)}/>
                                        {(el.fileName !== "") ? el.fileName : intl.formatMessage(createModalMessages["input-file"])}
                                    </label>
                                </Fragment>)
                                } else if (el.type === "enum") {
                                    return (<Form.Field key={el.id}
                                                        value={el.value}
                                                        label={el.label}
                                                        onChange={e => this.handleChange(e, el.id, el.type)}
                                                        control='select'>
                                        {el.values.map(elem => <option key={elem.enumValueId}
                                                                       value={elem.enumValueId}>{elem.enumValueName}</option>)}
                                    </Form.Field>)
                            } else {
                                return (<Form.Field key={el.id} fluid width={8}
                                                    control={Input}
                                                    label={el.label}
                                                    name={el.type}
                                    // placeholder=""
                                                    placeholder={el.value}
                                                    value={el.value}
                                                    onChange={e => this.handleChange(e, el.id)}
                                />)
                            }
                        })}
                        {this.state.isCreatingValidationError ? <Form.Field
                            control={Button}
                            color="blue"
                            floated='right'
                            className="modalButton"
                            content={intl.formatMessage(createModalMessages["button-action"])} disabled
                        /> : <Form.Field
                            control={Button}
                            color="blue"
                            floated='right'
                            className="modalButton"
                            content={intl.formatMessage(createModalMessages["button-action"])}
                        />}
                    </Form>}
                    {createProcessError &&
                    <Message error header={intl.formatMessage(createModalMessages["error-header"])}
                             content={createProcessError}/>}
                </Modal.Content>
            </Modal>
        )
    }
}

const mapStateToProps = ({processCreate: {loading, isCreated, createProcessError, xmlStartEventData}}) => {
    return {loading, xmlStartEventData, isCreated, createProcessError};
};

const mapDispatchToProps = (dispatch, {services}) => {
    return {
        createProcess: (data,
                        processKey = "warranty_approval_test",
                        businessKey = "myBusinessKey") => createProcess(services, dispatch)(data, processKey, businessKey),
        getStartEventXml: (procDefinitionKey = "warranty_approval_test") => getStartEventXml(services, dispatch)(procDefinitionKey),
        clearErrorMessage: () => dispatch(clearCreateErrorMessage()),
        closeModal: () => dispatch(closeCreateModal())
    };
};

export default compose(injectIntl, withServices(), connect(mapStateToProps, mapDispatchToProps))(ModalCreateContainer);
