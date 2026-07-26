import { loginGate, connect } from './login-module.js'

async function init() {
	if (!window.ethereum) return;

	// listen for account change/disconnect events
	window.ethereum.on("accountsChanged", async (accounts) => {
		// loginGate to check again
			// redirect
	});
}()
