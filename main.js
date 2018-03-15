const SHA256 = require('crypto-js/sha256');

class Transaction{
    constructor(fromAddress, toAddress, ammount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.ammount = ammount;
    }
}

class Block{
    constructor(timestamp, transactions, previousHash = ''){
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }
        //console.log(Date.now().toLocaleString() +" Block mined: " + this.hash);
    }

}

class Blockchain{

    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.pendidngTransactions = [];
        this.miningReward = 100;
        this.difficulty = 4;
    }

    createGenesisBlock(){
        return new Block(Date.now().toLocaleString(), "Genesis Block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length -1];
    }

    minePendidngTransactions(miningRewardAddress){
        let block = new Block(Date.now().toLocaleString(), this.pendidngTransactions)
        block.mineBlock(this.difficulty);
        console.log(Date.now().toLocaleString() + " Block mined: " + block.hash);
        this.chain.push(block);
        this.pendidngTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    createTransaction(transaction){
        this.pendidngTransactions.push(transaction);
    }

    getBalanceOfAdrres(address){
        let balance = 0;
        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance -= trans.ammount;
                }
                if(trans.toAddress === address){
                    balance += trans.ammount;
                }
            }
        }
        return balance;
    }

    isChainValid(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            if(currentBlock.hash != currentBlock.calculateHash()){
                return false;
            }
            if(currentBlock.previousHash != previousBlock.hash){
                return false;
            }
        }
        return true;
    }

}


let helfsteinCoin = new Blockchain();

helfsteinCoin.createTransaction(new Transaction('address1', 'address2', 100));
helfsteinCoin.createTransaction(new Transaction('address1', 'address2', 50));

console.log("\n Starting the miner...");
helfsteinCoin.minePendidngTransactions("helfstein-address");

console.log("\n Balance of helfstein-address is: " + helfsteinCoin.getBalanceOfAdrres("helfstein-address"));

console.log("\n Starting the miner again...");
helfsteinCoin.minePendidngTransactions("helfstein-address");

console.log("\n Balance of helfstein-address is: " + helfsteinCoin.getBalanceOfAdrres("helfstein-address"));