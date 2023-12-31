import fs from 'fs'
import { filePath } from '../utils/dataFilePath.js'

const initializeBankFile=()=>{
    if(!fs.existsSync(filePath)){
        fs.writeFileSync(filePath,JSON.stringify([]),'utf8')
    }

}
const readUsersFromFile = () => {
    try {
        initializeBankFile();
        const fileData = fs.readFileSync(filePath, 'utf-8')
        return JSON.parse(fileData)
    } catch (error) {
        throw new Error("Error reading from bank file")

    }
}

const writeUsersToFile = (users) => {
    try {
        initializeBankFile();
        fs.writeFileSync(filePath, JSON.stringify(users), 'utf-8')
    } catch (error) {
        throw new Error("Error writing to the bank file")
    }
}

export { readUsersFromFile, writeUsersToFile }