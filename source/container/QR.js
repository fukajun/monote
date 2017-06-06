import React from 'react';
import QRCode from 'qrcode.react'

export default function QR(props) {
  let { value } = props
  return (
    <div className='help-cover' onClick={props.onClose}>
      <div className='qr-window'>
         <a className='help-close' onClick={props.onClose} ><i className='fa fa-close' /></ a>
         <div className='help-contents' >
           <h2 className='help-title'>QR Code</h2>
           { value.length === 0 ? 'QRコード化したいテキストを選択してください。' : <QRCode value={value} size={256} className='qrcode' /> }
           <div> {value} </div>
         </div>
      </div>
    </div>
  )
}
