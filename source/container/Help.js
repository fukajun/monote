import React from 'react';

export default function Help(props) {
  return (
    <div className='help-cover' onClick={props.onClose}>
      <div className='help'>
         <a className='help-close' onClick={props.onClose} ><i className='fa fa-close' /></ a>
         <div className='help-contents' >
           <h2 className='help-title'>Shortcut key</h2>
           <dl>
             <dt>Ctrl + Shift + n </dt> <dd>: Toggle window</dd>
             <dt>Command + f </dt>      <dd>: Focus keyword box</dd>
             <dt>Command + i </dt>      <dd>: Toggle tree</dd>
             <dt>Command + Enter </dt>  <dd>: Back to List page</dd>
             <dt>Command + n </dt>      <dd>: Create new note</dd>
             <dt>Command + 0 〜 9 </dt> <dd>: Open each note</dd>
             <dt>Option / Alt</dt> <dd>: Enable url link on Editor</dd>
           </dl>
         </div>
      </div>
    </div>
  )
}
