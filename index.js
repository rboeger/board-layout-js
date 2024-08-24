"use strict";

// global variables
let xDistance = 0;
let yDistance = 0;
let distanceAdded = 0;
let lengthPosition = 0;

// runs when page loads
window.onload = () => {
    createEmptyRows();
    loadEventAssignments();
}

// assign functions to events
function loadEventAssignments() {
    // const csv = require('jquery-csv.js');
    const calcButton = document.getElementById("calc-button");
    const woodPipesCheck = document.getElementById("woodPipes");
    const minusLengthButton = document.getElementById("minus-length");
    const plusLengthButton = document.getElementById("plus-length");
    const minusWidthButton = document.getElementById("minus-width");
    const plusWidthButton = document.getElementById("plus-width");
    const helpButton = document.getElementById("help-button-1");
    const modalBlur = document.getElementById("modal-blur");
    const exportCSVButton = document.getElementById("export-csv-button");
    const importCSVButton = document.getElementById("import-csv-button");
    const clearAllButton = document.getElementById('clear-all-button');

    calcButton.addEventListener("click", onCalculateClick);
    woodPipesCheck.addEventListener("click", onWoodPipesClick);
    minusLengthButton.addEventListener("click", decreaseLength);
    plusLengthButton.addEventListener("click", increaseLength);
    minusWidthButton.addEventListener("click", decreaseWidth);
    plusWidthButton.addEventListener("click", increaseWidth);
    helpButton.addEventListener("click", onHelpClick);
    modalBlur.addEventListener("click", outsideModalClick);
    exportCSVButton.addEventListener('click', initiateDownload, false); 
    clearAllButton.addEventListener('click', clearAll);
    
    // load the file selector window
    importCSVButton.addEventListener("click", () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.onchange = () => {
            const file = input.files[0];
            if (file) {
                let reader = new FileReader();
                reader.readAsText(file, "UTF-8");
                reader.onload = (evt) => {
                    // all functions that use the parsed data need to be in this function
                    // because onload is asynchronous
                    const readData = (evt.target.result);
                    // convert from text to array
                    const lineSplitData = readData.split('\n'); // split by lines
                    // split by commas
                    const commaSplitData = lineSplitData.map((el) => el.split(','));

                    console.log(commaSplitData);
                    csvDataToInputs(commaSplitData);
                };

                reader.onerror = () => {
                    alert("Error reading file!");
                };
            }
        };
        input.click();
    });
}

// convert string to boolean
const isTrue = (string) => {
    return (string === "true");
}

const csvDataToInputs = (data) => {
    // data is an array parsed from the csv
    document.getElementById('jobName').value = data[0][1];
    document.getElementById('rankName').value = data[1][1];
    document.getElementById('sideRoom').value = data[2][1];
    document.getElementById('endRoom').value = data[3][1];
    const woodPipesCheck = document.getElementById('woodPipes');
    console.log(Boolean(data[4][1]));
    if (isTrue(data[4][1]) !== woodPipesCheck.checked) {
        woodPipesCheck.click();
    }
    document.getElementById('woodDepth1').value = data[5][1];
    document.getElementById('woodDepth2').value = data[6][1];
    const singleBassCheck = document.getElementById('singleBass');
    if (isTrue(data[7][1]) !== singleBassCheck.checked) {
        singleBassCheck.click();
    }
    document.getElementById('bassNum').value = data[8][1];
    const pipeValues = document.getElementsByClassName('td-editable');
    for (let i = 0; i < pipeValues.length; i++) {
        const iValue = i + 9;
        pipeValues[i].innerText = data[iValue][1];
    }
};

