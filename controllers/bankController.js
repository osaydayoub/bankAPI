import STATUS_CODE from "../constants/statusCode.js";
import { readUsersFromFile, writeUsersToFile } from "../models/bankModel.js";
import { filePath } from "../utils/dataFilePath.js";

//@des    get all users
//@route  GET /api/v1/bank
export const getAllUsers = async (req, res, next) => {
    try {
        const users = readUsersFromFile();
        res.send(users);
    } catch (error) {
        next(error)
    }
}

//@des    filter the users ,return users with amount of cash more than cashMoreThan
//@route  GET /api/v1/bank/filter/?cashMoreThan=#
export const FilteredUsers = async (req, res, next) => {
    // const cashMoreThan = Number(req.query.cashMoreThan);
    res.send('filteredUsers');
    // try {
    //     if (cashMoreThan === undefined) {
    //         res.status(STATUS_CODE.BAD_REQUEST)
    //         throw new Error("query parameter (cashMoreThan) is required")
    //     }
    //     const users = readUsersFromFile();
    //     const filteredUsers = users.filter(user => user.cash >= cashMoreThan);
    //     console.log(filteredUsers)
    //     res.send('filteredUsers');
    // } catch (error) {
    //     next(error)
    // }
}

//@des    get a single user
//@route  GET /api/v1/bank/:id
export const getUserById = async (req, res, next) => {
    // res.send("hiii getUserById")
    try {
        const users = readUsersFromFile();
        const user = users.find(u => u.ID === req.params.id)
        if (!user) {
            res.status(STATUS_CODE.NOT_FOUND)
            throw new Error("User was not found")
        }
        res.send(user)
    } catch (error) {
        next(error)
    }

}

//@des    creat a user
//@route  POST /api/v1/bank
export const creatUser = async (req, res, next) => {
    try {
        const { ID, cash, credit } = req.body
        if (!ID) {
            res.status(STATUS_CODE.BAD_REQUEST)
            throw new Error('ID is missing!')
        }
        const users = readUsersFromFile();
        if (users.some(u => u.ID === ID)) {
            res.status(STATUS_CODE.CONFLICT)
            throw new Error('A user with the same ID already exists')
        }
        const newUser = {
            ID,
            cash: cash === undefined ? 0 : cash,
            credit: credit === undefined ? 0 : credit
        }
        users.push(newUser);
        writeUsersToFile(users);
        res.status(STATUS_CODE.CREATED).send(newUser)

    } catch (error) {
        res.status(STATUS_CODE.BAD_REQUEST)
        next(error)
    }
}

//@des    deposit cash to a user. (by the user's ID and amount of cash)
//@route  Put /api/v1/bank/depositCash/?id=&amount=  query parameters(id & amount)
export const depositCash = async (req, res, next) => {
    const userId = req.query.id;
    const amount = Number(req.query.amount);
    try {
        const users = readUsersFromFile();
        const index = users.findIndex(u => u.ID === userId)
        if (index === -1) {
            res.status(STATUS_CODE.NOT_FOUND)
            throw new Error("User was not found!")
        }
        if (amount === undefined) {
            res.status(STATUS_CODE.BAD_REQUEST)
            throw new Error("add an amount as a query parameter")
        }
        let newCach = users[index].cash + amount
        const updatedUser = { ...users[index], cash: newCach }
        users[index] = updatedUser;
        writeUsersToFile(users)
        res.send(updatedUser)
    } catch (error) {
        next(error)
    }
}

