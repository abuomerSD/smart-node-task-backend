const Excel = require('exceljs');
const { XMLParser} = require("fast-xml-parser");
const fs = require("fs");
let HLSMAX = 240,
    colorDiffThreshold = 5
const indexedColors = [
    '000000',
    'FFFFFF',
    'FF0000',
    '00FF00',
    '0000FF',
    'FFFF00',
    'FF00FF',
    '00FFFF',
    '000000',
    'FFFFFF',
    'FF0000',
    '00FF00',
    '0000FF',
    'FFFF00',
    'FF00FF',
    '00FFFF',
    '800000',
    '008000',
    '000080',
    '808000',
    '800080',
    '008080',
    'C0C0C0',
    '808080',
    '9999FF',
    '993366',
    'FFFFCC',
    'CCFFFF',
    '660066',
    'FF8080',
    '0066CC',
    'CCCCFF',
    '000080',
    'FF00FF',
    'FFFF00',
    '00FFFF',
    '800080',
    '800000',
    '008080',
    '0000FF',
    '00CCFF',
    'CCFFFF',
    'CCFFCC',
    'FFFF99',
    '99CCFF',
    'FF99CC',
    'CC99FF',
    'FFCC99',
    '3366FF',
    '33CCCC',
    '99CC00',
    'FFCC00',
    'FF9900',
    'FF6600',
    '666699',
    '969696',
    '003366',
    '339966',
    '003300',
    '333300',
    '993300',
    '993366',
    '333399',
    '333333',
]
function hls_to_rgb(color) {
    let m1,m2,
        h=color.h/HLSMAX,
        l=color.l/HLSMAX,
        s=color.s/HLSMAX
    if(s == 0.0) {
        l = Math.round(255*l)
        return {red: l, green: l, blue: l}
    }
    if(l <= 0.5)
        m2 = l * (1.0 + s)
    else
        m2 = l + s - (l * s)
    m1 = 2.0 * l - m2
    return {
        red:Math.round(_v(m1, m2, h + 1/3)*255),
        green:Math.round(_v(m1, m2, h)*255),
        blue:Math.round(_v(m1, m2, h - 1/3)*255)
    }

    function _v(m1, m2, hue){
        if(hue>0)
            hue = hue % 1.0
        else
            hue = 1+hue
        if(hue < 1/6)
            return m1 + (m2-m1)*hue*6.0
        if(hue < 0.5)
            return m2
        if(hue < 2/3)
            return m1 + (m2-m1)*(2/3-hue)*6.0
        return m1
    }
}
function rgb_to_hls(r, g, b){
    let h,s,l
    let maxc = Math.max(r, g, b)
    let minc = Math.min(r, g, b)
    let sumc = (maxc+minc)
    let rangec = (maxc-minc)

    l = sumc/2.0
    if(minc == maxc)
        return {h:0.0, l, s:0.0}
    if(l <= 0.5)
        s = rangec / sumc
    else
        s = rangec / (2.0-sumc)
    let rc = (maxc-r) / rangec
    let gc = (maxc-g) / rangec
    let bc = (maxc-b) / rangec
    if(r == maxc)
        h = bc-gc
    else if(g == maxc)
        h = 2.0+rc-bc
    else
        h = 4.0+gc-rc
    h = (h/6.0) % 1.0
    return {
        h:Math.round(h*HLSMAX),
        l:Math.round(l*HLSMAX),
        s:Math.round(s*HLSMAX),
    }
}
function tint_luminance(tint, lum) {
    if(tint < 0)
        return Math.round(lum * (1.0 + tint))
    else
        return Math.round(lum * (1.0 - tint) + (HLSMAX - HLSMAX * (1.0 - tint)))
}
function theme_and_tint_to_rgb(worksheet,{theme,tint}){
    const parser = new XMLParser();
    let jObj = parser.parse(worksheet._workbook._themes.theme1);
    var xml = worksheet._workbook._themes.theme1
    var themes = Object.keys(jObj['a:theme']['a:themeElements']['a:clrScheme'])
        .map(theme=>{
            return {
                theme:theme.split("a:")[1],
                color:xml.split('<'+theme+">")[1].split('val="')[1].split('"')[0]
            }
        })
    let color = hex_to_rgb(themes[theme].color)
    // console.log("rgb",color)
    let hls = rgb_to_hls(color.red,color.green,color.blue,tint)
    // console.log("hls",hls)
    hls.l = tint_luminance(tint, hls.l)
    // console.log("hls new",hls)
    var new_color = hls_to_rgb(hls)
    // console.log("new color",new_color)
    return new_color
}
function hex_to_rgb(hexString){
    let blue = parseInt(hexString.substring(4,), 16)/255
    let green = parseInt(hexString.substring(2,4), 16)/255
    let red = parseInt(hexString.substring(0,2), 16)/255
    return {red,green,blue}
}
function getColor(ws,color){
    if(color.hasOwnProperty("argb")) {
        let rgb = hex_to_rgb(color.argb.substring(2))
        return {
            red:Math.round(rgb.red*255),
            green:Math.round(rgb.green*255),
            blue:Math.round(rgb.blue*255),
        }
    }
    else if(color.hasOwnProperty("indexed")) {
        let rgb = hex_to_rgb(indexedColors[color.indexed])
        return {
            red:Math.round(rgb.red*255),
            green:Math.round(rgb.green*255),
            blue:Math.round(rgb.blue*255),
        }
    }
    else if(color.hasOwnProperty("theme"))
        return theme_and_tint_to_rgb(ws,color)
}
function isSameColor(c1,c2){
    return Math.abs(c1.red-c2.red)<colorDiffThreshold && Math.abs(c1.green-c2.green)<colorDiffThreshold && Math.abs(c1.blue-c2.blue)<colorDiffThreshold
}

