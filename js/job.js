import Alpine from 'https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/module.esm.js'
import { loginGate, returnToLogin } from './login-module.js'
import { shortenAddress, toState, stateToClass, JobState, isAddress, call } from './util.js'
import { setup, getJob, applyToJob, submitWork, deleteJob, approveFreelancer, refund, EventType, getEvents } from './contract-module.js'

let user = {address: '', balance: ''}
let job = {title: '', client: '', freelancer: ''}
let events = []

const eventTypes = [EventType.FreelancerApplied]

const params = new Proxy(new URLSearchParams(window.location.search), {
	get: (searchParams, prop) => searchParams.get(prop),
});

const dateFormatter = new Intl.DateTimeFormat(navigator.language, {
    dateStyle: "medium",
    timeStyle: "short",
});

document.addEventListener('alpine:init', () => {
	Alpine.store('jobdata', {})

    Alpine.data('eventtemplate', () => ({
		formatDate: (timestamp) => {
			let date = new Date(Number(timestamp)*1000)
			return `${date.toDateString()} ${date.toLocaleTimeString()}`
		},
		formatExtraInfo: (extrainfo) => {
			if(!extrainfo) return ''
			let [[_, value]] = Object.entries(extrainfo)
			if(isAddress(value)) value = shortenAddress(value)
			return `${value}`
		},
        accept: async (address, data) => {
            try {
                await call(async () => await approveFreelancer(job.id, address))
                data.updateState()
            } catch(e) {
                console.log(e)
            }
        }
	}))

	Alpine.data('account', () => ({
		formattedAddr: shortenAddress(user.address),

        async apply() {
            try {
                await call(async () => await applyToJob(job.id))
                this.updateState()
            } catch(e) {
                console.log(e)
            }
        },

        async submit() {
            try {
                await call(async () => await submitWork(job.id))
                this.updateState()
            } catch(e) {
                console.log(e)
            }
        },

        async del() {
            try {
                await call(async () => await deleteJob(job.id))
                this.updateState()
            } catch(e) {
                console.log(e)
            }
        },

        async ref() {
            try {
                await call(async () => await refund(job.id))
                this.updateState()
            } catch(e) {
                console.log(e)
            }
        },

        applicationsNotEmpty: false,
        isRefundable: false,
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

            this.updateState()
		},

        async updateState() {
            let res = await getJob(BigInt(params.id))
            job = res

            this.isRefundable = user.address == res.client && BigInt(Math.floor(Date.now() / 1000)) >= res.deadline && res.state != JobState.Deleted
            this.isDeletable = !this.isRefundable && user.address == res.client && res.state == JobState.Open
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

            events = await getEvents(eventTypes, (j) => { return job.id == j.id })

            this.isAssignable =
                user.address != res.client
                && res.state == JobState.Open
                && !events.some((e) => e.extrainfo.freelancer == user.address)
            events = events.filter((e) => e.job.client == user.address)

            const unique = Array.from(new Map(events.map(e => [e.extrainfo.freelancer, e])).values())
            Alpine.store('events', unique)

            this.applicationsNotEmpty = user.address == job.client && job.state == JobState.Open && events.length > 0
        }
	}))
})
