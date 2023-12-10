
//var tblBudgetID_acc = 0;
//
//var tblVarianceID_acc = 0;
//var selectedFolderID = 0;
//
//var tblBudget_acc;
//var tblVariance_acc;

$('#tblClientFocus tbody').on('click', '.edit', function (){
    //var data = tblClientFocus.row( $(this).parents('tr') ).data();
    //selectedFolderID = data.folderID;
    //
    //$("#mdAccForm").modal();
    //prepareAccForm();
    //
    //console.log(data.actualCost);
    //
    //$("#txtGADActivity_acc").val(data.actualResult);
    //
    //if (data.actualCost != "" || data.actualCost != null) {
    //    var arrData = data.actualCost.split('~~');
    //    
    //    if (arrData != '') {
    //        for(var i = 0; i < arrData.length; i++) {
    //            var [source,item,expense] = arrData[i].split('~');
    //            
    //            
    //            tblBudget_acc.row.add({
    //                "source" : source,
    //                "item" : item,
    //                "budget" : expense.replaceAll(",","").replaceAll(".00",""),
    //                "id" : i
    //            }).draw( false );
    //            
    //            $(`#cmbBudgetSource_acc${i}`).val(source).trigger("change");
    //            $(`#cmbBudgetSource_acc${i}`).select2();
    //        }
    //    }
    //} else {
    //    $("#btnAddBudget_acc").click();
    //}
    //
    //if (data.varianceRemarks != "" || data.varianceRemarks != null) {
    //    var arrData = data.varianceRemarks.split('~~');
    //    
    //    if (arrData != '') {
    //        for(var i = 0; i < arrData.length; i++) {
    //            var [variance,remarks] = arrData[i].split('~');
    //            
    //            
    //            tblVariance_acc.row.add({
    //                "variance" : variance.replaceAll(",","").replaceAll(".00",""),
    //                "remarks" : remarks,
    //                "id" : i
    //            }).draw( false );
    //            
    //        }
    //    }
    //} else {
    //    $("#btnAddVariance_acc").click();
    //}
});

$('#tblAttrMain tbody').on('click', '.edit', function (){
    //var data = tblAttrMain.row( $(this).parents('tr') ).data();
    //selectedFolderID = data.folderID;
    //
    //$("#mdAccForm").modal();
    //prepareAccForm();
    //
    //$("#txtGADActivity_acc").val(data.actualResult);
    //
    //if (data.actualCost != "" || data.actualCost != null) {
    //    var arrData = data.actualCost.split('~~');
    //    
    //    if (arrData != '') {
    //        for(var i = 0; i < arrData.length; i++) {
    //            var [source,item,expense] = arrData[i].split('~');
    //            
    //            
    //            tblBudget_acc.row.add({
    //                "source" : source,
    //                "item" : item,
    //                "budget" : expense.replaceAll(",","").replaceAll(".00",""),
    //                "id" : i
    //            }).draw( false );
    //            
    //            $(`#cmbBudgetSource_acc${i}`).val(source).trigger("change");
    //            $(`#cmbBudgetSource_acc${i}`).select2();
    //        }
    //    }
    //} else {
    //    $("#btnAddBudget_acc").click();
    //}
    //
    //if (data.varianceRemarks != "" || data.varianceRemarks != null) {
    //    var arrData = data.varianceRemarks.split('~~');
    //    
    //    if (arrData != '') {
    //        for(var i = 0; i < arrData.length; i++) {
    //
    //
    //            var [variance,remarks] = arrData[i].split('~');
    //            
    //            
    //            tblVariance_acc.row.add({
    //                "variance" : variance.replaceAll(",","").replaceAll(".00",""),
    //                "remarks" : remarks,
    //                "id" : i
    //            }).draw( false );
    //            
    //        }
    //    }
    //} else {
    //    $("#btnAddVariance_acc").click();
    //}
});

$("#btnAddBudget_acc").click(function(){
	tblBudget_acc.row.add({
        "source" : "",
        "item" : "",
        "budget" : "",
        "id" : ++tblBudgetID_acc
    }).draw( false );
    
    $(`#cmbBudgetSource_acc${tblBudgetID_acc}`).select2();
});

$("#btnAddVariance_acc").click(function(){
	tblVariance_acc.row.add({
        "variance" : "",
        "remarks" : "",
        "id" : ++tblVarianceID_acc
    }).draw( false );
});


