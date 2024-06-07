import React from 'react'
import AboutusBanner from '../components/AboutusBanner/AboutusBanner'
import Aboutusskill from '../components/aboutusSkill/Aboutusskill'
import Aboutpage from '../components/About/About'
import ChooseUs from '../components/ChooseUs/ChooseUs'
import Appointment from '../components/Appointment/Appointment'
// import BottomBanner from '../components/BottomBanner/BottmBanner'


function About() {
  return (
    <div>
        <AboutusBanner />
        <Aboutusskill/>
        <Aboutpage/>
        <ChooseUs/>
        <Appointment/>
        {/* <BottomBanner/> */}
    </div>
  )
}

export default About