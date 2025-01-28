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

# User adds a new saving

-   target_amount = 1200
-   created_at = January 1 2025
-   due_date = December 31 2025
-   duration_period = 12 Months (system calculates the duration automatically and rounds up)

### now we need to calculate the amount that needs to be saved each month

```
monthlySaving = target_amount / duration_period
```

-   monthlySaving = 100

#### "You will need to save 100 dollars each month"

## do i need to save data for each month?

new column in the expense table, data
check set for previous month to true, in that case i'll use date, otherwise ill just use created at

### The time when the monthlySavings is calculated:

-   when the saving is first created
-   when the user states they have not saved the intended amount for the month, but a different amount "other"

-   when the user changes the due date

```
remainingAmount = target_amount - saved_amount
remainingMonths = months between current date and due date
monthlySaving = remaining_amount / remaining_months
```

# TODO:

### Add tax functionality

each income needs to have an additional field of tax and taxPercentage
that tax will go to the expense table as well?

### Track monthly activity

add MonthlyExpense and MonthlyActivity models

### Implement functionality for confirming the saved amount for each month.

maybe add a MonthlySavings table?

#### MonthlySavings
