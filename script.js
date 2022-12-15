let arithmetic_calc = document.getElementById("arithmetic-radio");
let programmer_calc = document.getElementById("programmer-radio");
let continous_operator = false;
let continous_dot = false;

arithmetic_calc.addEventListener('click', () => {
    document.getElementById("programmer-buttons").hidden = true;
    document.getElementById("arithmetic-buttons").hidden = false;
});

programmer_calc.addEventListener('click', () => {
    document.getElementById("arithmetic-buttons").hidden = true;
    document.getElementById("programmer-buttons").hidden = false;
})

let isOperator = (x) => {
    return x == '+' || x == '-' || x == '*' || x == '/' || x == '%' || x == '^';
}


function addBtnValue(val) {
    const display = document.getElementById('calc-display');

    if (display.value[0] == '0' && display.value.length == 1 && val != '.') {
        return;
    }

    // Repeating operator check
    if (continous_operator && isOperator(val)) {
        deleteDisplayValue();
        display.value += val;
        return;
    }
    if (isOperator(val)) {
        continous_operator = true;
    }
    else {
        continous_operator = false;
    }
    //TODO fix dot placement

    display.value += val;
}

function clearDisplay() {
    document.getElementById('calc-display').value = "";
}

function deleteDisplayValue() {
    let value = document.getElementById('calc-display').value;
    value = value.slice(0, -1);
    document.getElementById('calc-display').value = value;
}

// TODO PEMDAS, sqrt
function compute() {
    // get display element and value
    const display = document.getElementById('calc-display');
    const exquation = document.getElementById('calc-display').value;

    // create empty arrays for numbers and operations
    let numbers = [];
    let operations = [];
    let num = '';
    for (let i = 0; i < exquation.length; i++) {
        if (isOperator(exquation[i])) {
            if (num.length > 0) {
                numbers.push(num);
                num = '';
            }
            operations.push(exquation[i]);
        }
        else {
            if (exquation[i] == '(') continue;
            if (exquation[i] == ')') {
                numbers.push(num);
                num = '';
                continue;
            }
            num += exquation[i];
        }
        if (i == exquation.length - 1) {
            numbers.push(num);
            num = '';
        }

    }

    // debugging purposes
    console.log(exquation);
    console.log(`numbers: ${numbers}`);
    console.log(`operations: ${operations}`);

    // calculation
    let res = parseFloat(numbers[0]);
    for (let i = 0; i < numbers.length - 1; i++) {
        if (numbers[i] == NaN) continue;
        let y = parseFloat(numbers[i + 1]);
        let op = operations[i];
        switch (op) {
            case '+':
                res += y;
                break;
            case '-':
                res -= y;
                break;
            case '/':
                res /= y;
                break;
            case '*':
                res *= y;
                break;
            case '%':
                res %= y;
            case '^':
                res **= y;
            default:
                break;
        }
    }
    Math.fround(res);

    display.value = res;
    console.log(res);
}

function setNumberSystem(val) {
    let all = document.getElementsByClassName('btn-num');
    Array.from(all).forEach(el => {
        el.style.display = 'none';
        console.log(el);
    });
    let ok = document.getElementsByClassName(val);
    Array.from(ok).forEach(el => {
        el.style.display = 'block';
    });
}

// TODO logic operations