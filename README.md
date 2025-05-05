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

### The time when the monthlySavings is calculated:

-   when the saving is first created
-   when the user states they have not saved the intended amount for the month, but a different amount "other"

-   when the user changes the due date

```
remainingAmount = target_amount - saved_amount
remainingMonths = months between current date and due date
monthlySaving = remaining_amount / remaining_months
```

## Add tax functionality?

each income needs to have an additional field of tax and taxPercentage
that tax will go to the expense table as well?

#### MonthlySavings

Implement functionality for confirming the saved amount for each month.

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

Savings

    // GET
    // /incomeOverview
    // /incomeTrend
    // /expenseOverview
    // /expenseTrend
