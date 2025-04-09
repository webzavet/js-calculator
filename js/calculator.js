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

    convertUnits(value, from, to, type) {
        const conversionRates = {
            length: { m: 1, cm: 100, mm: 1000, km: 0.001, in: 39.3701, ft: 3.28084 },
            weights: { kg: 1, g: 1000, mg: 1000000, lb: 2.20462 },
            area: { m2: 1, cm2: 10000, mm2: 1e6, km2: 0.000001, ft2: 10.7639, in2: 1550 },
            num_sys: { bin: 2, oct: 8, dec: 10, hex: 16 }
        };

        try {
            if (type === 'num_sys') {
                const fromBase = conversionRates.num_sys[from];
                const toBase = conversionRates.num_sys[to];
                return parseInt(value, fromBase).toString(toBase).toUpperCase();
            }

            const fromRate = conversionRates[type][from];
            const toRate = conversionRates[type][to];

            if (isNaN(fromRate) || isNaN(toRate)) {
                return 'Error: Invalid unit';
            }

            const baseValue = parseFloat(value) / fromRate;
            const convertedValue = baseValue * toRate;
            return +convertedValue.toFixed(6);
        } catch {
            return 'Error';
        }
    }


    handleUnitConversion(type, fromSelect, toSelect) {
        const unitTypes = {
            length: ['m', 'cm', 'mm', 'km', 'in', 'ft', 'yd', 'mi'],
            weights: ['kg', 'g', 'mg', 'lb', 'oz'],
            area: ['m2', 'cm2', 'mm2', 'km2', 'ft2', 'in2'],
            num_sys: ['bin', 'oct', 'dec', 'hex']
        };

        // Заповнюємо списки from/to
        fromSelect.innerHTML = `<option value="" disabled selected>from:</option>`;
        toSelect.innerHTML = `<option value="" disabled selected>to:</option>`;
        unitTypes[type].forEach(unit => {
            fromSelect.appendChild(new Option(unit, unit));
            toSelect.appendChild(new Option(unit, unit));
        });

        fromSelect.dataset.type = type;
        toSelect.dataset.type = type;

        // Додаємо обробники зміни значення
        const performConversion = () => {
            const from = fromSelect.value;
            const to = toSelect.value;
            const selectedType = fromSelect.dataset.type;

            if (from && to && selectedType) {
                let value = this.expression;

                if (selectedType === 'num_sys') {
                    const fromBase =  this.getBase(from);
                    const regexMap = {
                        2: /^[01]+$/,
                        8: /^[0-7]+$/,
                        10: /^\d+$/,
                        16: /^[0-9A-Fa-f]+$/
                    };

                    const regex = regexMap[fromBase];
                    if (!regex.test(value)) {
                        this.expression = 'Error: Invalid input for base ' + fromBase;
                        return;
                    }
                }

                const result = this.convertUnits(value, from, to, selectedType);
                this.expression = result.toString();
            }
        };

        fromSelect.addEventListener('change', performConversion);
        toSelect.addEventListener('change', performConversion);
    }

    getBase(unit) {
        const bases = { bin: 2, oct: 8, dec: 10, hex: 16 };
        return bases[unit];
    }


    renderHistory(calculator) {
        if (calculator._history.length > 7) {
            calculator._history = calculator._history.slice(-7);
        }

        const items = document.querySelectorAll('.item.buffer');
        items.forEach(item => {
            item.textContent = '';
            item.replaceWith(item.cloneNode(true)); // Скидаємо попередні слухачі
        });

        const freshItems = document.querySelectorAll('.item.buffer');

        calculator._history.forEach((text, i) => {
            const index = freshItems.length - calculator._history.length + i;
            if (freshItems[index]) {
                freshItems[index].textContent = text;
                freshItems[index].addEventListener('click', () => {
                    calculator.expression += text;
                });
            }
        });
    }

}