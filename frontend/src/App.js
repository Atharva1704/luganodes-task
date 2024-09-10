import './App.css';
import CustomizedTables from "./components/Table.jsx"

function App() {

  return (
    <div className="App">
      <div className='title'>
        <h1 className='titleName'>
          Ethereum Deposit Tracker
        </h1>
      </div>
      <div className='tables'>
        <CustomizedTables />
      </div>
    </div>
  );
}

export default App;
