const apiLink = 'http://185.74.4.138:8080/'


export const staisticUrl = `${apiLink}statistics/seller`
export const loginUrl = `${apiLink}api/user/login`
export const createPayment = `${apiLink}payment/create`
export const cancel_payment = `${apiLink}payment/cancel`

export const SellerGet = `${apiLink}terminal/list`

export const SellerEdit = `${apiLink}terminal/update/`
export const payment_get_seller = `${apiLink}payment/list/for/seller`
export const payment_get_terminal = `${apiLink}payment/list/for/terminal`

export const UserTerminalGet = `${apiLink}api/user/terminal`

export const isRead_notification = `${apiLink}notification/is-read`
export const delete_notification = `${apiLink}notification/delete`
export const seller_notification = `${apiLink}notification/for-seller`
export const terminal_notification = `${apiLink}notification/for-terminal`
export const seller_notification_count = `${apiLink}notification/count/for-seller`
export const terminal_notification_count = `${apiLink}notification/count/for-terminal`


export const get_mee = `${apiLink}api/user/me`
export const update_profile = `${apiLink}api/user/update
`