import Alpine from 'https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/module.esm.js'

document.addEventListener('alpine:init', () => {
	Alpine.data('dropdown', () => ({
		open: false,

		toggle() {
			this.open = ! this.open
		}
	}))
})

Alpine.start()
