import React from 'react'
import logo from '../../../assets/footer-logo.svg'
import './Footer.css'
class Footer extends React.Component {
  render () {
  return (
    <div className='footer-container'>
        <br /><br /><br />
        <br /><br /><br /><br /><br /><br />
        <img  className="home-footer-logo" src={logo} alt="" />
    </div>
  )
}
}

export default Footer