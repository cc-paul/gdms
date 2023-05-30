var one_time = 0;
var isPasswordHidden = true;
var isPasswordHidden2 = true;
var isPasswordOk = false;

$("#txt_username").val(localStorage.getItem("username"));
$("#txt_password").val(localStorage.getItem("password"));

if (localStorage.getItem("username") != null) {
	$( "#chkRememberMe").prop('checked', true);
} else {
	$( "#chkRememberMe").prop('checked', false);
}

$("#btn_signin").click(function(){
	login();
});

$(".login").keyup(function(event) {
    if (event.keyCode === 13) {
        login();
    }
});

$("#aRegister").click(function(){
	$("#mdRegister").modal();
	isPasswordOk = false;
	$("#txtFirstName").val(null);
	$("#txtMiddleName").val(null);
	$("#txtLastName").val(null);
	$("#txtBirthDate").val(null);
	$("#cmbGender").val(null).trigger("change");
	$("#cmbCollege").val(null).trigger("change");
	$("#txtMobileNumber").val(null);
	$("#txtEmailAddress").val(null);
	$("#txtUsername").val(null);
	$("#txtPassword").val(null);
	$("#txtRepeatPassword").val(null);
	$("#password_strength").text("");
});

$("#btn_show").click(function(){
    isPasswordHidden2 = !isPasswordHidden2;
	
	if (!isPasswordHidden2) {
		$("#iShow").removeClass("fa-eye");
		$("#iShow").addClass("fa-eye-slash");
		$('#txtPassword').attr('type', 'text');
        $('#txtRepeatPassword').attr('type', 'text');
    } else {
		$("#iShow").removeClass("fa-eye-slash");
		$("#iShow").addClass("fa-eye");
		$('#txtPassword').attr('type', 'password');
        $('#txtRepeatPassword').attr('type', 'password');
	}
});

$("#btnRegisterAccount").click(function(){
	const firstName = $("#txtFirstName").val();
	const middleName = $("#txtMiddleName").val();
	const lastName = $("#txtLastName").val();
	const birthDate = $("#txtBirthDate").val();
	const gender = $("#cmbGender").val();
	const college = $("#cmbCollege").val();
	const mobileNumber = $("#txtMobileNumber").val();
	const emailAddress = $("#txtEmailAddress").val();
	const username = $("#txtUsername").val();
	const password = $("#txtPassword").val();
	const repeatPassword = $("#txtRepeatPassword").val();
	
	if (firstName == ""  || lastName == "" || birthDate == "" || gender == "" || mobileNumber == "" ||
		emailAddress == "" || username == "" || password == "" || repeatPassword == "" || college == null || college == "") {
		
		JAlert("Please fill in required fields","red");
		return;
    }
	
	if (!validateEmail(emailAddress)) {
		JAlert("Please provide proper email address","red");
		return;
    }
	
	if (mobileNumber.length < 11) {
		JAlert("Mobile number must be 11 digits","red");
		return;
    }
	
	if (submitBday() < 18) {
		JAlert("Please provide proper birth date","red");
		return;
    }
	
	if (password != repeatPassword) {
        JAlert("Passwords are not the same","red");
		return;
    }
	
	if (!isPasswordOk) {
		JAlert("Please provide a password based on the given format","red");
		return;
    }
	
	$.ajax({
		url: "../program_assets/php/web/account",
		data: {
			command   : 'new_user',
			firstName : firstName,
			middleName : middleName,
			lastName : lastName,
			birthDate : birthDate,
			gender : gender,
			mobileNumber : mobileNumber,
			emailAddress : emailAddress,
			username : username.replace("'",""),
			password : password,
			college : college
		},
		type: 'post',
		success: function (data) {
			var data = jQuery.parseJSON(data);
			var value = data[0];
			
			JAlert(value.message,value.color);
			
			if (!value.error) {
				$("#mdRegister").modal("hide");
            }
		}
	});
});

