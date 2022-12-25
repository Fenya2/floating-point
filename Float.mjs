export default class Float
{
    static add(float1, float2)
    {
        if (float1.MANTISSASIZE !== float2.MANTISSASIZE || float1.EXPSIZE !== float2.EXPSIZE)
            return new Float("", 0, 0);
        if (float1.state === "NaN" || float2.state === "NaN")
            return new Float("NaN", float1.EXPSIZE, float1.STANDARTSIZE);
        if (float1.state === "+INFINITY" && float2.state !== "-INFINITY")
            return Object.assign({}, float1);
        if (float1.state === "+INFINITY" && float2.state === "-INFINITY")
            return new Float("NaN", float1.EXPSIZE, float1.STANDARTSIZE);
        if (float2.state === "+INFINITY" && float1.state !== "-INFINITY")
            return Object.assign({}, float2);
        if (float2.state === "+INFINITY" && float1.state === "-INFINITY")
            return new Float("NaN", float1.EXPSIZE, float1.STANDARTSIZE);
        if (float1.state === "-INFINITY" && float2.state !== "+INFINITY")
            return Object.assign({}, float1);
        if (float1.state === "-INFINITY" && float2.state === "+INFINITY")
            return new Float("NaN", float1.EXPSIZE, float1.STANDARTSIZE);
        if (float2.state === "-INFINITY" && float1.state !== "+INFINITY")
            return Object.assign({}, float2);
        if (float2.state === "-INFINITY" && float1.state === "+INFINITY")
            return new Float("NaN", float1.EXPSIZE, float1.STANDARTSIZE);

        if(float1.sign === float2.sign)
        {
            let mantissa1 = float1.standartForm.substr(1 + float1.EXPSIZE, float1.MANTISSASIZE);
            if(float1.state === "NORMALIZED")
                mantissa1 = "1" + mantissa1;
            else
                mantissa1 = "0" + mantissa1;

            let mantissa2 = float2.standartForm.substr(1 + float2.EXPSIZE, float2.MANTISSASIZE);
            if(float2.state === "NORMALIZED")
                mantissa2 = "1" + mantissa2;
            else
                mantissa2 = "0" + mantissa2;


            let exp1 = parseInt(float1.standartForm.substr(1, float1.EXPSIZE), 2);
            let exp2 = parseInt(float2.standartForm.substr(1, float1.EXPSIZE), 2);

            let delta = Math.abs(exp2 - exp1);

            if(exp1 < exp2)
                mantissa1 = mantissa1.substr(0, float1.MANTISSASIZE+1 - delta).padStart(float1.MANTISSASIZE+1, "0");
            else
                mantissa2 = mantissa2.substr(0, float2.MANTISSASIZE+1 - delta).padStart(float2.MANTISSASIZE+1, "0");

            let resSign = float1.standartForm[0];
            let resExp = Math.max(exp1, exp2);
            let resMantissa = (parseInt(mantissa1, 2) + parseInt(mantissa2, 2)).toString(2);
            if(resMantissa.length - float1.MANTISSASIZE === 2) // сложение нормализованных с одинаковыми порядками
            {
                resMantissa = resMantissa.substr(1, float1.MANTISSASIZE);
                resExp++;
            }
            else if (resMantissa.length < float1.MANTISSASIZE ) // сложение денормализованных
                resMantissa = resMantissa.padStart(float1.MANTISSASIZE, "0");
            else if ( resMantissa.length - float1.MANTISSASIZE === 1 && float1.state === "DENORMALIZED" && float2.state === "DENORMALIZED") // условие выхода из денормализованных чисел
            {
                resExp++;
                resMantissa = resMantissa.substr(1, float1.MANTISSASIZE);
            } // сложение нормализованных с разными порядками.
            else
                resMantissa = resMantissa.substr(1, float1.MANTISSASIZE);
            resExp = resExp.toString(2).padStart(float2.EXPSIZE, "0");

            return new Float(resSign+resExp+resMantissa ,float1.EXPSIZE, float1.STANDARTSIZE);
        }
        else
        {
            let float2_sign = float2.standartForm[0];
            if(float2_sign === "1")
                return this.sub(float1, new Float("0" + float2.standartForm.slice(1), float2.EXPSIZE, float2.STANDARTSIZE));
            else
                return this.sub(float2, new Float("0" + float1.standartForm.slice(1), float1.EXPSIZE, float1.STANDARTSIZE));
        }
    }

    static sub(float1, float2) // float1 - float2
    {
        if (float1.MANTISSASIZE !== float2.MANTISSASIZE || float1.EXPSIZE !== float2.EXPSIZE)
            return new Float("", 0, 0);
        if (float1.state === "NaN" || float2.state === "NaN")
            return new Float("NaN", float1.EXPSIZE, float1.STANDARTSIZE);
        if (float1.state === "+INFINITY" && float2.state === "+INFINITY")
            return new Float("NaN", float1.EXPSIZE, float1.STANDARTSIZE);
        if (float1.state === "-INFINITY" && float2.state === "-INFINITY")
            return new Float("NaN", float1.EXPSIZE, float1.STANDARTSIZE);
        if (float1.state === "+INFINITY" && float2.state === "-INFINITY")
            return Object.assign({}, float1);
        if (float1.state === "-INFINITY" && float2.state === "+INFINITY")
            return Object.assign({}, float1);
        if (float1.state === "+INFINITY" && float2.state !== "-INFINITY")
            return Object.assign({}, float1);
        if (float1.state === "-INFINITY" && float2.state !== "+INFINITY")
            return Object.assign({}, float1);
        if (float2.state === "+INFINITY" && float1.state !== "-INFINITY")
            return Object.assign({}, float2);
        if (float2.state === "-INFINITY" && float1.state !== "+INFINITY")
            return Object.assign({}, float2);

        let float1_sign = float1.standartForm[0];
        let float2_sign = float2.standartForm[0];
        if(float1_sign === "1" && float2_sign === "0")
            return this.add(float1, new Float("1"+float2.standartForm.slice(1), float2.EXPSIZE, float2.STANDARTSIZE));
        else if(float1_sign === "0" && float2_sign === "1")
            return this.add(float1, new Float("0"+float2.standartForm.slice(1), float2.EXPSIZE, float2.STANDARTSIZE));

        let mantissa1 = float1.standartForm.substr(1 + float1.EXPSIZE, float1.MANTISSASIZE);
        if(float1.state === "NORMALIZED")
            mantissa1 = "1" + mantissa1;
        else
            mantissa1 = "0" + mantissa1;

        let mantissa2 = float2.standartForm.substr(1 + float2.EXPSIZE, float2.MANTISSASIZE);
        if(float2.state === "NORMALIZED")
            mantissa2 = "1" + mantissa2;
        else
            mantissa2 = "0" + mantissa2;

        let exp1 = parseInt(float1.standartForm.substr(1, float1.EXPSIZE), 2);
        let exp2 = parseInt(float2.standartForm.substr(1, float1.EXPSIZE), 2);

        let delta = Math.abs(exp2 - exp1);

        if(exp1 < exp2)
            mantissa1 = mantissa1.substr(0, float1.MANTISSASIZE+1 - delta).padStart(float1.MANTISSASIZE+1, "0");
        else
            mantissa2 = mantissa2.substr(0, float2.MANTISSASIZE+1 - delta).padStart(float2.MANTISSASIZE+1, "0");

        let resExp = Math.max(exp1, exp2);
        let resMantissa = Math.abs(parseInt(mantissa1, 2) - parseInt(mantissa2, 2));
        if (resMantissa === 0)
            return new Float("0.0", float1.EXPSIZE, float1.STANDARTSIZE);
        resMantissa = resMantissa.toString(2).padStart(float1.MANTISSASIZE+1, "0");
        if(delta !== 0)
            resExp -= resMantissa.indexOf("1");
        else
            resExp -= (resMantissa.indexOf("1"))//+2;

        if(resExp < 0)
            return new Float("0.0", float1.EXPSIZE, float1.STANDARTSIZE);
        resMantissa = resMantissa.slice(resMantissa.indexOf("1")+1).padEnd(float1.MANTISSASIZE, "0");
        resExp = resExp.toString(2).padStart(float1.EXPSIZE, "0");

        let resSign;
        let float1_module = parseInt(float1.standartForm.slice(1) ,2);
        let float2_module = parseInt(float2.standartForm.slice(1) ,2);

        if(float1.sign === "-" && float1_module > float2_module)
            resSign = "1";
        else if(float1.sign === "-" && float1_module < float2_module)
            resSign = "0";
        else if(float1.sign === "+" && float1_module > float2_module)
            resSign = "0";
        else if(float1.sign === "+" && float1_module < float2_module)
            resSign = "1";

        return new Float(resSign+resExp+resMantissa ,float1.EXPSIZE, float1.STANDARTSIZE);
    }





    constructor (num, expSize, size)
    {
        if(!Number.isInteger(expSize) || !Number.isInteger(size))
        {
            console.error("Error. expSize and size must be integer.");
            return {error_status:"Error. expSize and size must be integer."};
        }

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
            this.sign = "+";
            return this;
        }

        let regExp = new RegExp("^[01]"+ "{"+this.STANDARTSIZE.toString()+"}" + "$");

        if(num.match(/^[-+]?[0-9]+[.][0-9]+$/))
        {
            this.normalForm = parseFloat(num);
            this.standartForm = this.convertToStandartForm();
            this.state = this.getState();
            this.sign = this.standartForm[0] === "0" ? "+":"-"; // знак
        }
        else if(num.match(regExp))
        {
            this.standartForm = num;
            this.state = this.getState();
            this.sign = this.standartForm[0] === "0" ? "+":"-"; // знак
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
            case "NORMALIZED":
                exp = 2**(parseInt(this.standartForm.substr(1, this.EXPSIZE),2) - this.BIAS);
                return sign*exp*(1+mantissa);
            case "DENORMALIZED":
                exp = 2**(parseInt(this.standartForm.substr(1, this.EXPSIZE),2) - this.BIAS + 1);
                return sign*exp*mantissa;
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
                return "DENORMALIZED";
            }
            case "1".repeat(this.EXPSIZE):
            {
                if(mantissa === "0".repeat(this.MANTISSASIZE))
                    return sign + "INFINITY";
                return "NaN";
            }
            default:
                return "NORMALIZED";
        }
    }
}