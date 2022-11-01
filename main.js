const SHA256 = require('crypto-js/sha256');

class Block{
    // data: Bao gồm các dữ liệu bất kỳ 
    // previousMash : chuỗi băm trước của 1 block
    constructor(index, data, previousMash = ''){
        this.index = index;
        this.timestamp = new Date();
        this.data = data;
        this.previousMash = previousMash;
        this.hash = this.caculateHash();
        this.nonce = 0;
    }

    // tính toán xử lý hàm băm
    caculateHash(){
        return SHA256(this.index + this.previousMash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    // Độ khó của mã  khối 
    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) != Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.caculateHash();
        }

        console.log("Block mined: " + this.hash);
    }
    
}

class BlockChain{
    constructor(){
        this.chain  = [this.createGenesisBlock()];
        this.difficulty = 4;
    }

    // Hàm Tạo block 
    createGenesisBlock(){
        return new Block(0, {value: 170000}, "");
    }

    // Hàm lấy block cuối cùng
    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    // Hàm thêm block
    addBlock(newBlock){
        newBlock.previousMash =  this.getLatestBlock().hash;
        // newBlock.hash = newBlock.caculateHash(); 
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    // Hàm kiểm tra hợp lệ của chuỗi block
    isChainValid(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            // Kiểm tra xem hàm băm của block trùng nhau hau không
            if(currentBlock.hash !== currentBlock.caculateHash()){
                return false;
            }

            // Kiểm tra mã hàm băm của khối trước đó co chính xác với khối hiện tại hay không
            if(currentBlock.previousMash !== previousBlock.hash){
                return false;
            }
        }
        return true;
    }

}

let savjeeCoin = new BlockChain();
console.log("Mining block 1: ....");
savjeeCoin.addBlock(new Block(1, {value: 1460000}));
console.log("Mining block 2: ....");
savjeeCoin.addBlock(new Block(2, {value: 1130000}));


// console.log("Is blockchain Valid ? " + savjeeCoin.isChainValid());
// savjeeCoin.chain[1].data = {value: 14000};
// savjeeCoin.chain[1].hash = savjeeCoin.chain[1].caculateHash();
// console.log("Is blockchain Valid ? " + savjeeCoin.isChainValid());
// console.log(JSON.stringify(savjeeCoin, null, 4));
