
import './App.css';
import ChatScreen from './components/ChatArea';
import SearchBar from './components/SearchBar';
import { ChatProvider } from './components/ChatContext'

function App() {
  return (
    <ChatProvider>
      <div className="App">
        <ChatScreen />
        <SearchBar />
      </div>
    </ChatProvider>
  );
}

export default App;
