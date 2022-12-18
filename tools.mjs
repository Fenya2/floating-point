export function convert_to_IEEE754(num)
{
    if(!num.match(/^[-+]?[0-9]+[.][0-9]+$/))
        return "0"+"1".repeat(9)+"0".repeat(22);

    if(Number(num).toString(2) === "0")
    {
        if(num[0] === "-")
            return "1"+"0".repeat(31);
        else
            return "0".repeat(32);
    }

    if(Number(num).toString(2) === "0")
    {
        if(num[0] === "-")
            return "1"+"0".repeat(31);
        else
            return "0".repeat(32);
    }

    let res = [];
    num = [].concat(num.split("."));
    let integer_part = Number(num[0]).toString(2).split("");
    switch (integer_part[0])
    {
        case '-':
            res.push(1);
            integer_part.shift();
            break;
        case '+':
            res.push(0);
            integer_part.shift();
            break;
        default:
            res.push(0);
    }
    let fractional_part = num[1] === "0" ? new Array(100).fill("0") : fractionToBinary(Number("0."+num[1]), 100);
    let mantissa = [].concat(integer_part).concat(fractional_part);

    let offset = (integer_part.length - mantissa.indexOf('1') - 1 + 127);
    if(offset >= 255)
        return res[0]+"1".repeat(8)+"0".repeat(23);

    else if (offset - 127 < -126 )
    {
        if(offset - 127 < -149)
            return res[0] + "0".repeat(8) + "0".repeat(22) + "1";
        return res[0] + "0".repeat(8) + "0".repeat(149 - Math.abs(offset - 127)) + mantissa.join("").substr(mantissa.indexOf("1"), 23 - (149 - Math.abs(offset - 127))).split("");
    }

    offset = offset.toString(2).toString(2).padStart(8, "0").split("");
    mantissa = mantissa.join("").substr(mantissa.indexOf("1"), 24).split("");
    mantissa.shift();
    res = res.concat(offset).concat(mantissa);
    return  res.join("");

    function fractionToBinary(num, accuracy) // todo ноль для этой функции должен быть исключен.
    {
        let res = [];
        let fui = -1;

        while( fui === -1 || res.slice(fui).length <= accuracy )
        {
            num*=2;
            res.push((num ^ 0).toString());
            if(num >= 1)
                num--;
            if(fui === -1)
                fui = res[res.length-1] === "1" ? res.length-1 : -1;
        }
        return res;
    }
}

export function converToDecimal(IEEE_754)
{
    let sign = parseInt(IEEE_754[0],2) === 0? 1 : -1;
    let exp = 2**(parseInt(IEEE_754.slice(1, 9),2) - 127);
    let mantissa = 1 + (parseInt(IEEE_754.slice(9, 32), 2))/(2**23);
    console.log(sign, exp, mantissa);
    return sign*exp*mantissa;
}
