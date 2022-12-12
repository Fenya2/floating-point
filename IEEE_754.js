//let num = process.argv[2].toString();
let num = "-0.00";
//  /^[-+]?[0-9]*[.,]?[0-9]+(?:[eE][-+]?[0-9]+)?$/
try
{
    if(!num.match(/^[-+]?[0-9]+[.][0-9]+$/))
        throw new TypeError("arg must be number of type: [-+]?[0-9]+[.][0-9]+ ");
} catch (e)
{
    console.error(e.message);
    process.exit(1);
}

if(Number(num).toString(2) === "0")
{
    if(num[0] === "-")
        console.log("1"+"0".repeat(31));
    else
        console.log("0".repeat(32));
    process.exit(0);
}



let res = [];
num = [].concat(num.split("."));
let integer_part = Number(num[0]).toString(2).split("");
switch (integer_part[0]) // определили знак.
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
let offset = (integer_part.length - mantissa.indexOf('1') - 1 + 127).toString(2).padStart(8, "0").split(""); // todo сделать проверку на все нули.

mantissa = mantissa.join("").substr(mantissa.indexOf("1"), 24).split("");
mantissa.shift();
res = res.concat(offset).concat(mantissa);
//console.log(offset.join(""), mantissa.join(""));
console.log(res.join(""));

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

// 101000111101011100001010
// 10100011110101110