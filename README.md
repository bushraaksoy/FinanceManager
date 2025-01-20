# FinanceManager

Backend for a finance management application

## Models

-   User
-   Income
-   Expense
-   Goal
-   BankStatement
-   Notification

### User

id, name, username, password, dob, incomes, expenses, goals, email, phone

### Income

id, name, description?, frequency(weekly, daily, monthly, annualy), amount, date?, category?

### Expense

id, name, descryption?, frequency, amount, category?, date?

### SavingsGoal

id, name, description, targetAmount, savedAmount, dueDate?, timePeriod?

### Notification

id, title, message, time, isRead

### BankStatement

id, startDate, endDate, .....

### Income Category

Salary, Allowance, Commision, Investment Income, Interest, Royalty

## Functions

### Authentication

login, register, logout?

### Income

CRUD Income

### Expense

CRUD Expense

### SavingsGoal

CRUD SavingsGoal
