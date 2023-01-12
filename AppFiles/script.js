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

// Obrne niz
function reverseStr(str) {
    return str.split('').reverse().join('');
}

// Spremeni predznak trenutnega člena
function toggleNegative() {
    const display = document.getElementById('calc-display');
    let val = display.value;
    let slice = ')';
    let id = val.length - 1;
    if (id == 0) {
        val += '-(';
        val = reverseStr(val);
        val += ')';
        display.value = val;
        return;
    }
    for (id; !isOperator(val[id]); id--){
        slice += val[id];
        console.log(id + ': ' + val[id]);
    }
    console.log(id + ': ' + val[id]);
    const rep = val.substr(id+1, val.length - id);
    slice += '-(';
    slice = reverseStr(slice);
    console.log(slice);
    console.log(val);
    console.log(rep);
    val = val.replace(rep, slice);
    display.value = val;
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
    console.log('eq: ' + equation);
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
            if (isOperator(eq[i]) && eq[i] != '-') {
                left = '';
            }
            else {
                left += eq[i];
            }
        }
        console.log('left: ' + left);
        for (let i = pivot + 1; i < eq.length; i++) {
            console.log(eq[i]);
            if (isOperator(eq[i]) && eq[i] != '-') {
                break;
            }
            right += eq[i];
        }
        console.log('right: ' + right);

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
            // res = convert(val, 2, 8);
            res = binToOct(val);
        }
        else if (output == 'DEC') {
            // res = convert(val, 2, 10);
            res = binToDec(val);
        }
        else if (output == 'HEX') {
            // res = convert(val, 2, 16).toUpperCase();
            res = binToHex(val);
        }
    }
    else if (input == 'OCT') {
        if (output == 'OCT') return val;
        if (output == 'BIN') {
            // res = convert(val, 8, 2);
            res = octToBin(val);
        }
        else if (output == 'DEC') {
            // res = convert(val, 8, 10);
            res = octToDec(val);
        }
        else if (output == 'HEX') {
            // res = convert(val, 8, 16).toUpperCase();
            res = octToHex(val);
        }
    }
    else if (input == 'DEC') {
        if (output == 'DEC') return val;
        if (output == 'BIN') {
            // res = convert(val, 10, 2);
            res = decToBin(val);
        }
        else if (output == 'OCT') {
            // res = convert(val, 10, 8);
            res = decToOct(val);
        }
        else if (output == 'HEX') {
            // res = convert(val, 10, 16).toUpperCase();
            res = decToHex(val);
        }
    }
    else if (input == 'HEX') {
        if (output == 'HEX') return val;
        if (output == 'BIN') {
            // res = convert(val, 16, 2);
            res = hexToBin(val);
        }
        else if (output == 'OCT') {
            // res = convert(val, 16, 8);
            res = hexToOct(val);
        }
        else if (output == 'DEC') {
            // res = convert(val, 16, 10);
            res = hexToDec(val);
        }
    }
    return res;
}

// Pretvori binarno stevilo v osmisko
function binToOct(val) {
    let res = '';
    let remaining = val;
    while (remaining.length > 0) {
        let digits = remaining.slice(-3);
        while (digits.length < 3) {
            digits = '0' + digits;
        }

        let digit;

        switch (digits) {
            case '000':
                digit = '0';
                break;
            case '001':
                digit = '1';
                break;
            case '010':
                digit = '2';
                break;
            case '011':
                digit = '3';
                break;
            case '100':
                digit = '4';
                break;
            case '101':
                digit = '5';
                break;
            case '110':
                digit = '6';
                break;
            case '111':
                digit = '7';
                break;
        }
        res = digit + res;
        remaining = remaining.slice(0, -3);
    }
    return res;
}

// Pretvori binarno stevilo v desetisko
function binToDec(val) {
    let res = 0;
    let c = 0;
    for (let i = val.length - 1; i >= 0; i--){
        res += val[i] * (2 ** c);
        c++;
    }
    return res;
}

