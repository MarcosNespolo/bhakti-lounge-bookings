
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

    const nextMonth = new Date(todayDate.getFullYear(), todayDate.getMonth() + 1, todayDate.getDate())

    while (!isValidDate(nextMonth)) {
        nextMonth.setDate(nextMonth.getDate() + 1)
    }

    const formattedDate = formatDate(nextMonth)

    return formattedDate
}

function isValidDate(date: Date) {
    return !isNaN(date.getTime())
}

function formatDate(date: Date) {
    return date.getFullYear() + '-' +
        (date.getMonth() + 1).toString().padStart(2, '0') + '-' +
        date.getDate().toString().padStart(2, '0') + 'T' +
        date.getHours().toString().padStart(2, '0') + ':' +
        date.getMinutes().toString().padStart(2, '0')
}

export function toISOStringWithoutTimezone(data: Date) {
    const ano = data.getFullYear()
    const mes = (data.getMonth() + 1).toString().padStart(2, '0')
    const dia = data.getDate().toString().padStart(2, '0')
    const horas = data.getHours().toString().padStart(2, '0')
    const minutos = data.getMinutes().toString().padStart(2, '0')
    const segundos = data.getSeconds().toString().padStart(2, '0')
    const milissegundos = data.getMilliseconds().toString().padStart(3, '0')

    return `${ano}-${mes}-${dia}T${horas}:${minutos}:${segundos}.${milissegundos}`

}