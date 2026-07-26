function connect() {
	return {
		loggedIn: false,
		loading: true,
		err: false,
		msg: "",
		address: "",
		balance: "",

		async init() {
			if (!window.ethereum) return;

			// check if an account is already connected to the site 
			const accounts = await window.ethereum.request({ method: "eth_accounts" });
			if (accounts.length > 0) {
				await this.loadAccount();
			}

			// Keep UI in sync if user switches/disconnects accounts in MetaMask
			window.ethereum.on("accountsChanged", async (accounts) => {
				if (accounts.length === 0) {
					this.loggedIn = false;
					this.loading = false;
					this.address = "";
					this.balance = "";
				} else {
					await this.loadAccount();
				}
			});
		},

		async doConnect() {
			if (!window.ethereum) {
				this.err = true;
				this.msg = "No wallet found. Install MetaMask.";
				return;
			}
			try {
				await window.ethereum.request({ method: "eth_requestAccounts" });
				await this.loadAccount();
			} catch (e) {
				this.err = true;
				this.msg = e.message || "Connection failed.";
			}
		},

		async loadAccount() {
			const provider = new ethers.BrowserProvider(window.ethereum);
			const signer = await provider.getSigner();
			this.address = await signer.getAddress();
			const balance = await provider.getBalance(this.address);
			this.balance = `${ethers.formatEther(balance)} ETH`;
			this.loggedIn = true;
			this.loading = false;
			this.err = false;
		}
	};
}
