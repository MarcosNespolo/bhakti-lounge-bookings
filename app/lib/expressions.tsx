
export function getTodayDate(allDay?: boolean) {
    const todayDate = new Date()
    if (allDay) {
        todayDate.setHours(23, 59, 59)
    } else {
        todayDate.setHours(0, 0, 0)
    }
    let today = todayDate.getFullYear() +
        '-' +
        (todayDate.getMonth() + 1).toLocaleString('en-NZ', {
            minimumIntegerDigits: 2,
            useGrouping: false
        }) +
        '-' +
        todayDate.getDate().toLocaleString('en-NZ', {
            minimumIntegerDigits: 2,
            useGrouping: false
        }) + 'T' +
        todayDate.getHours().toLocaleString('en-NZ', {
            minimumIntegerDigits: 2,
            useGrouping: false
        }) + ':' +
        todayDate.getMinutes().toLocaleString('en-NZ', {
            minimumIntegerDigits: 2,
            useGrouping: false
        })

    return today
}

export function getNextMonthDate() {
    const todayDate = new Date()
    todayDate.setHours(23, 59, 59)

    let today = todayDate.getFullYear() +
        '-' +
        (todayDate.getMonth() + 2).toLocaleString('en-NZ', {
            minimumIntegerDigits: 2,
            useGrouping: false
        }) +
        '-' +
        todayDate.getDate().toLocaleString('en-NZ', {
            minimumIntegerDigits: 2,
            useGrouping: false
        }) + 'T' +
        todayDate.getHours().toLocaleString('en-NZ', {
            minimumIntegerDigits: 2,
            useGrouping: false
        }) + ':' +
        todayDate.getMinutes().toLocaleString('en-NZ', {
            minimumIntegerDigits: 2,
            useGrouping: false
        })

    return today
}