//@des    withdraw money from a user. (by the user's ID and amount of cash)
//@route  Put /api/v1/bank/withdrawMoney/?id=&amount=  query parameters(id & amount)
export const withdrawMoney = async (req, res, next) => {
    const userId = req.query.id;
    const amount = Number(req.query.amount);
    try {
        if (userId === undefined || amount === undefined) {
            res.status(STATUS_CODE.BAD_REQUEST)
            throw new Error("query parameters (id, amount) are required")
        }
        const users = readUsersFromFile();
        const index = users.findIndex(u => u.ID === userId)
        if (index === -1) {
            res.status(STATUS_CODE.NOT_FOUND)
            throw new Error("User was not found!")
        }

        let possibleWithdraw = users[index].cash + users[index].credit
        if (possibleWithdraw - amount < 0) {
            res.status(STATUS_CODE.BAD_REQUEST)
            throw new Error("The total amount of withdraw can't exceed the sum of cash and credit")
        }

        let sum = users[index].cash - amount;
        let newCach = (sum >= 0) ? sum : 0;
        let newCredit = (sum >= 0) ? users[index].credit : users[index].credit + sum;
        const updatedUser = { ...users[index], cash: newCach, credit: newCredit }
        users[index] = updatedUser;
        writeUsersToFile(users)
        res.send(updatedUser)
    } catch (error) {
        next(error)
    }
}
// transferMoney
//@des    withdraw money from a user. (by the user's ID and amount of cash)
//@route  Put /api/v1/bank/transferMoney?idFrom=&idTo=&amount=  query parameters(idFrom & idTo & amount)
export const transferMoney = async (req, res, next) => {
    const idFrom = req.query.idFrom;
    const idTo = req.query.idTo;
    const amount = Number(req.query.amount);
    try {
        if (idFrom === undefined || idTo === undefined || amount === undefined) {
            res.status(STATUS_CODE.BAD_REQUEST)
            throw new Error("query parameters (idFrom, idTo, amount) are required")
        }
        const users = readUsersFromFile();
        const indexFrom = users.findIndex(u => u.ID === idFrom)
        if (indexFrom === -1) {
            res.status(STATUS_CODE.NOT_FOUND)
            throw new Error(`User idFrom=${idFrom} was not found!`)
        }

        const indexTo = users.findIndex(u => u.ID === idTo)
        if (indexTo === -1) {
            res.status(STATUS_CODE.NOT_FOUND)
            throw new Error(`User idTo=${idTo} was not found!`)
        }

        let possibleWithdraw = users[indexFrom].cash + users[indexFrom].credit
        if (possibleWithdraw - amount < 0) {
            res.status(STATUS_CODE.BAD_REQUEST)
            throw new Error("The total amount of transfer money can't exceed the sum of cash and credit")
        }

        let sum = users[indexFrom].cash - amount;
        let newCach = (sum >= 0) ? sum : 0;
        let newCredit = (sum >= 0) ? users[indexFrom].credit : users[indexFrom].credit + sum;
        const updatedUserFrom = { ...users[indexFrom], cash: newCach, credit: newCredit }
        users[indexFrom] = updatedUserFrom;


        let newCreditTo = users[indexTo].credit + amount;
        const updatedUserTo = { ...users[indexTo], credit: newCreditTo }
        users[indexTo] = updatedUserTo;

        writeUsersToFile(users)
        res.send([updatedUserFrom, updatedUserTo])
    } catch (error) {
        next(error)
    }
}





//@des    update a user's credit (only positive numbers)
//@route  Put /api/v1/bank/updateCredit/?id=&newCredit=  query parameter(id & newCredit)
export const updateUserCredit = async (req, res, next) => {
    const userId = req.query.id;
    const newCredit = Number(req.query.newCredit);
    try {
        const users = readUsersFromFile();
        const index = users.findIndex(u => u.ID === userId)
        if (index === -1) {
            res.status(STATUS_CODE.NOT_FOUND)
            throw new Error("User was not found!")
        }
        if (newCredit === undefined) {
            res.status(STATUS_CODE.BAD_REQUEST)
            throw new Error("add new credit value as a query newCredit!")
        }
        if (newCredit <= 0) {
            res.status(STATUS_CODE.BAD_REQUEST)
            throw new Error("credit value can only be a positive number")
        }
        const updatedUser = { ...users[index], credit: newCredit }
        users[index] = updatedUser;
        writeUsersToFile(users)
        res.send(updatedUser)
    } catch (error) {
        next(error)
    }
}

//@des    delete a  user
//@route  DELETE /api/v1/bank/:id
export const deleteUser = async (req, res, next) => {
    try {
        const users = readUsersFromFile();
        const newUsersList = users.filter(user => user.ID !== req.params.id)
        if (newUsersList.length === users.length) {
            res.status(STATUS_CODE.NOT_FOUND)
            throw new Error('user was not found')
        }
        writeUsersToFile(newUsersList)
        res.status(STATUS_CODE.OK).send(`User with id of ${req.params.id} was deleted`)
    } catch (error) {
        next(error)
    }

}


