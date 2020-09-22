const memoryOperandPendingOperation = '';
const currentOperand = 0;
const currentOperation = '';
const calculatorGrid = document.querySelector('.calculator-grid');
const outputDisplayCurrentOperand = document.querySelector('.current-operand');
const outputDisplayPreviousOperand = document.querySelector('.previous-operand');

const inputNumber = (number) => {
  console.log('Input number: ', number)
}

const choiceOperation = (operationName) => {
  console.log('Choise operation: ', operationName)
}

const clear = () => {
  console.log('clear')
}

const calculate = () => {
  console.log('calculate')
}

const deleteNumber = () => {
  console.log('delete')
}

const inputPoint = () => {
  console.log('input point')
}

calculatorGrid.addEventListener('click', (evt) => {
  const btnType = evt.target.dataset.type
  const btnValue = evt.target.dataset.value

  switch (btnType) {
    case 'number':
      inputNumber(btnValue)
      break;
    case 'operation':
      choiceOperation(btnValue)
      break;
    case 'equals':
      calculate ()
      break;
    case 'all-clear':
      clear()
      break;
    case 'delete':
      deleteNumber()
      break;
    case 'point':
      inputPoint()
      break;
    default:
      return;
  }
})