const clearAll = () => {
    // clear all inputs
    document.getElementById('jobName').value = "";
    document.getElementById('rankName').value = "";
    document.getElementById('sideRoom').value = "";
    document.getElementById('endRoom').value = "";
    document.getElementById('woodPipes').checked = false;
    document.getElementById('woodDepth1').value = "";
    document.getElementById('woodDepth2').value = "";
    document.getElementById('singleBass').checked = false;
    document.getElementById('bassNum').value = "";
    const pipeValues = document.getElementsByClassName('td-editable');
    for (let i = 0; i < pipeValues.length; i++) {
        pipeValues[i].innerText = "";
        
    }
    console.log(Array(73).fill(""));
    //showResults('result-table', 1, Array(73).fill(""), Array(73).fill(""));

};

const onHelpClick = () => {
    const modal = document.getElementById("help-modal");
    const modalBlur = document.getElementById("modal-blur");

    if (modal.style.opacity == 0) {
        modal.style.opacity = 1;
        modal.style.left = "30vw";
        modalBlur.style.opacity = 1;
        modalBlur.style.left = 0;
    } else {
        modal.style.opacity = 0;
        modal.style.left = "-999rem";
        modalBlur.style.opacity = 0;
        modalBlur.style.left = "-999rem";
    }
};

const outsideModalClick = () => {
    const modal = document.getElementById("help-modal");
    const modalBlur = document.getElementById("modal-blur");
    modal.style.opacity = 0;
    modal.style.left = "-999rem";
    modalBlur.style.opacity = 0;
    modalBlur.style.left = "-999rem";
};

const onWoodPipesClick = () => {
    if (woodPipes.checked == true) {
        woodDepth1.disabled = false;
        woodDepth2.disabled = false;
    } else {
        woodDepth1.disabled = true;
        woodDepth2.disabled = true;
    }
};

const onBassPipesClick = () => {
    bassNum.disabled = singleBass.checked ? false : true;
};

const createEmptyRows = () => {
    for (let i = 0; i < 73; i++) {
        createNewRow("pipe-table", getTableRowNum("pipe-table") + 1, "");
        createNewRow("result-table", getTableRowNum("result-section") + 1, "");
    }
    makeColumnEditable("pipe-table", 1);
};

const getTableRowNum = (tableId) => {
    const table = document.getElementById(tableId);
    const rows = table.getElementsByTagName("tr");
    const rowCount = rows.length - 1;
    return parseInt(rowCount);
};

const createNewRow = (tableId, ...cellValues) => {
    const table = document.getElementById(tableId);
    const newRow = table.insertRow(-1);
    let cellCount = 0;

    for (const cell of cellValues) {
        const newCell = newRow.insertCell(cellCount);
        newCell.innerHTML = cell;
        cellCount++;
    }
};

const makeColumnEditable = (tableId, colNum) => {
    const table = document.getElementById(tableId);
    const rows = table.getElementsByTagName("tr");

    for (let i = 1; i < rows.length; i++) {
        const currRow = rows[i];
        const cell = currRow.getElementsByTagName("td");
        cell[colNum].contentEditable = true;
        cell[colNum].className = "td-editable";
    }
};

const calculate = () => {
    const pipeSizes = getDataFromTableColumn("pipe-table", 1);
    fillInBlanks();
    showResults(
        "result-table",
        1,
        getYValueList(getConvertedPipeSizes(pipeSizes)),
        pipeSizes
    );
};

const onCalculateClick = () => {
    setToDefault();
    calculate();
};

const setToDefault = () => {
    distanceAdded = 0;
    yDistance = 0;
    xDistance = 0;
    lengthPosition = 0;
};

const fillInBlanks = () => {
    const endRoom = document.getElementById("endRoom");
    const sideRoom = document.getElementById("sideRoom");

    if (!endRoom.value) {
        endRoom.value = 0;
    }
    if (!sideRoom.value) {
        sideRoom.value = 0;
    }
};

const getConvertedPipeSizes = (pipeSizes) => {
    let convertedPipeSizes = [];
    for (
        let pipeNum = getFirstPipeNum(pipeSizes);
        pipeNum <= getLastPipeNum(pipeSizes);
        pipeNum++
    ) {
        convertedPipeSizes.push(fractionToFloat(pipeSizes[pipeNum]));
    }
    return convertedPipeSizes;
};

