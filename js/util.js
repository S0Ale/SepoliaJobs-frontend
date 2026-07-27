import Alpine from 'https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/module.esm.js'

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

export { getstore, setstore, shortenAddress };
