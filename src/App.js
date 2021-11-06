import "./App.css";
import { BlockchainStore, StoreProvider } from "./Model/Store";

import Home from "./Components/Home";

const store = new BlockchainStore();

function App() {
  return (
    <StoreProvider store={store}>
      <Home />
    </StoreProvider>
  );
}

export default App;
