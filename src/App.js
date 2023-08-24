import AppHeader from './components/header';
import PoolCard from './components/pool-card';

import './App.css';
import 'antd/dist/antd.css';



function App() {
  
  return (
    <div className="app">
      <AppHeader></AppHeader>
      <PoolCard></PoolCard>
    </div>
  );
}

export default App;