$("#btnAddBudget_acc_ar").click(function(){
	tblBudget_acc_ar.row.add({
        "source" : "",
        "item" : "",
        "budget" : "",
        "id" : ++tblBudgetID_acc_ar + 1
    }).draw( false );
    
    $(`#cmbBudgetSource_acc_ar${tblBudgetID_acc_ar + 1}`).select2();
});

$("#btnAddVariance_acc_ar").click(function(){
	tblVariance_acc_ar.row.add({
        "variance" : "",
        "remarks" : "",
        "id" : ++tblVarianceID_acc_ar + 1
    }).draw( false );
});

$('#tblVariance_acc tbody').on( 'click', '.delete', function () {
	tblVariance_acc.row($(this).parents('tr')).remove().draw();
});

$('#tblBudget_acc tbody').on( 'click', '.delete', function () {
	tblBudget_acc.row($(this).parents('tr')).remove().draw();
});


$('#tblVariance_acc_ar tbody').on( 'click', '.delete_ar', function () {
	tblVariance_acc_ar.row($(this).parents('tr')).remove().draw();
});

$('#tblBudget_acc_ar tbody').on( 'click', '.delete_ar', function () {
	tblBudget_acc_ar.row($(this).parents('tr')).remove().draw();
});

$("#btnSaveAcc").click(function(){
	var outcome = $("#txtGADActivity_acc").val();
    var count_tblVariance_acc = Number(tblVariance_acc.data().count());
    var count_tblBudget_acc = Number(tblBudget_acc.data().count());
    var arrBudget = [];
    var arrVariance = [];
    
    $("#dvVariance_acc").html(null);
    $("#dvBudget_acc").html(null);
    $("#dvGADActivity_acc").html(null);
    
    if (outcome == "" && outcome == "") {
        $("#dvGADActivity_acc").html(`<code class="cust-label">Please add details in Actual Result</code>`);
    }
    
    if (count_tblVariance_acc == 0) {
        $("#dvVariance_acc").html(`<code class="cust-label">Please add variance</code>`);
    }
    
    if (count_tblBudget_acc == 0) {
        $("#dvBudget_acc").html(`<code class="cust-label">Please add Actual Cost and Expenditure</code>`);
    }
    
    tblBudget_acc.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
        var data = this.data();
        var exp_source = $(`#cmbBudgetSource_acc${data.id}`).val();
        var exp_item   = $(`#txtBudgetItem_acc${data.id}`).val();
        var exp = $(`#txtBudgetAmount_acc${data.id}`).val();
        
        if (exp_source == null || exp_item == "" || exp == "") {
            $("#dvBudget_acc").html(`<code class="cust-label">There is an empty field in Actual Cost and Expenditure</code>`);
        } else {
            arrBudget.push(`('${selectedFolderID}','${exp_source}','${exp_item.replace("'","")}','${exp}')`);
        }
    });
    
    tblVariance_acc.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
        var data = this.data();
        var variance = $(`#txtVariace_acc${data.id}`).val();
        var remarks   = $(`#txtRemarks_acc${data.id}`).val();
        
        if (variance == "" || remarks == "") {
            $("#dvVariance_acc").html(`<code class="cust-label">There is an empty field in Variance and Remarks</code>`);
        } else {
            arrVariance.push(`('${selectedFolderID}','${variance}','${remarks.replace("'","")}')`);
        }
    });
    
    console.log(arrBudget.join(","));
    console.log(arrVariance.join(","));
    
    if (
        $("#dvGADActivity_acc").html() != '' ||
        $("#dvVariance_acc").html() != '' || 
        $("#dvBudget_acc").html() != ''
    ) {
        JAlert("You have an error. Please check them all","red");
       
    } else {
        
        $("#btnSaveAcc").prop("disabled", true);
        
        $.ajax({
            url: "../program_assets/php/web/accomplishment.php",
            data: {
                command          : 'save_acc',
                parentFolderID   : selectedFolderID,
                outcome          : outcome,
                expenses         : arrBudget.join(","),
                variance         : arrVariance.join(",")
            },
            type: 'post',
            success: function (data) {
                var data = jQuery.parseJSON(data);
                
                JAlert(data[0].message,data[0].color);
                $("#btnSaveAcc").prop("disabled", false);
                
                if (!data[0].error) {
                    $("#mdAccForm").modal("hide");
                    
                    if (selectedTab == 3) {
                        loadAttr();
                        getTotalUtils();
                    } else {
                        loadClientFocus(selectedTab,cur_parentFolderID);
                        getTotalUtils();
                    }
                }
            }
        });
    }
});



