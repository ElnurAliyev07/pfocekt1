import React from 'react'
import Info from './Info'
import Employees from './Employees'

const Main: React.FC = () => {
  return (
    <div className='lg:flex flex-col lg:flex-row justify-between lg:items-center'>
      <Info />
      <Employees />
    </div>
  )
}

export default Main
