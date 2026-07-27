import Alpine from 'https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/module.esm.js'
import { loginGate, returnToLogin } from './login-module.js'
import { getstore, setstore, shortenAddress } from './util.js'

let user = {provide: null, signere: null, address: '', balance: ''}

document.addEventListener('alpine:init', () => {
	Alpine.data('account', () => ({
		balance: user.balance,
		formattedAddr: shortenAddress(user.address),

		async init(){
			let user = await loginGate(true) // note: true, so you actually get the full object
			if (!user) {
				returnToLogin()
				return
			}
			this.balance = user.balance
			this.formattedAddr = shortenAddress(user.address)

			this.provider = user.provider
			this.signer = user.signer
		}
	}))
})
