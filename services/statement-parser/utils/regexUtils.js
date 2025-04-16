export const regexes = {
    dateShort: /^\d{2}\.\d{2}\.\d{2}$/,     //  01.01.23
    dateLong: /^\d{2}\.\d{2}\.\d{4}$/,      //  01.01.2023
    amountWithSign: /^-?\d+\s?\d*,\d+$/,    // -15 378,00
    amountNoSign: /^\d+\s?\d*,\d+$/,        //  47 135,00
    dateDayMonth: /^\d{1,2}-[A-Za-z]{3}$/,  // 3-Mar
    plainDotDecimal: /^\d+\.\d+$/,          // 123.45
}

export function isDateShort(str) {
    return regexes.dateShort.test(str);
}

export function isDateLong(str) {
    return regexes.dateLong.test(str);
}

export function isAmountWithSign(str) {
    return regexes.amountWithSign.test(str);
}

export function isAmountNoSign(str) {
    return regexes.amountNoSign.test(str);
}

export function isDateDayMonth(str) {
    return regexes.dateDayMonth.test(str);
}

export function isPlainDotDecimal(str) {
    return regexes.plainDotDecimal.test(str);
}