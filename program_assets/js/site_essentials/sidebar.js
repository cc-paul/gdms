var url = location.protocol + '//' + location.host + location.pathname;
$('a').each(function(){
	if ($(this).prop('href') == url) {
		$(this).addClass('active');
		$(this).parents('li').addClass('active bg-gray');
		
		var header_menu,side_menu,menu_desc;
		
		header_menu = $(this).attr("data-header");
		side_menu   = $(this).text();
		menu_desc   = $(this).attr("data-desc");
		
		if (typeof header_menu === "undefined") {
			header_menu = "";
		} else {
			if (header_menu == "") {
				header_menu = "";
			} else {
				header_menu = "<li>" + header_menu + "</a></li>";
			}
		}
		
		/* tab title */
		document.title = "GDMS | " + side_menu;
		
		if (typeof menu_desc === 'undefined') {
			menu_desc = "";
		} else {
			if (menu_desc == "") {
				menu_desc = "";
			}
		}
		
		//$(".page-order").append(
		//	'' +
		//	header_menu +
		//	'<li>' + side_menu + '</li>' 
		//);
		
		document.body.innerHTML = document.body.innerHTML.replace("@side_header", side_menu);
		document.body.innerHTML = document.body.innerHTML.replace("@side_desc", menu_desc);
	}
});

$("input[name=q]").on('input', function() {
	var menu_name = $("input[name=q]").val().replace(" ","_");
	
	$(".sidebar-menu li").removeClass('bg-orange');
    
	if (menu_name != "") {
		$("#" + menu_name.toLowerCase()).addClass("bg-orange");
	}
});