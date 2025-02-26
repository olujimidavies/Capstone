import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import axios from 'axios';

function Index() {
  const [users, setUsers] = useState([]);

  // Fetch data from backend API
  useEffect(() => {
    axios.get('mysql://root:agcbXbJFrpSeDmIpRYBaEGaqLbKUPCCw@shinkansen.proxy.rlwy.net:17515/railway')  // Replace with your backend URL
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <React.StrictMode>
      <App users={users} />  {/* Pass users data to App component */}
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Index />);