// Get all x values of rows. returns object with 3 properties:
// rowX1: first row, rowX2: second row, 
// bassXRow: bass row for single row of bass pipes
const getXValues = () => {
    const findX1 = (pipe1Diameter) => {
        const sideRoom = isValidInput("sideRoom");
        return sideRoom + pipe1Diameter / 2;
    };

    const findX2 = (row1X, pipe1Diameter, pipe2Diameter) => {
        return twoRows.checked
            ? row1X + pipe1Diameter / 2 + xDistance + pipe2Diameter / 2
            : "N/A";
    };

    const findBassX = () => {
        return singleBass.checked ? totalWidth / 2 : "N/A";
    };

    const pipeSizes = getDataFromTableColumn("pipe-table", 1);
    const firstPipeNum = getFirstPipeNum(pipeSizes);
    if (firstPipeNum === "") {
        alert("Need to put values in body sizes!");
    }

    const totalWidth = getTotalWidth(pipeSizes, firstPipeNum);
    const woodDepth1 = fractionToFloat(
        document.getElementById("woodDepth1").value
    );
    const woodDepth2 = fractionToFloat(
        document.getElementById("woodDepth2").value
    );
    const pipe1Diameter = fractionToFloat(pipeSizes[firstPipeNum]);
    const pipe2Diameter = fractionToFloat(pipeSizes[firstPipeNum + 1]);
    const bassXRow = findBassX();
    let rowX1;
    let rowX2;

    rowX1 = woodPipes.checked ? findX1(woodDepth1) : findX1(pipe1Diameter);
    if (twoRows.checked) {
        rowX2 = woodPipes.checked
            ? findX2(rowX1, woodDepth1, woodDepth2)
            : findX2(rowX1, pipe1Diameter, pipe2Diameter);
    } else {
        rowX2 = "N/A";
    }

    return { rowX1: rowX1, rowX2: rowX2, bassXRow: bassXRow };
};

const rulerFrac = (floatNum, maxDecimal) => {
    const intNum = parseInt(floatNum);
    const decNum = floatNum - intNum;

    if (intNum == +floatNum) {
        return floatNum;
    } else {
        let numer = getLargestNumerator(decNum, maxDecimal);
        const gcdNum = getGCD(numer, maxDecimal);
        numer = numer / gcdNum;
        const denom = maxDecimal / gcdNum;

        if (denom == 0) {
            return intNum;
        } else if (denom == 1) {
            return intNum + 1;
        } else if (intNum > 0) {
            return `${intNum} ${parseInt(numer)}/${parseInt(denom)}`;
        } else {
            return `${parseInt(numer)}/${parseInt(denom)}`;
        }
    }
};

const getGCD = (a, b) => {
    if (b == 0) {
        return a;
    }
    return getGCD(b, a % b);
};

const getLargestNumerator = (decNum, maxDenom) => {
    let numer = 1;
    while (numer / maxDenom < decNum) {
        numer += 1;
    }
    if (numer / maxDenom != decNum) {
        if (numer / maxDenom - decNum > decNum - (numer - 1) / maxDenom) {
            numer -= 1;
        }
    }
    return numer;
};

const fractionToFloat = (fraction) => {
    if (fraction.includes(" ")) {
        const wholeNum = fraction.split(" ");
        const nums = wholeNum.pop().split("/");
        return parseFloat(+nums[0] / +nums[1] + +wholeNum);
    } else if (fraction.includes("/")) {
        const nums = fraction.split("/");
        return parseFloat(+nums[0] / +nums[1]);
    } else {
        return parseFloat(fraction);
    }
};

const chordLength = (radius, fromCenter) => {
    return 2 * Math.sqrt(radius * radius - fromCenter * fromCenter);
};

