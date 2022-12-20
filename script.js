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

function solveParentheses(eq) {
    let equations = [];
    let operators = [];
    let start = 0;
    // console.log("ID: " + eq.indexOf('(', start));
    // start = eq.indexOf('(', start) + 1;
    // console.log("ID: " + eq.indexOf('(', start));
    while (eq.indexOf('(', start) != -1) {
        let slice = eq.slice(eq.indexOf('(', start) + 1, eq.indexOf(')', start));

        operators.push(eq[eq.indexOf(')', start) + 1]);

        // console.log("ID: " + eq.indexOf('(', start));
        // console.log("slice: " + slice);
        equations.push(slice);
        start = eq.indexOf(')', start) + 1;
    }


    // TODO fix this calculation
    // console.log(`Equations: ${equations}`);
    // console.log(`Operators: ${operators}`);
    let res = '';
    for (let i = 0; i < equations.length-1; i++){
        res += equations[i] + operators[i];
    }
    res += equations[equations.length-1];
    // equations.forEach(x => {
    //     console.log(`x: ${x}`);
    //     console.log(`Res: ${calculate(x)}`);
    //     res.push(calculate(x));
    // })

    // console.log(`Res: ${res}`);
    res = calculate(res);
    // console.log(`Res: ${res}`);

    // let final = '';
    // for (let i = 0; i < res.length - 1; i++) {
    //     final += res[i] + operators[i];
    // }
    // final += res[res.length - 1];
    // console.log(`Temp: ${final}`);
    // (5-3)*(4)-(3)
    // 2*4-3
    return res;

}

function solveExperssions(eq, op) {
    console.log("eq start: " + eq);
    let equations = [];
    let start = 0;
    while (eq.indexOf(op, start) != -1) {
        let pivot = eq.indexOf(op, start);
        let left = '';
        let right = '';
        for (let i = 0; i < pivot; i++) {
            if (isOperator(eq[i])) {
                left = '';
            }
            else {
                left += eq[i];
            }
        }
        for (let i = pivot + 1; i < eq.length; i++) {
            if (isOperator(eq[i])) {
                break;
            }
            right += eq[i];
        }
        console.log(`Left: ${left}`);
        console.log(`Right: ${right}`);
        equations.push(left + op + right);
        start = eq.indexOf(op, start) + 1;
    }
    console.log(`Partial equation: ${equations}`);
    res = [];
    equations.forEach(x => {
        let y = calculate(x);
        res.push(y);
        eq = eq.replace(x, y);
    })
    console.log('New equaitons: ' + eq);
    res = calculate(eq);
    console.log(`Res: ${res}`);
    return res;
}

function solveMulDivMod() {

}

function solveAddSub() {

}

function calculate(equation) {
    let numbers = [];
    let operations = [];
    let num = '';
    for (let i = 0; i < equation.length; i++) {
        if (isOperator(equation[i])) {
            if (equation[i] == '-' && isNaN(equation[i - 1])) {
                num += equation[i];
                continue;
            }
            if (num.length > 0) {
                console.log("Num to push: " + num);
                numbers.push(num);
                num = '';
            }
            operations.push(equation[i]);
        }
        else {
            num += equation[i];
        }
        if (i == equation.length - 1) {
            console.log("Num to push: " + num);
            numbers.push(num);
            num = '';
        }
    }
    console.log("Calculate(numbers): " + numbers);
    console.log("calculate operators: " + operations);

    let res = parseFloat(numbers[0]);
    console.log("parse res: " + res);
    for (let i = 0; i < numbers.length - 1; i++) {
        if (numbers[i] == NaN) continue;
        let y = parseFloat(numbers[i + 1]);
        console.log('y: ' + y);
        let op = operations[i];
        console.log('op: ' + op);
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
                break;
            case '^':
                res **= y;
                break;
            default:
                break;
        }
        console.log("partial res: " + res);
    }
    Math.fround(res);
    return res;
}

// TODO PEMDAS, sqrt
function compute() {
    // get display element and value
    const display = document.getElementById('calc-display');
    let equation = document.getElementById('calc-display').value;  
    if (equation.length == 0) return;
    if (equation.includes('(')) {
        equation = solveParentheses(equation);
    }
    if (equation.includes('*')) {
        equation = solveExperssions(equation, '*');
    }
    else {
        equation = calculate(equation);
    }

    display.value = equation;
}

function setNumberSystem(val) {
    let all = document.getElementsByClassName('btn-num');
    Array.from(all).forEach(el => {
        el.style.display = 'none';
        // console.log(el);
    });
    let ok = document.getElementsByClassName(val);
    Array.from(ok).forEach(el => {
        el.style.display = 'block';
    });
}

// TODO logic operations