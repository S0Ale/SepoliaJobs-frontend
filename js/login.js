function connect() {
  return {
    open: false,
    err: false,
    msg: "",
    address: "",
    balance: "",

    async doConnect() {
      if (!window.ethereum) {
        this.err = true;
        this.msg = "No wallet found. Install MetaMask.";
        return;
      }
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);

        const signer = await provider.getSigner();
        this.address = await signer.getAddress();
        const balance = await provider.getBalance(this.address);

        this.balance = `${ethers.formatEther(balance)} ETH`;
        this.open = true;
        this.err = false;
      } catch (e) {
        this.err = true;
        this.msg = e.message || "Connection failed.";
      }
    }
  };
}
