import { returnToLogin } from './login-module.js'

function init(){
	if (!window.ethereum) return;

	// listen for account change/disconnect events
	window.ethereum.on("accountsChanged", async (accounts) => {
		returnToLogin()
	});
}
init()
