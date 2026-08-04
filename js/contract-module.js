import contractJson from "./FreelancePlatform.json" with { type: "json" }
import config from "../res/contract-address.json" with { type: "json" }
import { toState } from "./util.js"

const abi = contractJson.abi
let contract = null
let signedContract = null
let signer = null
const MAX_JOBS = 100

const EventType = {
	JobCreated: 'JobCreated',
	FreelancerApplied: 'FreelancerApplied',
	DisputeOpened: 'DisputeOpened',
	DisputeComment: 'DisputeComment',
	DisputeClosed: 'DisputeClosed'
}

const eHandlers = {}
eHandlers[EventType.JobCreated] = async (event, type) => {
	let obj = {type: type, timestamp: event.args.timestamp}
	obj.job = event.args.job.toObject()
	return obj
}
eHandlers[EventType.FreelancerApplied] = async (event, type) => {
	let id = event.args.jobID
	let obj = {type: type, timestamp: event.args.timestamp, freelancer: event.args.freelancer}
	obj.job = await getJob(id)
	obj.job.id = Number(id)
	return obj
}
eHandlers[EventType.DisputeOpened] = async (event, type) => {
	let id = event.args.jobID
	let obj = {type: type, timestamp: event.args.timestamp, opener: event.args.opener}
	obj.job = await getJob(id)
	obj.job.id = Number(id)
	return obj
}
eHandlers[EventType.DisputeClosed] = async (event, type) => {
	let id = event.args.jobID
	let obj = {type: type, timestamp: event.args.timestamp, isclient: event.args.isClient}
	obj.job = await getJob(id)
	obj.job.id = Number(id)
	return obj
}
eHandlers[EventType.DisputeComment] = async (event, type) => {
	let id = event.args.jobID
	let obj = {type: type, timestamp: event.args.timestamp, author: event.args.author, comment: event.args.text}
	obj.job = await getJob(id)
	obj.job.id = Number(id)
	return obj
}

function setup(provider, signer){
	contract = new ethers.Contract(config.address, abi, provider)
	signedContract = new ethers.Contract(config.address, abi, signer)
}

async function createJob(address, formData){
	const paymentWei = ethers.parseEther(formData.get('payment'))
	return await signedContract.createJob(formData.get('title'), formData.get('desc'), Number(formData.get('deadline')), {
		value: paymentWei
	})
}

async function getJob(id){
	let j = (await contract.jobs(id)).toObject()
    j.state = toState(j.state)
    j.id = id
    return j
}

// lasts: n more recent jobs, negative for the entire job list
async function getJobs(provider, lasts){
	let limit = lasts < 0 ? MAX_JOBS : lasts
	const filter = contract.filters.JobCreated()
	const events = await contract.queryFilter(filter, 0, "latest")

	const res = []
	for(const e of events.slice(-limit)){
		let j = e.args.job.toObject()
		j.id = e.args.jobID
        j.state = toState(j.state)
		res.push(j)
	}

	return res
}

// get events and filter them using a list
// list of objects: {job, type, timestamp}
async function getEvents(whitelist, predicate){
	let events = new Array()
	for(let type of whitelist){
		const filter = contract.filters[type]()
		const list = await contract.queryFilter(filter, 0, "latest")
		let l = []
		for(let e of list){
			let obj = await eHandlers[type](e, type)
			if(predicate(obj.job)) l.push(obj)
		}
		events = events.concat(l)
	}

	return events
}

async function applyToJob(jobID) {
    await signedContract.applyToJob(jobID);
}

// TODO: find a way to implement sending file (or file ID), maybe with IPFS?
async function submitWork(jobID) {
    await signedContract.submitWork(jobID)
}

async function deleteJob(jobID) {
    await signedContract.deleteJob(jobID)
}

export { setup, getJob, getJobs, createJob, applyToJob, submitWork, deleteJob, getEvents, EventType }
