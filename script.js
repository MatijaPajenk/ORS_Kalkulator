const arithmetic_calc = document.getElementById("arithmetic-radio");
const programmer_calc = document.getElementById("programmer-radio");
const readonly_checkbox = document.getElementById('display-cb');
let continous_operator = false;
let continous_dot = false;

arithmetic_calc.addEventListener('click', () => {
    document.getElementById("programmer-buttons").hidden = true;
    document.getElementById("arithmetic-buttons").hidden = false;
    document.getElementById('file-upload').hidden = false;

});

programmer_calc.addEventListener('click', () => {
    document.getElementById("arithmetic-buttons").hidden = true;
    document.getElementById("programmer-buttons").hidden = false;
    document.getElementById('file-upload').hidden = true;
})

readonly_checkbox.addEventListener('change', () => {
    const display = document.getElementById('calc-display');
    display.toggleAttribute('readonly');
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

function addSqrtValue() {
    const display = document.getElementById('calc-display');
    display.value += "^(1/2)";
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
    let equation = eq;
    // console.log("SP equation: " + equation);

    let start = 0;

    while (eq.indexOf('(', start) != -1) {
        let sliceP = eq.slice(eq.indexOf('(', start), eq.indexOf(')', start) + 1);
        // console.log("SP sliceP: " + sliceP);
        let slice = sliceP.slice(1, sliceP.length - 1);

        // console.log("SP slice: " + slice);
        slice = calculate(slice);
        // console.log("SP slice: " + slice);
        equation = equation.replace(sliceP, slice);

        start = eq.indexOf(')', start) + 1;
    }
    // console.log("SP return eqation: " + equation);
    return equation;

}

function solveExperssions(eq, op) {
    console.log("SE; eq start: " + eq);
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
        // console.log(`Left: ${left}`);
        // console.log(`Right: ${right}`);
        equations.push(left + op + right);
        start = eq.indexOf(op, start) + 1;
    }
    // console.log(`Partial equation: ${equations}`);
    res = [];
    equations.forEach(x => {
        let y = calculate(x);
        res.push(y);
        eq = eq.replace(x, y);
    })
    console.log('New equaitons: ' + eq);
    return eq;
}

function solveMulDivMod() {

}

function solveAddSub() {

}

function calculate(equation) {
    console.log("Calculate; Eqations is: " + equation)
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
                // console.log("Num to push: " + num);
                numbers.push(num);
                num = '';
            }
            operations.push(equation[i]);
        }
        else {
            num += equation[i];
        }
        if (i == equation.length - 1) {
            // console.log("Num to push: " + num);
            numbers.push(num);
            num = '';
        }
    }
    // console.log("Calculate(numbers): " + numbers);
    // console.log("calculate operators: " + operations);

    let res = parseFloat(numbers[0]);
    console.log("x: " + res);
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

function compute() {
    // get display element and value
    const display = document.getElementById('calc-display');
    let equation = document.getElementById('calc-display').value;
    if (equation.length == 0) return;
    if (equation.includes('sqrt')) {
        let index = equation.indexOf('sqrt');
        console.log('index: ' + index);
        let start = equation.indexOf('(', index);
        console.log('start: ' + start);
        let end = equation.indexOf(')', index);
        console.log('end: ' + end);
        // let slice = equation.slice(start, end + 1);
        // console.log('slice: ' + slice);
        equation = equation.replace('sqrt', '');
        start -= 4;
        end -= 3;
        console.log('start: ' + start);
        console.log('end: ' + end);
        equation = equation.slice(0, end) + '^(1/2)' + equation.slice(end);
        console.log('eq w/out sqrt: ' + equation)
    }
    if (equation.includes('pow')) {
        let index = equation.indexOf('pow');
        console.log('index: ' + index);
        let start = equation.indexOf('(', index);
        const end = equation.indexOf(')', index);
        let slice = equation.slice(start + 1, end);
        console.log('slice: ' + slice);
        slice = slice.split(',');
        const base = slice[0];
        const exponent = slice[1];
        equation = equation.replace('pow', '');
        console.log('equation replace: ' + equation);
        start = equation.indexOf('(', index - 3);
        equation = equation.slice(0, start) + base + '^' + exponent + equation.slice(end);
        console.log('eq w/out pow: ' + equation);
    }


    if (equation.includes('(')) {
        equation = solveParentheses(equation);
        //console.log("Eqation is " + equation);
    }

    if (isNaN(equation)) {

        if (equation.includes('^')) {
            equation = solveExperssions(equation, '^');
        }
        if (equation.includes('*') || equation.includes('/')) {
            let mul = equation.indexOf('*');
            let div = equation.indexOf('/');
            if (mul != -1 && div != -1) {
                if (mul < div) {
                    equation = solveExperssions(equation, '*');
                    equation = solveExperssions(equation, '/');
                }
                else {
                    equation = solveExperssions(equation, '/');
                    equation = solveExperssions(equation, '*');
                }
            }
            else if (mul != -1 && div == -1) {
                equation = solveExperssions(equation, '*');
            }
            else {
                equation = solveExperssions(equation, '/');
            }
        }
        if (equation.includes('%')) {
            equation = solveExperssions(equation, '%');
        }
        equation = calculate(equation);
    }


    display.value = equation;
}