function getLevel(ws,cell,levels){
    for(let i=0;i<levels.length;i++){
        if(cell.style.fill.fgColor && isSameColor(getColor(ws,cell.style.fill.fgColor),levels[i])){
            return i+1
            break
        }
    }
    return false
}
function readTree(inputFileName){
    return new Promise((resolve,reject)=>{
        const workbook = new Excel.Workbook();
        async function init(){
            await workbook.xlsx.readFile(inputFileName);
            workbook.eachSheet(function(worksheet, sheetId) {
                var levelsCount = 0,
                    levels=[],
                    found,
                    dataStart

                // detect levels
                for(let i=2;i<=worksheet.rowCount;i++){
                    if(worksheet.getCell('F'+i).value && typeof(worksheet.getCell('F'+i).value)=='string' &&worksheet.getCell('F'+i).value.trim().toLowerCase().includes("account type")){
                        found = true
                        break
                    }
                    if(!worksheet.getCell('F'+i).style.fill || !worksheet.getCell('F'+i).style.fill.fgColor) {
                        console.log("NO COLOR F"+i,worksheet.getCell('F'+i).value,worksheet.getCell('F'+i).style)
                        return resolve(false)
                    }
                    levels.push(getColor(worksheet,worksheet.getCell('F'+i).style.fill.fgColor))
                    levelsCount++
                    console.log("level:",levelsCount,"color",worksheet.getCell('F'+i).style.fill.fgColor)
                }
                if(!found) {
                    console.log("DID NOT FIND ACCOUNT TYPE")
                    return resolve(false)
                }
                console.log("levelsCount",levelsCount,levels)
                // end detect levels


                // detect chart of accounts margins
                dataStart = levelsCount+2
                for(let i=levelsCount+2;i<=worksheet.rowCount;i++){
                    if(worksheet.getCell('C'+i).value && typeof(worksheet.getCell('C'+i).value)=='string' &&worksheet.getCell('C'+i).value.trim().toLowerCase().includes("account name")){
                        found = true
                        break
                    }
                    dataStart++
                }
                if(!found){
                    console.log("DID NOT FIND ACCOUNT NAME")
                    return resolve(false)
                }
                // end detect chart of accounts margi

                let data = [],
                    lastLevelsData = []
                // start getting data
                for(let i=dataStart;i<=worksheet.rowCount;i++){
                    var cellLevel = getLevel(worksheet,worksheet.getCell('C'+i),levels)
                    if(cellLevel==1){
                        lastLevelsData[cellLevel-1] = {
                            name_en:worksheet.getCell('C'+i).value,
                            name:worksheet.getCell('D'+i).value,
                            code:worksheet.getCell('E'+i).value,
                            type:worksheet.getCell('F'+i).value,
                            children:[]
                        }
                        data.push(lastLevelsData[cellLevel-1])
                    }
                    else if(cellLevel>1){
                        lastLevelsData[cellLevel-1] = {
                            name_en:worksheet.getCell('C'+i).value,
                            name:worksheet.getCell('D'+i).value,
                            code:worksheet.getCell('E'+i).value,
                            type:worksheet.getCell('F'+i).value,
                            children:[]
                        }
                        console.log(cellLevel)
                        if(cellLevel==levels.length) {
                            console.log(lastLevelsData[cellLevel - 1])
                            delete lastLevelsData[cellLevel - 1].children
                        }
                        lastLevelsData[cellLevel-2].children.push(lastLevelsData[cellLevel-1])
                    }
                }
                console.log("data",data)
                resolve(data)

            });

        }
        init()
    })
}

module.exports = readTree