// return data from table as list
const getDataFromTableColumn = (tableId, columnIndex) => {
    let dataList = [];
    const table = document.getElementById(tableId);
    const rows = table.getElementsByTagName("tr");

    for (let i = 1; i < rows.length; i++) {
        const currRow = rows[i];
        const cell = currRow.getElementsByTagName("td");
        const cellValue = cell[columnIndex].innerText;
        dataList.push(cellValue);
    }
    return dataList;
};

// get first pipe that has value
const getFirstPipeNum = (pipeList) => {
    for (let count = 0; count <= pipeList.length; count++) {
        if (pipeList[count]) {
            return count;
        }
    }
    return "";
};

// get last pipe that has value
const getLastPipeNum = (pipeList) => {
    for (let count = 0; count <= pipeList.length; count++) {
        if (!pipeList[count] && count > getFirstPipeNum(pipeList)) {
            return count - 1;
        }
    }
    return 60;
};

const isValidInput = (elementId) => {
    if (document.getElementById(elementId).value) {
        return fractionToFloat(document.getElementById(elementId).value);
    } else {
        return 0;
    }
};

const getTotalWidth = (pipeSizes, firstPipeNum) => {
    const sideRoom = isValidInput("sideRoom");
    let totalWidth = 0;

    if (woodPipes.checked) {
        const woodDepth1 = fractionToFloat(
            document.getElementById("woodDepth1").value
        );
        totalWidth = sideRoom * 2 + woodDepth1;

        if (twoRows.checked) {
            const woodDepth2 = fractionToFloat(
                document.getElementById("woodDepth2").value
            );
            totalWidth += xDistance + woodDepth2;
        }
    } else {
        totalWidth = sideRoom * 2 + (pipeSizes[firstPipeNum]);

        if (twoRows.checked) {
            totalWidth += xDistance + (pipeSizes[firstPipeNum + 1]);
        }
    }
    return rulerFrac(totalWidth, 32);
};

const getYValueList = (pipeSizes) => {
    const firstPipe = getFirstPipeNum(pipeSizes);
    const lastPipe = getLastPipeNum(pipeSizes);
    const endRoom = fractionToFloat(document.getElementById("endRoom").value);
    let pipeYList = [];

    // assign empty values to pipeYList
    for (let pipeNum = 0; pipeNum <= lastPipe; pipeNum++) {
        pipeYList.push(0);
    }

    // get location of all of the single row bass pipes
    const getYBassPipes = (pipeYList) => {
        pipeYList[firstPipe] = endRoom + pipeSizes[0] / 2;
        for (let bassPipe = 1; bassPipe < firstPipe; bassPipe++) {
            pipeYList[bassPipe] =
                pipeYList[bassPipe - 1] +
                pipeSizes[bassPipe - 1] / 2 +
                yDistance +
                pipeSizes[bassPipe] / 2;
        }
    };

    // get y location of first pipe that is not a bass pipe
    const getYFirstPipe = (pipeYList) => {
        if (singleBass.checked) {
            pipeYList[firstPipe] =
                pipeYList[firstPipe - 1] +
                pipeSizes[firstPipe - 1] / 2 +
                yDistance +
                (pipeSizes[firstPipe]) / 2;
        } else {
            pipeYList[firstPipe] = endRoom + (pipeSizes[firstPipe]) / 2;
        }
    };

    const getTwoRowsPipes = (pipeYList) => {
        // first row
        for (let pipeNum = firstPipe + 2; pipeNum <= lastPipe; pipeNum += 2) {
            pipeYList[pipeNum] =
                pipeYList[pipeNum - 2] +
                pipeSizes[pipeNum - 2] / 2 +
                yDistance +
                pipeSizes[pipeNum] / 2;
        }

        // second row
        for (let pipeNum = firstPipe + 1; pipeNum <= lastPipe; pipeNum += 2) {
            if (pipeNum === lastPipe) {
                // ends on odd numbered pipe
                if (pipeNum % 2 === 0) {
                    pipeYList[pipeNum] =
                        (pipeYList[pipeNum + 1] -
                            pipeSizes[pipeNum + 1] / 2 -
                            (pipeYList[pipeNum - 1] +
                                pipeSizes[pipeNum - 1] / 2)) /
                            2 +
                        pipeYList[pipeNum - 1] +
                        pipeSizes[pipeNum - 1] / 2;
                    // ends on even numbered pipe
                } else {
                    pipeYList[pipeNum] =
                        pipeYList[pipeNum - 2] +
                        pipeSizes[pipeNum - 2] / 2 +
                        yDistance +
                        pipeSizes[pipeNum] / 2;
                }
            } else {
                pipeYList[pipeNum] =
                    (pipeYList[pipeNum + 1] -
                        pipeSizes[pipeNum + 1] / 2 -
                        (pipeYList[pipeNum - 1] + pipeSizes[pipeNum - 1] / 2)) /
                        2 +
                    pipeYList[pipeNum - 1] +
                    pipeSizes[pipeNum - 1] / 2;
            }
        }
    };

    const getOneRowPipes = (pipeYList) => {
        for (let pipeNum = firstPipe + 1; pipeNum <= lastPipe; pipeNum++) {
            pipeYList[pipeNum] =
                pipeYList[pipeNum - 1] +
                pipeSizes[pipeNum - 1] / 2 +
                yDistance +
                pipeSizes[pipeNum] / 2;
        }
    };

    const setMinimumDistanceBetween = (distance, pipeYList) => {
        const minDistance = fractionToFloat(distance);
        for (let pipeNum = firstPipe + 1; pipeNum <= lastPipe; pipeNum++) {
            if (pipeYList[pipeNum] - pipeYList[pipeNum - 1] < minDistance) {
                pipeYList[pipeNum] = pipeYList[pipeNum - 1] + minDistance;
            }
        }
    };

    if (singleBass.checked) {
        getYBassPipes(pipeYList);
    }
    getYFirstPipe(pipeYList);

    if (twoRows.checked) {
        getTwoRowsPipes(pipeYList);
    } else {
        getOneRowPipes(pipeYList);
    }
    setMinimumDistanceBetween("3/4", pipeYList);

    return pipeYList;
};

