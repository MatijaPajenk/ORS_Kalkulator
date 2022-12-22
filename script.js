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
        let sliceP = eq.slice(eq.indexOf('(', start), eq.indexOf(')', start)+1);
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
        let slice = equation.slice(start+1, end);
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
    let input = programmer_calc.querySelectorAll('.btn-in.active')[0] ?? '';
    // console.log(input.value);
    let output = programmer_calc.querySelectorAll('.btn-out.active')[0] ?? '';
    // console.log(output.value);
    if (input.length < 1 || output.length < 1) return alert('Polje za pretvorbo ni izbrano.');
    input = input.value;
    output = output.value;
    let res = '';
    if (input == 'BIN') {
        if (output == 'BIN') return;
        if (output == 'OCT') {
            res = convertBinToOct(val);
        }
        else if (output == 'DEC') {
            res = convertBinToDec(val);
        }
        else if (output == 'HEX') {
            res = convertBinToHex(val);
        }
    }
    else if (input == 'OCT') {
        if (output == 'OCT') return;
        if (output == 'BIN') {
            res = convertOctToBin(val);
        }
        else if (output == 'DEC') {
            res = convertOctToDec(val);
        }
        else if (output == 'HEX') {
            res = convertOctToHex(val);
        }
    }
    else if (input == 'DEC') {
        if (output == 'DEC') return;
        if (output == 'BIN') {
            res = convertDecToBin(val);
        }
        else if (output == 'OCT') {
            res = convertDecToOct(val);
        }
        else if (output == 'HEX') {
            res = convertDecToHex(val);
        }
    }

    else if (input == 'HEX') {
        if (output == 'HEX') return;
        if (output == 'BIN') {
            res = convertHexToBin(val);
        }
        else if (output == 'OCT') {
            res = convertHexToOct(val);
        }
        else if (output == 'DEC') {
            res = convertHexToDec(val);
        }
    }

    display.value = res;
}

function convertBinToOct(val) {
    while (val.length % 3 !== 0) {
        val = '0' + val;
    }

    // Split the binary number into groups of three digits
    const groups = val.match(/.{1,3}/g);

    // Convert each group to its octal equivalent
    const octal = groups.map(group => {
        let sum = 0;
        for (let i = 0; i < 3; i++) {
            sum += parseInt(group[i]) * Math.pow(2, 2 - i);
        }
        return sum;
    }).join('');

    return octal;
}

function convertBinToDec(val) {
    let decimal = 0;
    for (let i = 0; i < val.length; i++) {
        decimal += parseInt(val[i]) * Math.pow(2, val.length - 1 - i);
    }
    return decimal
}

function convertBinToHex(val) {
    while (val.length % 4 !== 0) {
        val = '0' + val;
    }

    // Split the binary number into groups of four digits
    const groups = val.match(/.{1,4}/g);

    // Convert each group to its hexadecimal equivalent
    const hex = groups.map(group => {
        let sum = 0;
        for (let i = 0; i < 4; i++) {
            sum += parseInt(group[i]) * Math.pow(2, 3 - i);
        }
        return sum.toString(16).toUpperCase();
    }).join('');

    return hex;
}

function convertOctToBin(val){
    let binary = '';
    for (let i = 0; i < val.length; i++) {
        const digit = parseInt(val[i]);
        binary += digit.toString(2);
    }
    return binary;
}

function convertOctToDec(val) {
    let decimal = 0;
    for (let i = 0; i < val.length; i++) {
        decimal += parseInt(val[i]) * Math.pow(8, val.length - 1 - i);
    }
    return decimal;
}

function convertOctToHex(val) {
    while (val.length % 3 !== 0) {
        val = '0' + val;
    }

    // Split the octal number into groups of three digits
    const groups = val.match(/.{1,3}/g);

    // Convert each group to its hexadecimal equivalent
    const hex = groups.map(group => {
        let sum = 0;
        for (let i = 0; i < 3; i++) {
            sum += parseInt(group[i]) * Math.pow(8, 2 - i);
        }
        return sum.toString(16).toUpperCase();
    }).join('');

    return hex;
}

function convertDecToBin(val) {
    let binary = '';
    while (val > 0) {
        binary = (val % 2) + binary;
        val = Math.floor(val / 2);
    }
    return binary;
}

function convertDecToOct(val) {
    let oct = '';
    while (val > 0) {
        oct = (val % 8) + oct;
        val = Math.floor(val / 8);
    }
    return oct;
}

function convertDecToHex(val) {
    let hex = '';
    while (val > 0) {
        hex = (val % 16).toString(16).toUpperCase() + hex;
        val = Math.floor(val / 16);
    }
    return hex;
}

function convertHexToBin(val) {
    let binary = '';
    for (let i = 0; i < val.length; i++) {
        const digit = parseInt(val[i], 16);
        binary += digit.toString(2);
    }
    return binary;
}

function convertHexToOct(val) {
    while (val.length % 2 !== 0) {
        val = '0' + val;
    }

    // Split the hexadecimal number into groups of two digits
    const groups = val.match(/.{1,2}/g);

    // Convert each group to its octal equivalent
    const octal = groups.map(group => {
        let sum = 0;
        for (let i = 0; i < 2; i++) {
            sum += parseInt(group[i], 16) * Math.pow(16, 1 - i);
        }
        return sum.toString(8);
    }).join('');

    return octal;
}

function convertHexToDec(val) {
    let decimal = 0;
    for (let i = 0; i < val.length; i++) {
        decimal += parseInt(val[i], 16) * Math.pow(16, val.length - 1 - i);
    }
    return decimal;
}