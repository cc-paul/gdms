var tblGenderIssue;
var tblGenderIssueID;
var tblGADStatement;
var tblGADStatementID;
var tblRelevantMFO;
var tblRelevantMFOID;
var tblPerformanceIndicator;
var tblPerformanceIndicatorID;
var tblBudget;
var tblBudgetID;
var tblResponsibleOffices;
var tblResponsibleOfficesID;
var tblFiles;
var tblFilesID;
var folderID = 0;
var selectedGADID = 0;
var selectedGAD = "";
var selectedGenderID = 0;
var selectedGender = 0;
var checFormEverySecond;
var selectedTab = 1;
var parentFolderID = makeid(10);
var loadedStatus = $("#lblParentStatus").text().trim();
var lblEnableSched = $("#lblEnableSched").text().trim();

if (lblEnableSched == "Yes") {
    $("#dvSched").hide();
    
    if (loadedStatus == "Draft") {
        parentFolderID = $("#lblParentFolderID").text().trim();
        
        $("#txtAllottedBudget").val($("#lblParentAmount").text().trim());
        $("#cmbYear").val($("#lblParentYear").text().trim()).trigger("change");
        
        setTimeout(function() {
            computeGAD();
        }, 100);
        
        $("#dvReminder").hide();
        $("#btnSignatory").prop("disabled", false);
        $("#btnSaveDraft").prop("disabled", false);
        $("#btnSubmitGBPFinal").prop("disabled", false);
        $("#btnAddActivity").prop("disabled", false);
        $("#btnDeleteActivity").prop("disabled", false);
    } else if (loadedStatus == null || loadedStatus == "") {
        $("#dvReminder").hide();
        $("#btnSignatory").prop("disabled", false);
        $("#btnSaveDraft").prop("disabled", false);
        $("#btnSubmitGBPFinal").prop("disabled", false);
        $("#btnAddActivity").prop("disabled", false);
        $("#btnDeleteActivity").prop("disabled", false);
    } else {
        $("#dvReminder").show();
        $("#btnSignatory").prop("disabled", true);
        $("#btnSaveDraft").prop("disabled", true);
        $("#btnSubmitGBPFinal").prop("disabled", true);
        $("#btnAddActivity").prop("disabled", true);
        $("#btnDeleteActivity").prop("disabled", true);
    }
} else {
    $("#dvSched").show();
    $("#btnSignatory").prop("disabled", true);
    $("#btnSaveDraft").prop("disabled", true);
    $("#btnSubmitGBPFinal").prop("disabled", true);
    $("#btnAddActivity").prop("disabled", true);
    $("#btnDeleteActivity").prop("disabled", true);
    
    if (loadedStatus == "Draft") {
        parentFolderID = $("#lblParentFolderID").text().trim();
        
        $("#txtAllottedBudget").val($("#lblParentAmount").text().trim());
        $("#cmbYear").val($("#lblParentYear").text().trim()).trigger("change");
        
        setTimeout(function() {
            computeGAD();
        }, 100);
        
        $("#dvReminder").hide();
    } else if (loadedStatus == null || loadedStatus == "") {
        $("#dvReminder").hide();
    } else {
        $("#dvReminder").show();
    }
}
    
    
$("#btnAddActivity").click(function(){
    if (selectedTab == 1 || selectedTab == 2) {
        checFormEverySecond = window.setInterval(function(){
            console.log("running");
        }, 1000);
        
        folderID = makeid(5);
        
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
        
        prepareGBP();
        
        $("#btnAddGenderIssue").click();
        $("#btnAddGADStatement").click();
        $("#btnAddRelevantMFO").click();
        $("#btnAddPerformanceIndicator").click();
        $("#btnAddBudget").click();
        $("#btnAddResponsibleOffices").click();
    } else {
        folderID = makeid(5);
        
        openAttr();
    }
});

function selectTab(tabID) {
    selectedTab = tabID;
    console.log(selectedTab);
    
    if (selectedTab == 3) {
        $("#btnAddActivity").html(`
            <i class="fa fa-file-text-o"></i>
                &nbsp;
				New Attributed Program
        `);
        
        setTimeout(function() {
            $("#cmbAttrXEntries").val(5).trigger("change");
        }, 500);
    } else {
        $("#btnAddActivity").html(`
            <i class="fa fa-file-text-o"></i>
                &nbsp;
				New Activity
        `);
        loadClientFocus();

        setTimeout(function() {
            $("#cmbClientXEntries").val(5).trigger("change");
        }, 500);
    }
    
    $("#lblFormTitle").text(tabID == 1 ? "Client Focused" : "Organization Focused");
}

$("#btnCloseGBP").click(function(){
    clearInterval(checFormEverySecond);
});

$("#btnGuide").click(function(){
	JAlert("Coming Soon","orange");
});

