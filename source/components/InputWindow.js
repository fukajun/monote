import React from 'react';

export default class InputWindow extends React.Component {
  constructor(props) {
    super(props);
    this.okHandler = this.okHandler.bind(this);
  }

  okHandler() {
    this.props.onSubmit(this.input.value)
  }

  render() {
    const props = this.props;
    return (
      <div className="window-wrapper" onClick={props.onClose}>
        <div className="window dirpath" onClick={e => e.stopPropagation()}>
          <a className="window-close" onClick={props.onClose} ><i className="fa fa-close" /></a>
          <div className="window-contents" >
            <h2 className="window-title">Change directory</h2>
            <input defaultValue={props.value} ref={(c) => this.input = c} />
            <ul>
              <li><a className="window-ok-button" onClick={this.okHandler}>Save</a></li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