// print results on to result table
const showResults = (tableId, columnIndex, pipeYList, pipeSizes) => {
    const table = document.getElementById(tableId);
    const rows = table.getElementsByTagName("tr");

    const updateResultsTable = () => {
        for (let i = 1; i < rows.length; i++) {
            const currRow = rows[i];
            const cell = currRow.getElementsByTagName("td");
            if (pipeYList[i - 1]) {
                cell[columnIndex].innerText = rulerFrac(pipeYList[i - 1], 32);
            }
        }
    };

    const updateResultsInformation = () => {
        const rowOneLabel = document.getElementById("row-one-label");
        const rowTwoLabel = document.getElementById("row-two-label");
        const middleRowLabel = document.getElementById("middle-row-label");
        const bassPipesLabel = document.getElementById("bass-pipes-label");
        const xDistanceLabel = document.getElementById("x-distance-label");
        const yDistanceLabel = document.getElementById("y-distance-label");
        const distanceAddedLabel = document.getElementById(
            "distance-added-label"
        );
        const sidesLabel = document.getElementById("sides-label");
        const endsLabel = document.getElementById("ends-label");
        const totalLengthLabel = document.getElementById("total-length-label");
        const totalWidthLabel = document.getElementById("total-width-label");
        const xValues = getXValues();

        rowTwoLabel.innerText = twoRows.checked
            ? `Row Two: ${rulerFrac(xValues.rowX2, 32)}`
            : "Row Two: N/A";
        rowOneLabel.innerText = `Row One: ${rulerFrac(xValues.rowX1, 32)}`;
        middleRowLabel.innerText = singleBass.checked
            ? `Middle Row: ${xValues.bassXRow}`
            : "Middle Row: N/A";
        bassPipesLabel.innerText = bassNum.value
            ? `Bass Pipes: ${bassNum.value}`
            : "Bass Pipes: N/A";
        if (xDistance < 0) {
            xDistanceLabel.innerText = `X Overlap: ${rulerFrac(
                Math.abs(xDistance),
                32
            )}`;
        } else {
            xDistanceLabel.innerText = `X Distance: ${rulerFrac(
                Math.abs(xDistance),
                32
            )}`;
        }
        yDistanceLabel.innerText = `Y Distance: ${rulerFrac(yDistance, 32)}`;
        distanceAddedLabel.innerText = `Distance Added: ${rulerFrac(
            distanceAdded,
            32
        )}`;

        sidesLabel.innerText = sideRoom.value
            ? `Sides: ${sideRoom.value}`
            : "Sides: 0";
        endsLabel.innerText = endRoom.value
            ? `Ends: ${endRoom.value}`
            : "Ends: 0";
        totalLengthLabel.innerText = `Total Length: ${getTotalLength(
            getYValueList(getConvertedPipeSizes(pipeSizes)),
            getConvertedPipeSizes(pipeSizes)
        )}`;
        totalWidthLabel.innerText = `Total Width: ${getTotalWidth(
            getConvertedPipeSizes(pipeSizes),
            getFirstPipeNum(pipeSizes)
        )}`;
    };
    updateResultsTable();
    updateResultsInformation();
};

