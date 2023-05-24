var tblClientFocus;
var tblClientFocus2;

loadClientFocus();

$('#txtSearchClientFocus').keyup(function(){
    tblClientFocus.search($(this).val()).draw() ;
});

$("#btnDeleteActivity").click(function(){
    if (selectedTab == 1 || selectedTab == 2) {
        var arrFolderIDS = [];
    
        tblClientFocus.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
            var data = this.data();
            var folderID = data.folderID;
            
            arrFolderIDS.push(`'${folderID}'`);
        });
        
        $.ajax({
            url: "../program_assets/php/web/gbp",
            data: {
                command   : 'delete_all_activity',
                folderIDS : arrFolderIDS.join(","),
                tab : selectedTab
            },
            type: 'post',
            success: function (data) {
                var data = jQuery.parseJSON(data);
                
                JAlert(data[0].message,data[0].color);
                            
                if (!data[0].error) {
                    loadClientFocus();
                }
            }
        });
    } else {
        var arrFolderIDS = [];
    
        tblAttrMain.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
            var data = this.data();
            var folderID = data.folderID;
            
            arrFolderIDS.push(`'${folderID}'`);
        });
        
        $.ajax({
            url: "../program_assets/php/web/gbp",
            data: {
                command   : 'delete_all_activity',
                folderIDS : arrFolderIDS.join(","),
                tab : 0
            },
            type: 'post',
            success: function (data) {
                var data = jQuery.parseJSON(data);
                
                JAlert(data[0].message,data[0].color);
                            
                if (!data[0].error) {
                    loadAttr();
                }
            }
        });
    }
});

$('#tblClientFocus tbody').on('click', '.delete', function (){
	var data = tblClientFocus.row( $(this).parents('tr') ).data();
    
    $.ajax({
        url: "../program_assets/php/web/gbp",
        data: {
            command   : 'delete_activity',
            id : data.id
        },
        type: 'post',
        success: function (data) {
            var data = jQuery.parseJSON(data);
            
            JAlert(data[0].message,data[0].color);
            
            if (!data[0].error) {
                loadClientFocus();
                
                setTimeout(function() {
                    changeClientFocusRow($("#cmbClientXEntries").val())
                }, 1500);
            }
        }
    });
});

$('#tblClientFocus tbody').on('click', '.copy', function (){
	var data = tblClientFocus.row( $(this).parents('tr') ).data();
    var newFolderID = makeid(5);
    var oldFolderID = data.folderID;
    
    $.ajax({
        url: "../program_assets/php/web/gbp",
        data: {
            command : 'create_folder_copy',
            oldFolderID : oldFolderID,
            newFolderID : newFolderID
        },
        type: 'post',
        success: function (data) {
            var data1 = jQuery.parseJSON(data);
            
            if (data[0].error) {
                JAlert(data[0].message,data[0].color);
            } else {
                $.ajax({
                    url: "../program_assets/php/web/gbp",
                    data: {
                        command   : 'copy_activity',
                        oldFolderID : oldFolderID,
                        newFolderID : newFolderID
                    },
                    type: 'post',
                    success: function (data) {
                        var data = jQuery.parseJSON(data);
                        
                        JAlert(data[0].message,data[0].color);
                        
                        if (!data[0].error) {
                            loadClientFocus();
                            
                            setTimeout(function() {
                                changeClientFocusRow($("#cmbClientXEntries").val())
                            }, 1000);
                        }
                    }
                });
            }
        }
    });
});