function getSolveButton(id) {
    let button = document.createElement('button');
    button.id = `eq-${id}`;
    button.classList += 'btn-table';
    button.innerText = "Vstavi";
    button.addEventListener('click', function () {
        let text = this.parentElement.parentElement.firstChild.innerText;
        console.log(text);
        document.getElementById('calc-display').value = text;
    })
    return button;
}

function uploadFromFile(input) {
    let file = input.files[0];
    alert(`File name: ${file.name}`);
    // alert(`Last modified: ${file.lastModified}`);

    let reader = new FileReader();
    let text;
    reader.readAsText(file);
    reader.onload = function () {
        let tbody = document.getElementById('tbody');
        let id = 0;
        console.log(this.result);
        text = this.result.split('\r\n');
        console.log("Before");
        console.log(text);
        text.forEach(x => {
            x = x.replaceAll(' ', '');
            let row = document.createElement('tr');
            let text_cell = document.createElement('td');
            text_cell.innerText = x;
            let btn_cell = document.createElement('td');
            btn_cell.classList += 'btn-cell';
            btn_cell.appendChild(getSolveButton(id));
            row.appendChild(text_cell);
            row.appendChild(btn_cell);
            tbody.appendChild(row);
            console.log(x);
            id++;
        })
        console.log("After");
        console.log(text);


    }
    reader.onerror = function () {
        console.log(this.error);
    }


}

//TODO +/-, mod


// TODO logic operations
document.addEventListener('click', e => {
    if (e.target.className.includes('btn-in')) {
        const buttons = document.querySelectorAll('.btn-in');
        buttons.forEach(btn => {
            if (btn !== e.target) {
                btn.classList.remove('active');
            }
        })
        e.target.classList.add('active');
    }
    if (e.target.className.includes('btn-out')) {
        const buttons = document.querySelectorAll('.btn-out');
        buttons.forEach(btn => {
            if (btn !== e.target) {
                btn.classList.remove('active');
            }
        })
        e.target.classList.add('active');
    }
});


function setNumberSystemInput(btn) {
    const programmer_calc = document.getElementById('programmer-buttons');
    const all_btns = programmer_calc.getElementsByClassName('btn-num');
    const val = btn.value.toLowerCase();
    // console.log(all_btns);
    for (let i = 0; i < all_btns.length; i++) {
        all_btns[i].disabled = all_btns[i].classList.contains(val) ? false : true;
    }
}

function logic_compute() {
    const display = document.getElementById('calc-display');
    const val = display.value;
    const programmer_calc = document.getElementById('programmer-buttons');
    let input = programmer_calc.querySelectorAll('.btn-in.active')[0].value ?? '';
    // console.log(input.value);
    let output = programmer_calc.querySelectorAll('.btn-out.active')[0].value ?? '';
    // console.log(output.value);
    let res;

    if (val.includes('AND') || val.includes('OR') || val.includes('XOR'))
        res = solve_logic(val);
    console.log("Solved logic res: " + res);

    res = convertInput(res, input, output);

    display.value = res;
}

function not(num) {
    let binStr = num.toString(2);

    // Negate all the bits
    let negatedBinStr = '';
    for (let i = 0; i < binStr.length; i++) {
        negatedBinStr += (binStr[i] === '0') ? '1' : '0';
    }

    // Convert the negated binary string back to a number and return it
    return parseInt(negatedBinStr, 2);
}

function and(num1, num2) {
    console.log('AND num1: ' + num1);
    console.log('AND num2: ' + num2);
    num1 = num1.toString();
    num2 = num2.toString();

    let len1 = num1.length;
    let len2 = num2.length;

    console.log('len1: ' + len1);
    console.log('len2: ' + len2);

    // If one of the numbers is shorter, add zeros to the start of it
    if (len1 > len2) {
        num2 = '0'.repeat(len1 - len2) + num2;
    } else if (len2 > len1) {
        num1 = '0'.repeat(len2 - len1) + num1;
    }

    console.log('Num1: ' + num1);
    console.log('Num2: ' + num2)
    // AND the bits together
    let resultBinStr = '';
    for (let i = 0; i < len1; i++) {
        console.log('num1 at i: ' + num1[i]);
        console.log('num2 at i: ' + num2[i]);
        resultBinStr += (num1[i] == '1' && num2[i] == '1') ? '1' : '0';
    }
    console.log('resbinstr: ' + resultBinStr);
    // Convert the resulting binary string back to a number and return it
    return resultBinStr;
}