const increaseLength = () => {
    yDistance += 0.0625;
    lengthPosition++;
    distanceAdded = lengthPosition * 0.0625;
    calculate();
};

const decreaseLength = () => {
    if (lengthPosition > 0) {
        yDistance -= 0.0625;
        lengthPosition--;
        distanceAdded = lengthPosition * 0.0625;
        calculate();
    }
};

const increaseWidth = () => {
    const woodCheck = document.getElementById("woodPipes");
    const pipeSizes = getConvertedPipeSizes(getDataFromTableColumn("pipe-table", 1));
    const firstPipe = getFirstPipeNum(pipeSizes);
    xDistance += 0.0625;
    const pipe1Width = pipeSizes[firstPipe];
    const pipe2Width = pipeSizes[firstPipe + 1];
    const pipe3Width = pipeSizes[firstPipe + 2];

    if (xDistance >= 0) {
        yDistance = 0;
    } else {
        if (woodCheck.checked) {
            widthPosition++;
        } else {
            const chordLength1 = chordLength(
                pipe1Width / 2,
                pipe1Width / 2 - Math.abs(xDistance)
            );
            const chordLength2 = chordLength(
                pipe2Width / 2,
                pipe2Width / 2 - Math.abs(xDistance)
            );
            const chordLength3 = chordLength(
                pipe3Width / 2,
                pipe3Width / 2 - Math.abs(xDistance)
            );
            const chordRemainder1 = (pipe1Width - chordLength1) / 2;
            const chordRemainder3 = (pipe3Width - chordLength3) / 2;
            yDistance = chordLength2 - (chordRemainder1 + chordRemainder3);

            if (yDistance < 0) {
                yDistance = 0;
            }
            lengthPosition = 0;
            distanceAdded = 0;
        }
    }
    calculate();
};

const getTotalLength = (pipeYList, pipeSizes) => {
    const lastPipe = getLastPipeNum(pipeSizes);
    const endRoom = isValidInput("endRoom");
    return rulerFrac(
        +pipeYList[lastPipe] + +pipeSizes[lastPipe] + +endRoom,
        32
    );
};

