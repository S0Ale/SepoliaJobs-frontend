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
                //TODO: implement the listening of the event of the application to make the button go away
                let tx = await applyToJob(job.id)
                const receipt = await tx.wait()
				console.log(receipt)
                window.location.href = './home.html'
            } catch(e) {
                console.log(e)
            }
        },

        submit: async () => {
            try {
                let tx = await submitWork(job.id)
                const receipt = await tx.wait()
				console.log(receipt)
                window.location.href = './home.html'
            } catch(e) {
                console.log(e)
            }
        },

        del: async () => {
            try {
                let tx = await deleteJob(job.id)
                const receipt = await tx.wait()
				console.log(receipt)
                window.location.href = './home.html'
            } catch(e) {
                console.log(e)
            }
        },

        isDeletable: false,
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

            this.isDeletable = user.address == res.client && res.state == JobState.Open
            this.isAssignable = user.address != res.client && res.state == JobState.Open
            this.isSubmittable = user.address == res.freelancer && res.state == JobState.Assigned
            console.log(user.address)
            console.log(res.client)

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
