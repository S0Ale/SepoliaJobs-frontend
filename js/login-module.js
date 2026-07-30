async function connect() {
	if (!window.ethereum) {
		let msg = "No wallet found. Install MetaMask.";
		return {e: true, msg: msg}
	}

	try {
		await window.ethereum.request({ method: "eth_requestAccounts" });
		let account = await getData();
		return account
	} catch (e) {
		let msg = e.message || "Connection failed.";
		return {e: true, msg: msg}
	}
}

async function getData(){
	//const provider = new ethers.BrowserProvider(window.ethereum);
	let url = 'http://127.0.0.1:8545/'
	const provider = new ethers.JsonRpcProvider(url)
	const signer = await provider.getSigner();
	let address = await signer.getAddress();
	let balance = await provider.getBalance(address);
	balance = `${ethers.formatEther(balance)} ETH`;

	return { provider: provider, signer: signer, address: address, balance: balance }
}

async function loginGate(canGetData=true){
	if (!window.ethereum) {
		window.location.href = "/";
		return false
	}

	try{
		let list = await window.ethereum.request({ method: "eth_accounts" });
		if(list.length > 0) return canGetData ? getData() : true
		return false
	} catch(e){
		return false
	}
}

function returnToLogin(){
	const BASE_PATH = '/';
	window.location.href = BASE_PATH
}

export { loginGate, connect, returnToLogin };
