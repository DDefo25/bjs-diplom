'use strict'

const userForm = new UserForm();

userForm.loginFormCallback = data => {
    let {login, password} = data;
    ApiConnector.login({login, password}, response => {
        let {success, error} = response;
        if (success) {
            location.reload();
        } else {
            userForm.setLoginErrorMessage(error);
        }
    })
}

userForm.registerFormCallback = data => {
    let {login, password} = data;
    ApiConnector.register({login, password}, response => {
        let {success, error} = response;
        if (success) {
            location.reload();
        } else {
            userForm.setRegisterErrorMessage(error);
        }       
    })
}