import React, { useContext } from 'react';
import { SchemeContext } from '../contexts/SchemeContext';

const SchemeButton = () => {
  const { scheme, setScheme } = useContext(SchemeContext);

  return (
    <div className="scheme-wrapper">
      <button
        id="schemeChange"
        onClick={(event) => {
          if (scheme === '' || scheme === 'fade-in-blue') {
            return setScheme('redScheme fade-in-red');
          }
          return setScheme('fade-in-blue');
        }}
      />
    </div>

  );
}

export default SchemeButton;
