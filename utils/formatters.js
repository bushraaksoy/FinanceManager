export function formatDate(date) {
    const formattedDate = new Date(date);
    return formattedDate.toLocaleDateString();
}
