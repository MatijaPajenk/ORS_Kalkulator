let continous_operator = false;

// Nastavi 'click' dogodek na radio gumb za aritmetično računalo
document.getElementById("arithmetic-radio").addEventListener('click', () => {
    document.getElementById("programmer-buttons").hidden = true;
    document.getElementById("arithmetic-buttons").hidden = false;
    document.getElementById('file-upload').hidden = false;
    document.getElementById('file-upload-logic').hidden = true;

});

// Nastavi 'click' dogodek na radio gumb za logično računalo
document.getElementById("programmer-radio").addEventListener('click', () => {
    document.getElementById("arithmetic-buttons").hidden = true;
    document.getElementById("programmer-buttons").hidden = false;
    document.getElementById('file-upload').hidden = true;
    document.getElementById('file-upload-logic').hidden = false;

})

// Nastavi 'change' event za gumb 'vnos preko tipkovnice', da omogoči oz. onemogoči funkcijo
document.getElementById('display-cb').addEventListener('change', () => {
    const display = document.getElementById('calc-display');
    display.toggleAttribute('readonly');
})

// Preveri, če je vhodni parameter operator 
let isOperator = (x) => {
    return x == '+' || x == '-' || x == '*' || x == '/' || x == '%' || x == '^';
}

// Doda vrednost gumba v polje za računanje
function addBtnValue(val) {
    const display = document.getElementById('calc-display');
    if (display.value[0] == '0' && display.value.length == 1 && val != '.') {
        return;
    }
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
    display.value += val;
}

// Doda sintakso za računanje korenov
function addSqrtValue() {
    const display = document.getElementById('calc-display');
    display.value += "^(1/2)";
}

// Počisti polje za računanje
function clearDisplay() {
    document.getElementById('calc-display').value = "";
}

// Odstrani zadnji znak v polju za računanje
function deleteDisplayValue() {
    let value = document.getElementById('calc-display').value;
    value = value.slice(0, -1);
    document.getElementById('calc-display').value = value;
}

// Reši račun znotraj okepajev
function solveParentheses(eq) {
    let equation = eq;
    let start = 0;

    while (eq.indexOf('(', start) != -1) {
        let sliceP = eq.slice(eq.indexOf('(', start), eq.indexOf(')', start) + 1);
        let slice = sliceP.slice(1, sliceP.length - 1);
        slice = calculate(slice);
        equation = equation.replace(sliceP, slice);
        start = eq.indexOf(')', start) + 1;
    }

    return equation;
}

// Zračuna vrednost izraza za specifično računsko operacijo, ki je podana kot 2. parameter 
function solveExpressions(eq, op) {
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

        equations.push(left + op + right);
        start = eq.indexOf(op, start) + 1;
    }

    res = [];
    equations.forEach(x => {
        let y = calculate(x);
        res.push(y);
        eq = eq.replace(x, y);
    })
    return eq;
}

// Zračuna vrednost izraza
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

                numbers.push(num);
                num = '';
            }
            operations.push(equation[i]);
        }
        else {
            num += equation[i];
        }
        if (i == equation.length - 1) {

            numbers.push(num);
            num = '';
        }
    }

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
                break;
            case '^':
                res **= y;
                break;
            default:
                break;
        }

    }
    Math.fround(res);
    return res;
}

// Funkcija, ki se pokliče ob pritisku na gumb '=', ki razporedi pravilni vrsti red operacij pri aritmetičnem računalu
function compute() {
    const display = document.getElementById('calc-display');
    let equation = document.getElementById('calc-display').value;
    if (equation.length == 0) return;
    if (equation.includes('sqrt')) {
        let index = equation.indexOf('sqrt');
        let start = equation.indexOf('(', index);
        let end = equation.indexOf(')', index);
        equation = equation.replace('sqrt', '');
        start -= 4;
        end -= 3;
        equation = equation.slice(0, end) + '^(1/2)' + equation.slice(end);
    }
    if (equation.includes('pow')) {
        let index = equation.indexOf('pow');
        let start = equation.indexOf('(', index);
        const end = equation.indexOf(')', index);
        let slice = equation.slice(start + 1, end);
        slice = slice.split(',');
        const base = slice[0];
        const exponent = slice[1];
        equation = equation.replace('pow', '');
        start = equation.indexOf('(', index - 3);
        equation = equation.slice(0, start) + base + '^' + exponent + equation.slice(end);
    }
    if (equation.includes('(')) {
        equation = solveParentheses(equation);
    }

    if (isNaN(equation)) {
        if (equation.includes('^')) {
            equation = solveExpressions(equation, '^');
        }
        if (equation.includes('*') || equation.includes('/')) {
            let mul = equation.indexOf('*');
            let div = equation.indexOf('/');
            if (mul != -1 && div != -1) {
                if (mul < div) {
                    equation = solveExpressions(equation, '*');
                    equation = solveExpressions(equation, '/');
                }
                else {
                    equation = solveExpressions(equation, '/');
                    equation = solveExpressions(equation, '*');
                }
            }
            else if (mul != -1 && div == -1) {
                equation = solveExpressions(equation, '*');
            }
            else {
                equation = solveExpressions(equation, '/');
            }
        }
        if (equation.includes('%')) {
            equation = solveExpressions(equation, '%');
        }
        equation = calculate(equation);
    }
    display.value = equation;
}

