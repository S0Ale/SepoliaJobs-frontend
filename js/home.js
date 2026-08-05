import Alpine from 'https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/module.esm.js'
import { loginGate, returnToLogin } from './login-module.js'
import { shortenAddress, getType } from './util.js'
import { setup, getJobs, createJob } from './contract-module.js'

let user = {address: '', balance: ''}
let jobs = []
let userJobs = []

async function listJobs(alljobs=true, userjobs=false){
	if(alljobs) jobs = await getJobs(user.provider, 10)
	if(userjobs){
		userJobs = jobs.filter((job) => getType(user.address, job) !== null)
	}
	jobs = jobs.filter((job) => !userJobs.some(userjob => userjob.id === job.id))

	if(alljobs) Alpine.store('jobs', jobs)
	if(userjobs) Alpine.store('userjobs', userJobs)
}

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

			await listJobs(true, true)
		}
	}))

	Alpine.data('newjobmodal', () => ({
		openmodal: false,
		modalerror: false,
		errormsg: '',

		async submitJob(){
			let form = document.querySelector("#create-job")
			let data = new FormData(form)
			let date = data.get('deadline')
			data.delete('deadline')
			data.append('deadline', Math.floor(new Date(date).getTime() / 1000))
			
			try{
				let tx = await createJob(user.address, data)
				const receipt = await tx.wait()
				console.log(receipt)
				this.openmodal = false
				await listJobs(true, true)
			}catch(e){
				console.error(e)
				this.modalerror = true
				this.errormsg = e.reason ||
					e.shortMessage ||                    // short summary
					e.info?.error?.message ||            // provider errors
					e.data?.message || 'Transaction failed'
			}
		}
	}))
})
