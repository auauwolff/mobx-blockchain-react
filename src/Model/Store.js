import { makeAutoObservable } from "mobx";
import { createContext, useContext, useEffect } from "react";
import sha256 from "crypto-js/sha256";

// interface IBlock {
//   hash: string;
//   transactions: Array<string>;
// }

class BlockchainStore {
  blocks = [];
  transactions = [];

  constructor() {
    makeAutoObservable(this);
  }

  addTransaction(message) {
    this.transactions.push(message);
  }

  writeBlock() {
    if (this.transactions.length === 0) {
      return;
    }

    const transactions = [...this.transactions];
    this.transactions = [];

    const prevBlock = this.blocks[this.blocks.length - 1] ?? { hash: "" };
    const hash = sha256(
      `${prevBlock.hash}${JSON.stringify(transactions)}`
    ).toString();

    this.blocks.push({
      hash,
      transactions,
    });
  }

  get numberBlocks() {
    return this.blocks.length;
  }

  get valid() {
    return this.blocks.every((block, index) => {
      const prevBlock = this.blocks[index - 1] ?? { hash: "" };
      const hash = sha256(
        `${prevBlock.hash}${JSON.stringify(block.transactions)}`
      ).toString();

      return hash === block.hash;
    });
  }
}

const StoreContext = createContext(new BlockchainStore());

const StoreProvider = ({ store, children }) => {
  useEffect(() => {
    const interval = setInterval(() => {
      store.writeBlock();
    }, 5000);

    return () => clearInterval(interval);
  }, [store]);

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

const useStore = () => {
  return useContext(StoreContext);
};

export { BlockchainStore, StoreProvider, useStore };
