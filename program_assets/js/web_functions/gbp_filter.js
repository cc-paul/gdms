var tblGBPTable;

$("#btnViewReportFilter").click(function(){
    $("#cmbFilterReport").val('-').trigger("change");
    $("#cmbFilterYear").val('-').trigger("change");
    $("#cmbFilterStatus").val('-').trigger("change");
    
	$("#mdGBPFilter").modal();
    loadGBPReportTable();
});

$("#cmbFilterReport").on("change", function() {
    loadGBPReportTable();
});

$("#cmbFilterYear").on("change", function() {
    loadGBPReportTable();
});

$("#cmbFilterStatus").on("change", function() {
    loadGBPReportTable();
});

function loadGBPReportTable() {
    tblGBPTable = 
    $('#tblGBPTable').DataTable({
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
        		command : 'load_gbp_table',
                report  : $("#cmbFilterReport").val(),
                year    : $("#cmbFilterYear").val(),
                status  : $("#cmbFilterStatus").val()
        	}    
        },
        'aoColumns' : [
        	{ mData: 'reportType'},
            { mData: 'year'},
            { mData: 'status'},
            { mData: 'totalAmount'},
            { mData: 'remarks',
                render: function (data,type,row) {
                    return '<span style="white-space:normal">' + row.remarks + "</span>";
                }
            },
            { mData: 'id',
                render: function (data,type,row) {
                    var enableEdit = row.status == 'Draft' ? '' : ' disabled';
                    var enableView = row.status != 'Draft' ? '' : ' disabled';
                    
                    return '<div class="input-group">' + 
                           '	<button id="list_' + row.id + '" name="list_' + row.id + '" type="submit" class="btn btn-default btn-xs dt-button list gbp-table-edit" '+ enableEdit +'>' +
                           '		<i class="fa fa-edit"></i>' +
                           '	</button>' +
                           '</div>' +
                           '&nbsp; &nbsp;' + 
                           '<div class="input-group">' + 
                           '	<button id="list_' + row.id + '" name="list_' + row.id + '" type="submit" class="btn btn-default btn-xs dt-button list gbp-table-view" '+ enableView +'>' +
                           '		<i class="fa fa-eye"></i>' +
                           '	</button>' +
                           '</div>';
                }
            }
        ],
        'aoColumnDefs': [
        	{"className": "custom-center", "targets": [5]},
        	{"className": "dt-center", "targets": [0,1,2,3,4]},
        	{ "width": "5%", "targets": [0,1,2,3,5] },
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

$('#tblGBPTable tbody').on('click', '.gbp-table-view', function (){
	var data = tblGBPTable.row( $(this).parents('tr') ).data();
    
    showParentGBPFilter(data.parentFolderID);
});

function showParentGBPFilter(cur_parentFolderID) {
    totalPrimarySource = 0;
    totalOtherSource = 0;
    
    $.ajax({
        url: "../program_assets/php/web/gbp",
        data: {
            command   : 'load_activity_parent_filter',
            parentFolderID : cur_parentFolderID
        },
        type: 'post',
        success: function (data) {
            var data = jQuery.parseJSON(data);
            
            for (var i = 0; i < data.length; i++) {
                showGBPView(data[i].parentFolderID);
                $("#mdGBPFilter").modal("hide");
                $("#mdViewGBP").modal();
                
                $("#lblFY").text(data[i].year);
                $("#lblGAABudget").text(data[i].totalAmount);
				
				$("#lblApprovedByName").text(data[i].approvedBy);
				$("#lblApprovedByPosition").text(data[i].approvedByPosition);
				$("#lblPreparedByName").text(data[i].preparedBy);
				$("#lblPreparedByPosition").text(data[i].preparedByPosition);
				$("#lblDocReq").text(data[i].status);
            }
        }
    });
}

$('#tblGBPTable tbody').on('click', '.gbp-table-edit', function (){
	var data = tblGBPTable.row( $(this).parents('tr') ).data();
    
    parentFolderID = data.parentFolderID;
    
    $("#txtAllottedBudget").val($("#lblParentAmount").text().trim());
    $("#cmbYear").val($("#lblParentYear").text().trim()).trigger("change");
    
    setTimeout(function() {
        loadClientFocus();
        loadAttr();
        computeGAD();
    }, 100);
    
    $("#dvReminder").hide();
    $("#mdGBPFilter").modal("hide");
    $("#btnSignatory").prop("disabled", false);
    $("#btnSaveDraft").prop("disabled", false);
    $("#btnSubmitGBPFinal").prop("disabled", false);
    $("#btnAddActivity").prop("disabled", false);
    $("#btnDeleteActivity").prop("disabled", false);
});

