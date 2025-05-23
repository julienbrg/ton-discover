import "@stdlib/deploy";

message Transfer {
    to: Address;
    amount: Int as coins;
}

message Mint {
    to: Address;
    amount: Int as coins;
}

// Non-standard token edited by Claude
contract SimpleToken with Deployable {
    owner: Address;
    name: String;
    symbol: String;
    totalSupply: Int as coins;
    balances: map<Address, Int as coins>;

    init(owner: Address, name: String, symbol: String, totalSupply: Int) {
        self.owner = owner;
        self.name = name;
        self.symbol = symbol;
        self.totalSupply = totalSupply;
        self.balances.set(owner, totalSupply);
    }

    receive(msg: Transfer) {
        let senderAddr: Address = sender();
        let senderBalance: Int = self.balances.get(senderAddr)!!;
        require(senderBalance >= msg.amount, "Insufficient balance");

        self.balances.set(senderAddr, senderBalance - msg.amount);
        let receiverBalance: Int = self.balances.get(msg.to)!!;
        self.balances.set(msg.to, receiverBalance + msg.amount);
    }

    receive(msg: Mint) {
        require(sender() == self.owner, "Only owner can mint");
        self.totalSupply = self.totalSupply + msg.amount;
        let balance: Int = self.balances.get(msg.to)!!;
        self.balances.set(msg.to, balance + msg.amount);
    }

    receive() {
        // Empty receiver for deployment
    }

    get fun name(): String {
        return self.name;
    }

    get fun symbol(): String {
        return self.symbol;
    }

    get fun totalSupply(): Int {
        return self.totalSupply;
    }

    get fun balanceOf(account: Address): Int {
        return self.balances.get(account)!!;
    }

    get fun owner(): Address {
        return self.owner;
    }
}
