import Alpine from 'https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/module.esm.js'

const AddressType = {
	CLIENT: 'client',
	FREELANCE: 'freelance'
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

export { getstore, setstore, shortenAddress, getType };
