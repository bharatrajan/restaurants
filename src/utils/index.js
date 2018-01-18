export const zipVaildator = zipStr =>
/(^\d{5}$)|(^\d{5}-\d{4}$)/.test(zipStr)