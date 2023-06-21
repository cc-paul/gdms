var tblAccTable;
var cur_parentFolderID;
var tblBudget_attrID = 0;
var tblFiles_attrID = 0;
var curfolderID;    
var selectedTab = 1;

loadAcc();

$('#txtSearchAcc').keyup(function(){
    tblAccTable.search($(this).val()).draw() ;
});

$('#txtSearchClientFocus').keyup(function(){
    tblClientFocus.search($(this).val()).draw() ;
});

$("#btnExport").click(function(){
	$(".btn-export-acc").click();
});

$(document).ready(function(){
  setTimeout(function() {
    try {
      var row = tblAccTable.row(0);
      var button = row.node().querySelector('.gbp-acc-view');
      button.click();
    }
    catch(err) {
      $("#btnViewGBP").prop("disabled", true);
      $("#btnSubmitGBPFinal").prop("disabled", true);
    }
  }, 1000);
});

$('#tblAccTable tbody').on('click', 'td button', function (){
	var data = tblAccTable.row( $(this).parents('tr') ).data();
     
  $("#spDateEndorse").text(data.dateEndorse);
  $("#spCollege").text(data.college);
  $("#spTotalGAA").text(data.totalAmount);
  
  
  
  activaTab('tab1');
  loadClientFocus(1,data.parentFolderID);
  cur_parentFolderID = data.parentFolderID;
  
  $("#txtSearchClientFocus").val("");
  $("#txtSearchAttr").val("");
  
  
  getTotalUtils();
  
  //$("#mdViewGBP").modal();
});

$("#btnSubmitGBPFinal").click(function(){
  $.ajax({
    url: "../program_assets/php/web/accomplishment.php",
    data: {
      command   : 're_endorse',
      parentFolderID : cur_parentFolderID
    },
    type: 'post',
    success: function (data) {
      var data = jQuery.parseJSON(data);
      
      JAlert(data[0].message,data[0].color);
      
      if (!data[0].error) {
        setTimeout(function() {
          location.reload();
        }, 1500);   
      }
    }
  });
});

function getTotalUtils() {
  $.ajax({
    url: "../program_assets/php/web/accomplishment",
    data: {
      command   : 'all_cost',
      parentFolderID : cur_parentFolderID
    },
    type: 'post',
    success: function (data) {
      var data = jQuery.parseJSON(data);
      
      console.log(data);
      
      $("#spTotalExpenditure").text(data[0].totalExpense);
      $("#spOriginalBudget").text(data[0].totalBudget);
      
      var percent_util = (Number(data[0].totalExpense.replaceAll(",","")) / Number(data[0].totalBudget.replaceAll(",",""))) * 100;
      var percent_gad =  (Number(data[0].totalExpense.replaceAll(",","")) / Number($("#spTotalGAA").text().replaceAll(",",""))) * 100;
      
      $("#spUtilBudget").text(percent_util.toFixed(2));
      $("#spGADExp").text(percent_gad.toFixed(2));
    }
  });
}

function selectTab(tabID) {
    selectedTab = tabID;
    console.log(selectedTab);
    
    if (selectedTab == 3) {
        loadAttr();
    } else {
        loadClientFocus(selectedTab,cur_parentFolderID);
    }
}

function activaTab(tab){
  $('.nav-tabs a[href="#' + tab + '"]:first').tab('show');
};

