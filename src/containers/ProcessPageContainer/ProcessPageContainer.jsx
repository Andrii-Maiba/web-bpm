import React, { Component } from 'react';
import { connect } from 'react-redux';
import compose from '../../utils/compose';
import withServices from '../../components/hocs/withServices';

class ProcessPageContainer extends Component {
    render() {
        return (
            <>
                {this.props.loading && 'Loading...'}
                <p>Process</p>
            </>
        );
    }
}

const mapStateToProps = ({ tasklist: { list, loading } }) => {
    return {
        list,
        loading,
    };
};

export default compose(withServices(), connect(mapStateToProps))(ProcessPageContainer);
