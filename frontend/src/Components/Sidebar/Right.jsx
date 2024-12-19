import React from 'react'

const Right = () => {
  return (
    <div className="hidden lg:block w-[320px] fixed top-0 right-0 h-screen p-8">
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          <div>
            <p className="font-semibold">Username</p>
            <p className="text-gray-500 text-sm">Name</p>
          </div>
        </div>
        
        <div>
          <p className="text-gray-500 font-semibold mb-4">회원님을 위한 추천</p>
        </div>
      </div>
    </div>
  )
}

export default Right