const decreaseWidth = () => {
    const woodCheck = document.getElementById("woodPipes");
    const pipeSizes = getConvertedPipeSizes(getDataFromTableColumn("pipe-table", 1));
    const firstPipe = getFirstPipeNum(pipeSizes);
    const pipe1Width = pipeSizes[firstPipe];
    const pipe2Width = pipeSizes[firstPipe + 1];
    const pipe3Width = pipeSizes[firstPipe + 2];

    if (xDistance > 0) {
        xDistance = xDistance - 0.0625;
    } else {
        if (woodCheck.checked) {
            if (widthPosition > 0) {
                widthPosition -= 1;
                xDistance -= 0.0625;
            } else {
                alert("Cannot decrease width if pipes are wood!");
            }
        } else {
            if (
                woodCheck.checked &&
                sideRoom * 2 + pipeSizes[firstPipe] >=
                    getTotalWidth(pipeSizes, firstPipe)
            ) {
                alert("Cannot decrease width any more!");
            } else {
                xDistance -= 0.0625;
                const chordLength1 = chordLength(
                    pipe1Width / 2,
                    pipe1Width / 2 - Math.abs(xDistance)
                );
                const chordLength2 = chordLength(
                    pipe2Width / 2,
                    pipe2Width / 2 - Math.abs(xDistance)
                );
                const chordLength3 = chordLength(
                    pipe3Width / 2,
                    pipe3Width / 2 - Math.abs(xDistance)
                );
                const chordRemainder1 = (pipe1Width - chordLength1) / 2;
                const chordRemainder3 = (pipe3Width - chordLength3) / 2;
                yDistance = chordLength2 - (chordRemainder1 + chordRemainder3);

                if (yDistance < 0) {
                    yDistance = 0;
                }
                lengthPosition = 0;
                distanceAdded = 0;
            }
        }
    }
    calculate();
};

// custom function to create a csv
const createFileToDownload = () => {
    let textFile = null;
    const data = new Blob([createCSV()], {type: 'text/plain'});

    if (textFile !== null) {
        window.URL.revokeObjectURL(textFile);
    }

    textFile = window.URL.createObjectURL(data);
    return textFile;
};

const initiateDownload = () => { 
    const jobName = document.getElementById("jobName").value;
    const rankName = document.getElementById("rankName").value;
    let link = document.createElement('a');
    let fileName = (!jobName || !rankName) ? "untitled" : `${jobName}-${rankName}`;

    link.setAttribute('download', `${fileName}.csv`);
    link.href = createFileToDownload();
    document.body.appendChild(link);

    // wait for the link to be added to the document
    window.requestAnimationFrame(() => {
      let event = new MouseEvent('click');
      link.dispatchEvent(event);
      document.body.removeChild(link);
    });
};

const createCSV = () => {
    const data = getAllData();
    let text = `jobName,${data.jobName}
rankName,${data.rankName}
sideRoom,${data.sideRoom}
endRoom,${data.endRoom}
woodPipes,${data.woodPipes}
woodDepth1,${data.woodDepth1}
woodDepth2,${data.woodDepth2}
singleBass,${data.singleBass}
bassNum,${data.bassNum}
`;
    
    for (let i = 0; i < data.pipeValues.length; i++) {
        text += `${i},${data.pipeValues[i]}\n`;
    }
    return text;
};

const getAllData = () => {
    let data = {};
    data.jobName = document.getElementById("jobName").value;
    data.rankName = document.getElementById("rankName").value;
    data.sideRoom = document.getElementById("sideRoom").value;
    data.endRoom = document.getElementById("endRoom").value;
    data.rowNum = (oneRow.checked) ? 1 : 2;
    if (woodPipes.checked) {
        data.woodPipes = true;
        data.woodDepth1 = document.getElementById("woodDepth1").value;
        data.woodDepth2 = document.getElementById("woodDepth2").value;
    } else {
        data.woodPipes = false;
        data.woodDepth1 = "";
        data.woodDepth2 = "";
    }
    if (singleBass.checked) {
        data.singleBass = true;
        data.bassNum = document.getElementById("bassNum").value;
    } else {
        data.singleBass = false;
        data.bassNum = "";
    }
    const pipeValues = getDataFromTableColumn("pipe-table", 1); 
    data.pipeValues = []; 

    for (let i = 0; i < pipeValues.length; i++) {
        data.pipeValues.push(pipeValues[i]);
    }
    return data;
};