// Funkcija, ki ustvari gumb 'vstavi'
function getSolveButton(id) {
    let button = document.createElement('button');
    button.id = `eq-${id}`;
    button.classList += 'btn-table';
    button.innerText = "Vstavi";
    button.addEventListener('click', function () {
        let text = this.parentElement.parentElement.firstChild.innerText;
        document.getElementById('calc-display').value = text;
    })
    return button;
}

// Naloži tekst iz datoteke v tabelo z enačbami
function uploadFromFile(input) {
    let file = input.files[0];
    alert(`Datoteka: ${file.name}`);
    let reader = new FileReader();
    let text;
    reader.readAsText(file);
    reader.onload = function () {
        let tbody = document.getElementById('tbody');
        let id = 0;
        text = this.result.split('\r\n');
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
            id++;
        })
    }
    reader.onerror = function () {
        alert('Napaka pri nalaganju datoteke.');
    }
}

// Doda 'click' dogodek na gumbe za vhodne in izhodne številske sisteme 
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

// Določi kateri gumbi se lahko kliknejo pri določenem številskem sistemu
function setNumberSystemInput(btn) {
    const programmer_calc = document.getElementById('programmer-buttons');
    const all_btns = programmer_calc.getElementsByClassName('btn-num');
    const val = btn.value.toLowerCase();
    for (let i = 0; i < all_btns.length; i++) {
        all_btns[i].disabled = all_btns[i].classList.contains(val) ? false : true;
    }
}

// Funkcija, ki se pokliče ob kliku na gumb '=', pri logičnem računalu
function logic_compute() {
    const display = document.getElementById('calc-display');
    const val = display.value;
    const programmer_calc = document.getElementById('programmer-buttons');
    let input = programmer_calc.querySelectorAll('.btn-in.active')[0].value ?? '';
    let output = programmer_calc.querySelectorAll('.btn-out.active')[0].value ?? '';
    let res = val;
    if (val.includes('AND') || val.includes('OR') || val.includes('XOR')) {
        res = solve_logic(val);
    }
    res = convertInput(res, input, output);
    display.value = res;
}

// Reši logično operacijo ne
function not(num) {
    let binStr = num.toString(2);
    let negatedBinStr = '';
    for (let i = 0; i < binStr.length; i++) {
        negatedBinStr += (binStr[i] === '0') ? '1' : '0';
    }
    return parseInt(negatedBinStr, 2);
}

// Reši logično operacijo med dvema izjavama, ki je podana kot 3. parameter
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

// Ovrednoti vrednost izjave v polju
function solve_logic(equation) {
    let start = 0;
    while (equation.includes('NOT ')) {
        const index = equation.indexOf('NOT ', start) + 4;
        let num = '';
        for (let i = index; equation[i] != ' ' && i < equation.length; i++) {
            num += equation[i];
        }
        not_num = not(num).toString(2);
        equation = equation.replace(`NOT ${num}`, not_num);
    }

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

    let res = parseFloat(numbers[0]);
    for (let i = 0; i < numbers.length - 1; i++) {
        if (numbers[i] == NaN) continue;
        let y = parseFloat(numbers[i + 1]);

        let op = operations[i];

        res = logic_operation(res, y, op);
    }
    return res;
}

// Pretvarja izraz med številskimi sistemi
function convertInput(val, input, output) {
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
    return res;
}

// Pretvori vrednost izjave v željen številski sistem
function convert(val, from, to) {
    return parseInt(val, from).toString(to);
}

// Ustvari gumb, ki doda izjavo v polje za izjave
function getSolveButtonLogic(id) {
    let button = document.createElement('button');
    button.id = `lo-${id}`;
    button.classList += 'btn-table';
    button.innerText = "Vstavi";
    button.addEventListener('click', function () {
        let tokens = this.parentElement.parentElement.firstChild.innerText.split(';');
        const input = document.getElementsByName(`IN-${tokens[0]}`)[0];
        input.click();
        document.getElementById('calc-display').value = tokens[1].toString();
        const output = document.getElementsByName(`OUT-${tokens[2]}`)[0];
        output.click();
    })
    return button;
}

// Naloži tekst iz datoteke v tabelo z izjavami
function uploadFromFileLogic(input) {
    let file = input.files[0];
    alert(`Datoteka: ${file.name}`);
    let reader = new FileReader();
    let text;
    reader.readAsText(file);
    reader.onload = function () {
        let tbody = document.getElementById('tbody-logic');
        tbody.innerHTML = '';
        let id = 0;
        text = this.result.split('\r\n');
        text.forEach(x => {
            let row = document.createElement('tr');
            let text_cell = document.createElement('td');
            text_cell.innerText = x;
            let btn_cell = document.createElement('td');
            btn_cell.classList += 'btn-cell';
            btn_cell.appendChild(getSolveButtonLogic(id));
            row.appendChild(text_cell);
            row.appendChild(btn_cell);
            tbody.appendChild(row);
            id++;
        })
    }
    reader.onerror = function () {
        alert('Napaka pri nalaganju datoteke.');
    }
}