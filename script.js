let fitstOperand = '';
let currentOperand = '0';
let currentOperation = '';
let error = false;

const calculatorGrid = document.querySelector('.calculator-grid')
const mainDisplay = document.querySelector('.current-operand')
const secondDisplay = document.querySelector('.previous-operand')
const displayError = document.querySelector('.error');

const showToMainDisplay = str => mainDisplay.textContent = str
const showToSecondDisplay = str => secondDisplay.textContent = str

const showError = (msg) => {
  error = true;
  displayError.textContent = msg;
  displayError.classList.add('show');
}

const hideError = () => {
  error = false;
  displayError.textContent = '';
  displayError.classList.remove('show')
}

const inputNumber = (number) => {
  currentOperand = (currentOperand.toString() === '0')
    ? number
    : currentOperand.toString() + number.toString()
  showToMainDisplay(currentOperand)
}

const choiceOperation = (operationName) => {
  if (operationName === '-' && currentOperand === '0') {
    currentOperand = '-'
    showToMainDisplay(currentOperand)
  } else if (fitstOperand && currentOperation) {
    currentOperation = operationName
    fitstOperand = calculate()
    currentOperand = '0'
    showToMainDisplay(currentOperand.toString())
    showToSecondDisplay(`${fitstOperand} ${currentOperation}`)
  } else {
    currentOperation = operationName
    fitstOperand = currentOperand
    currentOperand = '0'
    showToSecondDisplay(`${fitstOperand} ${currentOperation}`)
    showToMainDisplay(currentOperand)
  }
}

const clear = () => {
  memoryOperandPendingOperation = ''
  currentOperand = '0'
  currentOperation = ''
  showToMainDisplay(currentOperand)
  showToSecondDisplay('')
}

const calculate = () => {
  if (fitstOperand === '' || currentOperand === '0' || currentOperation === '') {
    return false
  }
  let result
  switch(currentOperation) {
    case '-':
      result = Number(fitstOperand) - Number(currentOperand)
      break
    case '/':
      result = Number(fitstOperand) / Number(currentOperand)
      break
    case '*':
      result = Number(fitstOperand) * Number(currentOperand)
      break
    case '+':
      result = Number(fitstOperand) + Number(currentOperand)
      break
    default:
      break
  }

  return result
}

const deleteNumber = () => {
  currentOperand = currentOperand.length === 1
    ? '0'
    : currentOperand.substring(0, currentOperand.length - 1)
  showToMainDisplay(currentOperand)
}

const inputPoint = () => {
  if (!currentOperand.toString().includes('.')) {
    currentOperand = currentOperand.toString() + '.'
    showToMainDisplay(currentOperand)
  }
}

const equals = () => {
  if (fitstOperand && currentOperation && currentOperand !== '0') {
    currentOperand = calculate()
    fitstOperand = ''
    currentOperation = ''
    showToMainDisplay(currentOperand.toString())
    showToSecondDisplay('')
  }
}

showToMainDisplay(currentOperand)


calculatorGrid.addEventListener('click', (evt) => {
  const btnType = evt.target.dataset.type
  const btnValue = evt.target.dataset.value

  if (error) hideError();

  switch(btnType) {
    case 'number':
      inputNumber(btnValue)
      break
    case 'operation':
      choiceOperation(btnValue)
      break
    case 'equals':
      equals()
      break
    case 'all-clear':
      clear()
      break
    case 'delete':
      deleteNumber()
      break
    case 'point':
      inputPoint()
      break
    default:
      return
  }
})

document.addEventListener('keydown', function(event) {

  if (error) hideError();

  if (event.key >= 0 && event.key <= 9) {
    inputNumber(event.key)
  }
  if (event.key.toLowerCase() === 'enter' || event.key === '=') {
    equals()
  }
  if (['+', '-', '/', '*'].includes(event.key)) {
    choiceOperation(event.key)
  }
  if (event.key.toLowerCase() === 'delete') {
    deleteNumber()
  }
  if (event.key === '.') {
    inputPoint()
  }
})