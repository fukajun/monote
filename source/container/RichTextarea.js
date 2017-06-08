

import React from 'react';
import _u from 'lodash';

const CURSOR_POSITION = 0;
// NOTE: pattern match as https://localhost:3000, https//192.168.1.1:3000, https://example.com
const URL_PATTERN = /(https?:\/\/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.?[-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

export default class RichTextarea extends React.Component {
  constructor(props) {
    super(props);
    this.value = props.value;
    this.state = { isScrolling: false };
    this.debounceOnScroll = _u.debounce(() => {
      this.setState({ isScrolling: false });
    }, 100);
  }

  componentDidMount() {
    this._setCursorPosition(this.props.startPosition);
  }

  _syncScrollPositionFromInput(e) {
    const scrollTop = e.target.scrollTop;
    this.refs.coverContents.scrollTop = scrollTop;

    // Disable url link in scrolling
    this.setState({ isScrolling: true });
    this.debounceOnScroll();
  }

  _syncScrollPositionFromCover(e) {
    if (this.props.isEnableLink) {
      const scrollTop = e.target.scrollTop;
      this.refs.inputContents.scrollTop = scrollTop;
    }
  }

  _moveCursor(e) {
    const { selectionStart, selectionEnd } = this.refs.inputContents;
    this.props.onSelect(this.value.slice(selectionStart, selectionEnd));
    this.props.onMoveCursor(selectionStart, selectionEnd);
  }

  _handleOnLinkClick(e) {
    e.preventDefault();
    this.props.onClickLink(e.target.href);
  }

  _setCursorPosition(pos) {
    // NOTE: Important call order
    this.refs.inputContents.setSelectionRange(pos, pos);
    this.refs.inputContents.focus();
  }

  _isHideInputContents() {
    return this.state.isScrolling || this.props.isEnableLink;
  }

  _changeContents(e) {
    this.value = e.target.value;
    this.props.onChange(e.target.value);
  }

  _blurHandler() {
    if (this.props.onBlur) {
      this.props.onBlur();
    }
  }

  renderCoverContents() {
    const keyName = 'coverElement';
    const urlStateClassName = this.props.isEnableLink ? 'active' : 'disable';
    let i = 0;
    return (
      this.props.value.split('\n').map((str) => {
        const lineElements = str.split(URL_PATTERN).map((el) => {
          if (el.match(URL_PATTERN)) {
            return <a key={`${keyName}-${i++}`} href={el} className={`editor-cover-contents-url ${urlStateClassName}`} onClick={this._handleOnLinkClick.bind(this)}>{el}</a>;
          }
          return <span key={`${keyName}-${i++}`} >{el}</span>;
        });
        return (<span key={`${keyName}-${i++}`} >{lineElements}<br /></span>);
      })
    );
  }

  render() {
    const inputStateClassName = this._isHideInputContents() ? 'disable' : 'active';
    const coverStateClassName = 'active';

    return (
      <div className="rich-textarea">

        <div className="editor-bg">
          <div
            className={`editor-cover-contents ${coverStateClassName}`}
            onScroll={this._syncScrollPositionFromCover.bind(this)}
            ref="coverContents"
          >
            {this.renderCoverContents()}
          </div>
        </div>

        <div className="editor-fg">
          <textarea
            className={`editor-input-contents ${inputStateClassName}`}
            ref="inputContents"
            onChange={this._changeContents.bind(this)}
            onKeyDown={this._moveCursor.bind(this)}
            onClick={this._moveCursor.bind(this)}
            onScroll={this._syncScrollPositionFromInput.bind(this)}
            onBlur={this._blurHandler.bind(this)}
            value={this.props.value}
          />
        </div>

      </div>
    );
  }
}