function loadAcc() {
    tblAccTable = 
    $('#tblAccTable').DataTable({
        'destroy'       : true,
        'paging'        : true,
        'lengthChange'  : false,
        'pageLength'    : 15,
        "order"         : [],
        'info'          : true,
        'autoWidth'     : false,
        'select'        : true,
        'sDom'			: 'Btp<"clear">',
        //dom: 'Bfrtip',
        buttons: [{
            extend: "excel",
            className: "btn btn-default btn-sm hide btn-export-acc",
            titleAttr: 'Export in Excel',
            text: 'Export in Excel',
            init: function(api, node, config) {
               $(node).removeClass('dt-button buttons-excel buttons-html5')
            }
        }],
        'fnRowCallback' : function( nRow, aData, iDisplayIndex ) {
            $('td', nRow).attr('nowrap','nowrap');
            return nRow;
        },
        'ajax'          : {
        	'url'       : '../program_assets/php/web/accomplishment.php',
        	'type'      : 'POST',
        	'data'      : {
        		command : 'load_acc'
        	}    
        },
        'aoColumns' : [
        	{ mData: 'reportType'},
            { mData: 'college'},
            { mData: 'year'},
            { mData: 'status'},
            { mData: 'totalAmount'},
            { mData: 'fullName'},
            { mData: 'id',
                render: function (data,type,row) {
                    var enableEdit = row.status == 'Draft' ? '' : ' disabled';
                    var enableView = row.status != 'Draft' ? '' : ' disabled';
                    
                    return '<div class="input-group">' + 
                           '	<button id="list_' + row.id + '" name="list_' + row.id + '" type="submit" class="btn btn-default btn-xs dt-button list gbp-acc-view" '+ enableView +'>' +
                           '		<i class="fa fa-eye"></i>' +
                           '	</button>' +
                           '</div>';
                }
            }
        ],
        'aoColumnDefs': [
        //	{"className": "custom-center", "targets": [8]},
        	{"className": "dt-center", "targets": [0,1,2,3,4,5]},
        	{ "width": "1%", "targets": [6] },
        //	{"className" : "hide_column", "targets": [9]} 
        ],
        "drawCallback": function() {  
            row_count = this.fnSettings().fnRecordsTotal();
        },
        //"fnRowCallback": function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
        //	console.log(aData["status"]);
        //	
        //	if (aData["status"] == "Pending") {
        //		count_pending++;
        //	} else if (aData["status"] == "Approved") {
        //		count_approved++;
        //	} else {
        //		count_rejected++;
        //	}
        //},
        "fnInitComplete": function (oSettings, json) {
            console.log('DataTables has finished its initialisation.');
        }
    }).on('user-select', function (e, dt, type, cell, originalEvent) {
        if ($(cell.node()).parent().hasClass('selected')) {
            e.preventDefault();
        }
    });
}

$("#cmbClientXEntries").on("change", function() {
    var val = $(this).val();
    changeClientFocusRow(val);
});

function changeClientFocusRow(row) {
    tblClientFocus.page.len(row).draw('page');
    tblClientFocus.page.len(row).draw();
}

$("#cmbAttrXEntries").on("change", function() {
    var val = $(this).val();
    changeAttrRow(val);
});

function changeAttrRow(row) {
    tblAttrMain.page.len(row).draw('page');
    tblAttrMain.page.len(row).draw();
}

$('#txtSearchAttr').keyup(function(){
    tblAttrMain.search($(this).val()).draw() ;
});

