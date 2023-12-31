# bankAPI
We are going to build a bank API.
You are a manager of a big bank.
The manager has access to the users of the bank and 
website:
https://bank-api-no1b.onrender.com
can do the following:
- Add users
Can add users to the bank. Each user has ID, cash (default 0), credit (default 0) use: 
- POST https://bank-api-no1b.onrender.com/api/v1/bank and in body{"ID":"","cash":#,"credit":#}
- Depositing
Can deposit cash to a user. (by the user's ID and amount of cash) use:
- PUT https://bank-api-no1b.onrender.com/api/v1/bank/depositCash/?id=&amount=

- Update credit
Can update a user's credit (only positive numbers) Withdraw money Can withdraw money from
the user (can withdraw money until the cash and credit run out) use:
- PUT https://bank-api-no1b.onrender.com/api/v1/bank/updateCredit/?id=&newCredit=



