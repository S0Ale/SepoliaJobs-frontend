import Alpine from 'https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/module.esm.js'
import { loginGate, returnToLogin } from './login-module.js'
import { getstore, setstore, shortenAddress, getType } from './util.js'
import { setup, getJobs } from './contract-module.js'

let user = {address: '', balance: ''}
let jobs = []

document.addEventListener('alpine:init', () => {
	Alpine.store('jobs', [])

	Alpine.data('jobtemplate', () => ({
		formatDate: (timestamp) => { return (new Date(Number(timestamp)*1000)).toDateString() },
		getJobType: (job) => { return getType(user.address, job) },
		redirectJob: (job) => { window.location.href = `/job.html?id=${job.id}`;return; },
	}))

	Alpine.data('account', () => ({
		balance: user.balance,
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

			jobs = await getJobs(user.provider, 10)
			let userJobs = jobs.filter((job) => getType(user.address, job) !== null)
			jobs = jobs.filter((job) => !userJobs.some(job => job.id === jobs[0].id))
			Alpine.store('jobs', jobs)
			Alpine.store('userjobs', userJobs)
		}
	}))

	Alpine.data('newjobmodal', () => ({
		openmodal: false,

		submitJob: () => {
		}
	}))
})
