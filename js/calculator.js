export class Calculator {
    constructor(displayElement) {
        this._expression = '0';
        this._context = '';
        this._memory = 0;
        this._buffer = null; // Додаємо буфер
        this._history = []; // Додаємо історію обчислень
        this._historyIndex = -1; // Додаємо індекс історії
        this.display = displayElement;
        this.updateDisplay();
    }

    get expression() {
        return this._expression;
    }

    set expression(value) {
        if (typeof value !== 'string') throw new TypeError('Expression must be a string');
        this._expression = value;
        this.updateDisplay();
    }

    get context() {
        return this._context;
    }

    set context(value) {
        if (typeof value !== 'string') throw new TypeError('Context must be a string');
        this._context = value;
    }

    updateDisplay() {
        this.display.textContent = this._expression;
    }

    insert(num) {
        if (this._expression === '0') {
            this._expression = '';
        }
        this._expression += num;
        this.updateDisplay();
    }

    clean() {
        this._expression = '0';
        this._context = '';
        this.updateDisplay();
    }

    equal() {
        try {
            let expr = this._expression;

            expr = expr.replace(/(\d+(?:\.\d+)?|\([^\)]+\))\^\(([^)]+)\)/g, 'Math.pow($1,$2)');

            expr = expr.replace(/(\d+(?:\.\d+)?)\^(\d+(?:\.\d+)?)/g, 'Math.pow($1,$2)');

            const result = eval(expr);
            this._expression = result.toString();
            this._history.push(this._expression); // Додаємо результат до історії
            this._historyIndex = this._history.length - 1;
        } catch (e) {
            this._expression = 'Error';
        }
        this.updateDisplay();
    }


    back() {
        if (this._expression.length <= 1 || this._expression === '0') {
            this._expression = '0';
        } else {
            this._expression = this._expression.slice(0, -1);
        }
        this.updateDisplay();
    }

    percent() {
        try {
            this._expression = (eval(this._expression) / 100).toString();
        } catch {
            this._expression = 'Error';
        }
        this.updateDisplay();
    }

    degree(name) {
        try {
            if (name === '^') {
                this._expression += '^(';
            } else if (name === 'sqrt') {
                const result = Math.sqrt(this._expression);
                this._expression = result.toString();
            } else {
                throw new Error(`Unknown operation: ${name}`);
            }
        } catch {
            this._expression = 'Error';
        }
        this.updateDisplay();
    }

    fact() {
        const factorial = function (n) {
            if (n < 0 || !Number.isInteger(n)) throw new Error('Invalid input');
            return n <= 1 ? 1 : n * factorial(n - 1);
        };

        try {
            const value = +eval(this._expression);
            this._expression = factorial(value).toString();
        } catch {
            this._expression = 'Error';
        }
        this.updateDisplay();
    }

    trigonometry(name) {
        try {
            let value = +eval(this._expression);

            let result;
            switch (name) {
                case 'sin':
                    result = Math.sin(value);
                    break;
                case 'cos':
                    result = Math.cos(value);
                    break;
                case 'tan':
                    result = Math.tan(value);
                    break;
                case 'ctg':
                    const tan = Math.tan(value);
                    if (tan === 0) throw new Error('Cotangent undefined');
                    result = 1 / tan;
                    break;
                default:
                    throw new Error(`Unknown trig function: ${name}`);
            }

            this._expression = Number(result.toFixed(8)).toString();
        } catch {
            this._expression = 'Error';
        }
        this.updateDisplay();
    }

    memoryClear() { this._memory = 0; }
    memoryRecall() { this._expression = this._memory.toString(); this.updateDisplay(); }
    memoryAdd() {
        try { this._memory += parseFloat(eval(this._expression)); }
        catch { this._expression = 'Error'; }
    }
    memorySubtract() {
        try { this._memory -= parseFloat(eval(this._expression)); }
        catch { this._expression = 'Error'; }
    }

    copyHistory(index) {
        if (index >= 0 && index < this._history.length) {
            this._buffer = this._history[index];
        }
    }

    pasteFromBuffer() {
        if (this._buffer !== null) {
            this._expression += this._buffer;
            this.updateDisplay();
        }
    }

    historyPrevious() {
        if (this._historyIndex > 0) {
            this._historyIndex--;
            this._expression = this._history[this._historyIndex];
            this.updateDisplay();
        }
    }

    historyNext() {
        if (this._historyIndex < this._history.length - 1 && this._historyIndex >= 0) {
            this._historyIndex++;
            this._expression = this._history[this._historyIndex];
            this.updateDisplay();
        }
    }

    showHistoryList() {
        const historyList = document.createElement('ul');
        historyList.style.position = 'absolute';
        historyList.style.background = 'white';
        historyList.style.border = '1px solid black';
        historyList.style.listStyleType = 'none';
        historyList.style.padding = '0';
        historyList.style.margin = '0';

        this._history.forEach((item, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = item;
            listItem.style.padding = '5px';
            listItem.style.cursor = 'pointer';

            listItem.addEventListener('click', () => {
                this._expression += item;
                this.updateDisplay();
                document.body.removeChild(historyList);
            });

            historyList.appendChild(listItem);
        });

        document.body.appendChild(historyList);
    }

    convertUnits(value, from, to, type) {
        const conversionRates = {
            length: { m: 1, cm: 100, mm: 1000, km: 0.001, in: 39.3701, ft: 3.28084 },
            weights: { kg: 1, g: 1000, mg: 1e6, lb: 2.20462 },
            area: { m2: 1, cm2: 10000, mm2: 1e6, km2: 0.000001 },
            num_sys: { bin: 2, oct: 8, dec: 10, hex: 16 }
        };

        try {
            if (type === 'num_sys') {
                return parseInt(value, conversionRates[from]).toString(conversionRates[to]);
            }
            const baseValue = parseFloat(value) / conversionRates[type][from];
            const convertedValue = baseValue * conversionRates[type][to];
            return +convertedValue.toFixed(6);
        } catch {
            return 'Error';
        }
    }
}