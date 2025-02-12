export const calculateMonthlySaving = (target_amount, savedAmount, dueDate) => {
    const remainingAmount = target_amount - savedAmount;
    const currentDate = new Date();
    const due = new Date(dueDate);
    if (due <= currentDate) {
        throw new Error('Due date must be in the future');
    }
    const remainingMonths =
        (due.getFullYear() - currentDate.getFullYear()) * 12 +
        (due.getMonth() - currentDate.getMonth());

    const monthlySaving = remainingAmount / remainingMonths;
    return monthlySaving;
};
