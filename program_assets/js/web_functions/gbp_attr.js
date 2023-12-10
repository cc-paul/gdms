var tblBudget_attr;
var tblBudget_attrID;
var tblFiles_attr;
var tblFiles_attrID;

$('#tblAttrMain tbody').on('click', '.edit', function (){
	var data = tblAttrMain.row( $(this).parents('tr') ).data();
    var curfolderID = data.folderID;
    
    folderID = curfolderID;
    
    openAttr();
    
    setTimeout(function() {
        $("#txtProgram").val(data.program);
        
        if (data.arrBudget != "" || data.arrBudget != null) {
            var arrData = data.arrBudget.split('~~');
            
            for(var i = 0; i < arrData.length; i++) {
                var [source,item,budget] = arrData[i].split('~');
               
                tblBudget_attr.row.add({
                    "source" : "",
                    "item" : "",
                    "budget" : "",
                    "id" : ++tblBudget_attrID
                }).draw( false );
                
                $(`#cmbBudgetSource_attr${tblBudget_attrID}`).select2();
                
                $(`#cmbBudgetSource_attr${tblBudget_attrID}`).val(source).trigger("change");
                $(`#txtBudgetItem_attr${tblBudget_attrID}`).val(item);
                $(`#txtBudgetAmount_attr${tblBudget_attrID}`).val(budget.replaceAll(".00",""));
            }
        }
        
        
        if (data.files != "" || data.files != null) {
            var arrData = data.files.split(',');
            
            for(var i = 0; i < arrData.length; i++) {
                tblFiles_attr.row.add({
                    "description" : arrData[i],
                    "id" : ++tblFiles_attrID
                }).draw( false );
            }
        }
    }, 500);
});


function openAttr() {
    $("#txtProgram").val(null);
    
    tblBudget_attrID = 0;
    tblFiles_attrID = 0;
    
    $("#dvProgram").html(null);
    $("#dvBudget_attr").html(null);
    
    $.ajax({
        url: "../program_assets/php/web/gbp",
        data: {
            command : 'create_folder',
            folderID : folderID
        },
        type: 'post',
        success: function (data) {
            var data = jQuery.parseJSON(data);
            
            if (data[0].error) {
                JAlert(data[0].message,data[0].color);
            }
        }
    });
    
    tblBudget_attr = 
    $('#tblBudget_attr').DataTable({
        'destroy'       : true,
        'paging'        : false,
        'lengthChange'  : false,
        'pageLength'    : 15,
        "ordering"      : false,
        'info'          : true,
        'autoWidth'     : false,
        'select'        : true,
        'sDom'			: 'tp<"clear">',
        'fnRowCallback' : function( nRow, aData, iDisplayIndex ) {
            $('td', nRow).attr('nowrap','nowrap');
            return nRow;
        },
        'aoColumns' : [
            { "data": "source",
                render: function(data, type, row) {
                    return `
                        <select
                            id="cmbBudgetSource_attr${row.id}"
                            name="cmbBudgetSource_attr${row.id}"
                            class="form-control select2 cust-label cust-textbox"
                            style="width: 100%;">
                                <option value="" selected disabled>Please Select Source</option>
                                <option value="GAA">GAA</option>
                                <option value="ODA">ODA</option>
                                <option value="Corporate Funds">Corporate Funds</option>
                                <option value="Legacy Funded Project">Legacy Funded Project</option>
                                <option value="Government Subsidy">Government Subsidy</option>
                                <option value="Others (not GAA)">Others (not GAA)</option>
                        </select>
                    `;				
                }
            },
            { "data": "item",
                render: function(data, type, row) {
                    return `
                        <textarea
                            id="txtBudgetItem_attr${row.id}"
                            name="txtBudgetItem_attr${row.id}"
                            rows="1"
                            class="form-control cust-label cust-textbox"
                            placeholder="Enter Budget Item"></textarea>
                    `;				
                }
            },
            { "data": "budget",
                render: function(data, type, row) {
                    return `
                        <input type="number"
                            style="width: 100%;"
                            id="txtBudgetAmount_attr${row.id}"
                            name="txtBudgetAmount_attr${row.id}"
							oninput="this.value = 
							!!this.value && Math.abs(this.value) >= 0 ? Math.abs(this.value) : null"
                            class="form-control cust-label cust-textbox"
                            placeholder="Enter Budget">
                    `;				
                }
            },
            { "data": "id",
                render: function(data, type, row) {
                    return `
                        <center>
                            <button
                                id="btnBudget_attr${row.id}"
                                name="btnBudget_attr${row.id}"
                                type="submit"
                                class="btn btn-default btn-sm">
                                <i class="fa fa-trash"></i>
                            </button>
                        </center>
                    `;
                }
            }
        ],
        'aoColumnDefs': [
        	{"className": "dt-center", "targets": [1,2,3]},
            {"className": "custom-center", "targets": [3]},
            { "width": "22%", "targets": [0] },
        	{ "width": "1%", "targets": [3] }
        ],
        "drawCallback": function() {  
            row_count = this.fnSettings().fnRecordsTotal();
        },
        "fnInitComplete": function (oSettings, json) {
            console.log('DataTables has finished its initialisation.');
        }
    }).on('user-select', function (e, dt, type, cell, originalEvent) {
        if ($(cell.node()).parent().hasClass('selected')) {
            e.preventDefault();
        }
    });
    
    tblFiles_attr = 
    $('#tblFiles_attr').DataTable({
        'destroy'       : true,
        'paging'        : false,
        'lengthChange'  : false,
        'pageLength'    : 15,
        "ordering"      : false,
        'info'          : true,
        'autoWidth'     : false,
        'select'        : true,
        'sDom'			: 'tp<"clear">',
        'fnRowCallback' : function( nRow, aData, iDisplayIndex ) {
            $('td', nRow).attr('nowrap','nowrap');
            return nRow;
        },
        'aoColumns' : [
            { "data": "description",
                render: function(data, type, row) {
                    return `
                        <a
                            id="aFiles${row.id}"
                            name="aFiles${row.id}"
                            onclick="downLoadFile('${folderID}','${row.description}')"
                            href="#">
                            ${row.description}
                        </a>
                    `;				
                }
            },
            { "data": "id",
                render: function(data, type, row) {
                    return `
                        <center>
                            <button
                                id="btnFiles${row.id}"
                                name="btnFiles${row.id}"
                                type="submit"
                                class="btn btn-default btn-sm">
                                <i class="fa fa-trash"></i>
                            </button>
                        </center>
                    `;
                }
            }
        ],
        'aoColumnDefs': [
        	{"className": "dt-center", "targets": [0,1]},
            {"className": "custom-center", "targets": [1]},
        	{ "width": "1%", "targets": [1] }
        ],
        "drawCallback": function() {  
            row_count = this.fnSettings().fnRecordsTotal();
        },
        "fnInitComplete": function (oSettings, json) {
            console.log('DataTables has finished its initialisation.');
        }
    }).on('user-select', function (e, dt, type, cell, originalEvent) {
        if ($(cell.node()).parent().hasClass('selected')) {
            e.preventDefault();
        }
    });
    
    
    tblBudget_attr.clear().draw();
    tblFiles_attr.clear().draw();
    
    $("#mdAttr").modal();
}

