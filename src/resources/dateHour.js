function dateHour() {
    const date = new Date();

    const ret = {
        'day': String(date.getDate()).padStart(2, '0'),
        'mon': String(date.getMonth() + 1).padStart(2, '0'),
        'yea': String(date.getFullYear()),
        'hou': String(date.getHours()).padStart(2, '0'),
        'min': String(date.getMinutes()).padStart(2, '0'),
        'sec': String(date.getSeconds()).padStart(2, '0'),
        'mil': String(date.getMilliseconds()).padStart(3, '0'),
        'tim': Date.now()
    }

    return ret
}

export { dateHour };