const Excel = require('exceljs');
const fs = require("fs");

function exportExcel(inputFileName,data){
    return new Promise((resolve,reject)=>{
        const workbook = new Excel.Workbook();
        var nvForRepeats = {}
        var nhForRepeats = {}
        async function init(){
            await workbook.xlsx.readFile(inputFileName);
            workbook.eachSheet(function(worksheet, sheetId) {
                var lastRow = worksheet.rowCount
                var lastCol = worksheet.columnCount

                for (var row = 1; row <= lastRow; row++) {
                    // detect vFor in this row
                    var hasVFor = false
                    for(var col=1;col<=lastCol;col++) {
                        var cellData = worksheet.getCell(row,col).value
                        if (typeof(cellData)=="string" && cellData.includes("%%vfor(")) {
                            hasVFor = true
                            break
                        }
                    }
                    if(hasVFor){
                        processVForRow(worksheet,row)
                        continue
                    }
                    for(var col=1;col<=lastCol;col++) {
                        // detect hFor in this row
                        var hasHFor = false
                        for(var rr=1;rr<=lastRow;rr++){
                            var cellData = worksheet.getCell(rr,col).value
                            if (typeof(cellData)=="string" && cellData.includes("%%hfor(")) {
                                hasHFor = true
                                break
                            }
                        }
                        if(hasHFor){
                            processHForRow(worksheet,row)
                            continue
                        }

                        var cell = worksheet.getCell(row,col)

                        if(!cell.value) continue
                        startProcessingExpression(worksheet,cell,cell.value,data,row,col)
                        lastRow = worksheet.rowCount
                        lastCol = worksheet.columnCount
                    }
                }
            });
            var outputFileName = Date.now()+".xlsx"
            await workbook.xlsx.writeFile(outputFileName);
            resolve(fs.readFileSync(outputFileName))
        }
        function getExpressionType(exp){
            if(exp.includes("img:"))
                return "image"
            if(exp.includes("nvforRepeat"))
                return "nvforRepeat"
            if(exp.includes("nhforRepeat"))
                return "nhforRepeat"
            return "text"
        }
        function processTextExpression(value,data,expressions,exp,expIndex,isForItem,extraaScopes=[]){

            var text = exp.variable.includes("%%vfor(")||exp.variable.includes("%%nfor(")||exp.variable.includes("evfor%%")||exp.variable.includes("enfor%%")?"":getDataFromExpression(data,exp.variable,isForItem,extraaScopes)
            text = text.toString()
            value = value.substring(0,exp.start-2) + text + value.substring(exp.end+3)
            var shift =  text.length -  exp.variable.length - 4

            if(expressions) {
                expressions.slice(expIndex + 1).forEach(exp => {
                    exp.start += shift
                    exp.end += shift
                })
            }
            return value
        }
        function processImageExpression(worksheet,cell,exp,row,col,isForItem,data,extraScopes){
            var filename = exp.variable.split("img:")[1].split(",")[0]
            if(filename.startsWith("'") || filename.startsWith('"') )
                filename = filename.split(filename[0])[1]
            else {
                filename = getDataFromExpression(data, filename, isForItem, extraScopes)
            }
            //var ext = filename.substring(filename.lastIndexOf("."))
            try {
                var base64 = fs.readFileSync(filename, {encoding: 'base64'})
                const imageId1 = workbook.addImage({
                    base64,
                    extension: "png",
                })
                var width = 1, height = 1
                if (exp.variable.split("size:")) {
                    width = exp.variable.split("size:")[1].split(",")[0].split("x")[0]
                    height = exp.variable.split("size:")[1].split(",")[0].split("x")[1]
                }

                cell.value = ""
                var obj = {
                    tl: {col: col - 1, row: row - 1},
                    br: {col: col + parseInt(height) - 1, row: row + parseInt(width) - 1},
                    //  ext: { width: 500, height: 200 }
                }

                worksheet.addImage(imageId1, obj)
            }catch (e) {
                console.log("Error",e)
            }
        }
        function parseExpressions(value,isForItem){
            var expressions = []
            var splits = value.split("{{")

            splits.slice(1).forEach((exp,index)=>{
                var start = splits.slice(0,index+1).reduce((a,b)=>a+b.length,0)+2+(index>0?2*index:0)
                expressions.push(
                    {
                        variable:exp.substring(0,exp.lastIndexOf("}}")),
                        start,
                        end:start+exp.lastIndexOf("}}")-1
                    }
                )
            })
            return expressions
        }
        function getDataFromExpression(obj,path,isForItem,optionalScopes=[]){
            var pathes = []
            var quote = path.includes("'")?"'":'"'
            if(!isNaN(path)){
                return parseFloat(path)
            }
            else if(!path.includes(".") && ( path.includes("'") || path.includes('"')) && !isNaN(path.split(quote).join("")) ){
                return path.split(quote).join("")
            }
            else if(path.includes("(") && path.trim().endsWith(")")){
                var leftSplit = path.split("(")[0]
                var leftSide = leftSplit.substring(0,leftSplit.includes(".")?leftSplit.lastIndexOf("."):0)
                if(leftSide){
                    leftSide.split(".")
                        .forEach(objectPart=>{
                            var arrayParts = objectPart.split("[")
                            if(arrayParts[0]){
                                pathes.push(arrayParts[0])
                            }
                            arrayParts.slice(1).forEach(arrayPart=>{
                                pathes.push(parseInt(arrayPart.split("]")[0]))
                                var remaining = arrayPart.split("]")[1]
                                if(remaining)
                                    pathes.push(remaining)
                            })

                        })
                }
                pathes.push(path.substring(leftSide.length?leftSide.length+1:0))
                console.log("pathes",pathes)
            }
            else
                path.split(".")
                    .forEach(objectPart=>{
                        var arrayParts = objectPart.split("[")
                        if(arrayParts[0]){
                            pathes.push(arrayParts[0])
                        }
                        arrayParts.slice(1).forEach(arrayPart=>{
                            pathes.push(parseInt(arrayPart.split("]")[0]))
                            var remaining = arrayPart.split("]")[1]
                            if(remaining)
                                pathes.push(remaining)
                        })

                    })

            if(isForItem && ((isForItem.vforItemVariable && !isForItem.nforItemVariable && isForItem.vforItemVariable==pathes[0])||(isForItem.vforItemVariable && isForItem.nforItemVariable && isForItem.nforItemVariable==pathes[0])) && typeof(obj)=="string"){
                return obj
            }
            var returnText
            var found,objects = [obj, ...optionalScopes]
            function getStartingIndex(index){
                if(index==0 && isForItem && isForItem.vforItemVariable && !isForItem.nforItemVariable && isForItem.vforItemVariable==pathes[0])
                    return 1
                else if(index==0 && isForItem && isForItem.vforItemVariable && isForItem.nforItemVariable && isForItem.nforItemVariable==pathes[0])
                    return 1
                else if(index==1 && isForItem && isForItem.vforItemVariable && isForItem.nforItemVariable && isForItem.vforItemVariable==pathes[0])
                    return 1
                else
                    return 0
            }
            objects.forEach((obj,index)=>{
                if(found) return
                found = true
                returnText = obj
                console.log("pathes",pathes)
                for (var i = (getStartingIndex(index)?1:0); i < pathes.length; i++) {
                    if(i==(pathes.length-1) && pathes[i].includes("()")){
                        console.log(pathes[i])
                        returnText = returnText[pathes[i].split("()")[0]]()
                    }
                    else if(i==(pathes.length-1) && pathes[i].includes("(")){
                        console.log("171")
                        var params = pathes[i]
                            .substring(pathes[i].indexOf("(")+1,pathes[i].indexOf(")"))
                            .split(",")
                            .map(param=>param.trim())
                            .map(param=>getDataFromExpression(obj,param,isForItem,optionalScopes))
                        console.log(params)
                        // throw new Error("kkkkkkk")
                        returnText = returnText[pathes[i].split("(")[0]](...params)
                    }
                    else if (returnText[pathes[i]] || returnText[pathes[i]]==0) {
                        returnText = returnText[pathes[i]]
                    }
                    else{
                        returnText = ""
                        found = false
                        break
                    }
                }

            })
            return returnText
        }
        function isExpression(value){
            return typeof(value)=='string' && value.includes("{{") && value.includes("}}")
        }
        async function processVForRow(worksheet,rowIndex){
            var rows = [],vfors = [],addedRowsCount,formatValue,isRepeatSet,isRepeatValue
            var lastCol = worksheet.columnCount
            var lastRow = worksheet.rowCount
            // read all vfors in this row
            var oneVFor = {},oneNFor = {}

            // detect is repeat calue
            for(var col=1;col<=lastCol;col++) {
                var cellValue = worksheet.getCell(rowIndex,col).value
                if(typeof(cellValue)=='string' && cellValue.includes("%%vfor")){
                    var vForExpression = cellValue.split("%%vfor((")[1].split("))")[0]
                    if(!isRepeatSet && vForExpression.includes(",") && vForExpression.includes("repeat")){
                        isRepeatSet = true
                        isRepeatValue = vForExpression.split(",").find(exp=>exp.toLowerCase().includes('repeat'))
                    }
                    oneVFor.itemVariable = vForExpression.split("in")[0].trim()
                    oneVFor.arrayVariable = vForExpression.split("in")[1].split(",")[0].trim()
                    oneVFor.arrayData = getDataFromExpression(data, oneVFor.arrayVariable)
                    oneVFor.start= col
                    if(vForExpression.includes("excelformat")){
                        oneVFor.excelformatValue = JSON.parse(vForExpression.split("excelformat:")[1])
                    }
                    else if(vForExpression.includes("jsformat")){
                        oneVFor.jsformatValue = JSON.parse(vForExpression.split("jsformat:")[1])
                    }

                }
                else if(typeof(cellValue)=='string' && cellValue.includes("%%nfor") && cellValue.includes("enfor%%")){
                    if(!oneVFor.nested) oneVFor.nested = []
                    var nForExpression = cellValue.split("%%nfor((")[1].split("))")[0]
                    oneNFor.arrayVariable = nForExpression.split("in")[1].split(",")[0].trim()
                    oneNFor.itemVariable = nForExpression.split("in")[0].trim()

                    oneNFor.arrayVariable = oneNFor.arrayVariable.split(oneVFor.itemVariable)[1].substring(1)
                    if(nForExpression.includes("format")){
                        oneNFor.formatValue = JSON.parse(vForExpression.split("format:")[1])
                    }
                    if(oneNFor.arrayVariable.startsWith("."))
                        oneNFor.arrayVariable = oneNFor.arrayVariable.substring(1)
                    // oneNFor.arrayData = getDataFromExpression(oneVFor.arrayData, oneNFor.arrayVariable)

                    oneNFor.index = col
                    oneVFor.nested.push(oneNFor)
                    oneNFor = {}
                }

                else if(typeof(cellValue)=='string' && cellValue.includes("evfor%%")){
                    oneVFor.end = col
                    vfors.push(oneVFor)
                    oneVFor = {}
                }
            }



            // add new columns first for nested nFor
            if(vfors.some(vfor=>vfor.nested)){
                //var reversedVFors = Object.assign([],vfors).reverse()
                vfors.forEach((vfor,vforIndex)=>{
                    if(!vfor.nested) return
                    vfor.nested.forEach((nested,nestedIndex)=>{
                        // from each item in the outer row take the longest inner array length
                        nested.maxNestedLength = vfor.arrayData.map(oneItem=>{
                            return getDataFromExpression(oneItem,nested.arrayVariable).length
                        }).sort((a,b)=>b-a)[0]
                        //getDataFromExpression(reversedVFor.arrayData[nestedIndex],nested.arrayVariable).map(a=>a.length).sort((a,b)=>b-a)[0]
                        // add new columns
                        for(var i=0;i<nested.maxNestedLength-1;i++) {
                            worksheet.spliceColumns(nested.index + 1, 0, [])
                        }
                        for(var i=0;i<nested.maxNestedLength-1;i++) {
                            worksheet.getCell(rowIndex,nested.index+i+1).style = worksheet.getCell(rowIndex,nested.index).style

                        }
                        // add shift to all vfors and nfors after this
                        for(var i=vforIndex;i<vfors.length;i++){
                            // add shift to vfor start and end
                            if(i==vforIndex)
                                vfors[i].end+=nested.maxNestedLength-1
                            else if(i!=vforIndex){
                                vfors[i].start+=nested.maxNestedLength-1
                                vfors[i].end+=nested.maxNestedLength-1
                            }
                            if(vfors[i].nested) {
                                for (var j = 0; j < vfors[i].nested.length; j++) {
                                    if(i==vforIndex && j<=nestedIndex) continue
                                    vfors[i].nested[j].index+=nested.maxNestedLength-1
                                }
                            }
                        }
                    })
                })

                // if there in nFor other cells should go back by totalOtherCellShift for each nfor
                var startShiftingIndex
                vfors.forEach((vfor,vforIndex)=>{
                    if(vfor.nested){

                        vfor.nested.forEach((nested,nestedIndex)=>{
                            var nextNested,totalOtherCellShift = 0
                            for(var i=0;i<=vforIndex;i++){
                                if(vfors[i].nested)
                                    for(var j=0;j<vfors[i].nested.length;j++){
                                        if(i==vforIndex && j>nestedIndex) break
                                        totalOtherCellShift += vfors[i].nested[0].maxNestedLength-1
                                    }
                                if(i==vforIndex && j>nestedIndex) break
                            }

                            if(vfor.nested[nestedIndex+1]) {
                                nextNested = vfor.nested[nestedIndex + 1]
                            }
                            else {
                                let nextFor =  vfors.slice(vforIndex + 1).find(vfor => vfor.nested)
                                if(nextFor)
                                    nextNested = nextFor.nested[0]
                            }
                            // if no shift is needed go the next nested

                            if(totalOtherCellShift==0) return

                            // if shift is needed perform it
                            startShiftingIndex = nested.index+nested.maxNestedLength
                            var finishShiftingIndex = nextNested?nextNested.index:lastCol+totalOtherCellShift

                            for (var y=1;y<=lastRow;y++){
                                if(y==rowIndex || nvForRepeats[y]) continue
                                for(var x=startShiftingIndex;x<=finishShiftingIndex;x++){
                                    worksheet.getCell(y,(x-totalOtherCellShift)).value =worksheet.getCell(y,x).value
                                    worksheet.getCell(y,(x-totalOtherCellShift)).style =worksheet.getCell(y,x).style
                                }
                            }
                        })
                    }
                })

                if(startShiftingIndex){

                    for(var x=startShiftingIndex;x<=worksheet.columnCount;x++){
                        for (var y=1;y<=lastRow;y++){
                            if(y==rowIndex) continue
                            worksheet.getCell(y,x).value =""
                        }
                    }
                }
            }
            // end add new columns first for nested nFor

            // render data
            var selectedRowData = []
            var maxNewRowCells = 0
            worksheet.getRow(rowIndex).eachCell((c,colNumber)=>{
                maxNewRowCells = colNumber
            })

            // fill array that has maxNewRowCells length with undefined
            for(var i=0;i<maxNewRowCells;i++){
                var obj = {
                    col:i+1,
                    merged:isMerged(worksheet,rowIndex,i+1),
                    value:""
                }
                selectedRowData.push(obj)
                if(obj.merged) i+=obj.merged.width-1
            }


            worksheet.getRow(rowIndex).eachCell(function(cell, colNumber) {
                var foundCell = selectedRowData.find(r=>r.col==colNumber)
                if(!foundCell) return
                if(indexInVfor(colNumber).hasOwnProperty("vforIndex"))
                    foundCell.value = cell.value
                else {
                    foundCell.value = startProcessingExpression(worksheet, cell,cell.value, data, rowIndex, colNumber, false, [])
                    foundCell.image = hasImage(worksheet, rowIndex, colNumber)
                    if(typeof (foundCell.value)=="object"){
                        foundCell.value = foundCell.value.value
                    }
                }
            })

            addedRowsCount = vfors.map((vfor)=>vfor.arrayData.length).sort((a,b)=>b-a)[0]

            worksheet.duplicateRow(rowIndex,addedRowsCount-1,true)
            for(var r=1;r<=addedRowsCount;r++){
                for(var x=0;x<selectedRowData.length;x++){
                    worksheet.getCell(rowIndex+r-1,selectedRowData[x].col).value = ""
                    if(selectedRowData[x].merged){
                        worksheet.unMergeCells(rowIndex+r,selectedRowData[x].col,rowIndex+r+selectedRowData[x].merged.height-1,selectedRowData[x].col+selectedRowData[x].merged.width-1)
                        worksheet.mergeCells(rowIndex+r,selectedRowData[x].col,rowIndex+r+selectedRowData[x].merged.height-1,selectedRowData[x].col+selectedRowData[x].merged.width-1)
                    }
                }
            }


            // render data
            for(var y=0;y<=addedRowsCount;y++){
                for(var x=0;x<selectedRowData.length;x++){
                    var currentCol = selectedRowData[x].col
                    var vFor = indexInVfor(currentCol)
                    if (!vFor.hasOwnProperty("vforIndex") && (y==0 || isRepeatValue)) {
                        worksheet.getCell(rowIndex+y, currentCol).value =  selectedRowData[x].value
                    }
                    else if (vFor.hasOwnProperty("vforIndex") && vfors[vFor.vforIndex].arrayData[y] && !vFor.hasOwnProperty("nforIndex")) {
                        startProcessingExpression(worksheet, worksheet.getCell(rowIndex+y, currentCol),selectedRowData[x].value, vfors[vFor.vforIndex].arrayData[y], rowIndex+y, currentCol, {vforItemVariable:vfors[vFor.vforIndex].itemVariable}, [data])
                    }
                    else if(vFor.hasOwnProperty("vforIndex") && vfors[vFor.vforIndex].arrayData[y]){
                        for (var oldX=x; oldX < (x + vfors[vFor.vforIndex].nested[vFor.nforIndex].maxNestedLength);oldX++){

                            var nForData =  vfors[vFor.vforIndex].arrayData[y][vfors[vFor.vforIndex].nested[vFor.nforIndex].arrayVariable][selectedRowData[oldX].col-vfors[vFor.vforIndex].nested[vFor.nforIndex].index]

                            if(nForData) {
                                startProcessingExpression(worksheet, worksheet.getCell(rowIndex+y,selectedRowData[oldX].col ), selectedRowData[x].value, nForData, rowIndex+1, selectedRowData[oldX].col, {vforItemVariable:vfors[vFor.vforIndex].itemVariable,nforItemVariable:vfors[vFor.vforIndex].nested[vFor.nforIndex].itemVariable}, [vfors[vFor.vforIndex].arrayData[y], data])
                            }
                        }
                        x = oldX
                    }


                }
                // console.log("finished")
            }

            // shift after vfor rows
            vfors.forEach(vfor=>{
                if(addedRowsCount>vfor.arrayData.length){
                    var shift = addedRowsCount - vfor.arrayData.length
                    var lastRow = worksheet.rowCount
                    for (var y=rowIndex+addedRowsCount;y<=lastRow;y++){
                        for(var x=vfor.start;x<=vfor.end;x++){
                            worksheet.getCell(y-shift,x).value = worksheet.getCell(y,x).value
                            worksheet.getCell(y-shift,x).style = worksheet.getCell(y,x).style
                        }
                    }
                }
                if(vfor.excelformatValue){
                    formatObject = {
                        ref: `${encode_column(vfor.start-1)}${rowIndex-1}:${encode_column(vfor.end-1)}${rowIndex+vfor.arrayData.length}`,
                        rules: [
                            {
                                type: 'expression',
                                formulae: [vfor.excelformatValue.formulae],
                                style: vfor.excelformatValue.style,
                            }
                        ]
                    }
                    worksheet.addConditionalFormatting(formatObject)
                }
                else if(vfor.jsformatValue){
                    //throw new Error("gggg")
                    vfor.jsformatValue.forEach(condition=>{
                        if(typeof(condition.condition)=='object'){
                            vfor.arrayData.forEach((row,index)=>{
                                if(row.processed) return
                                condition.leftValue = isNaN(condition.condition[0]) ? getDataFromExpression(row,condition.condition[0],{vforItemVariable:vfor.itemVariable},[data]) : parseFloat(condition.condition[0])
                                condition.rightValue = isNaN(condition.condition[2]) ? getDataFromExpression(row,condition.condition[2],{vforItemVariable:vfor.itemVariable},[data]) : parseFloat(condition.condition[2])
                                condition.operator = condition.condition[1]
                                var formatObject = false
                                switch (condition.operator) {
                                    case ">":
                                        if(condition.leftValue > condition.rightValue)
                                            formatObject = true
                                        break
                                    case "<":
                                        if(condition.leftValue < condition.rightValue)
                                            formatObject = true
                                        break
                                    case "<=":
                                        if(condition.leftValue <= condition.rightValue)
                                            formatObject = true
                                        break
                                    case ">=":
                                        if(condition.leftValue >= condition.rightValue)
                                            formatObject = true
                                        break
                                    case "==":
                                        if(condition.leftValue === condition.rightValue)
                                            formatObject = true
                                        break
                                    case "!=":
                                        if(condition.leftValue != condition.rightValue)
                                            formatObject = true
                                }
                                if(formatObject) {
                                    row.processed = true
                                    for(let i = vfor.start-1; i<=vfor.end-1;i++)
                                        worksheet.getCell(`${encode_column(i)}${rowIndex + index}`).style = condition.style;
                                }
                                // worksheet.addConditionalFormatting(formatObject)
                                //throw new Error("lllll")
                            })
                        }
                        else{
                            // return
                            vfor.arrayData.forEach((row,index)=>{
                                if(!row.processed) {
                                    row.processed = true
                                    for(let i = vfor.start-1; i<=vfor.end-1;i++)
                                        worksheet.getCell(`${encode_column(i)}${rowIndex + index}`).style = condition.style;
                                }
                                //  throw new Error("lllll")
                            })

                        }

                    })

                }

            })

            function indexInVfor(index){
                var returnedData = {}
                for(var i=0;i<vfors.length;i++){
                    if(index<vfors[i].start || index>vfors[i].end)
                        continue
                    returnedData.vforIndex = i
                    if(vfors[i].nested){
                        for(var j=0;j<vfors[i].nested.length;j++){
                            if(index==vfors[i].nested[j].index){
                                returnedData.nforIndex = j
                                break
                            }

                        }
                    }
                    break
                }
                return returnedData
            }
        }
        function processHForRow(){

        }
        function startProcessingExpression(worksheet,cell,value,data,row,col,isForItem,extraaScopes){
            if(isExpression(value)) {
                // Read the expressions

                var expressions = parseExpressions(value,isForItem)
                // process the expressions
                expressions.forEach((exp,index)=>{
                    var expressionType = getExpressionType(exp.variable)

                    switch (expressionType){
                        case "text":
                            value = processTextExpression(value,data,expressions,exp,index,isForItem,extraaScopes)
                            cell.value = value
                            break
                        case "image":
                            processImageExpression(worksheet,cell,exp,row,col,isForItem,data,extraaScopes)
                            break
                        case "nvforRepeat":
                            nvForRepeats[row] = value.split(":")[1].split("}}")[0]
                            break
                        case "nhforRepeat":
                            nhForRepeats[col] = true
                            break
                    }

                })
                // End process the expressions
                return cell
            }
            else
                return cell.value
        }
        function hasImage(worksheet,row,col){
            var image = worksheet.getImages().find(image=>row==image.range.tl.nativeRow+1 && col==image.range.tl.nativeCol+1)
            return image?image:false
        }
        function encode_column(n) {
            var ordA = 'a'.charCodeAt(0);
            var ordZ = 'z'.charCodeAt(0);
            var len = ordZ - ordA + 1;

            var s = "";
            while(n >= 0) {
                s = String.fromCharCode(n % len + ordA) + s;
                n = Math.floor(n / len) - 1;
            }
            return s.toUpperCase();
        }
        function isMerged(worksheet,row,col){
            var cell = encode_column(col-1)+row
            if(worksheet._merges[cell])
                return {
                    width:worksheet._merges[cell].right - worksheet._merges[cell].left + 1,
                    height:worksheet._merges[cell].bottom - worksheet._merges[cell].top + 1,
                    merge:worksheet._merges[cell]
                }
            else return false
        }
        init()
    })
}

module.exports = exportExcel
