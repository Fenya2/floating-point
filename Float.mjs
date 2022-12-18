export default class Float
{
    constructor (num, expSize, size)
    {
        this.STANDARTSIZE = size;
        this.EXPSIZE = expSize;
        this.MANTISSASIZE = this.STANDARTSIZE - (this.EXPSIZE + 1); // + sign

        if(this.MANTISSASIZE < 2 || this.EXPSIZE < 2)
        {
            console.error("Error. number of bits for exponent and mantissa must be more than 2 (including sign).");
            return {error_status:"Error. number of bits for exponent and mantissa must be more than 2 (including sign)."};
        }

        this.STANDARTNaN = "0" + "1".repeat(this.EXPSIZE) + "1".repeat(this.MANTISSASIZE);
        this.PINFINITY = "0" + "1".repeat(this.EXPSIZE) + "0".repeat(this.MANTISSASIZE);
        this.MINFINITY = "1" + "1".repeat(this.EXPSIZE) + "0".repeat(this.MANTISSASIZE);
        this.PZERO = "0".repeat(this.STANDARTSIZE);
        this.MZERO = "1" + "0".repeat(this.STANDARTSIZE - 1);
        this.BIAS = 2**(this.EXPSIZE-1) - 1; // минус один определяет стандарт.

        if(isNaN(num))
        {
            this.normalForm = NaN;
            this.standartForm = this.STANDARTNaN;
            this.state = "NaN";
            return this;
        }

        if(Number(num) === 0)
        {
            this.normalForm = "0";
            this.standartForm = this.PZERO;
            this.state = "+ZERO";
            return this;
        }

        let regExp = new RegExp("^[01]"+ "{"+this.STANDARTSIZE.toString()+"}" + "$");

        if(num.match(/^[-+]?[0-9]+[.][0-9]+$/))
        {
            this.normalForm = parseFloat(num);
            this.standartForm = this.convertToStandartForm();
            this.state = this.getState();
        }
        else if(num.match(regExp))
        {
            this.standartForm = num;
            this.state = this.getState();
            this.normalForm = this.convertToDecimal();
        }
        else
        {
            console.error("Error. number must have type of /^[-+]?[0-9]+[.][0-9]+$/");
            return {error_status:"Error. number must have type of /^[-+]?[0-9]+[.][0-9]+$/"};
        }
    }

    convertToDecimal()
    {
        let sign = this.standartForm[0] === "0" ? 1:-1; // знак
        let exp;
        let mantissa = (parseInt("0" + this.standartForm.substr(1 + this.EXPSIZE, this.MANTISSASIZE), 2))/(2**this.MANTISSASIZE);

        switch (this.state)
        {
            case "+ZERO":
            case "-ZERO":
                return 0;
            case "+INFINITY":
                return Number.POSITIVE_INFINITY;
            case "-INFINITY":
                return Number.NEGATIVE_INFINITY;
            case "+NORMALIZED":
            case "-NORMALIZED":
                exp = 2**(parseInt(this.standartForm.substr(1, this.EXPSIZE),2) - this.BIAS);
                return sign*exp*(1+mantissa);
            case "+DENORMALIZED":
            case "-DENORMALIZED":
                exp = 2**(parseInt(this.standartForm.substr(1, this.EXPSIZE),2) - this.BIAS + 1);
                return sign*exp*(mantissa);
        }
    }

    convertToStandartForm()
    {
        let sign = this.normalForm.toString()[0] === "-" ? "1":"0"; // 1. узнаем знак.

        let binaryForm = this.normalForm.toString(2);
        if(binaryForm.indexOf(".") === -1)
            binaryForm+=".0";
        let exp = binaryForm.indexOf(".") >= binaryForm.indexOf("1") ? // 3. Находим сегмент, в котором находится число
            binaryForm.indexOf(".") - binaryForm.indexOf("1") - 1 :    // (переносим запятую настолько, чтобы преобразовать число к научной записи.)
            binaryForm.indexOf(".") - binaryForm.indexOf("1");
        exp += this.BIAS // осуществляем смещение.
        if(exp >= 2**this.EXPSIZE - 1) // если больше или равен размеру формата - бесконечность
        {
            switch (sign)
            {
                case "0": return this.PINFINITY;
                case "1": return this.MINFINITY;
            }
        }
        else if (exp < 0) // если меньше - 0
        {
            switch (sign)
            {
                case "0": return this.PZERO;
                case "1": return this.MZERO;
            }
        }
        else // иначе просто число (нормализованное или нет)
        {
            binaryForm = binaryForm.replace(".", "");
            return sign + exp.toString(2).padStart(this.EXPSIZE, "0") + binaryForm.substr(binaryForm.indexOf("1") + 1, this.MANTISSASIZE).padEnd(this.MANTISSASIZE, "0");
        }
    }

    getState()
    {
        let sign = this.standartForm[0] === "0" ? "+":"-"; // знак
        let exp = this.standartForm.substr(1, this.EXPSIZE);
        let mantissa = this.standartForm.substr(1 + this.EXPSIZE, this.MANTISSASIZE);
        switch (exp)
        {
            case "0".repeat(this.EXPSIZE):
            {
                if(mantissa === "0".repeat(this.MANTISSASIZE))
                    return sign + "ZERO";
                return sign + "DENORMALIZED";
            }
            case "1".repeat(this.EXPSIZE):
            {
                if(mantissa === "0".repeat(this.MANTISSASIZE))
                    return sign + "INFINITY";
                return "NaN";
            }
            default:
                return sign + "NORMALIZED";
        }
    }
}