$('#tblAttrMain tbody').on('click', '.view', function (){
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
        
        
        if (data.files != null) {
          if (data.files != null || data.files != "") {
              var arrData = data.files.split(',');
              
              for(var i = 0; i < arrData.length; i++) {
                  tblFiles_attr.row.add({
                      "description" : arrData[i],
                      "id" : ++tblFiles_attrID
                  }).draw( false );
              }
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
    
    //$.ajax({
    //    url: "../program_assets/php/web/gbp",
    //    data: {
    //        command : 'create_folder',
    //        folderID : folderID
    //    },
    //    type: 'post',
    //    success: function (data) {
    //        var data = jQuery.parseJSON(data);
    //        
    //        if (data[0].error) {
    //            JAlert(data[0].message,data[0].color);
    //        }
    //    }
    //});
    
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
                            style="width: 100%;" disabled>
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
                            placeholder="Enter Budget Item" disabled></textarea>
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
                            class="form-control cust-label cust-textbox"
                            placeholder="Enter Budget" disabled>
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
                                class="btn btn-default btn-sm" disabled>
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
                                <i class="fa fa-trash" disabled></i>
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

$('#tblClientFocus tbody').on('click', '.view', function (){
    var data = tblClientFocus.row( $(this).parents('tr') ).data();
    var curfolderID = data.folderID;
    
    prepareGBP();
    
    setTimeout(function() {
        $("#txtGenderIssueAddress").val(data.gender);
        $("#txtGADAddress").val(data.gad);
        $("#txtGADActivity").val(data.gadActivity);
        
        selectedGADID = data.gadID;
        selectedGAD = $("#txtGADAddress").val();
        selectedGenderID = data.genderID;
        selectedGender = $("#txtGenderIssueAddress").val();
        
        if (data.arrBudget != "" || data.arrBudget != null) {
            var arrData = data.arrBudget.split('~~');
            
            for(var i = 0; i < arrData.length; i++) {
                var [source,item,budget] = arrData[i].split('~');
               
                tblBudget.row.add({
                    "source" : "",
                    "item" : "",
                    "budget" : "",
                    "id" : ++tblBudgetID
                }).draw( false );
                
                $(`#cmbBudgetSource${tblBudgetID}`).select2();
                
                $(`#cmbBudgetSource${tblBudgetID}`).val(source).trigger("change");
                $(`#txtBudgetItem${tblBudgetID}`).val(item);
                $(`#txtBudgetAmount${tblBudgetID}`).val(budget.replaceAll(".00",""));
            }
        }
        
        console.log(data.arrFiles.length);
        
        if (data.arrFiles != "" || data.arrFiles != null) {
            var arrData = data.arrFiles.split('~~');
            
            if (arrData != '') {
                for(var i = 0; i < arrData.length; i++) {
                    tblFiles.row.add({
                        "description" : arrData[i],
                        "id" : ++tblFilesID
                    }).draw( false );
                }
            }
        }
        
        if (data.arrGADResult != "" || data.arrGADResult != null) {
            var arrData = data.arrGADResult.split('~~');
            
            for(var i = 0; i < arrData.length; i++) {
                tblGADStatement.row.add({
                    "description" : "",
                    "id" : ++tblGADStatementID
                }).draw( false );
                
                $(`#txtGADStatement${tblGADStatementID}`).val(arrData[i]);
            }
        }
        
        if (data.arrGenderIssue != "" || data.arrGenderIssue != null) {
            var arrData = data.arrGenderIssue.split('~~');
            
            for(var i = 0; i < arrData.length; i++) {
                tblGenderIssue.row.add({
                    "description" : "",
                    "id" : ++tblGenderIssueID
                }).draw( false );
                
                $(`#txtGenderIssueAddress${tblGenderIssueID}`).val(arrData[i]);
            }
        }
        
        if (data.arrMFO != "" || data.arrMFO != null) {
            var arrData = data.arrMFO.split('~~');
            
            for(var i = 0; i < arrData.length; i++) {
                var [type,description] = arrData[i].split('~');
                
                tblRelevantMFO.row.add({
                    "type" : "",
                    "description" : "",
                    "id" : ++tblRelevantMFOID
                }).draw( false );
                
                $(`#cmbRelevantMFO${tblRelevantMFOID}`).select2();
                $(`#cmbRelevantMFO${tblRelevantMFOID}`).val(type).trigger("change");
                $(`#txtRelevantMFO${tblRelevantMFOID}`).val(description);
            }
        }
        
        if (data.arrOffices != "" || data.arrOffices != null) {
            var arrData = data.arrOffices.split('~~');
            
            for(var i = 0; i < arrData.length; i++) {
                tblResponsibleOffices.row.add({
                    "description" : "",
                    "id" : ++tblResponsibleOfficesID
                }).draw( false );
                
                $(`#txtResponsibleOffices${tblResponsibleOfficesID}`).val(arrData[i]);
            }
        }
        
        
        if (data.arrPerformanceIndicator != "" || data.arrPerformanceIndicator != null) {
            var arrData = data.arrPerformanceIndicator.split('~~');
            
            for(var i = 0; i < arrData.length; i++) {
                var [performance,target] = arrData[i].split('~');
                
                tblPerformanceIndicator.row.add({
                    "performance" : "",
                    "target" : "",
                    "id" : ++tblPerformanceIndicatorID
                }).draw( false );
                
                $(`#txtPerformanceIndicator${tblPerformanceIndicatorID}`).val(performance);
                $(`#txtPerformanceTarget${tblPerformanceIndicatorID}`).val(target);
            }
        }
        
    }, 1500);
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
                            placeholder="Enter cause of Gender Issue" disabled></textarea>
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
                                class="btn btn-default btn-sm" disabled>
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
                            placeholder="Enter Statement or Objective" disabled></textarea>
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
                                class="btn btn-default btn-sm" disabled>
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
                            style="width: 150px;" disabled>
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
                            placeholder="Enter Statement" disabled></textarea>
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
                                class="btn btn-default btn-sm" disabled>
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
                            placeholder="Enter Performance Indicator" disabled></textarea>
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
                            placeholder="Enter Target" disabled></textarea>
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
                                class="btn btn-default btn-sm" disabled>
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
                            style="width: 100%;" disabled>
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
                            placeholder="Enter Budget Item" disabled></textarea>
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
                            class="form-control cust-label cust-textbox"
                            placeholder="Enter Budget" disabled>
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
                                class="btn btn-default btn-sm" disabled>
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
                            placeholder="Enter Responsible Offices" disabled></textarea>
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
                                class="btn btn-default btn-sm" disabled>
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
                                class="btn btn-default btn-sm" disabled>
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

function loadClientFocus(selectedTab,parentFolderID) {
    tblClientFocus = 
    $('#tblClientFocus').DataTable({
        'destroy'       : true,
        'paging'        : true,
        'lengthChange'  : false,
        'pageLength'    : 5,
        "order"         : [],
        'info'          : true,
        'autoWidth'     : false,
        'select'        : true,
        'sDom'			: 'Btp<"clear">',
        //dom: 'Bfrtip',
        buttons: [{
            extend: "excel",
            className: "btn btn-default btn-sm hide btn-export-admin",
            titleAttr: 'Export in Excel',
            text: 'Export in Excel',
            init: function(api, node, config) {
               $(node).removeClass('dt-button buttons-excel buttons-html5')
            }
        }],
        'fnRowCallback' : function( nRow, aData, iDisplayIndex ) {
            $('td', nRow).attr('nowrap','nowrap');
            return nRow;
        },
        'ajax'          : {
        	'url'       : '../program_assets/php/web/accomplishment.php',
        	'type'      : 'POST',
        	'data'      : {
        		command : 'load_activity',
                tab : selectedTab,
                parentFolderID : parentFolderID
        	}    
        },
        'aoColumns' : [
        	{ mData: 'gender',
                render: function (data,type,row) {
                    return `
                        <span style="white-space:normal"><b>Gender Issue : </b>${row.gender}</span>
                        <br>
                        <br>
                        <span style="white-space:normal"><b>GAD Mandate : </b>${row.gad}</span>
                    `;
                }
            },
            { mData: 'gadActivity',
                render: function (data,type,row) {
                    return `
                        <span style="white-space:normal">${row.gadActivity}</span>
                    `;
                }
            },
            { mData: 'budget',
                render: function (data,type,row) {
                    return `
                        <span style="white-space:normal">${row.budget}</span>
                    `;
                }
            },
            { mData: 'actualCost',
              render: function (data,type,row) {
                  
                  var strCost = "";
                  
                  if (row.actualCost != "") {
                    var arrCost = row.actualCost.split('~~');
                  
                    for(var i = 0; i < arrCost.length; i++) {
                      var [source,item,expense] = arrCost[i].split('~');
                      
                      strCost += `
                        <span style="white-space:normal"><b>Source : </b>${source}</span>
                        <br>
                        <span style="white-space:normal"><b>Item : </b>${item}</span>
                        <br>
                        <span style="white-space:normal"><b>Expense : </b>${expense}</span>
                        <br>
                        <br>
                      `;
                    }
                  }
                
                  return strCost;
              }
            },
            { mData: 'varianceRemarks',
              render: function (data,type,row) {
                  
                  var strVariance = "";
                  
                  if (row.varianceRemarks != "") {
                    var arrVariance = row.varianceRemarks.split('~~');
                  
                    for(var i = 0; i < arrVariance.length; i++) {
                      var [variance,remarks] = arrVariance[i].split('~');
                      
                      strVariance += `
                        <span style="white-space:normal"><b>Variance : </b>${variance}</span>
                        <br>
                        <span style="white-space:normal"><b>Remarks : </b>${remarks}</span>
                        <br>
                        <br>
                      `;
                    }
                  }
                
                  return strVariance;
              }
            },
            { mData: 'id',
                render: function (data,type,row) {
                    return `
                        <button type="button" class="btn btn-default view">
                            <i class="fa fa-eye"></i>
                        </button>
                        <button type="button" class="btn btn-default edit">
                            <i class="fa fa-edit"></i>
                        </button>
                    `;
                }
            }
        ],
        'aoColumnDefs': [
        	//{"className": "custom-center", "targets": [3,4]},
        	{ "width": "30%", "targets": [0,1,3,4] },
            { "width": "1%", "targets": [2] }
        //	{"className" : "hide_column", "targets": [9]} 
        ],
        "drawCallback": function() {  
            row_count = this.fnSettings().fnRecordsTotal();
        },
        //"fnRowCallback": function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
        //	console.log(aData["status"]);
        //	
        //	if (aData["status"] == "Pending") {
        //		count_pending++;
        //	} else if (aData["status"] == "Approved") {
        //		count_approved++;
        //	} else {
        //		count_rejected++;
        //	}
        //},
        "fnInitComplete": function (oSettings, json) {
            //computeGAD();
        }
    }).on('user-select', function (e, dt, type, cell, originalEvent) {
        if ($(cell.node()).parent().hasClass('selected')) {
            e.preventDefault();
        }
    });
    
    tblClientFocus2 = 
    $('#tblClientFocus2').DataTable({
        'destroy'       : true,
        'paging'        : true,
        'lengthChange'  : false,
        'pageLength'    : 15,
        "order"         : [],
        'info'          : true,
        'autoWidth'     : false,
        'select'        : true,
        'sDom'			: 'Btp<"clear">',
        //dom: 'Bfrtip',
        buttons: [{
            extend: "excel",
            className: "btn btn-default btn-sm hide btn-export-admin",
            titleAttr: 'Export in Excel',
            text: 'Export in Excel',
            init: function(api, node, config) {
               $(node).removeClass('dt-button buttons-excel buttons-html5')
            }
        }],
        'fnRowCallback' : function( nRow, aData, iDisplayIndex ) {
            $('td', nRow).attr('nowrap','nowrap');
            return nRow;
        },
        'ajax'          : {
        	'url'       : '../program_assets/php/web/accomplishment.php',
        	'type'      : 'POST',
        	'data'      : {
        		command : 'load_activity2',
                tab : selectedTab,
                parentFolderID : parentFolderID
        	}    
        },
        'aoColumns' : [
        	{ mData: 'gender',
                render: function (data,type,row) {
                    return `
                        <span style="white-space:normal"><b>Gender Issue : </b>${row.gender}</span>
                        <br>
                        <br>
                        <span style="white-space:normal"><b>GAD Mandate : </b>${row.gad}</span>
                    `;
                }
            },
            { mData: 'gadActivity',
                render: function (data,type,row) {
                    return `
                        <span style="white-space:normal">${row.gadActivity}</span>
                    `;
                }
            },
            { mData: 'budget',
                render: function (data,type,row) {
                    return `
                        <span style="white-space:normal">${row.budget}</span>
                    `;
                }
            },
            { mData: 'actualCost'},
            { mData: 'varianceRemarks'},
            { mData: 'id',
                render: function (data,type,row) {
                    return `
                        <button type="button" class="btn btn-default view">
                            <i class="fa fa-eye"></i>
                        </button>
                        <button type="button" class="btn btn-default edit">
                            <i class="fa fa-edit"></i>
                        </button>
                    `;
                }
            }
        ],
        'aoColumnDefs': [
        	{"className": "custom-center", "targets": [3,4]},
        	{ "width": "30%", "targets": [0,1,2] },
        //	{"className" : "hide_column", "targets": [9]} 
        ],
        "drawCallback": function() {  
            row_count = this.fnSettings().fnRecordsTotal();
        },
        //"fnRowCallback": function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
        //	console.log(aData["status"]);
        //	
        //	if (aData["status"] == "Pending") {
        //		count_pending++;
        //	} else if (aData["status"] == "Approved") {
        //		count_approved++;
        //	} else {
        //		count_rejected++;
        //	}
        //},
        "fnInitComplete": function (oSettings, json) {
            //computeGAD();
        }
    }).on('user-select', function (e, dt, type, cell, originalEvent) {
        if ($(cell.node()).parent().hasClass('selected')) {
            e.preventDefault();
        }
    });
}

function loadAttr() {
    tblAttrMain = 
    $('#tblAttrMain').DataTable({
        'destroy'       : true,
        'paging'        : true,
        'lengthChange'  : false,
        'pageLength'    : 15,
        "order"         : [],
        'info'          : true,
        'autoWidth'     : false,
        'select'        : true,
        'sDom'			: 'Btp<"clear">',
        //dom: 'Bfrtip',
        buttons: [{
            extend: "excel",
            className: "btn btn-default btn-sm hide btn-export-admin",
            titleAttr: 'Export in Excel',
            text: 'Export in Excel',
            init: function(api, node, config) {
               $(node).removeClass('dt-button buttons-excel buttons-html5')
            }
        }],
        'fnRowCallback' : function( nRow, aData, iDisplayIndex ) {
          $('td', nRow).attr('nowrap','nowrap');
          return nRow;
        },
        'ajax'          : {
        	'url'       : '../program_assets/php/web/accomplishment.php',
        	'type'      : 'POST',
        	'data'      : {
        		command : 'load_attr',
            parentFolderID : cur_parentFolderID
        	}    
        },
        'aoColumns' : [
            { mData: 'program'},
            { mData: 'budget'},
            { mData: 'source',
                render: function (data,type,row) {
                    var datas = "";
                    var str_array = row.source.split('~~');
                    var arr_data = [];
                    
                    for(var i = 0; i < str_array.length; i++) {
                        var [budgetSource,budgetItem,budget] = str_array[i].split('~');
                                            
                        arr_data.push(`
                            <label class="cust-label">Budget Source:&nbsp;</label>${budgetSource}
                            <br>
                            <label class="cust-label">Budget Item:&nbsp;</label>${budgetItem}
                            <br>
                            <label class="cust-label">Budget Amount:&nbsp;</label>${budget}              
                        `);
                    }
                    
                    return arr_data.join("<br><br>");
                }
            },
            { mData: 'files',
                render: function (data,type,row) {
                    var datas = "";
                    var arr_data = [];
                              
                    if (row.files != null) {
                      var str_array = row.files.split(',');
                              
                      for(var i = 0; i < str_array.length; i++) {           
                        arr_data.push(`
                          <a href="#" onclick="downLoadFile('${row.folderID}','${str_array[i]}')">
                            ${str_array[i]}
                          </a>              
                        `);
                      }
                    }
                    
                    return arr_data.join("<br>");
                }
            },
            { mData: 'actualCost',
              render: function (data,type,row) {
                  
                  var strCost = "";
                  
                  if (row.actualCost != "") {
                    var arrCost = row.actualCost.split('~~');
                  
                    for(var i = 0; i < arrCost.length; i++) {
                      var [source,item,expense] = arrCost[i].split('~');
                      
                      strCost += `
                        <span style="white-space:normal"><b>Source : </b>${source}</span>
                        <br>
                        <span style="white-space:normal"><b>Item : </b>${item}</span>
                        <br>
                        <span style="white-space:normal"><b>Expense : </b>${expense}</span>
                        <br>
                        <br>
                      `;
                    }
                  }
                
                  return strCost;
              }
            },
            { mData: 'varianceRemarks',
              render: function (data,type,row) {
                  
                  var strVariance = "";
                  
                  if (row.varianceRemarks != "") {
                    var arrVariance = row.varianceRemarks.split('~~');
                  
                    for(var i = 0; i < arrVariance.length; i++) {
                      var [variance,remarks] = arrVariance[i].split('~');
                      
                      strVariance += `
                        <span style="white-space:normal"><b>Variance : </b>${variance}</span>
                        <br>
                        <span style="white-space:normal"><b>Remarks : </b>${remarks}</span>
                        <br>
                        <br>
                      `;
                    }
                  }
                
                  return strVariance;
              }
            },
            { mData: 'id',
                render: function (data,type,row) {
                    return `
                        <button type="button" class="btn btn-default view">
                            <i class="fa fa-eye"></i>
                        </button>
                        <button type="button" class="btn btn-default edit">
                            <i class="fa fa-edit"></i>
                        </button>
                    `;
                }
            }
        ],
        'aoColumnDefs': [
        	{ "width": "1%", "targets": [0,6] }
        ],
        "drawCallback": function() {  
            row_count = this.fnSettings().fnRecordsTotal();
        },
        //"fnRowCallback": function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
        //	console.log(aData["status"]);
        //	
        //	if (aData["status"] == "Pending") {
        //		count_pending++;
        //	} else if (aData["status"] == "Approved") {
        //		count_approved++;
        //	} else {
        //		count_rejected++;
        //	}
        //},
        "fnInitComplete": function (oSettings, json) {
            //computeGAD();
        }
    }).on('user-select', function (e, dt, type, cell, originalEvent) {
        if ($(cell.node()).parent().hasClass('selected')) {
            e.preventDefault();
        }
    });
}