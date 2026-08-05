import Alpine from 'https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/module.esm.js'
import { loginGate, connect } from './login-module.js'

document.addEventListener('alpine:init', () => {
	Alpine.store('login', { showerror: false, msg: '' })

	Alpine.data('initLogin', () => ({
		connectF: async () => {
			let res = await connect()
			if (res.e) {
				Alpine.store('login', { showerror: true, msg: res.msg })
			}
			else window.location.href = './home.html'
		}
	}))
})

let user = await loginGate(false)
if(user){
	// redirect to main page
	window.location.href = './home.html'
}

