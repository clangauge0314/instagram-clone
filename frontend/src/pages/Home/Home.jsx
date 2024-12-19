import React from 'react'
import { Outlet } from 'react-router-dom'
import Feed from './Feed'
import Right from '../../Components/Sidebar/Right'

const Home = () => {
  return (
    <div className="flex justify-center">
      <div className="w-[630px] ml-[280px] border-x border-gray-200">
        <Feed />
        <Outlet />
      </div>
      <Right />
    </div>
  )
}

export default Home