$("#btnSaveAcc_ar").click(function(){
	var outcome = $("#txtGADActivity_acc_ar").val();
    var count_tblVariance_acc = Number(tblVariance_acc_ar.data().count());
    var count_tblBudget_acc = Number(tblBudget_acc_ar.data().count());
    var arrBudget = [];
    var arrVariance = [];
    
    $("#dvVariance_acc_ar").html(null);
    $("#dvBudget_acc_ar").html(null);
    $("#dvGADActivity_acc_ar").html(null);
    
    if (outcome == "" && outcome == "") {
        $("#dvGADActivity_acc_ar").html(`<code class="cust-label">Please add details in Actual Result</code>`);
    }
    
    if (count_tblVariance_acc == 0) {
        $("#dvVariance_acc_ar").html(`<code class="cust-label">Please add variance</code>`);
    }
    
    if (count_tblBudget_acc == 0) {
        $("#dvBudget_acc_ar").html(`<code class="cust-label">Please add Actual Cost and Expenditure</code>`);
    }
    
    tblBudget_acc_ar.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
        var data = this.data();
        var exp_source = $(`#cmbBudgetSource_acc_ar${data.id}`).val();
        var exp_item   = $(`#txtBudgetItem_acc_ar${data.id}`).val();
        var exp = $(`#txtBudgetAmount_acc_ar${data.id}`).val();
        
        if (exp_source == null || exp_item == "" || exp == "") {
            $("#dvBudget_acc_ar").html(`<code class="cust-label">There is an empty field in Actual Cost and Expenditure</code>`);
        } else {
            arrBudget.push(`('${selectedFolderID}','${exp_source}','${exp_item.replace("'","")}','${exp}')`);
        }
    });
    
    tblVariance_acc_ar.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
        var data = this.data();
        var variance = $(`#txtVariace_acc_ar${data.id}`).val();
        var remarks   = $(`#txtRemarks_acc_ar${data.id}`).val();
        
        if (variance == "" || remarks == "") {
            $("#dvVariance_acc_ar").html(`<code class="cust-label">There is an empty field in Variance and Remarks</code>`);
        } else {
            arrVariance.push(`('${selectedFolderID}','${variance}','${remarks.replace("'","")}')`);
        }
    });
    
    console.log(arrBudget.join(","));
    console.log(arrVariance.join(","));
    
    if (
        $("#dvGADActivity_acc_ar").html() != '' ||
        $("#dvVariance_acc_ar").html() != '' || 
        $("#dvBudget_acc_ar").html() != ''
    ) {
        JAlert("You have an error. Please check them all","red");
       
    } else {
        
        $("#btnSaveAcc_ar").prop("disabled", true);
        
        $.ajax({
            url: "../program_assets/php/web/accomplishment.php",
            data: {
                command          : 'save_acc',
                parentFolderID   : selectedFolderID,
                outcome          : outcome,
                expenses         : arrBudget.join(","),
                variance         : arrVariance.join(",")
            },
            type: 'post',
            success: function (data) {
                var data = jQuery.parseJSON(data);
                
                JAlert(data[0].message,data[0].color);
                $("#btnSaveAcc_ar").prop("disabled", false);
                
                if (!data[0].error) {
                    $("#mdAccForm").modal("hide");
                    
                    if (selectedTab == 3) {
                        loadAttr();
                        getTotalUtils();
                    } else {
                        loadClientFocus(selectedTab,cur_parentFolderID);
                        getTotalUtils();
                    }
                }
            }
        });
    }
});

