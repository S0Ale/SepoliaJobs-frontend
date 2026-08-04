import Alpine from 'https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/module.esm.js'
import { loginGate, returnToLogin } from './login-module.js'
import { shortenAddress, toState, stateToClass, JobState } from './util.js'
import { setup, getJob, applyToJob, submitWork, deleteJob } from './contract-module.js'

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

        apply: async () => {
            try {
                await applyToJob(job.id)
            } catch(e) {
                console.log(e)
            }
        },

        submit: async () => {
            try {
                await submitWork(job.id)
            } catch(e) {
                console.log(e)
            }
        },

        del: async () => {
            try {
                await deleteJob(job.id)
            } catch(e) {
                console.log(e)
            }
        },

        isClient: false,
        isAssignable: false,
        isSubmittable: false,

		async init(){
			user = await loginGate(true)
			if (!user) {
				returnToLogin()
				return
			}
			setup(user.provider, user.signer)
			this.balance = user.balance
			this.formattedAddr = shortenAddress(user.address)

			let res = await getJob(BigInt(params.id))
            job = res
            console.log(job)

            this.isClient = user.address == res.client
            this.isAssignable = user.address != res.client && res.state == JobState.Open
            this.isSubmittable = user.address == res.freelancer && res.state == JobState.Assigned

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
