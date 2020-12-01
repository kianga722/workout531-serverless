import React from 'react'

const Loading = () => {
  return (
    <div id='loading'>
      <div className="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div> </div>
      </div>
      <div className='load-message'>
        Loading...
      </div>
    </div>
  )
}

export default Loading