function logic_operation(num1, num2, op) {
    num1 = num1.toString();
    num2 = num2.toString();
    const len1 = num1.length;
    const len2 = num2.length;

    if (len1 > len2) {
        num2 = '0'.repeat(len1 - len2) + num2;
    } else if (len2 > len1) {
        num1 = '0'.repeat(len2 - len1) + num1;
    }

    let res = '';
    for (let i = 0; i < len1; i++) {
        if (op == 'AND') {
            res += (num1[i] == '1' && num2[i] == '1') ? '1' : '0';
        } else if (op == 'OR') {
            res += (num1[i] == '1' || num2[i] == '1') ? '1' : '0';
        } else if (op == 'XOR') {
            res += (num1[i] != num2[i]) ? '1' : '0';
        }
    }
    return res;
}

function or(num1, num2) {
    // Convert the numbers to binary strings
    let binStr1 = num1.toString(2);
    let binStr2 = num2.toString(2);

    let len1 = binStr1.length;
    let len2 = binStr1.length;

    // If one of the numbers is shorter, add zeros to the start of it
    if (len1 > len2) {
        binStr2 = '0'.repeat(len1 - len2) + binStr2;
    } else if (len2 > len1) {
        binStr1 = '0'.repeat(len2 - len1) + binStr1;
    }

    // AND the bits together
    let resultBinStr = '';
    for (let i = 0; i < binStr1.length; i++) {
        resultBinStr += (binStr1[i] === '1' || binStr2[i] === '1') ? '1' : '0';
    }

    // Convert the resulting binary string back to a number and return it
    return parseInt(resultBinStr, 2);
}

function xor(num1, num2) {
    // Convert the numbers to binary strings
    let binStr1 = num1.toString(2);
    let binStr2 = num2.toString(2);

    let len1 = binStr1.length;
    let len2 = binStr1.length;

    // If one of the numbers is shorter, add zeros to the start of it
    if (len1 > len2) {
        binStr2 = '0'.repeat(len1 - len2) + binStr2;
    } else if (len2 > len1) {
        binStr1 = '0'.repeat(len2 - len1) + binStr1;
    }

    // AND the bits together
    let resultBinStr = '';
    for (let i = 0; i < binStr1.length; i++) {
        resultBinStr += (binStr1[i] !== binStr2[i]) ? '1' : '0';
    }

    // Convert the resulting binary string back to a number and return it
    return parseInt(resultBinStr, 2);
}

function solve_logic(equation) {
    console.log("Calculate logic; \nEqations is: " + equation)

    let start = 0;
    while (equation.includes('NOT ')) {
        const index = equation.indexOf('NOT ', start) + 4;
        console.log('NOT index: ' + index);
        let num = '';
        for (let i = index; equation[i] != ' ' && i < equation.length; i++) {
            num += equation[i];
        }
        console.log('Num: ' + num);
        not_num = not(num).toString(2);
        console.log('Not num: ' + not_num);
        equation = equation.replace(`NOT ${num}`, not_num);
    }

    console.log('Without not: ' + equation);

    let numbers = [];
    let operations = [];
    let tokens = equation.split(' ');
    for (let i = 0; i < tokens.length; i++) {
        if (!isNaN(tokens[i])) {
            numbers.push(tokens[i].toString(2));
        } else {
            operations.push(tokens[i]);
        }
    }
    console.log('Numbers: ' + numbers);
    console.log('Operations: ' + operations);

    let res = parseFloat(numbers[0]);
    console.log("x: " + res);
    for (let i = 0; i < numbers.length - 1; i++) {
        if (numbers[i] == NaN) continue;
        let y = parseFloat(numbers[i + 1]);
        console.log('y: ' + y);
        let op = operations[i];
        console.log('op: ' + op);
        res = logic_operation(res, y, op);
    }
    console.log("partial res: " + res);


    return res;
}

function convertInput(val, input, output) {
    console.log("convert input val: " + val);
    let res = '';
    if (input == 'BIN') {
        if (output == 'BIN') return val;
        if (output == 'OCT') {
            res = convert(val, 2, 8);
        }
        else if (output == 'DEC') {
            res = convert(val, 2, 10);
        }
        else if (output == 'HEX') {
            res = convert(val, 2, 16).toUpperCase();
        }
    }
    else if (input == 'OCT') {
        if (output == 'OCT') return val;
        if (output == 'BIN') {
            res = convert(val, 8, 2);
        }
        else if (output == 'DEC') {
            res = convert(val, 8, 10);
        }
        else if (output == 'HEX') {
            res = convert(val, 8, 16).toUpperCase();
        }
    }
    else if (input == 'DEC') {
        if (output == 'DEC') return val;
        if (output == 'BIN') {
            res = convert(val, 10, 2);
        }
        else if (output == 'OCT') {
            res = convert(val, 10, 8);
        }
        else if (output == 'HEX') {
            res = convert(val, 10, 16).toUpperCase();
        }
    }

    else if (input == 'HEX') {
        if (output == 'HEX') return val;
        if (output == 'BIN') {
            res = convert(val, 16, 2);
        }
        else if (output == 'OCT') {
            res = convert(val, 16, 8);
        }
        else if (output == 'DEC') {
            res = convert(val, 16, 10);
        }
    }

    console.log("Convert input res: " + res);
    return res;

}

function convert(val, from, to) {
    return parseInt(val, from).toString(to);
}
