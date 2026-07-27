import Alpine from 'https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/module.esm.js'
import { loginGate, connect } from './login-module.js'
import { getstore, setstore } from './util.js'

document.addEventListener('alpine:init', () => {
	Alpine.store('login', { showError: false, msg: '' })

	Alpine.data('initLogin', () => ({
		connectF: async () => {
			let res = await connect()
			if (res.e) {
				setstore('login', true, 'showerror')
				setstore('login', res.msg, 'msg')
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

