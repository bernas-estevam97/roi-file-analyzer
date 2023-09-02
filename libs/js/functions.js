// Variables for changing excel sheets if available.
var functionButtons = document.getElementById('functionButtons');
var sheetSelector = document.getElementById('sheetSelect');
var sheetButton = document.getElementById('changeSheet');
var results = document.getElementById('resultsSection');
var resultsAllSection = document.getElementById('resultsAllSection');
resultsAllSection.style.display = 'none';
functionButtons.style.display = 'none';
sheetButton.style.display = 'none';
sheetSelector.style.display = 'none';
document.getElementById('tblcsvdata').style.display = 'none';
document.getElementById('excel_data').style.display = 'none';
document.getElementById('my_file_output').style.display = 'none';

// localStorage.clear();

// Input event listener with handlefile function.


document.getElementById('uploadFile').addEventListener('change', handleFiles, false);

function handleFiles(event) {
    let fileName = $('#uploadFile')[0].files[0].name;
    document.getElementById('fileName').innerHTML = "<u>File name</u>: " + fileName;
    file = document.getElementById('uploadFile').value;
    regex = new RegExp('[^.]+$')
    extension = file.match(regex);
    if (extension == 'txt'){
        results.innerHTML = '';
        resultsAllSection.style.display = 'none';
        sheetButton.style.display = 'none';
        sheetSelector.style.display = 'none';
        var fr = new FileReader();
        fr.onload = function () {
            file = null;
            document.getElementById('my_file_output').style.display = 'block';
            document.getElementById('my_file_output').textContent = this.result;
            functionButtons.style.display = '';
            document.getElementById('tblcsvdata').style.display = 'none';
            document.getElementById('excel_data').style.display = 'none';
        };
        fr.readAsText(event.target.files[0]);
    } else if(extension == 'csv'){
        results.innerHTML = '';
        resultsAllSection.style.display = 'none';
        sheetButton.style.display = 'none';
        sheetSelector.style.display = 'none';
        document.getElementById('areaInput').value = '';
        resultsAllSection.style.display = 'none';
        var frCSV = new FileReader();

        // Read file as string 
        

        // Load event
        frCSV.onload = function(event) {
            file = null;
            // Read file data
            
            var csvdata = event.target.result;

            // Split by line break to gets rows Array
            var rowData = csvdata.split('\n');

            // <table > <tbody>
            var tbodyEl = document.getElementById('tblcsvdata').getElementsByTagName('tbody')[0];
            document.getElementById('tblcsvdata').style.display = '';
            document.getElementById('my_file_output').textContent = '';
            document.getElementById('my_file_output').style.display = 'none';
            document.getElementById('excel_data').style.display = 'none';
            tbodyEl.innerHTML = "";
            functionButtons.style.display = '';

            // Loop on the row Array (change row=0 if you also want to read 1st row)
            // Most CSV files dont have column names, but if they do we can always use those as table headers in html
            // Length -1 because the last line always has a line break \n but we dont have more data below it so we can ignore
            for (var row = 0; row < rowData.length-1; row++) {

                    // Insert a row at the end of table
                    var newRow = tbodyEl.insertRow();
                    

                    // Split by comma (,) to get column Array
                    rowColData = rowData[row].split(',');
                    
        

                    // Loop on the row column Array
                    for (var col = 0; col < rowColData.length; col++) {
                        // Insert a cell at the end of the row
                        var newCell = newRow.insertCell();
                        newCell.innerHTML = rowColData[col];
                    }
            }
        };
        frCSV.readAsText(event.target.files[0]);
    } else if (extension == 'xls' || extension == 'xlsx'){
        results.innerHTML = '';
        resultsAllSection.style.display = 'none';
        document.getElementById('areaInput').value = '';
        resultsAllSection.style.display = 'none';
        var reader = new FileReader();

        reader.readAsArrayBuffer(event.target.files[0]);
        // reader.addEventListener('load', function(){
        //     localStorage.setItem("excel-file", reader.result);
        // })

        reader.onload = function(){
            
            file = null;
            document.getElementById('excel_data').style.display = '';
            document.getElementById('my_file_output').style.display = 'none';
            document.getElementById('tblcsvdata').style.display = 'none';
            functionButtons.style.display = '';

            var data = new Uint8Array(reader.result);

            var work_book = XLSX.read(data, {type:'array'});
            
            var sheet_names = work_book.SheetNames;
            var sheet_data = [];
            if (sheet_names.length > 1) {
                var i, L = sheetSelector.options.length - 1;
                for(i = L; i >= 0; i--) {
                    sheetSelector.remove(i);
                }
                document.getElementById('selectOptions').style.display = '';
                sheetSelector.style.display = '';
                sheetButton.style.display = '';
                for (var i=0; i<sheet_names.length; i++) {
                    sheetSelector.options[sheetSelector.options.length] = new Option(sheet_names[i], i)
                    
                }
                var sheet_data = XLSX.utils.sheet_to_json(work_book.Sheets[sheet_names[sheetSelector.options[sheetSelector.selectedIndex].value]], {header:1});
            } else{
                var sheet_data = XLSX.utils.sheet_to_json(work_book.Sheets[sheet_names[0]], {header:1});
            }
            

            if(sheet_data.length > 0){
                var table_output = '<table class="excel-table">';

                for(var row = 0; row < sheet_data.length; row++)
                {

                    table_output += '<tr>';

                    for(var cell = 0; cell < sheet_data[row].length; cell++)
                    {

                        if(row == 0)
                        {

                            table_output += '<th>'+sheet_data[row][cell]+'</th>';

                        }
                        else
                        {

                            table_output += '<td>'+sheet_data[row][cell]+'</td>';

                        }

                    }

                    table_output += '</tr>';

                }

                table_output += '</table>';

                document.getElementById('excel_data').innerHTML = table_output;
            } else{
                return;
            }
        
            // excel_file.value = '';
        }
    }
}

