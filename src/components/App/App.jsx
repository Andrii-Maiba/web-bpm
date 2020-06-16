import React from 'react';
import {Route, Switch} from 'react-router-dom';
import HeaderNav from '../Header/Header';
import TasklistPageContainer from '../../containers/TasklistPageContainer/TasklistPageContainer';
import ProcessPageContainer from '../../containers/ProcessPageContainer/ProcessPageContainer';

const App = () => {
    return (
        <>
            <HeaderNav />
                <Switch>
                    <Route path="/" component={TasklistPageContainer} exact/>
                    <Route path="/process" component={ProcessPageContainer}/>
                </Switch>
        </>
    );
}

export default App;
