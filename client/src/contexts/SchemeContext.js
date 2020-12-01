import React, { createContext, useState } from 'react';

export const SchemeContext = createContext();

const SchemeContextProvider = (props) => {
  // Color Scheme
  const [scheme, setScheme] = useState('');
  return (
    <SchemeContext.Provider value={{ scheme, setScheme }}>
      {props.children}
    </SchemeContext.Provider>
  )
}


export default SchemeContextProvider;