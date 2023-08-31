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
                console.log(sheet_data);
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
        console.log(sheet_data);
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
    if (extension == 'txt'){
        var text = document.getElementById('my_file_output').textContent;
        var textSplitedbyLine = text.split('\n');
        textSplitedbyLine = textSplitedbyLine.slice(0, textSplitedbyLine.length -1);
        const arrName = new Array();
        arrName.push(textSplitedbyLine[0].split('\t'));
        const areaValues = new Array();
        var markedArea = [];
        var markedAreaIndex = [];
        var nonmarkedArea = [];
        var resultsText = '';
        if (arrName[0].indexOf('Area' != -1)){
            var areaIndex = arrName[0].indexOf('Area');
        } else{
            alert('Your txt file does not have a Area column.');
        }
        for (var i = 1; i < textSplitedbyLine.length; i++){
            var line = textSplitedbyLine[i].split('\t');
            areaValues.push(line[areaIndex]);
        }
        for (var i = 0; i < areaValues.length; i++){
            if (areaValues[i] >= area){
                markedArea.push(areaValues[i]);
                markedAreaIndex.push(i);
                resultsText += 'Line '+(i+1)+': '+ areaValues[i]+'<br>';
            } else{
                nonmarkedArea.push(areaValues[i]);
            }
        }
        resultsAllSection.style.display = '';
        results.innerHTML = resultsText;
    } else if (extension == 'csv'){

    }
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
