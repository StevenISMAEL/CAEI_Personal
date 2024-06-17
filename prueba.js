function funcion1(n) {
    if (n > 2) {
        return n - 1;
    } else {
        return funcion2(n + 2);
    }
}

function funcion2(n) {
    if (n > 2) {
        return n - 1;
    } else {
        return funcion2(funcion2(n + 2));
    }
}

console.log(funcion1(3));
console.log(funcion2(3));
