import React from 'react';
import CompanyProperties from './components/CompanyProperties';
import Admin from './pages/Admin';

const App = () => {
  return (
    <div className="App">
      <CompanyProperties companyId={9}/>
      <Admin/>
    </div>
  );
};

export default App;
