'use strict'

const userForm = new UserForm();

userForm.loginFormCallback = request => {
    ApiConnector.login(request, response => {
        let { success, error } = response;
        if (success) {
            location.reload();
        } else {
            userForm.setLoginErrorMessage(error);
        }
    })
}

userForm.registerFormCallback = request => {
    ApiConnector.register(request, response => {
        let { success, error } = response;
        if (success) {
            location.reload();
        } else {
            userForm.setRegisterErrorMessage(error);
        }       
    })
}