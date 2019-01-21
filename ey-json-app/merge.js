const fs = require('fs');
const flatten = require('flat');
var unflatten = require('flat').unflatten;

const objectKey = 'item_code';
const objectVal = 'value';

let checkFilenames = (filesToMerge) => {
    // Make sure file names input by user all exist in this directory
    try{
        let invalidNames = [];
        filesToMerge.forEach(element => {
            if(!fs.existsSync(`./${element}`))
               invalidNames.push(element);
        });
        return invalidNames;
    }catch(e){
        logError(e);
        return;
    }
};
let mergeFiles = (fileName, filesToMerge) =>{
    try{
        var mergedArr = [];
        filesToMerge.forEach((element) => {
            // For each file input by the user, merge with the mergedArr, until all files have been combined
            let sourceArr = JSON.parse(fs.readFileSync(`./${element}`));
            if(mergedArr.length === 0){
                // On first iteration, just make mergedArr equal to the first file's content
                mergedArr = sourceArr;
            } else {
                // On subsequent iterations, add the values to the mergedArr
               mergedArr = processArray(sourceArr, mergedArr);
            }
        });

        fs.writeFile(fileName, JSON.stringify(mergedArr), (err)=>{
            if (err) throw err;
            console.log('Merged file created successfully.');
        });
    } catch(e){
        logError(e);
        return [];
    }
};
let processArray = (sourceArr, mergedArr) => {
    // Creates a single object with indexes baked into the keys
    var flattenedSource = flatten(sourceArr);
    var flattenedMerge = flatten(mergedArr);
    var masterVals = Object.values(flattenedMerge);
    var masterKeys = Object.keys(flattenedMerge);
    //console.log(flattenedSource);
    for(var i in flattenedSource){
        if(i.includes(objectKey)){
            // Gets the value of the 'value' attribute corresponding to the item code from the source file
            let sourceVal = parseInt(flattenedSource[i.replace(objectKey,objectVal)]);
            // Gets the index of the entry of the mergedArr with the matching item code
            let masterItemCodeIndex = masterVals.indexOf(flattenedSource[i]);
            // Gets the key of the item code, then the corresponding key for the value attribute
            let masterItemKeyCode = masterKeys[masterItemCodeIndex];
            let masterValKey = masterItemKeyCode.replace(objectKey,objectVal);
            // Adds the source file's value to the merged file's value and updates the mergedArr
            let newVal = parseInt(flattenedMerge[masterValKey]) + sourceVal;
            flattenedMerge[masterValKey] = newVal.toString();
        }
    }
    return Object.values(unflatten(flattenedMerge));
/*console.log(sourceArr);
    sourceArr.forEach((element, index) =>{
        let matchIndex = mergedArr.findIndex(p => p.item_code === element.item_code);
        mergedArr[matchIndex].value += element.value;
        for(var i in element.children){
            let child1Match = mergedArr[index].children.findIndex(q => q.item_code === element.children[i].item_code);
            mergedArr[index].children[child1Match].value += element.children[i].value;
            for(var j in element.children[i].children){
                let child2Match = mergedArr[index].children[child1Match].children.findIndex(r => r.item_code === element.children[i].children[j].item_code);
                mergedArr[index].children[child1Match].children[child2Match].value += element.children[i].children[j].value;
            }
        }
    })*/
};
let logError = (e) =>{
    console.log(`Error found in merge.js: ${e}`)
};

module.exports = {
    checkFilenames,
    mergeFiles
}