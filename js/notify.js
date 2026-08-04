import Alpine from 'https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/module.esm.js'
import { loginGate, returnToLogin } from './login-module.js'
import { getstore, setstore, shortenAddress, getType } from './util.js'
import { setup, getEvents, EventType } from './contract-module.js'

let user = {address: '', balance: ''}
let events = []
let eventTypes = [EventType.JobCreated, EventType.FreelancerApplied, EventType.DisputeOpened, EventType.DisputeComment, EventType.DisputeClosed]

document.addEventListener('alpine:init', () => {
	Alpine.store('events', [])

	Alpine.data('eventtemplate', () => ({
		formatDate: (timestamp) => { 
			let date = new Date(Number(timestamp)*1000) 
			return `${date.toDateString()} ${date.toLocaleTimeString()}`
		},
	}))

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

			events = await getEvents(eventTypes, (job) => {
				return (job.client == user.address) || (job.freelancer == user.address)
			})
			console.log(events)
			Alpine.store('events', events)
		}
	}))
})