function changeSheet(){
    resultsAllSection.style.display = 'none';
    results.innerHTML = '';
    var file = document.getElementById('uploadFile').files[0];
    var reader = new FileReader();
    reader.readAsArrayBuffer(file);
    document.getElementById('excel_data').innerHTML = '';
    reader.onload = function(){
        var data = new Uint8Array(reader.result);

        var work_book = XLSX.read(data, {type:'array'});
        
        var sheet_names = work_book.SheetNames;
        let sheet_index = sheet_names[sheetSelector.options[sheetSelector.selectedIndex].value];
        
        let sheet_data = XLSX.utils.sheet_to_json(work_book.Sheets[sheet_names[sheet_index-1]], {header:1});
        if(sheet_data.length > 0){
            var table_output = '<table class="excel-table">';

            
            for(var row = 0; row < sheet_data.length; row++)
            {

                table_output += '<tr>';

                for(var cell = 0; cell < sheet_data[row].length; cell++)
                {

                    if(row == 0)
                    {

                        table_output += '<th>'+sheet_data[row][cell]+'</th>';

                    }
                    else
                    {

                        table_output += '<td>'+sheet_data[row][cell]+'</td>';

                    }

                }

                table_output += '</tr>';

            }

            table_output += '</table>';

            document.getElementById('excel_data').innerHTML = table_output;
        } else{
            return;
        }
    }
}

// sheetSelector.onchange = function(){
//     var wb = localStorage.getItem("excel-file");
//     var data = new Uint8Array(wb);

//     var work_book = XLSX.read(data, {type:'array'});
    
//     var sheet_names = work_book.SheetNames;
//     console.log(sheet_names);
//     var sheet_data = XLSX.utils.sheet_to_json(work_book.Sheets[sheet_names[sheetSelector.options[sheetSelector.selectedIndex].value]], {header:1});
//     if(sheet_data.length > 0){
//         var table_output = '<table class="excel-table">';

//         for(var row = 0; row < sheet_data.length; row++)
//         {

//             table_output += '<tr>';

//             for(var cell = 0; cell < sheet_data[row].length; cell++)
//             {

//                 if(row == 0)
//                 {

//                     table_output += '<th>'+sheet_data[row][cell]+'</th>';

//                 }
//                 else
//                 {

//                     table_output += '<td>'+sheet_data[row][cell]+'</td>';

//                 }

//             }

//             table_output += '</tr>';

//         }

//         table_output += '</table>';

//         document.getElementById('excel_data').innerHTML = table_output;
//     } else{
//         return;
//     }


// }

// $('#uploadFile').change(function() {
//     let fileName = $('#uploadFile')[0].files[0].name;
//     document.getElementById('fileName').innerHTML = "<u>File name</u>: " + fileName;
//   });


let resetFile = function(){
    document.getElementById('fileName').innerHTML = '';
    document.getElementById('my_file_output').textContent = '';
    document.getElementById('my_file_output').style.display = 'none';
    document.getElementById('tblcsvdata').style.display = 'none';
    document.getElementById('uploadFile').value = null;
    document.getElementById('excel_data').style.display = 'none';
    document.getElementById('selectOptions').style.display = 'none';
    functionButtons.style.display = 'none';
    document.getElementById('areaInput').value = '';
    resultsAllSection.style.display = 'none';
}

