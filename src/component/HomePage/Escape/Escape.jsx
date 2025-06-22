import React from 'react'
import overlay from '../../../assets/overlay.svg'
import ghost from '../../../assets/ghost.svg'
import flag from '../../../assets/flags.svg'
import { withTranslation } from "react-i18next";
import './Escape.css'
class Escape extends React.Component {
    render () {
        const {t} = this.props
  return (
    <div className='escape-container'>
        <br /><br /><br /><br />
        <img  className="overlay" src={overlay} alt="" />
        <br /><br /><br /><br />
        <div className="escape-content">
            <div className="escape-left">
                <p className='red-title'>{t('escape.redTitle')}</p>
                <h1 className='left-text'>{t('escape.mainTitle')}</h1>
                <p>{t('escape.description')}</p>
            </div>
            <div className="escape-right">
                <img src={ghost} alt="" />
                <img src={flag} alt="" />
            </div>
        </div>
    </div>
  )
}
}

export default withTranslation()(Escape);