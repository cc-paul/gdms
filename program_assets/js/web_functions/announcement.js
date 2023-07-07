var tblNotifications;

loadNotifications();

$('#txtSearchNotification').keyup(function(){
    tblNotifications.search($(this).val()).draw() ;
});

function loadNotifications() {
    tblNotifications = 
    $('#tblNotifications').DataTable({
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
        		command : 'load_notif',
        	}    
        },
        'aoColumns' : [
        	{ mData: 'subject',
                render: function (data,type,row) {
                    return '<span style="white-space:normal">' + row.subject + "</span>";
                }
            },
            { mData: 'remarks'},
            { mData: 'fullName'},
            { mData: 'dateCreated',
                render: function (data,type,row) {
                    const timestamp = new Date(row.dateCreaterd);
                    const formattedTimeAgo = formatTimeAgo(timestamp);
                    
                    return '<span style="white-space:normal">' + row.dateCreated + "<br>" + formattedTimeAgo + "</span>";
                }
            }
        ],
        //'aoColumnDefs': [
        //	{"className": "custom-center", "targets": [8]},
        //	{"className": "dt-center", "targets": [0,1,2,3,4,5,6,7]},
        //	{ "width": "1%", "targets": [8] },
        //	{"className" : "hide_column", "targets": [9]} 
        //],
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

function formatTimeAgo(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = Math.abs(now - date) / 1000; // Time difference in seconds

  // Define time intervals in seconds
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  // Find the appropriate time interval
  for (let interval in intervals) {
    if (diff >= intervals[interval]) {
      const timeAgo = Math.floor(diff / intervals[interval]);
      return `${timeAgo} ${interval}${timeAgo !== 1 ? 's' : ''} ago`;
    }
  }

  return 'Just now'; // If the date is within a minute
}
