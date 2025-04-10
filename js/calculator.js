export class Calculator {
    constructor(displayElement) {
        this._expression = '0';
        this._context = '';
        this._memory = 0;
        this._history = [];
        this.display = displayElement;
        this.updateDisplay();
        this._originalInput = '';
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
            this._history.push(this._expression);
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

    insertConstant(name) {
        switch (name) {
            case 'PI':
                this.insert(Math.PI.toString());
                break;
            case 'E':
                this.insert(Math.E.toString());
                break;
            default:
                this.insert('0');
        }
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
            length: {
                m: 1, cm: 0.01, mm: 0.001, km: 1000,
                in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.34
            },
            weights: {
                kg: 1, g: 0.001, mg: 0.000001,
                lb: 0.453592, oz: 0.0283495
            },
            area: {
                m2: 1, cm2: 0.0001, mm2: 0.000001,
                km2: 1e6, ft2: 0.092903, in2: 0.00064516
            },
            num_sys: {
                bin: 2, oct: 8, dec: 10, hex: 16
            }
        };

        try {
            if (type === 'num_sys') {
                const fromBase = conversionRates.num_sys[from];
                const toBase = conversionRates.num_sys[to];
                return parseInt(value, fromBase).toString(toBase).toUpperCase();
            }

            const fromRate = conversionRates[type]?.[from];
            const toRate = conversionRates[type]?.[to];

            if (!fromRate || !toRate || isNaN(parseFloat(value))) {
                return 'Error: Invalid unit or input';
            }

            const baseValue = parseFloat(value) * fromRate;
            const convertedValue = baseValue / toRate;
            return +convertedValue.toFixed(6);
        } catch (e) {
            return 'Error';
        }
    }

    handleUnitConversion(type, fromSelect, toSelect, inputElement) {
        const unitTypes = {
            length: ['m', 'cm', 'mm', 'km', 'in', 'ft', 'yd', 'mi'],
            weights: ['kg', 'g', 'mg', 'lb', 'oz'],
            area: ['m2', 'cm2', 'mm2', 'km2', 'ft2', 'in2'],
            num_sys: ['bin', 'oct', 'dec', 'hex']
        };

        fromSelect.innerHTML = `<option value="" disabled selected>from:</option>`;
        toSelect.innerHTML = `<option value="" disabled selected>to:</option>`;
        unitTypes[type].forEach(unit => {
            fromSelect.appendChild(new Option(unit, unit));
            toSelect.appendChild(new Option(unit, unit));
        });

        fromSelect.dataset.type = type;
        toSelect.dataset.type = type;

        const updateOriginal = () => {
            this._originalInput = inputElement.textContent.trim();
        };

        const performConversion = () => {
            const from = fromSelect.value;
            const to = toSelect.value;
            const selectedType = fromSelect.dataset.type;
            const value = this._originalInput || inputElement.textContent.trim();

            if (from && to && selectedType) {
                if (selectedType === 'num_sys') {
                    const fromBase = this.getBase(from);
                    const regexMap = {
                        2: /^[01]+$/,
                        8: /^[0-7]+$/,
                        10: /^\d+$/,
                        16: /^[0-9A-Fa-f]+$/
                    };

                    const regex = regexMap[fromBase];
                    if (!regex.test(value)) {
                        this.display.textContent = 'Error: Invalid input for base ' + fromBase;
                        return;
                    }
                }

                const result = this.convertUnits(value, from, to, selectedType);
                this.display.textContent = result.toString();
            }
        };

        inputElement.addEventListener('input', () => {
            updateOriginal();
            performConversion();
        });

        fromSelect.addEventListener('change', performConversion);
        toSelect.addEventListener('change', performConversion);

        updateOriginal();
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

        // Скидаємо старі події й очищаємо
        items.forEach(item => {
            item.textContent = '';
            const newItem = item.cloneNode(true);
            item.replaceWith(newItem);
        });

        const freshItems = document.querySelectorAll('.item.buffer');

        calculator._history.forEach((text, i) => {
            const index = freshItems.length - calculator._history.length + i;
            if (freshItems[index]) {
                const displayText = text.length > 4 ? text.slice(0, 4) + '…' : text;
                freshItems[index].textContent = displayText;
                freshItems[index].dataset.fullValue = text;

                freshItems[index].addEventListener('click', () => {
                    calculator.expression += freshItems[index].dataset.fullValue;
                });
            }
        });
    }


}