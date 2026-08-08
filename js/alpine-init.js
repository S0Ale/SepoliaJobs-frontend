import Alpine from 'https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/module.esm.js'

document.addEventListener('alpine:init', () => {
    Alpine.data('dropdown', () => ({
		open: false,

		toggle() {
			this.open = ! this.open
		}
	}))

	Alpine.data('deadlinePicker', () => ({
		localValue: '',
		unixTimestamp: null,

		init() {
			this.minDateTime = new Date().toISOString().slice(0, 16)
		}
	}))

	Alpine.data('loadstate', () => ({
		loadtrue(){ Alpine.store('loading', true) },
		loadfalse(){ Alpine.store('loading', false) }
	}))
})

Alpine.store('loading', true)
Alpine.start()