// Run button function: this function returns which values (index) have ROI with area bigger than specified in the area input box

function getPossibleFusedAggregateValues(area){
    area = document.getElementById('areaInput').value;
    var file = document.getElementById('uploadFile').files[0];
    file = document.getElementById('uploadFile').value;
    regex = new RegExp('[^.]+$')
    extension = file.match(regex);
    var markedArea = [];
    var markedAreaIndex = [];
    var nonmarkedArea = [];
    const areaValues = new Array();
    var resultsText = '';
    if (extension == 'txt'){
        var text = document.getElementById('my_file_output').textContent;
        var textSplitedbyLine = text.split('\n');
        textSplitedbyLine = textSplitedbyLine.slice(0, textSplitedbyLine.length -1);
        const arrName = new Array();
        arrName.push(textSplitedbyLine[0].split('\t'));
        if (arrName[0].indexOf('Area' != -1)){
            var areaIndex = arrName[0].indexOf('Area');
        } else{
            alert('Your txt file does not have a Area column.');
        }
        for (let i = 1; i < textSplitedbyLine.length; i++){
            var line = textSplitedbyLine[i].split('\t');
            areaValues.push(line[areaIndex]);
        }
        if (area == ''){
            alert('Please input your area value cutoff');
            resultsAllSection.style.display = 'none';
            results.innerHTML = '';
        } else{
            for (let i = 0; i < areaValues.length; i++){
                if (parseInt(areaValues[i]) >= parseInt(area)){
                    markedArea.push(areaValues[i]);
                    markedAreaIndex.push(i);
                    resultsText += '<b>Index '+(i+1)+':</b>'+ areaValues[i]+'<br>';
                } else{
                    nonmarkedArea.push(areaValues[i]);
                }
            }
            if (resultsText.innerHTML == ''){
                alert('You have no area values above your cutoff of:'+ area);
            }
            else{
                alert('You have no area values above your cutoff of: '+ area);
                document.getElementById('areaInput').value = '';
                results.innerHTML = '';
                resultsAllSection.style.display = 'none';
            }  
              
        }
    } else if (extension == 'csv'){
        var csvTable = document.getElementById('tblcsvdata');
        const firstRow = new Array();
        var areaCellIndex = 0;
        for (let c=0; c<csvTable.rows[0].cells.length; c++) {
            firstRow.push(csvTable.rows[0].cells[c].innerHTML);
        }
        if (firstRow.indexOf('Area') == -1) {
            alert('Your csv table does not contain an Area column.');
            return;
        }
        areaCellIndex = firstRow.indexOf('Area');
        for (let r=1; r<csvTable.rows.length; r++) {
            areaValues.push(csvTable.rows[r].cells[areaCellIndex].innerHTML);
        }
        if (area == ''){
            alert('Please input your area value cutoff');
            resultsAllSection.style.display = 'none';
            results.innerHTML = '';
        } else{
            for (let i = 0; i < areaValues.length; i++){
                if (parseInt(areaValues[i]) >= parseInt(area)){ // values need to be Ints to be properly compared
                    markedArea.push(areaValues[i]);
                    markedAreaIndex.push(i);
                    resultsText += '&nbsp<b>Index '+(i+1)+':</b>&nbsp'+ areaValues[i]+'<br>';
                } else{
                    nonmarkedArea.push(areaValues[i]);
                }
            }
            if (resultsText){
                resultsAllSection.style.display = '';
                results.innerHTML = resultsText;
            }
            else{
                alert('You have no area values above your cutoff of: '+ area);
                document.getElementById('areaInput').value = '';
                results.innerHTML = '';
                resultsAllSection.style.display = 'none';
            }  
        }     
        
    } else if(extension == 'xlsx' || extension == 'xlx'){
        var excelTable = document.getElementById('excel_data').getElementsByTagName('tbody')[0];
        const firstRowExcel = new Array();
        var areaCellIndex = 0;
        for (let c=0; c<excelTable.rows[1].cells.length; c++) {
            firstRowExcel.push(excelTable.rows[1].cells[c].innerHTML);
        }
        if (firstRowExcel.indexOf('Area') == -1) {
            alert('Your excel table does not contain an Area column.');
            return;
        }
        areaCellIndex = firstRowExcel.indexOf('Area');
        for (let r=2; r<excelTable.rows.length; r++) {
            areaValues.push(excelTable.rows[r].cells[areaCellIndex].innerHTML);
        }
        if (area == ''){
            alert('Please input your area value cutoff');
            resultsAllSection.style.display = 'none';
            results.innerHTML = '';
        } else{
            for (let i = 0; i < areaValues.length; i++){
                if (parseInt(areaValues[i]) >= parseInt(area)){ // values need to be Ints to be properly compared
                    markedArea.push(areaValues[i]);
                    markedAreaIndex.push(i);
                    resultsText += '&nbsp<b>Index '+(i+1)+':</b>&nbsp'+ areaValues[i]+'<br>';
                } else{
                    nonmarkedArea.push(areaValues[i]);
                }
            }
            if (resultsText){
                resultsAllSection.style.display = '';
                results.innerHTML = resultsText;
            }
            else{
                alert('You have no area values above your cutoff of: '+ area);
                document.getElementById('areaInput').value = '';
                results.innerHTML = '';
                resultsAllSection.style.display = 'none';
            }  
        }    
    }
}