// Pretvori binarno stevilo v sestnajstisko
function binToHex(val) {
    let res = '';
    let remaining = val;
    while (remaining.length > 0) {
        let digits = remaining.slice(-4);
        while (digits.length < 4) {
            digits = '0' + digits;
        }

        let digit;

        switch (digits) {
            case '0000':
                digit = '0';
                break;
            case '0001':
                digit = '1';
                break;
            case '0010':
                digit = '2';
                break;
            case '0011':
                digit = '3';
                break;
            case '0100':
                digit = '4';
                break;
            case '0101':
                digit = '5';
                break;
            case '0110':
                digit = '6';
                break;
            case '0111':
                digit = '7';
                break;
            case '1000':
                digit = '8';
                break;
            case '1001':
                digit = '9';
                break;
            case '1010':
                digit = 'A';
                break;
            case '1011':
                digit = 'B';
                break;
            case '1100':
                digit = 'C';
                break;
            case '1101':
                digit = 'D';
                break;
            case '1110':
                digit = 'E';
                break;
            case '1111':
                digit = 'F';
                break;
        }
        res = digit + res;
        remaining = remaining.slice(0, -4);
    }
    return res;
}

// Pretvori osmisko stevilo v dvojisko
function octToBin(val) {
    var lookup = {
        '0': '000',
        '1': '001',
        '2': '010',
        '3': '011',
        '4': '100',
        '5': '101',
        '6': '110',
        '7': '111',
    };
    let res = '';
    for (var i = 0; i < val.length; i++) {
        res += lookup[val[i]];
    }
    return res;
}

// Pretvori osmisko stevilo v desetisko
function octToDec(val) {
    let res = 0;
    let c = 0;
    for (let i = val.length - 1; i >= 0; i--) {
        res += val[i] * (8 ** c);
        c++;
    }
    return res;
}

// Pretvori osmisko stevilo v sestnajstisko
function octToHex(val) {
    let res = octToBin(val);
    res = binToHex(res);
    while (res[0] == '0') {
        res = res.slice(1, res.length);
    }
    return res;
}

// Pretvori desetisko stevilo v dvojisko
function decToBin(val) {
    let res = '';
    while (val > 0) {
        res = val % 2 + res;
        val = (val - val % 2) / 2;
    }
    return res;
}

// Pretvori desetisko stevilo v osmisko
function decToOct(val) {
    let res = '';
    while (val > 0) {
        res = val % 8 + res;
        val = (val - val % 8) / 8;
    }
    return res;
}

// Pretvori desetisko stevilo v sestnajstisko
function decToHex(val) {
    let res = '';
    while (val > 0) {
        let rem = val % 16;
        switch (rem) {
            case 10:
                res = 'A' + res;
                break;
            case 11:
                res = 'B' + res;
                break;
            case 12:
                res = 'C' + res;
                break;
            case 13:
                res = 'D' + res;
                break;
            case 14:
                res = 'E' + res;
                break;
            case 15:
                res = 'F' + res;
                break;
            default:
                res = rem + res;
                break;
            }
        val = (val - rem) / 16;
    }
    return res;
}

// Pretvori sestnajstisko stevilo v dvojisko
function hexToBin(val) {
    var lookup = {
        '0': '0000',
        '1': '0001',
        '2': '0010',
        '3': '0011',
        '4': '0100',
        '5': '0101',
        '6': '0110',
        '7': '0111',
        '8': '1000',
        '9': '1001',
        'A': '1010',
        'B': '1011',
        'C': '1100',
        'D': '1101',
        'E': '1110',
        'F': '1111'
    };
    let res = '';
    for (var i = 0; i < val.length; i++) {
        res += lookup[val[i]];
    }
    return res;
}

// Pretvori sestnajstisko stevilo v osmisko
function hexToOct(val) {
    let res = hexToBin(val);
    console.log('res: ' + res);
    res = binToOct(res);
    while (res[0] == '0') {
        res = res.slice(1, res.length);
    }
    console.log('res: ' + res);
    return res;
}

// Pretvori sestnajstisko stevilo v desetisko
function hexToDec(val) {
    let res = 0;
    let c = 0;
    for (let i = val.length - 1; i >= 0; i--) {
        let x;
        switch (val[i]) {
            case 'A':
                x = 10;
                break;
            case 'B':
                x = 11;
                break;
            case 'C':
                x = 12;
                break;
            case 'D':
                x = 13;
                break;
            case 'E':
                x = 14;
                break;
            case 'F':
                x = 15;
                break;
            default:
                x = val[i];
        }
        res += x * (16 ** c);
        c++;
    }
    return res;
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