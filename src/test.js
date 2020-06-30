const absBaseLog = (x, y) => Math.abs(Math.log(y) / Math.log(x));

Number.prototype.commafy = function () {
    return String(this).commafy();
}

String.prototype.commafy = function () {
    return this.replace(/(^|[^\w.])(\d{4,})/g, function (_$0, $1, $2) {
        return $1 + $2.replace(/\d(?=(?:\d\d\d)+(?!\d))/g, "$&,");
    });
}

for (let i = 0; i <= 100000000; i += 5000000) {
    const consumption = Math.floor(i * (2 + absBaseLog(10, absBaseLog(10, absBaseLog(3, i))))) || 0;
    console.log(`${i.commafy()}: ${consumption.commafy()} food`)
}