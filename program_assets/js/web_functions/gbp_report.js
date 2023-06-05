var tblGBPTable;

loadGBPTable();

$("#btnGenerateReport").click(function(){
	loadGBPTable();
});

$("#btnExport").click(function(){
	$(".btn-export-gbp").click();
});

function loadGBPTable() {
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
            className: "btn btn-default btn-sm hide btn-export-gbp",
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
        	'url'       : '../program_assets/php/web/gbp_report.php',
        	'type'      : 'POST',
        	'data'      : {
        		command : 'load_gbp_table',
                report  : $("#cmbFilterReport").val(),
                year    : $("#cmbFilterYear").val(),
                status  : $("#cmbFilterStatus").val(),
                college : $("#cmbFilterCollege").val()
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