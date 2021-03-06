import React from 'react';
import _u from 'lodash';

// NOTE: pattern match as https://localhost:3000, https//192.168.1.1:3000, https://example.com
//       pattern match as #new, #20181231235930
const LINK_PATTERN = /(https?:\/\/[-a-zA-Z0-9@:%._+~#=]{2,256}\.?[-a-zA-Z0-9@:%_+.~#?&//=]*|^#new|^#[0-9]{17,17}| #new| #[0-9]{17,17})/;
const URL_PATTERN = /(https?:\/\/[-a-zA-Z0-9@:%._+~#=]{2,256}\.?[-a-zA-Z0-9@:%_+.~#?&//=]*)/;
const ID_PATTERN = /( #[0-9]{17,17}|^#[0-9]{17,17})/;
const NEW_ID_PATTERN = /( #new|^#new)/;

export default class RichTextarea extends React.Component {
  constructor(props) {
    super(props);
    this.value = props.value;
    this.state = { isScrolling: false };
    this.debounceOnScroll = _u.debounce(() => {
      this.setState({ isScrolling: false });
    }, 100);
    this._handleOnLinkClick = this._handleOnLinkClick.bind(this);
    this._blurHandler = this._blurHandler.bind(this);
    this._syncScrollPositionFromInput = this._syncScrollPositionFromInput.bind(this);
    this._moveCursor = this._moveCursor.bind(this);
    this._changeContents = this._changeContents.bind(this);
    this._syncScrollPositionFromCover = this._syncScrollPositionFromCover.bind(this);
    this._handleOnLinkClick = this._handleOnLinkClick.bind(this);
    this._handleOnIdLinkClick = this._handleOnIdLinkClick.bind(this);
    this._handleOnNewLinkClick = this._handleOnNewLinkClick.bind(this);
  }

  componentDidMount() {
    this._setCursorPosition(this.props.startPosition);
  }

  _syncScrollPositionFromInput(e) {
    const scrollTop = e.target.scrollTop;
    this.coverContents.scrollTop = scrollTop;

    // Disable url link in scrolling
    this.setState({ isScrolling: true });
    this.debounceOnScroll();
  }

  _syncScrollPositionFromCover(e) {
    if (this.props.isEnableLink) {
      const scrollTop = e.target.scrollTop;
      this.inputContents.scrollTop = scrollTop;
    }
  }

  _moveCursor(e) {
    const { selectionStart, selectionEnd } = this.inputContents;
    this.props.onSelect(this.value.slice(selectionStart, selectionEnd));
    this.props.onMoveCursor(selectionStart, selectionEnd);
  }

  _handleOnLinkClick(e) {
    e.preventDefault();
    this.props.onClickLink(e.target.href);
  }

  _handleOnIdLinkClick(e) {
    e.preventDefault();
    this.props.onClickIdLink(e.target.href);
  }

  _handleOnNewLinkClick(e) {
    e.preventDefault();
    this.props.onClickNewLink(e.target.getAttribute('data-click-line'));
  }

  _setCursorPosition(pos) {
    // NOTE: Important call order
    this.inputContents.setSelectionRange(pos, pos);
    this.inputContents.focus();
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

  _generateKey(keyName) {
    let i = 0;
    return () => (`${keyName}-${(i += 1)}`);
  }

  renderCoverContents() {
    const urlStateClassName = this.props.isEnableLink ? 'active' : 'disable';
    const key = this._generateKey('coverElement');

    let line = 0;
    return (
      this.props.value.split('\n').map((str) => {
        line = line + 1;
        const lineElements = str.split(LINK_PATTERN).map((el) => {
          if (el.match(URL_PATTERN)) {
            return <a key={key()} href={el} className={`editor-cover-contents-url ${urlStateClassName}`} onClick={this._handleOnLinkClick}>{el}</a>;
          } else if (el.match(NEW_ID_PATTERN)) {
            return <a key={key()} href={el} data-click-line={line} className={`editor-cover-contents-url ${urlStateClassName}`} onClick={this._handleOnNewLinkClick}>{el}</a>;
          } else if (el.match(ID_PATTERN)) {
            return <a key={key()} href={el} className={`editor-cover-contents-url ${urlStateClassName}`} onClick={this._handleOnIdLinkClick}>{el}</a>;
          }
          return <span key={key()} >{el}</span>;
        });
        return (<span key={key()} >{lineElements}<br /></span>);
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
            onScroll={this._syncScrollPositionFromCover}
            ref={(c) => (this.coverContents = c)}
          >
            {this.renderCoverContents()}
          </div>
        </div>

        <div className="editor-fg">
          <textarea
            className={`editor-input-contents ${inputStateClassName}`}
            ref={(c) => (this.inputContents = c)}
            onChange={this._changeContents}
            onKeyDown={this._moveCursor}
            onClick={this._moveCursor}
            onScroll={this._syncScrollPositionFromInput}
            onBlur={this._blurHandler}
            value={this.props.value}
          />
        </div>

      </div>
    );
  }
}
