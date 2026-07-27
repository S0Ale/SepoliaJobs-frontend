import { loginGate, returnToLogin } from './login-module.js'
import { getstore, setstore } from './util.js'

let user = await loginGate(false)
if(!user){
	returnToLogin()
} 