function prepareGBP() {
    $("#mdGBP").modal();
    
    $("#txtGenderIssueAddress").val(null);
    $("#txtGADAddress").val(null);
    $("#txtGADActivity").val(null);
    
    tblGenderIssueID = 0;
    tblGADStatementID = 0;
    tblRelevantMFOID = 0;
    tblPerformanceIndicatorID = 0;
    tblBudgetID = 0;
    tblResponsibleOfficesID = 0;
    
    $("#dvGenderIssueAddress").html(null);
    $("#dvGADAddress").html(null);
    $("#dvGenderIssue").html(null);
    $("#dvGADStatement").html(null);
    $("#dvGADActivity").html(null);
    $("#dvPerformanceIndicator").html(null);
    $("#dvBudget").html(null);
    $("#dvResponsibleOffices").html(null);
    $("#dvRelevantMFO").html(null);
    
    tblGenderIssue = 
    $('#tblGenderIssue').DataTable({
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
                        <textarea
                            id="txtGenderIssueAddress${row.id}"
                            name="txtGenderIssueAddress${row.id}"
                            rows="1"
                            class="form-control cust-label cust-textbox"
                            placeholder="Enter cause of Gender Issue"></textarea>
                    `;				
                }
            },
            { "data": "id",
                render: function(data, type, row) {
                    return `
                        <center>
                            <button
                                id="btnGenderIssueAddress${row.id}"
                                name="btnGenderIssueAddress${row.id}"
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
    
    tblGADStatement = 
    $('#tblGADStatement').DataTable({
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
                        <textarea
                            id="txtGADStatement${row.id}"
                            name="txtGADStatement${row.id}"
                            rows="1"
                            class="form-control cust-label cust-textbox"
                            placeholder="Enter Statement or Objective"></textarea>
                    `;				
                }
            },
            { "data": "id",
                render: function(data, type, row) {
                    return `
                        <center>
                            <button
                                id="btnGADStatement${row.id}"
                                name="btnGADStatement${row.id}"
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
    
    tblRelevantMFO = 
    $('#tblRelevantMFO').DataTable({
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
            { "data": "type",
                render: function(data, type, row) {
                    return `
                        <select
                            id="cmbRelevantMFO${row.id}"
                            name="cmbRelevantMFO${row.id}"
                            class="form-control select2 cust-label cust-textbox"
                            style="width: 150px;">
                                <option value="" selected disabled>Please Select Type</option>
                                <option>MFO</option>
                                <option>PAP</option>
                                <option>GASS</option>
                        </select>
                    `;				
                }
            },
            { "data": "description",
                render: function(data, type, row) {
                    return `
                        <textarea
                            id="txtRelevantMFO${row.id}"
                            name="txtRelevantMFO${row.id}"
                            rows="1"
                            class="form-control cust-label cust-textbox"
                            placeholder="Enter Statement"></textarea>
                    `;				
                }
            },
            { "data": "id",
                render: function(data, type, row) {
                    return `
                        <center>
                            <button
                                id="btnRelevantMFO${row.id}"
                                name="btnRelevantMFO${row.id}"
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
        	{"className": "dt-center", "targets": [1,2]},
            {"className": "custom-center", "targets": [2]},
            { "width": "22%", "targets": [0] },
        	{ "width": "1%", "targets": [2] }
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
    
    tblPerformanceIndicator = 
    $('#tblPerformanceIndicator').DataTable({
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
            { "data": "performance",
                render: function(data, type, row) {
                    return `
                        <textarea
                            id="txtPerformanceIndicator${row.id}"
                            name="txtPerformanceIndicator${row.id}"
                            rows="1"
                            class="form-control cust-label cust-textbox"
                            placeholder="Enter Performance Indicator"></textarea>
                    `;				
                }
            },
            { "data": "target",
                render: function(data, type, row) {
                    return `
                        <textarea
                            id="txtPerformanceTarget${row.id}"
                            name="txtPerformanceTarget${row.id}"
                            rows="1"
                            class="form-control cust-label cust-textbox"
                            placeholder="Enter Target"></textarea>
                    `;				
                }
            },
            { "data": "id",
                render: function(data, type, row) {
                    return `
                        <center>
                            <button
                                id="btnPerformanceIndicator${row.id}"
                                name="btnPerformanceIndicator${row.id}"
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
        	{"className": "dt-center", "targets": [1,2]},
            {"className": "custom-center", "targets": [2]},
        	{ "width": "1%", "targets": [2] }
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
    
    tblBudget = 
    $('#tblBudget').DataTable({
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
                            id="cmbBudgetSource${row.id}"
                            name="cmbBudgetSource${row.id}"
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
                            id="txtBudgetItem${row.id}"
                            name="txtBudgetItem${row.id}"
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
                            id="txtBudgetAmount${row.id}"
                            name="txtBudgetAmount${row.id}"
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
                                id="btnBudget${row.id}"
                                name="btnBudget${row.id}"
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
    
    tblResponsibleOffices = 
    $('#tblResponsibleOffices').DataTable({
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
                        <textarea
                            id="txtResponsibleOffices${row.id}"
                            name="txtResponsibleOffices${row.id}"
                            rows="1"
                            class="form-control cust-label cust-textbox"
                            placeholder="Enter Responsible Offices"></textarea>
                    `;				
                }
            },
            { "data": "id",
                render: function(data, type, row) {
                    return `
                        <center>
                            <button
                                id="btnResponsibleOffices${row.id}"
                                name="btnResponsibleOffices${row.id}"
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
    
    tblFiles = 
    $('#tblFiles').DataTable({
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
    
    tblGenderIssue.clear().draw();
    tblGADStatement.clear().draw();
    tblRelevantMFO.clear().draw();
    tblPerformanceIndicator.clear().draw();
    tblBudget.clear().draw();
    tblResponsibleOffices.clear().draw();
    tblFiles.clear().draw();
}

$("#btnAddGenderIssue").click(function(){
	tblGenderIssue.row.add({
        "description" : "",
        "id" : ++tblGenderIssueID
    }).draw( false );
});

$('#tblGenderIssue tbody').on('click', 'td button', function (){
	tblGenderIssue.row($(this).parents('tr')).remove().draw();
});

$("#btnAddGADStatement").click(function(){
	tblGADStatement.row.add({
        "description" : "",
        "id" : ++tblGADStatementID
    }).draw( false );
});

$('#tblGADStatement tbody').on('click', 'td button', function (){
	tblGADStatement.row($(this).parents('tr')).remove().draw();
});

$("#btnAddRelevantMFO").click(function(){
	tblRelevantMFO.row.add({
        "type" : "",
        "description" : "",
        "id" : ++tblRelevantMFOID
    }).draw( false );
    
    $(`#cmbRelevantMFO${tblRelevantMFOID}`).select2();
});

$('#tblRelevantMFO tbody').on('click', 'td button', function (){
	tblRelevantMFO.row($(this).parents('tr')).remove().draw();
});

$("#btnAddPerformanceIndicator").click(function(){
	tblPerformanceIndicator.row.add({
        "performance" : "",
        "target" : "",
        "id" : ++tblPerformanceIndicatorID
    }).draw( false );
});

$('#tblPerformanceIndicator tbody').on('click', 'td button', function (){
	tblPerformanceIndicator.row($(this).parents('tr')).remove().draw();
});

$("#btnAddBudget").click(function(){
	tblBudget.row.add({
        "source" : "",
        "item" : "",
        "budget" : "",
        "id" : ++tblBudgetID
    }).draw( false );
    
    $(`#cmbBudgetSource${tblBudgetID}`).select2();
});

$('#tblBudget tbody').on('click', 'td button', function (){
	tblBudget.row($(this).parents('tr')).remove().draw();
});

$("#btnAddResponsibleOffices").click(function(){
	tblResponsibleOffices.row.add({
        "description" : "",
        "id" : ++tblResponsibleOfficesID
    }).draw( false );
});

$('#tblResponsibleOffices tbody').on('click', 'td button', function (){
	tblResponsibleOffices.row($(this).parents('tr')).remove().draw();
});

$("#txtFile").change(function(){
    var file_data = $('#txtFile').prop('files')[0];
    var fileInput = document.getElementById('txtFile');   
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
                $("#txtFile").val(null);
                            
                tblFiles.row.add({
                    "description" : filename,
                    "id" : ++tblFilesID
                }).draw( false );
            }
        }
    });
});


$('#tblFiles tbody').on('click', 'td button', function (){
    var data = tblFiles.row( $(this).parents('tr') ).data();
    
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
    
    tblFiles.row($(this).parents('tr')).remove().draw();
});



function clearContent(id) {
    $(`#${id}`).val(null);
}

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

function getFileNameWithExt(event) {

    if (!event || !event.target || !event.target.files || event.target.files.length === 0) {
        return;
    }
    
    const name = event.target.files[0].name;
    const lastDot = name.lastIndexOf('.');
    const fileName = name.substring(0, lastDot);
  
    return name.substring(lastDot + 1);
}

ddYear();

function ddYear() {
    var startYear = 2023;
    var latestYear = new Date().getFullYear();
    
    if (startYear == latestYear) {
        $('#cmbYear').append($('<option>', {
            value: 2023,
            text : 2023
        }));
    }
    
    for (var i = startYear; i < latestYear; i++) {
        $('#cmbYear').append($('<option>', {
            value: i,
            text : i
        }));
    }
}

$('#txtAllottedBudget').keyup(function(event) {
    // skip for arrow keys
    if(event.which >= 37 && event.which <= 40) return;
    
    // format number
    $(this).val(function(index, value) {
      return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    });
});
