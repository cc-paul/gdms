var isPasswordHidden = true;
var isPasswordOk = false;

$("#btn_password").click(function(){
    var password_1 = $("#txt_new_password").val();
    var password_2 = $("#txt_repeat_password").val();
    
    if (password_1 == "" || password_2 == "") {
        JAlert("Please fill in all required fields","red");
    } else if (password_1 != password_2) {
        JAlert("Passwords are not the same","red");
    } else if (password_1.length < 8) {
        JAlert("Passwords must be 8 characters","red");
    } else if (!isPasswordOk) {
        JAlert("Password Failed. Password must have upper case,lower case,numeric and special characters","red");
    } else {
        $.ajax({
            url: "../program_assets/php/web/profile.php",
            data: {
                password : password_1,
                command  : "update_pass"
            },
            type: 'post',
            success: function (data) {
                var data = data.trim();
                
                if (data == 1) {
                    JConfirm("Password has been changed-green", () => {
                        //location.reload();
                        
                        window.location.href = "../pages/profile";
                    });
                }
            }
        });
    }
});

function openImage() {
    javascript:document.getElementById('image_uploader').click();
}

function removeImage() {
    $.ajax({
        url: "../program_assets/php/upload/delete.php",
        type: 'post',
        success: function (data) {
            location.reload(true);
        }
    });
}

$('#image_uploader').change(function (e) {
	var file_data = $('#image_uploader').prop('files')[0];
	var form_data = new FormData();
	form_data.append('file', file_data);
	$.ajax({
	    url: '../program_assets/php/upload/upload_profile2.php',
	    dataType: 'text',
	    cache: false,
	    contentType: false,
	    processData: false,
	    data: form_data,
	    type: 'post',
	    success: function(data) {
            id = data.trim();
            $('#imgProfile').attr("src", "../profile/" + id + ".png?random=" + Math.random());
            isImageAdded = 1;
            //location.reload(true);
            //location.reload();
        }
	});
});

$("#btn_show").click(function(){
    isPasswordHidden = !isPasswordHidden;
	
	if (!isPasswordHidden) {
		$("#iShow").removeClass("fa-eye");
		$("#iShow").addClass("fa-eye-slash");
		$('#txt_repeat_password').attr('type', 'text');
        $('#txt_new_password').attr('type', 'text');
    } else {
		$("#iShow").removeClass("fa-eye-slash");
		$("#iShow").addClass("fa-eye");
		$('#txt_repeat_password').attr('type', 'password');
        $('#txt_new_password').attr('type', 'password');
	}
});

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