<?php
  //if(!isset($_SESSION)) { session_start(); } 
  //if (isset($_SESSION['id'])) {
  //  header( "Location: index");
  //}
?>

<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>GDMS | Login</title>
  <!-- Tell the browser to be responsive to screen width -->
  <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
  <!-- Bootstrap 3.3.7 -->
  <link rel="stylesheet" href="../bower_components/bootstrap/dist/css/bootstrap.min.css">
  <!-- Font Awesome -->
  <link rel="stylesheet" href="../bower_components/font-awesome/css/font-awesome.min.css">
  <!-- Ionicons -->
  <link rel="stylesheet" href="../bower_components/Ionicons/css/ionicons.min.css">
  <!-- Theme style -->
  <link rel="stylesheet" href="../dist/css/AdminLTE.min.css">
  <!-- iCheck -->
  <link rel="stylesheet" href="../plugins/iCheck/square/blue.css">
  <!-- Select2 -->
  <link rel="stylesheet" href="../bower_components/select2/dist/css/select2.min.css">
  <!-- Custom Confirm -->
  <link rel="stylesheet" href="../bower_components/custom-confirm/jquery-confirm.min.css">

  <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
  <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
  <!--[if lt IE 9]>
  <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
  <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
  <![endif]-->

  <!-- Google Font -->
  <!--link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,700,300italic,400italic,600italic"-->
	<link rel="stylesheet" href="../fonts/fonts.css">
		
  
  <!-- StartUp Custom CSS (do not remove)  -->
  <link href="../plugins/bootoast/bootoast.css" rel="stylesheet" type="text/css">
  <link href="../program_assets/css/style.css" rel="stylesheet" type="text/css">
  <style>
    .login-page, .register-page {
      height: auto;
      background: #ffffff;
    }
    
    .image-container {
    display: flex;
    align-items: center;
  }
  .image-container img {
    max-width: 200px; /* Adjust as needed */
    margin-right: 10px; /* Space between image and text */
  }
  </style>
</head>
<body class="hold-transition login-page">
   
<div class="login-box" style="width:700px;">
  <center>
    <!--<div class="image-container" style="margin-left: 68px;">
      <img src="../images/logo.png" alt="logo">
      <p>GENDER AND DEVELOPMENT (GAD) RESOURCE</p>
      <p>CENTER MONITORING SYSTEM</p>
    </div>-->
    <div class="row">
      <div class="col-md-1 col-xs-12"></div>
      <div class="col-md-4 col-xs-12">
        <img src="../images/logo.png" alt="logo">
      </div>
      <div class="col-md-7 col-xs-12">
        <br>
        <br>
        <br>
        <br>
        <b style="font-size: 19px;">GENDER AND DEVELOPMENT (GAD) RESOURCE</b>
        <b style="font-size: 19px;">CENTER MONITORING SYSTEM</b>
        <p>Cavite State University - Main Campus</p>
      </div>
    </div>
    <br>
    <br>
  </center>
  <!-- /.login-logo -->
  <center>
    <div class="login-box-body" style="width:400px;">
    <p class="login-box-msg">Sign in to start your session</p>

    
      <div class="form-group has-feedback">
        <input id="txt_username" name="txt_username" type="text" class="form-control login cust-label" placeholder="Enter your Username">
        <span class="glyphicon glyphicon-user form-control-feedback"></span>
      </div>
      <div class="form-group has-feedback">
        <input id="txt_password" name="txt_password" type="password" class="form-control login cust-label" placeholder="Enter your Password">
        <span id="spIconPassword" class="glyphicon glyphicon-eye-close form-control-feedback" style="pointer-events: auto !important; cursor: pointer;" onclick="showHidePassword()"></span>
      </div>
      <div class="row">
        <div class="col-md-6">
          <label style="display: inline-block">
            <input id="chkRememberMe" style="vertical-align: middle; margin-top: -4px;" type="checkbox" autocomplete="off">
            <label for="chkRememberMe" style="vertical-align: middle" class="cust-label">&nbsp;&nbsp;Remember Me</label>
          </label>
        </div>
        <div class="col-md-6">
          <a id="aRegister" href="#" class="cust-label pull-right">
            <b>Register Account</b>
          </a>
        </div>
        <!-- /.col -->
        
        <!-- /.col -->
      </div>

      <div class="row">
        <div class="col-md-6 col-xs-12">
          <button id="btn_signin" name="btn_signin" type="submit" class="btn btn-primary btn-block cust-label">Sign In</button>
        </div>
        <div class="col-md-6 col-xs-12">
          <button id="btnForgot" name="btnForgot" type="submit" class="btn btn-default btn-block cust-label">Forgot Password</button>
        </div>
      </div>

    <!--div class="social-auth-links text-center">
      <p>- OR -</p>
      <a href="#" class="btn btn-block btn-social btn-facebook btn-flat"><i class="fa fa-facebook"></i> Sign in using
        Facebook</a>
      <a href="#" class="btn btn-block btn-social btn-google btn-flat"><i class="fa fa-google-plus"></i> Sign in using
        Google+</a>
    </div -->
    <!-- /.social-auth-links -->

    <!--a href="#">I forgot my password</a><br>
    <a href="register.html" class="text-center">Register a new membership</a-->

  </div>
  <!-- /.login-box-body -->
