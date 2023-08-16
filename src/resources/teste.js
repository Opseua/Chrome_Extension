let string = 'Ola'
if (string.charAt(0) === string.charAt(0).toUpperCase()) {
    console.log(true)
    string = string.charAt(0).toLowerCase() + string.slice(1)
    console.log(string)
} else {
    console.log(false)
    string = string.charAt(0).toUpperCase() + string.slice(1)
    console.log(string)
}