import Float from "./Float.mjs";
let float1 = new Float("-819.719", 8, 32);
let float2 = new Float("-771.761", 8, 32);
let float3 = Float.add(float1, float2)

console.log(float1.normalForm);
console.log(float2.normalForm);
console.log(float3.normalForm);
console.log(float3.standartForm);

