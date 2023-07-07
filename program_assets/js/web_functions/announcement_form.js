var tblAnnouncement;
var isNewAnnouncement;
var oldSubject;
var annID;

loadAnnouncement();

$("#btnAddAnnouncement").click(function(){
    $("#txtSubject").val("");
    $("#txtDescription").val("");
	$("#mdCompose").modal();
    annID = 0;
    isNewAnnouncement = 1;
    oldSubject = 0;
});

$('#tblAnnouncement tbody').on('click', '.edit', function (){
	var data = tblAnnouncement.row( $(this).parents('tr') ).data();
    
    $("#txtSubject").val(data.subject);
    $("#txtDescription").val(data.description);
	$("#mdCompose").modal();
    annID = data.id;
    isNewAnnouncement = 0;
    oldSubject = data.subject;
});


$('#tblAnnouncement tbody').on('click', '.delete', function (){
	var data = tblAnnouncement.row( $(this).parents('tr') ).data();
    
    $.ajax({
        url: "../program_assets/php/web/gbp_report",
        data: {
            command   : 'delete_ann',
            annID : data.id
        },
        type: 'post',
        success: function (data) {
            var data = jQuery.parseJSON(data);
            
            JAlert(data[0].message,data[0].color);
            if (!data[0].error) {
                loadAnnouncement();
            }
        }
    });
});

$("#btnSaveAnnouncement").click(function(){
	var subject = $("#txtSubject").val();
    var description = $("#txtDescription").val();
    
    if (subject == "" || description == "") {
        JAlert("Please fill in all required fields","red");
    } else {
        $.ajax({
            url: "../program_assets/php/web/gbp_report",
            data: {
                command   : 'save_ann',
                subject   : subject,
                description : description,
                annID : annID,
                oldSubject : oldSubject,
                isNewAnnouncement :isNewAnnouncement
            },
            type: 'post',
            success: function (data) {
                var data = jQuery.parseJSON(data);
                
                JAlert(data[0].message,data[0].color);
                if (!data[0].error) {
                    $("#mdCompose").modal("hide");
                    loadAnnouncement();
                }
            }
        });
    }
});

function loadAnnouncement() {
    tblAnnouncement = 
    $('#tblAnnouncement').DataTable({
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
        	'url'       : '../program_assets/php/web/gbp_report.php',
        	'type'      : 'POST',
        	'data'      : {
        		command : 'load_ann',
        	}    
        },
        'aoColumns' : [
        	{ mData: 'subject'},
            { mData: 'description'},
            { mData: 'dateCreated'},
            { mData: 'id',
                render: function (data,type,row) {
                    return '<div class="input-group">' + 
                           '	<button id="list_' + row.id + '" name="list_' + row.id + '" type="submit" class="btn btn-default btn-xs dt-button list edit">' +
                           '		<i class="fa fa-edit"></i>' +
                           '	</button>' +
                           '</div>' +
                           '&nbsp; &nbsp;' + 
                           '<div class="input-group">' + 
                           '	<button id="list_' + row.id + '" name="list_' + row.id + '" type="submit" class="btn btn-default btn-xs dt-button list delete">' +
                           '		<i class="fa fa-trash"></i>' +
                           '	</button>' +
                           '</div>';
                }
            }
        ],
        'aoColumnDefs': [
        	{"className": "custom-center", "targets": [3]},
        	{"className": "dt-center", "targets": [0,1,2]},
        	{ "width": "1%", "targets": [2,3] },
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