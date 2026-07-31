import Alpine from 'https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/module.esm.js'
import { loginGate, returnToLogin } from './login-module.js'
import { shortenAddress } from './util.js'
import { setup, getJob } from './contract-module.js'

let user = {address: '', balance: ''}
let job = {title: '', client: '', freelancer: ''}

const params = new Proxy(new URLSearchParams(window.location.search), {
	get: (searchParams, prop) => searchParams.get(prop),
});

document.addEventListener('alpine:init', () => {
	Alpine.store('jobdata', {})

	Alpine.data('account', () => ({
		formattedAddr: shortenAddress(user.address),

		async init(){
			user = await loginGate(true)
			if (!user) {
				returnToLogin()
				return
			}
			setup(user.provider, user.signer)
			this.balance = user.balance
			this.formattedAddr = shortenAddress(user.address)
			let id = Number(params.id)

			let res = await getJob(id)
			//job.title = res.title
			//job.client = res.client
			//job.freelancer = res.freelancer
			console.log(res)

			Alpine.store('jobdata', {
				title: res.title,
				client: res.client,
				freelancer: res.freelancer,
			})
		}
	}))
})
