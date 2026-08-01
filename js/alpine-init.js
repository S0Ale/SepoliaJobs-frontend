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
			// prevent picking a deadline in the past
			this.minDateTime = new Date().toISOString().slice(0, 16)

			this.$watch('localValue', (val) => {
				if (!val) {
					this.unixTimestamp = null
					return
				}
				// datetime-local gives local time with no timezone info,
					// so `new Date(val)` parses it as local time — correct here
				this.unixTimestamp = Math.floor(new Date(val).getTime() / 1000)
			})
		}
	}))
})

Alpine.start()