$("#btnForgot").click(function(){
	$.confirm({
		title: 'Forgot Password',
		content: '' +
		'<form action="" class="formName">' +
		'<div class="form-group">' +
		'<label>Email Address</label>' +
		'<input type="text" placeholder="Enter Email Address" class="email form-control" value="" required />' +
		'</div>' +
		'</form>',
		buttons: {
			formSubmit: {
				text: 'Submit',
				btnClass: 'btn-blue',
				action: function () {
					var email = this.$content.find('.email').val();
					if(!email){
						JAlert("Please provide an email","red");
						return false;
					}
					
					if (!validateEmail(email)) {
                        JAlert("Please provide proper email","red");
						return false;
                    }
					
					
					$.ajax({
						url: "../program_assets/php/web/account.php",
						data: {
							command : 'reset_password_email',
							email   : email
						},
						type: 'post',
						success: function (data) {
							var data = jQuery.parseJSON(data);
							
							if (!data[0].error) {
								
								$.ajax({
									url: "https://apps.project4teen.online/email-service/send.php",
									data: {
										rEmail    : email,
										sEmail    : 'teamohmygad.system@gmail.com',
										sName     : 'GDMS',
										sPassword : 'hvaaijeopwczvoxf',
										sSubject  : 'GDMS Password Reset',
										sBody     : data[0].messageBody
									},
									type: 'post',
									success: function (data) {
										var data = jQuery.parseJSON(data);
										
										if (!data[0].error) {
											JConfirm("Password has been reset and a new one will be sent to your email and also check your spam-green", () => {
						
											});
										} else {
											JAlert(data[0].message,data[0].color);
										}
									}
								});
                            } else {
								JAlert(data[0].message,data[0].color);
							}
						}
					});
					
					
					
				}
			},
			cancel: function () {
				//close
			},
		},
		onContentReady: function () {
			// bind to events
			var jc = this;
			this.$content.find('form').on('submit', function (e) {
				// if the user submits the form by pressing enter in the field.
				e.preventDefault();
				jc.$$formSubmit.trigger('click'); // reference the button and click it
			});
		}
	});
});

function login () {
	var username = $("#txt_username").val();
	var password = $("#txt_password").val();

	if (username == "" || password == "") {
		JAlert("Please provide all account details","red");
	} else {
		$.ajax({
		    url: '../program_assets/php/web/login.php',
		    data: {
		        'username': username,
		        'password': password
		    },
		    type: 'post',
		    success: function(data) {
				var data = jQuery.parseJSON(data);
				
				if (data[0].error) {
					JAlert(data[0].message,data[0].color);
                } else {
					if (document.getElementById('chkRememberMe').checked) {
						localStorage.setItem("username", username);
						localStorage.setItem("password", password);
					} else {
						localStorage.removeItem("username");
						localStorage.removeItem("password");
					}
					
					
					JConfirm(data[0].message + "-" + data[0].color, () => {
						window.location.href = "../pages/profile";
					});
				}
		    }
		});
	}
}

function JConfirm (message,confirmCallback) {
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
			confirm: confirmCallback
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

function showHidePassword() {
	isPasswordHidden = !isPasswordHidden;
	
	if (!isPasswordHidden) {
		$("#spIconPassword").removeClass("glyphicon-eye-close");
		$("#spIconPassword").addClass("glyphicon-eye-open");
		$('#txt_password').attr('type', 'text');
    } else {
		$("#spIconPassword").removeClass("glyphicon-eye-open");
		$("#spIconPassword").addClass("glyphicon-eye-close");
		$('#txt_password').attr('type', 'password');
	}
}

function validateEmail($email) {
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailReg.test( $email );
}

function numOnly(selector){
    selector.value = selector.value.replace(/[^0-9]/g,'');
}

function submitBday() {
    var Bdate = document.getElementById('txtBirthDate').value;
    var Bday = +new Date(Bdate);
    return ((Date.now() - Bday) / (31557600000));
}

function CheckPasswordStrength(password) {
    var password_strength = document.getElementById("password_strength");

    //if textBox is empty
    if(password.length==0){
        password_strength.innerHTML = "";
        return;
    }

    //Regular Expressions
    var regex = new Array();
    regex.push("[A-Z]"); //For Uppercase Alphabet
    regex.push("[a-z]"); //For Lowercase Alphabet
    regex.push("[0-9]"); //For Numeric Digits
    regex.push("[$@$!%*#?&]"); //For Special Characters

    var passed = 0;
  
    //Validation for each Regular Expression
    for (var i = 0; i < regex.length; i++) {
        if((new RegExp (regex[i])).test(password)){
            passed++;
        }
    }

    //Validation for Length of Password
    if(passed > 2 && password.length > 8){
        passed++;
    }

    //Display of Status
    var color = "";
    var passwordStrength = "";
    switch(passed){
        case 0:
            break;
        case 1:
            passwordStrength = "Password is Weak.";
            color = "Red";
            break;
        case 2:
            passwordStrength = "Password is Good.";
            color = "darkorange";
            isPasswordOk = true;
            break;
        case 3:
                break;
        case 4:
            passwordStrength = "Password is Strong.";
            color = "Green";
            isPasswordOk = true;
            break;
        case 5:
            passwordStrength = "Password is Very Strong.";
            color = "darkgreen";
            isPasswordOk = true;
            break;
    }
    password_strength.innerHTML = passwordStrength;
    password_strength.style.color = color;
}

/* init select2 */
try {
	$('.select2').select2();
} catch(e){
	console.log(e);
}