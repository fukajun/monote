import React from 'react';
import _u from 'lodash'

const TYPES = ['input', 'select']
class FormFields extends React.Component {
  change() {
    let values = _u.reduce(this.refs, (h, el)=> {h[el.name] = el.value; return h}, {})
    this.props.onChange(values)
  }
  render() {
    return <div>{this.r(this.props.children)}</div>
  }
  r(children) {
    return React.Children.map(children, (child)=> {
      let cProps = {}
      if(React.isValidElement(child)) {
        if(_u.includes(TYPES, child.type)) {
          cProps.onChange = this.change.bind(this)
          cProps.ref = child.props.name
          cProps.value = this.props.values[child.props.name]
        }
      }
      if(child.props) {
        cProps.children = this.r(child.props.children)
        return React.cloneElement(child, cProps)
      }
      return child
    })
  }
}
export default class Config extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className='help-cover' onClick={this.props.onClose}>
        <div className='help' onClick={(e)=> e.stopPropagation()}>
           <a className='help-close' onClick={this.props.onClose} ><i className='fa fa-close' /></ a>
           <div className='help-contents' >
             <h2 className='help-title'>Settings</h2>
             <FormFields type='update' values={this.props.configs} onChange={this.props.onChange}>
               <div>
               <dt>Default cursor position</dt>
               <dd>
                 <select name='cursorPosition'>
                   <option value='top'>Top</option>
                   <option value='bottom'>Bottom</option>
                 </select>
               </dd>
               <dt>Color of pin</dt>
               <dd>
                 <select name='pinColor'>
                   <option value='red'>Red</option>
                   <option value='blue'>Blue</option>
                 </select>
               </dd>
               </div>
             </FormFields>
           </div>
        </div>
      </div>
    )
  }
}
