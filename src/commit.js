import React, {Component} from 'react';

class Commit extends Component {
    render() {
        return (
            <div>{this.props.infos.sha}</div>
        );
    }
}

export default Commit;