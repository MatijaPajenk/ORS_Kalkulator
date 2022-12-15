let arithmetic_calc = document.getElementById("arithmetic-radio");
let programmer_calc = document.getElementById("programmer-radio");
var display = document.getElementsByName("calc-display");

arithmetic_calc.addEventListener('click', () => {
    document.getElementById("programmer-buttons").hidden = true;
    document.getElementById("arithmetic-buttons").hidden = false;
});

programmer_calc.addEventListener('click', () => {
    document.getElementById("arithmetic-buttons").hidden = true;
    document.getElementById("programmer-buttons").hidden = false;
})

function addBtnValue(val) {
    document.getElementById('calc-display').value += val;
}

function clearDisplay() {
    document.getElementById('calc-display').value = "";
}

function deleteDisplayValue() {
    
}