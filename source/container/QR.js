import React from 'react';
import QRCode from 'qrcode.react';

export default function QR(props) {
  const { value } = props;
  return (
    <div className="window-wrapper" onClick={props.onClose}>
      <div className="window qr">
        <a className="window-close" onClick={props.onClose} ><i className="fa fa-close" /></a>
        <div className="window-contents" >
          <h2 className="window-title">QR Code</h2>
          { value.length === 0 ? 'QRコード化したいテキストを選択してください。' : <QRCode value={value} size={256} className="qrcode" /> }
          <div> {value} </div>
        </div>
      </div>
    </div>
  );
}
