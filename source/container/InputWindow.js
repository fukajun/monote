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
      <div className="help-cover" onClick={props.onClose}>
        <div className="qr-window" onClick={e => e.stopPropagation()}>
          <a className="help-close" onClick={props.onClose} ><i className="fa fa-close" /></a>
          <div className="help-contents" >
            <h2 className="help-title">Change directory</h2>
            <input defaultValue={props.value} ref={(c) => this.input = c} />
            <ul>
              <li><a onClick={this.okHandler}>OK</a></li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
