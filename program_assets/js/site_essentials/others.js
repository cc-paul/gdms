var read_ids;

/* footer company name */
$('#footer-cname').text('');
/* logo system name lg */
$(".logo-lg").html("<b style='font-size:14px;'>GAD Monitoring System</b>");
/* logo system name sh */
$(".logo-mini").html("GDM");

/* check if there is an internet (MONITORING) */
// window.addEventListener('load',updateOnlineStatus);
// window.addEventListener('online',  updateOnlineStatus);
// window.addEventListener('offline', updateOnlineStatus);
// $(document).ready(function () {
//    updateOnlineStatus();
// });
  
/* check if there is an internet (BUTTON CLICK) */
//$('button[type=submit]').click(function() {
//	var condition = navigator.onLine ? "online" : "offline";
//	if (condition == "offline") {
//		$('#modal-default').modal('show');
//		throw new Error('This is not an error. This is just to abort javascript');
//	}
//});

/* online offline checker */
function updateOnlineStatus(event) {
	var condition = navigator.onLine ? "online" : "offline";
	if (condition == "online") {
		$('#modal-default').modal('hide');
	} else {
		$('#modal-default').modal('show');
	}
}

/* init select2 */
try {
	$('.select2').select2();
} catch(e){
	console.log(e);
}

/* number only and 2 decimal in textbox */
function validateFloatKeyPress(el, evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode;
    var number = el.value.split('.');
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    if(number.length>1 && charCode == 46){
         return false;
    }
    var caratPos = getSelectionStart(el);
    var dotPos = el.value.indexOf(".");
    if( caratPos > dotPos && dotPos>-1 && (number[1].length > 1)){
        return false;
    }
    return true;
}

function getSelectionStart(o) {
	if (o.createTextRange) {
		var r = document.selection.createRange().duplicate()
		r.moveEnd('character', o.value.length)
		if (r.text == '') return o.value.length
		return o.value.lastIndexOf(r.text)
	} else return o.selectionStart
}

/* for comma formatting */
function comma (n) {
	var parts = (+n).toFixed(2).split(".");
	var num = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (+parts[1] ? "." + parts[1] : "");
	return num;
}

/* for date formatting */
function formatDate(date) {
    var year = date.getFullYear().toString();
    var month = (date.getMonth() + 101).toString().substring(1);
    var day = (date.getDate() + 100).toString().substring(1);
    return year + "-" + month + "-" + day;
}

function arrange_date(date)	{
	var output = date.replace(/(\d\d)\/(\d\d)\/(\d{4})/, "$3-$1-$2");
	return output;
}

/* parameter in link */
var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};


/* NOTIFICATION */
//delivery_notif()
//window.setInterval(delivery_notif, 1000 * 20);

function delivery_notif() {
	$.ajax({
		url: "../program_assets/php/dropdown/notification.php",
		data: {
			mode : 'delivery'
		},
		type: 'post',
		success: function (data) {
			var item_data = jQuery.parseJSON(data);
			var counter = 0;
			var show_counter = "";
			read_ids   = [];

			$('.menu').html('');
			for (var i = 0; i <= item_data.length; i++) {
				try {
					var id         = item_data[i].id;
					var message    = item_data[i].message;
					var ref        = item_data[i].ref;
					var is_read    = item_data[i].is_read;
					var notif_mode = item_data[i].notif_mode;
					var is_read_class;

					if (is_read == 0) {
						is_read_class = "class='notif-unread read-it'";
						counter++;
					} else {
						is_read_class = "";
					}

					if (notif_mode != "promo") {
						read_ids.push(id);
					}
						
					

					switch (notif_mode) {
						case 'Pull Out W' :
							$('.menu').append(''+
								'<li '+ is_read_class + '>'+
								'	<a href="return_po?nid='+ id +'" onClick="set_sales_date('+ "'" + ref + "'" + ',' + id + ')">'+
								'		<i class="fa fa-truck"></i>'+
								'       <span class="cust-label">' + message + '</span>' +
								'	</a>'+
								'</li>'+
							'');
						break;
						default :
						/* None */
					}
				} catch(e) {
					
				}
			}

			if (counter == 0) {
				$("#sp-notif-counter").html("");
				$("#li-noti").html("You have 0 notification(s)");
			} else {
				$("#sp-notif-counter").html(comma(counter));
				$("#li-noti").html("You have " + comma(counter) + " notification(s)");
			}
		}
	});
}

function message(message) {
	display_toast(message,"error");
}