// Reset values only function

function resetValues(){
    results.innerHTML = '';
    resultsAllSection.style.display = 'none';
    document.getElementById('areaInput').value = '';
}


// Testing function 

function displayFile(){
    file = document.getElementById('uploadFile').value;
    regex = new RegExp('[^.]+$')
    extension = file.match(regex);
    if (extension == 'txt'){
        console.log('TXT');
    }else if (extension == 'csv'){
        console.log('CSV');
        // code block
    }else if (extension == 'xlsx'){
        console.log('XLSX');
        // code block
    } else{
        alert ('Upload a file with only the formats requested.')
    }
} 


function readCSVFile(){
    var files = document.querySelector('#file').files;

    if(files.length > 0 ){

         // Selected file
         var file = files[0];

         // FileReader Object
         var reader = new FileReader();

         // Read file as string 
         reader.readAsText(file);

         // Load event
         reader.onload = function(event) {

              // Read file data
              var csvdata = event.target.result;

              // Split by line break to gets rows Array
              var rowData = csvdata.split('\n');

              // <table > <tbody>
              var tbodyEl = document.getElementById('tblcsvdata').getElementsByTagName('tbody')[0];
              tbodyEl.innerHTML = "";

              // Loop on the row Array (change row=0 if you also want to read 1st row)
              for (var row = 1; row < rowData.length; row++) {

                    // Insert a row at the end of table
                    var newRow = tbodyEl.insertRow();

                    // Split by comma (,) to get column Array
                    rowColData = rowData[row].split(',');

                    // Loop on the row column Array
                    for (var col = 0; col < rowColData.length; col++) {

                         // Insert a cell at the end of the row
                         var newCell = newRow.insertCell();
                         newCell.innerHTML = rowColData[col];

                    }

              }
         };

    }else{
         alert("Please select a file.");
    }

}



// const excel_file = document.getElementById('excel_file');

// excel_file.addEventListener('change', (event) => {

//     if(!['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'].includes(event.target.files[0].type))
//     {
//         document.getElementById('excel_data').innerHTML = '<div class="alert alert-danger">Only .xlsx or .xls file format are allowed</div>';

//         excel_file.value = '';

//         return false;
//     }

//     var reader = new FileReader();

//     reader.readAsArrayBuffer(event.target.files[0]);

//     reader.onload = function(event){

//         var data = new Uint8Array(reader.result);

//         var work_book = XLSX.read(data, {type:'array'});

//         var sheet_name = work_book.SheetNames;

//         var sheet_data = XLSX.utils.sheet_to_json(work_book.Sheets[sheet_name[0]], {header:1});

//         if(sheet_data.length > 0)
//         {
//             var table_output = '<table class="table table-striped table-bordered">';

//             for(var row = 0; row < sheet_data.length; row++)
//             {

//                 table_output += '<tr>';

//                 for(var cell = 0; cell < sheet_data[row].length; cell++)
//                 {

//                     if(row == 0)
//                     {

//                         table_output += '<th>'+sheet_data[row][cell]+'</th>';

//                     }
//                     else
//                     {

//                         table_output += '<td>'+sheet_data[row][cell]+'</td>';

//                     }

//                 }

//                 table_output += '</tr>';

//             }

//             table_output += '</table>';

//             document.getElementById('excel_data').innerHTML = table_output;
//         }

//         excel_file.value = '';

//     }

// });
