import Float from "./Float.mjs";

switch (process.argv[2])
{
    case 'convert':
    {
        let float = new Float(process.argv[3], 8, 32);
        console.log(float.standartForm);
        break;
    }
    case 'add':
    {
        let float1 = new Float(process.argv[3], 8, 32);
        let float2 = new Float(process.argv[4], 8, 32);
        let float3 = Float.add(float1, float2);
        console.log(float3.standartForm);
        console.log(float3.normalForm);
        break;
    }
    case 'sub':
    {
        let float1 = new Float(process.argv[3], 8, 32);
        let float2 = new Float(process.argv[4], 8, 32);
        let float3 = Float.sub(float1, float2);
        console.log(float3.standartForm);
        console.log(float3.normalForm);
        break;
    }
    case '--help':
    case '-h':
    case '/?':
    {
        console.log("Usage: node IEEE754 convert 'float'");
        console.log("OR: node IEEE754 add 'float1' 'float2'");
        console.log("OR: node IEEE754 sub 'float1' 'float2'");
        break;
    }
    default:
    {
        console.log("Type error. Type node IEEE754 --help for info");
        break;
    }
}