</div>
  </center>
<!-- /.login-box -->

<!-- NO INTERNET MODAL -->
<div class="modal fade" id="modal-default" data-backdrop="static" data-keyboard="false">
  <div class="modal-dialog modal-sm">
    <div class="box box-danger">
      <div class="box-body">
        <div class="row">
          <div class="col-md-12 col-sm-12">
            <label>System Message</label>
            <br>
              <center>
                <img class="img-res" src="../dist/img/404-error.png" alt="No Internet Connection">
              </center>
            <br>
            <p class="cust-label">There is no Internet connection. Kindly use the local program to continue your transaction and sync later.</p>
          </div>
        </div>
      </div>
    </div>
  <!-- /.modal-content -->
  </div>
<!-- /.modal-dialog -->
</div>

<!-- Modal Name  -->
<div class="modal fade" id="mdRegister" name="mdRegister">
  <div class="modal-dialog modal-md">
    <div class="box box-default">
        <div class="box-header with-border">
          <label class="cust-label">Account Registration</label>
          <button type="submit" class="btn btn-default btn-xs pull-right" data-dismiss="modal"><i class="fa fa-close"></i>
          </button>
        </div>
        <div class="box-body">
          <div class="row">
            <div class="col-md-12">
              <span class="pull-right-container">
                <small class="label pull-right bg-gray">Basic Information</small>
              </span>
            </div>
          </div>
          <br>
          <div class="row">
            <div class="col-md-4 col-sm-12">
              <div class="form-group">
                <label for="txtFirstName" class="cust-label">First Name</label>
                <code>*</code>
                <input type="text" class="form-control cust-label cust-textbox" id="txtFirstName" name="txtFirstName"  placeholder="Enter First Name">
              </div>
            </div>
            <div class="col-md-4 col-sm-12">
              <div class="form-group">
                <label for="txtMiddleName" class="cust-label">Middle Name</label>
                <input type="text" class="form-control cust-label cust-textbox" id="txtMiddleName" name="txtMiddleName"  placeholder="Enter Middle Name">
              </div>
            </div>
            <div class="col-md-4 col-sm-12">
              <div class="form-group">
                <label for="txtLastName" class="cust-label">Last Name</label>
                <code>*</code>
                <input type="text" class="form-control cust-label cust-textbox" id="txtLastName" name="txtLastName"  placeholder="Enter Last Name">
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-4 col-sm-12">
              <div class="form-group">
                <label for="txtBirthDate" class="cust-label">Birthday</label>
                <code>*</code>
                <input type="date" class="form-control cust-label cust-textbox" id="txtBirthDate" name="txtBirthDate"  placeholder="Enter Birthdate" style="height: 30px !important;">
              </div>
            </div>
            <div class="col-md-4 col-sm-12">
              <div class="form-group">
                <label for="cmbGender" class="cust-label">Sex</label>
                <code>*</code>
                <select id="cmbGender" name="cmbGender" class="form-control select2 cust-label cust-textbox" style="width: 100%;">
                  <option value="" selected disabled>Please select sex</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>
            <div class="col-md-4 col-sm-12">
              <div class="form-group">
                <label for="txtMobileNumber" class="cust-label">Mobile Number</label>
                <code>*</code>
                <input type="text" class="form-control cust-label cust-textbox" id="txtMobileNumber" name="txtMobileNumber"  placeholder="Enter Mobile (09XXXXXXXXX)" maxlength="11" onkeyup="numOnly(this)">
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <span class="pull-right-container">
                <small class="label pull-right bg-gray">Account Details</small>
              </span>
            </div>
          </div>
          <br>
          <div class="row">
            <div class="col-md-4 col-sm-12">
              <div class="form-group">
                <label for="txtEmailAddress" class="cust-label">Email Address</label>
                <code>*</code>
                <input type="text" class="form-control cust-label cust-textbox" id="txtEmailAddress" name="txtEmailAddress"  placeholder="Enter Email Address">
              </div>
            </div>
            <div class="col-md-4 col-sm-12">
              <div class="form-group">
                <label for="txtUsername" class="cust-label">Username</label>
                <code>*</code>
                <input type="text" class="form-control cust-label cust-textbox" id="txtUsername" name="txtUsername"  placeholder="Enter Username">
              </div>
            </div>
            <div class="col-md-4 col-sm-12">
              <div class="form-group">
                <label for="cmbGender" class="cust-label">College \ Campus \ Units</label>
                <code>*</code>
                <select id="cmbCollege" name="cmbCollege" class="form-control select2 cust-label cust-textbox" style="width: 100%;">
                  <option value="" selected disabled>Please select college</option>
                  <?php
                    include dirname(__FILE__,2) . '/program_assets/php/dropdown/colleges.php';
                  ?>
                </select>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 col-sm-12">
              <div class="form-group">
                <label for="txtPassword" class="cust-label">Password</label>
                <code>*</code>
                <input type="password" class="form-control cust-label cust-textbox" id="txtPassword" name="txtPassword"  placeholder="Enter Password" onkeyup="CheckPasswordStrength(this.value)">
                <label id="password_strength" name="password_strength" class="cust-label"></label>
              </div>
            </div>
            <div class="col-md-6 col-sm-12">
              <div class="form-group">
                <label for="txtRepeatPassword" class="cust-label">Repeat Password</label>
                <code>*</code>
                <input type="password" class="form-control cust-label cust-textbox" id="txtRepeatPassword" name="txtRepeatPassword"  placeholder="Enter Repeat Password">
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <div id="message" class="alert bg-gray">
                <label class="cust-label">Password Pattern</label>
                <br>
                <span class="cust-label" id="letter" class="invalid">Must have a <b>lowercase</b> letter</span>
                <br>
                <span class="cust-label"  id="capital" class="invalid">Must have a  <b>capital (uppercase)</b> letter</span>
                <br>
                <span class="cust-label"  id="number" class="invalid">Must have a <b>number</b></span>
                <br>
                <span class="cust-label"  id="length" class="invalid">Minimum of <b>8 characters</b></span>
                <br>
                <span class="cust-label"  id="length" class="invalid">Must have a <b>Special</b> Characters</span>
              </div>
            </div>
          </div>
        </div>
        <div class="box-footer">
          <div class="row">
            <div class="col-md-6 col-sm-12">
              <button id="btn_show" name="btn_show" type="submit" class="btn btn-default btn-sm" style="width: 100%;"><i id="iShow" class="fa fa-eye"></i>
                &nbsp; 
                Show/Hide Password
              </button>
            </div>
            <div class="col-md-6 col-sm-12">
              <button id="btnRegisterAccount" name="btnRegisterAccount" type="submit" class="btn btn-default btn-sm" style="width: 100%;"><i class="fa fa-save"></i>
                &nbsp; 
                Register Account
              </button>
            </div>
          </div>
        </div>
    </div>
  <!-- /.modal-content -->
  </div>
  <!-- /.modal-dialog -->
</div>

<!-- jQuery 3 -->
<script src="../bower_components/jquery/dist/jquery.min.js"></script>
<script src="../bower_components/jquery-ui/jquery-ui.min.js"></script>
<!-- Bootstrap 3.3.7 -->
<script src="../bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
<!-- iCheck -->
<script src="../plugins/iCheck/icheck.min.js"></script>
<script src="../plugins/bootoast/bootoast.js"></script>
<!-- Select2 -->
<script src="../bower_components/select2/dist/js/select2.full.min.js"></script>
<!-- Custom Confirm -->
<script src="../bower_components/custom-confirm/jquery-confirm.min.js"></script>
<!-- StartUp Custom JS (do not remove)  -->
<!--<script src="../program_assets/js/site_essentials/others.js"></script>-->
<!-- Select2 -->
<script src="../bower_components/select2/dist/js/select2.full.min.js"></script>
<script src="../program_assets/js/web_functions/login.js?random=<?php echo uniqid(); ?>"></script>
</body>
</html>