$("#read_all").click(function(){
	for (var i = 0; i < read_ids.length; i++) {
		$.ajax({
			url: "../program_assets/php/web/profile.php",
			data: {
				saving_mode   : 'read_all',
				ids           : read_ids[i]
			},
			type: 'post',
			success: function (data) {
				
			}
		});
	}
});

// $(window).bind('unload', function(){
//     $.ajax({
// 	    url: '../program_assets/php/web/login_status.php',
// 	    data: {
// 	    	'mode'      : "offline"    
// 	    },
// 	    type: 'post',
// 	    success: function(data) {
// 	    }
// 	});
// });

function set_sales_date(sales_date,read_id) { 
	localStorage.setItem('sales_date', sales_date);
	localStorage.setItem('read_id', read_id);
}


function read_it(sales_date,read_id) { 
	$.ajax({
		url: "../program_assets/php/web/read_notification.php",
		data: {
			id   : read_id
		},
		type: 'post',
		success: function (data) {
		}
	});
}


function popupWindow(url, title, win, w, h) {
    const y = win.top.outerHeight / 2 + win.top.screenY - ( h / 2);
    const x = win.top.outerWidth / 2 + win.top.screenX - ( w / 2);
    return win.open(url, title, 'toolbar=yes, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+y+', left='+x);
}


/* Profile Picture change */
$.ajax({
    url: '../program_assets/php/web/profile.php',
	data: {
		command  : "check_change_pass"
	},
	type: 'post',
    success: function(data) {
    	var output = data.trim();
		
		var parts = location.pathname.split('/');
		var currentpage = parts[parts.length - 1];
		
		if (output == 0 && currentpage != "profile") {
			JConfirm("For new users please change your password first-red", () => {
				window.location.href = "profile";
			});
		}
    }
});

function get_today_longdate() {
	var date      = new Date();
	var month     = date.getMonth() + 1;
	var wmonth    = "";
	var day       = date.getDate();
	var year      = date.getFullYear();
	
	switch (month) {
		case 1 :
			wmonth = "January";
		break;
		case 2 :
			wmonth = "February";
		break;
		case 3 :
			wmonth = "March";
		break;
		case 4 :
			wmonth = "April";
		break;
		case 5 :
			wmonth = "May";
		break;
		case 6 :
			wmonth = "June";
		break;
		case 7 :
			wmonth = "July";
		break;
		case 8 :
			wmonth = "August";
		break;
		case 9 :
			wmonth = "September";
		break;
		case 10 :
			wmonth = "October";
		break;
		case 11 :
			wmonth = "November";
		break;
		case 12 :
			wmonth = "December";
		break;
	}
	
	return wmonth + " " + day + ", " + year;
}

function getRandom() {
	return Math.random();
}

$(document).ready(function(){ 
    $("input").attr("autocomplete", "off");
});

//setInterval(function() {
//    $.ajax({
//		url: "../program_assets/php/web/promo_mechanics.php",
//		data: {
//			saving_mode   : 'check_duration',
//		},
//		type: 'post',
//		success: function (data) {
//		}
//	});
//}, 5 * 1000);

function datebetween(from,to,check) {
    var fDate,lDate,cDate;
    fDate = Date.parse(from);
    lDate = Date.parse(to);
    cDate = Date.parse(check);

    if((cDate <= lDate && cDate >= fDate)) {
        return true;
    }
    return false;
}

function dateex(from,check) {
    var fDate,cDate;
    fDate = Date.parse(from);
    cDate = Date.parse(check);

    if(fDate < cDate) {
        return true;
    }
    return false;
}

function today () {
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	var yyyy = today.getFullYear();
	
	today = mm + '/' + dd + '/' + yyyy;
	return today;
}

function JConfirm (message,confirmCallback, cancelCallback) {
	var [c_message,c_color] = message.split('-');
	var default_color;
	
	if (c_color == null) {
		default_color = "orange";
	} else {
		default_color = c_color;
	}
	
	$.confirm({
		title    : 'System Message',
		content  : c_message,
		type     : default_color,
		icon     : 'fa fa-question-circle',
		backgroundDismiss : false,
		backgroundDismissAnimation : 'glow',
		buttons: {
			confirm: confirmCallback,
			cancel: cancelCallback
		}
	});
}

function JAlert (message,type,confirmCallback) {
	$.alert({
		title    : 'System Message',
		content  : message,
		type     : type,
		icon     : 'fa fa-warning',
		backgroundDismiss : false,
		backgroundDismissAnimation : 'glow'
	});
}