function prepareAccForm() {
    $("#txtGADActivity_acc").val("");
    tblBudgetID_acc = 0;
    tblVarianceID_acc = 0;
    
    tblBudget_acc = 
    $('#tblBudget_acc').DataTable({
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
                            id="cmbBudgetSource_acc${row.id}"
                            name="cmbBudgetSource_acc${row.id}"
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
                            id="txtBudgetItem_acc${row.id}"
                            name="txtBudgetItem_acc${row.id}"
                            rows="1"
                            class="form-control cust-label cust-textbox"
                            placeholder="Enter Expense Item">${row.item}</textarea>
                    `;				
                }
            },
            { "data": "budget",
                render: function(data, type, row) {
                    return `
                        <input type="number"
                            style="width: 100%;"
                            id="txtBudgetAmount_acc${row.id}"
                            name="txtBudgetAmount_acc${row.id}"
                            class="form-control cust-label cust-textbox"
							oninput="this.value = 
							!!this.value && Math.abs(this.value) >= 0 ? Math.abs(this.value) : null"
                            placeholder="Enter Expense" value="${row.budget}">
                    `;				
                }
            },
            { "data": "id",
                render: function(data, type, row) {
                    return `
                        <center>
                            <button
                                id="btnBudget_acc${row.id}"
                                name="btnBudget_acc${row.id}"
                                type="submit"
                                class="btn btn-default btn-sm delete">
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
    
    tblVariance_acc = 
    $('#tblVariance_acc').DataTable({
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
            { "data": "variance",
                render: function(data, type, row) {
                    return `
                        <input type="number"
                            style="width: 100%;"
                            id="txtVariace_acc${row.id}"
                            name="txtVariace_acc${row.id}"
                            class="form-control cust-label cust-textbox"
                            placeholder="Enter Variance" value="${row.variance}">
                    `;				
                }
            },
            { "data": "remarks",
                render: function(data, type, row) {
                    return `
                        <textarea
                            id="txtRemarks_acc${row.id}"
                            name="txtRemarks_acc${row.id}"
                            rows="1"
                            class="form-control cust-label cust-textbox"
                            placeholder="Enter Remarks">${row.remarks}</textarea>
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
                                class="btn btn-default btn-sm delete">
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

    tblBudget_acc.clear().draw();
    tblVariance_acc.clear().draw();
}


function prepareAccForm2() {
    $("#txtGADActivity_acc_ar").val("");
    tblBudgetID_acc_ar = 0;
    tblVarianceID_acc_ar = 0;
    
    tblBudget_acc_ar = 
    $('#tblBudget_acc_ar').DataTable({
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
                            id="cmbBudgetSource_acc_ar${row.id}"
                            name="cmbBudgetSource_acc_ar${row.id}"
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
                            id="txtBudgetItem_acc_ar${row.id}"
                            name="txtBudgetItem_acc_ar${row.id}"
                            rows="1"
                            class="form-control cust-label cust-textbox"
                            placeholder="Enter Expense Item">${row.item}</textarea>
                    `;				
                }
            },
            { "data": "budget",
                render: function(data, type, row) {
                    return `
                        <input type="number"
                            style="width: 100%;"
                            id="txtBudgetAmount_acc_ar${row.id}"
                            name="txtBudgetAmount_acc_ar${row.id}"
                            class="form-control cust-label cust-textbox"
							oninput="this.value = 
							!!this.value && Math.abs(this.value) >= 0 ? Math.abs(this.value) : null"
                            placeholder="Enter Expense" value="${row.budget}">
                    `;				
                }
            },
            { "data": "id",
                render: function(data, type, row) {
                    return `
                        <center>
                            <button
                                id="btnBudget_acc_ar${row.id}"
                                name="btnBudget_acc_ar${row.id}"
                                type="submit"
                                class="btn btn-default btn-sm delete_ar">
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
    
    tblVariance_acc_ar = 
    $('#tblVariance_acc_ar').DataTable({
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
            { "data": "variance",
                render: function(data, type, row) {
                    return `
                        <input type="number"
                            style="width: 100%;"
                            id="txtVariace_acc_ar${row.id}"
                            name="txtVariace_acc_ar${row.id}"
                            class="form-control cust-label cust-textbox"
                            placeholder="Enter Variance" value="${row.variance}">
                    `;				
                }
            },
            { "data": "remarks",
                render: function(data, type, row) {
                    return `
                        <textarea
                            id="txtRemarks_acc_ar${row.id}"
                            name="txtRemarks_acc_ar${row.id}"
                            rows="1"
                            class="form-control cust-label cust-textbox"
                            placeholder="Enter Remarks">${row.remarks}</textarea>
                    `;				
                }
            },
            { "data": "id",
                render: function(data, type, row) {
                    return `
                        <center>
                            <button
                                id="btnBudget_ar${row.id}"
                                name="btnBudget_ar${row.id}"
                                type="submit"
                                class="btn btn-default btn-sm delete_ar">
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

    tblBudget_acc_ar.clear().draw();
    tblVariance_acc_ar.clear().draw();
}