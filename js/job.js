import Alpine from 'https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/module.esm.js'
import { loginGate, returnToLogin } from './login-module.js'
import { shortenAddress, toState, stateToClass } from './util.js'
import { setup, getJob } from './contract-module.js'

let user = {address: '', balance: ''}
let job = {title: '', client: '', freelancer: ''}

const params = new Proxy(new URLSearchParams(window.location.search), {
	get: (searchParams, prop) => searchParams.get(prop),
});

const dateFormatter = new Intl.DateTimeFormat(navigator.language, {
    dateStyle: "medium",
    timeStyle: "short",
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

			Alpine.store('jobdata', {
				title: res.title,
				client: res.client,
				freelancer: res.freelancer,
				desc: res.desc,
                state: res.state,
                payment: ethers.formatUnits(res.payment, "ether"),
                deadline: dateFormatter.format(new Date(Number(res.deadline) * 1000)),
                stateClass: stateToClass(res.state)
			})
		}
	}))
})
