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
