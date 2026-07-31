import contractJson from "./FreelancePlatform.json" with { type: "json" }
import config from "../res/contract-address.json" with { type: "json" }

const abi = contractJson.abi
let contract = null
let signer = null
const MAX_JOBS = 100

function setup(provider, signer){
	contract = new ethers.Contract(config.address, abi, provider)
	signer = signer
}

async function getJob(id){
	return await contract.jobs(id).toObject()
}

// lasts: n more recent jobs, negative for the entire job list
async function getJobs(provider, lasts){
	let limit = lasts < 0 ? MAX_JOBS : lasts
	const filter = contract.filters.JobCreated()
	const events = await contract.queryFilter(filter, 0, "latest")

	const res = []
	for(const e of events.slice(-limit)){
		let j = e.args.job.toObject()
		j.id = Number(e.args.jobID)
		res.push(j)
	}

	return res
}

export { setup, getJob, getJobs }
