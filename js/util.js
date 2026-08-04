import Alpine from 'https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/module.esm.js'

const AddressType = {
	CLIENT: 'client',
	FREELANCE: 'freelance'
}

const JobState = Object.freeze({
    Open: 'Open',
    Assigned: 'Assigned',
    Submitted: 'Submitted',
    Disputed: 'Disputed',
    Completed: 'Completed',
    Settled: 'Settled',
    Deleted: 'Deleted'
});
const StateEnum = [
    JobState.Open,
    JobState.Assigned,
    JobState.Submitted,
    JobState.Disputed,
    JobState.Completed,
    JobState.Settled,
    JobState.Deleted
]

const StateToClass = {
    'Open': 'job-open',
    'Assigned': 'job-pending',
    'Submitted': 'job-pending',
    'Disputed': 'job-disputed',
    'Completed': 'job-completed',
    'Settled': 'job-settled'
}

function setstore(store, v, property){
	Alpine.store(store)[property] = v
}

function getstore(store, property){
	return (typeof property !== 'undefined') ? Alpine.store(store)[property] : Alpine.store(store)
}

function shortenAddress(address, chars = 4) {
	if (!address) return '';
	return `${address.slice(0, 2 + chars)}...${address.slice(-chars)}`;
}

function getType(address, job){
	if(address == job.client) return AddressType.CLIENT
	if(address == job.freelancer) return AddressType.FREELANCE
	return null
}

function toState(intState) {
    return StateEnum[Number(intState)]
}

function stateToClass(state) {
    return StateToClass[state]
}

export { getstore, setstore, shortenAddress, getType, toState, stateToClass, JobState };
