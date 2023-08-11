let minhaVariavel = "Olá mundo.";

if (minhaVariavel.endsWith(".")) {
    console.log(true);
    minhaVariavel = minhaVariavel.slice(0, -1);
    console.log(minhaVariavel);
} else {
    console.log(false);
}