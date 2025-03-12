# FinanceManager

Backend for a finance management application

## Models

-   User
-   Income
-   Expense
-   Savings
-   Goal
-   BankStatement
-   Notification

## Add new saving

-   target_amount = 1200
-   created_at = January 1 2025
-   due_date = December 31 2025
-   duration_period = 12 Months (system calculates the duration automatically and rounds up)

### Save the date for each expense to know which month it belongs to

```
monthlySaving = target_amount / duration_period
```

-   monthlySaving = 100

#### "You will need to save 100 dollars each month"

## do i need to save data for each month?

nope, just a new column in the expense table, data
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

## Add tax functionality

each income needs to have an additional field of tax and taxPercentage
that tax will go to the expense table as well?

## Track monthly activity

#### MonthlySavings

Implement functionality for confirming the saved amount for each month.

## You can check the fixed expenses / payments for the current month

the app shows the full income of the user in one section

when a user checks a particular payment, the income for the current month is reduced

what table do we add?

## FixedExpensesTracker

FixedExpensesTracker model?

expenseId
paid Boolean
date

-   netflix
-   10 dollars
-   paid?
-   date

## Endpoints

```
/totalExpenses
```

```
/totalIncomes
```

```
/totalBalance
```

```
/analytics
```

```
/profile
```

## Add profile pic

I will have a bunch of ready made avatars for the user to choose from

## Expense table

id title description amount type category frequency date

1 grocery 100 fixed weekly 7-jul
1 grocery 100 fixed weekly 14-jul

how should reminder mechanisms work?

## Transaction History

### monthly, weekly generated checklist for the user based on their added expenses.

```
/weekly-expenses
```

```
/monthly-expenses
```

```
/yearly-expenses
```

transaction history does the above calls and for the respective endpoint, if adequate the time has passed, it will refresh them

## SPENDING HISTORY

here we add the expense that we just did and how much we spent on it and current date

```
/currentMonthSpendings
```

this will load all the expenses we have done for this month

# Analytics

/incomeOverview

```
"incomeOverview": {
    "totalIncome": 5000,
    "incomeByCategory": {
      "salary": 4000,
      "freelance": 1000,
      "investment": 0
    }
}
```

/incomeTrend

```
"incomeTrend": [
      { "month": "2023-01", "amount": 4500 },
      { "month": "2023-02", "amount": 4800 },
      { "month": "2023-03", "amount": 5000 }
]
```

/expenseOverview

```
"expenseOverview": {
    "totalExpenses": 3000,
    "expensesByCategory": {
      "housing": 1000,
      "groceries": 500,
      "entertainment": 300,
      "transport": 200
    },
}
```

/expenseTrend

```
"expenseTrend": [
      { "month": "2023-01", "amount": 2800 },
      { "month": "2023-02", "amount": 3200 },
      { "month": "2023-03", "amount": 3000 }
]
```

/savingsTrend

```
"savingsTrend": [
      { "month": "2023-01", "amount": 1500 },
      { "month": "2023-02", "amount": 1800 },
      { "month": "2023-03", "amount": 2000 }
    ]
```

/savingsOverview

```
"totalSavings": 1000
```

/spendingPatterns

```
"spendingPatterns": {
    "averageMonthlySpending": 2500,
    "highSpendingCategories": [
      { "category": "groceries", "amount": 500 },
      { "category": "entertainment", "amount": 300 }
    ]
  }
```

/budgetingInsights

```
"budgetingInsights": {
    "recommendations": [
      "Consider reducing entertainment spending by 10% this month.",
      "Your grocery spending has increased by 20% compared to last month."
    ]
  }
```

/savingsInsight

```
"savingGoals": {
    "savings": [
      {
        "title": "Vacation",
        "status": "On Track",
        "progress": "50%"
      }
    ]
  }
```

# Pages

-   Home
-   Spendings
-   Budget Planner
-   Analytics
-   Profile

## Budget planner page has 3 Main Functionalities

-   Managing Income
-   Managing Expenses
-   Managing Savings

### Income Management

-   A user can add a source of income
-   A user can edit their source of income
-   A user can delete their source of income

### Expense Management

-   A user can add an expense assigning the limit spending amount on that expense each month
-   A user can edit a specific expense
-   A user can delete an expense

### Savings Management

-   A user can add financial goals they want to save for
-   A user can edit their financial goal
-   A user can delete a financial goal

## Spendings page has two main functionalities

-   Viewing the amount spent on each expense for this month
-   Adding new spendings that the user has recently made

### Viewing spendings

-   The user can see how much they spent on specific expenses, as well as how much more they can spend on that expense to not go over budget. They can see a progress bar for better visual understanding.

### Adding new spendings

-   When a user makes a new purchase, they can tap on the specific expense they want to add it in, and insert the amount they have spent on that category.

# Card

-   title
-   incomes[]
-   userId
-   transactions[]

# Income

-   title
-   amount
-   cardId
-   userId

# Transactions

-   amount
-   cardId?
-   type (EXPENSE or SAVING)
-   savingId or expenseId