$("#btnAddBudget_attr").click(function(){
	tblBudget_attr.row.add({
        "source" : "",
        "item" : "",
        "budget" : "",
        "id" : ++tblBudget_attrID
    }).draw( false );
    
    $(`#cmbBudgetSource_attr${tblBudget_attrID}`).select2();
});

$('#tblBudget_attr tbody').on('click', 'td button', function (){
	tblBudget_attr.row($(this).parents('tr')).remove().draw();
});

$("#txtFile_attr").change(function(){
    var file_data = $('#txtFile_attr').prop('files')[0];
    var fileInput = document.getElementById('txtFile_attr');   
    var filename = fileInput.files[0].name;
    var form_data = new FormData();
    
	const fileSizeInMB = file_data.size / 1024 / 1024; 

	if (fileSizeInMB > 20) {
		JAlert('File size exceeds 20MB. Please choose a smaller file.','orange');
		$("#file_uploader").val(null);
		
		return;
	}
	
	
    form_data.append('file', file_data);    
    form_data.append('fileName', filename);
    form_data.append('folderID', folderID);
    form_data.append('command', 'upload_file');
    $.ajax({
        url: "../program_assets/php/web/gbp",
        dataType: 'text',
        cache: false,
        contentType: false,
        processData: false,
        data: form_data,
        type: 'post',
        success: function(data) {
            var data = jQuery.parseJSON(data);
            
            if (data[0].error) {
                JAlert(data[0].message,data[0].color);
            } else {                    
                $("#txtFile_attr").val(null);
                            
                tblFiles_attr.row.add({
                    "description" : filename,
                    "id" : ++tblFiles_attrID
                }).draw( false );
            }
        }
    });
});

$('#tblFiles_attr tbody').on('click', 'td button', function (){
    var data = tblFiles_attr.row( $(this).parents('tr') ).data();
    
    $.ajax({
        url: "../program_assets/php/web/gbp",
        data: {
            command   : 'remove_file',
            fileName  : data.description,
            folderID  : folderID
        },
        type: 'post',
        success: function (data) {
            var data = jQuery.parseJSON(data);
            
            JAlert(data[0].message,data[0].color);
        }
    });
    
    tblFiles_attr.row($(this).parents('tr')).remove().draw();
});