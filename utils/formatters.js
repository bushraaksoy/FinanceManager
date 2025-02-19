export function formatDate(date) {
    const formattedDate = new Date(date);
    return formattedDate.toLocaleDateString();
}

export function formatTransactionDate(date) {
    const formattedDate = new Date(date);
    return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(formattedDate);
}
