var minimumSwitchingTimes = function (
    source = [
        [1, 2, 3, 5, 6, 7, 8, 9],
        [3, 4, 5],
    ],
    target = [
        [1, 3, 5, 1, 3, 2, 4, 5],
        [2, 3, 4],
    ],
) {
    let sourceArr = source.toString().split(",").sort();
    let targetArr = target.toString().split(",").sort();
    let changeCount = 0;
    console.log(sourceArr);
    console.log(targetArr);

    for (let i = 0; i < sourceArr.length; i++) {
        let isIn = targetArr.indexOf(sourceArr[i]);
        if (isIn) {
            targetArr.splice(isIn, 1);
        } else {
            changeCount++;
        }
    }
    console.log(sourceArr);
    console.log(targetArr);
    return changeCount;
};
minimumSwitchingTimes();
