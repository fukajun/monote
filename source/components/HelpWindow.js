import React from 'react';

export default function Help(props) {
  return (
    <div className="window-wrapper" onClick={props.onClose}>
      <div className="window">
        <a className="window-close" onClick={props.onClose} ><i className="fa fa-close" /></a>
        <div className="window-contents" >
          <h2 className="window-title">Shortcut key</h2>
          <dl>
            <dt>Ctrl + Shift + n </dt><dd>: Toggle window</dd>
            <dt>Command + f </dt><dd>: Focus keyword box</dd>
            <dt>Command + t </dt><dd>: Toggle tree</dd>
            <dt>Command + Enter </dt><dd>: Back to List page</dd>
            <dt>Command + n </dt><dd>: Create new note</dd>
            <dt>Command + 0 〜 9 </dt><dd>: Open each note</dd>
            <dt>Option / Alt</dt> <dd>: Enable url link on Editor</dd>
          </dl>
        </div>
      </div>
    </div>
  );
}