$('#tblClientFocus tbody').on('click', '.edit', function (){
	var data = tblClientFocus.row( $(this).parents('tr') ).data();
    var curfolderID = data.folderID;
    
    checFormEverySecond = window.setInterval(function(){
        console.log("running");
    }, 1000);
    
    folderID = curfolderID;
    
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
            
            for(var i = 0; i < arrData.length; i++) {
                tblFiles.row.add({
                    "description" : arrData[i],
                    "id" : ++tblFilesID
                }).draw( false );
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

$("#cmbClientXEntries").on("change", function() {
    var val = $(this).val();
    changeClientFocusRow(val);
});

function changeClientFocusRow(row) {
    tblClientFocus.page.len(row).draw('page');
    tblClientFocus.page.len(row).draw();
}

function loadClientFocus() {
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
        	'url'       : '../program_assets/php/web/gbp.php',
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
            { mData: 'performanceIndicator',
                render: function (data,type,row) {
                    return `
                        <span style="white-space:normal">${row.performanceIndicator}</span>
                    `;
                }
            },
            { mData: 'budget'},
            { mData: 'id',
                render: function (data,type,row) {
                    return `
                        <button type="button" class="btn btn-default edit">
                            <i class="fa fa-edit"></i>
                        </button>
                        <button type="button" class="btn btn-default copy">
                            <i class="fa fa-copy"></i>
                        </button>
                        <button type="button" class="btn btn-default delete">
                            <i class="fa fa-trash"></i>
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
        	'url'       : '../program_assets/php/web/gbp.php',
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
            { mData: 'performanceIndicator',
                render: function (data,type,row) {
                    return `
                        <span style="white-space:normal">${row.performanceIndicator}</span>
                    `;
                }
            },
            { mData: 'budget'},
            { mData: 'id',
                render: function (data,type,row) {
                    return `
                        <button type="button" class="btn btn-default edit">
                            <i class="fa fa-edit"></i>
                        </button>
                        <button type="button" class="btn btn-default copy">
                            <i class="fa fa-copy"></i>
                        </button>
                        <button type="button" class="btn btn-default delete">
                            <i class="fa fa-trash"></i>
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
            computeGAD();
        }
    }).on('user-select', function (e, dt, type, cell, originalEvent) {
        if ($(cell.node()).parent().hasClass('selected')) {
            e.preventDefault();
        }
    });
}

$('#txtAllottedBudget').on('input',function(e){
	computeAllocated();
});

$("#btnSaveDraft").click(function(){
	var year = $("#cmbYear").val();
    var total = $("#txtAllottedBudget").val();
    
    $.ajax({
        url: "../program_assets/php/web/gbp",
        data: {
            command : 'save_parent_gbp',
            parentFolderID : parentFolderID,
            year : year,
            total : total
        },
        type: 'post',
        success: function (data) {
            var data = jQuery.parseJSON(data);
            
            JAlert(data[0].message,data[0].color);
        }
    });
});

function computeGAD() {
    
    
    tblClientFocus2.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
        var data = this.data();
        var budget = data.budget.replaceAll(",","");
        
        
    });
    
    
    
    $.ajax({
        url: "../program_assets/php/web/gbp",
        data: {
            command   : 'gbp_group',
            parentFolderID : parentFolderID
        },
        type: 'post',
        success: function (data) {
            var data = jQuery.parseJSON(data);
            var html = "";
            var total = 0;
            
            for (var i = 0; i < data.length; i++) {
                html += `
                    <b>
                        <span class="cust-label">${data[i].budgetSource}</span>
                    </b>
                    <span class="cust-label">${data[i].alloc_budget}</span>
                    <br>
                `;
                
                 total += Number(data[i].alloc_budget.replaceAll(",",""));
            }
            
           
            $("#dvGadAllocated").html(html);
            
            $("#spTotalBudget").text(total.toLocaleString('en-US', {maximumFractionDigits: 2}));
            $("#lblTotalBudget").text(total.toLocaleString('en-US', {maximumFractionDigits: 2}));
            
            computeAllocated();
        }
    });
}

function computeAllocated() {
    var  originalAmount = $("#txtAllottedBudget").val().replaceAll(",","");
    var amountRemoved = $("#spTotalBudget").text().replaceAll(",","");
    var percentageRemoved = (amountRemoved / originalAmount) * 100;
    
    $("#spPercent").text(percentageRemoved.toFixed(2) + "%");
    
    if ($("#spPercent").text() == "Infinity%" || $("#spPercent").text() == "NaN%") {
        $("#spPercent").text("0.00%");
    }
}