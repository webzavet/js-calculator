let calculator = new Calculator();

let input = document.querySelector('.input');
calculator.expression = input.textContent;


function insert(num) {
    calculator.insert(num)
}

function clean() {
    calculator.clean()
}

function equal() {
    calculator.equal()
}

function percent() {
    calculator.percent()
}

function back() {
    calculator.back()
}

function piNumber() {
    calculator.piNumber()
}

function eNumber() {
    calculator.eNumber()
}

function degree(operation) {
    calculator.degree(operation)
}

function fact() {
    calculator.fact()
}

function log(name) {
    calculator.log(name)
}

function toggleAngleMode() {
    calculator.toggleAngleMode()
}

function trigonometry(name) {
    calculator.trigonometry(name)
}

