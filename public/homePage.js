'use strict'

const logoutButton = new LogoutButton();
const ratesBoard = new RatesBoard();
const moneyManager = new MoneyManager();
const favoritesWidget = new FavoritesWidget();

logoutButton.action = () => {
    ApiConnector.logout(result => {
        if (result.success) {
            location.reload();
        }
    })
}

ApiConnector.current(response => {
    let { success, data } = response;
    if (success) {
        ProfileWidget.showProfile(data);
    }
})

function updateRatesBoard() {
    ApiConnector.getStocks(response => {
        let { success, data } = response;
        if(success) {
            ratesBoard.clearTable();
            ratesBoard.fillTable(data);
        }
    })
}

updateRatesBoard();
setInterval(updateRatesBoard, 60000);

moneyManager.addMoneyCallback = request => {
    let { amount, currency } = request;
    ApiConnector.addMoney(request, response => {
        let { success, data, error } = response;
        if (success) {
            ProfileWidget.showProfile(data);
            moneyManager.setMessage(success, `Счет пополнен на ${amount} ${currency}`);
        } else {
            moneyManager.setMessage(success, error);
        }
    });
}

moneyManager.conversionMoneyCallback = request => {
    let { fromCurrency, targetCurrency, fromAmount } = request;
    ApiConnector.convertMoney(request, response => {
        let { success, data, error } = response;
        if (success) {
            ProfileWidget.showProfile(data);
            moneyManager.setMessage(success, `Конвертировано ${fromAmount} ${fromCurrency} в ${targetCurrency}`);
        } else {
            moneyManager.setMessage(success, error);
        }
    })
}

moneyManager.sendMoneyCallback = request => {
    let { amount, currency } = request;
    ApiConnector.transferMoney(request, response => {
        let { success, data, error } = response;
        if (success) {
            ProfileWidget.showProfile(data);
            moneyManager.setMessage(success, `Переведено ${amount} ${currency}`);
        } else {
            moneyManager.setMessage(success, error);
        }
    })
}

ApiConnector.getFavorites(response => {
    let { success, data } = response;
    if (success) {
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(data);
        moneyManager.updateUsersList(data);
    }
});

favoritesWidget.addUserCallback = request => {
    let { name } = request;
    ApiConnector.addUserToFavorites(request, response => {
        let { success, data, error } = response;
        if (success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(data);
            moneyManager.updateUsersList(data);
            favoritesWidget.setMessage(success, `${name} добавлен(а) в адресную книгу`);
        } else {
            favoritesWidget.setMessage(success, error);            
        }
    })
}

favoritesWidget.removeUserCallback = request => {
    ApiConnector.removeUserFromFavorites(request, response => {
        let { success, data, error } = response;
        if (success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(data);
            moneyManager.updateUsersList(data);
            favoritesWidget.setMessage(success, `Пользователь удален из адресной книги`);
        } else {
            favoritesWidget.setMessage(success, error);            
        }
    })
}