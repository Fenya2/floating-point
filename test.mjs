import Float from "./Float.mjs";

switch (process.argv[2])
{
    case 'convert':
    {
        console.log(new Float(process.argv[3], 8, 32).standartForm);
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
    case '--help':
    case '-h':
    case '/?':
    {
        console.log("Usage: node convert 'float'");
        console.log("Usage: node add 'float1' 'float2'.\n only for same signs yet.");
        break;
    }
    default:
    {
        console.log("Error");
        break;
    }
}