<?php
	if(!isset($_SESSION)) { session_start(); } 
	if (!isset($_SESSION['id'])) {
		header( "Location: login" );
	}
?>

<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<title></title>
		<!-- Tell the browser to be responsive to screen width -->
		<meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
		<!-- Bootstrap 3.3.7 -->
		<link rel="stylesheet" href="../bower_components/bootstrap/dist/css/bootstrap.min.css">
		<!-- Font Awesome -->
		<link rel="stylesheet" href="../bower_components/font-awesome/css/font-awesome.min.css">
		<!-- Ionicons -->
		<link rel="stylesheet" href="../bower_components/Ionicons/css/ionicons.min.css">
		<!-- DataTables -->
  		<link rel="stylesheet" href="../bower_components/datatables.net-bs/css/dataTables.bootstrap.min.css">
  		<link rel="stylesheet" href="../bower_components/datatables.select/select.dataTables.min.css">
		<!-- Select2 -->
  		<link rel="stylesheet" href="../bower_components/select2/dist/css/select2.min.css">
		<!-- Theme style -->
		<link rel="stylesheet" href="../dist/css/AdminLTE.min.css">
		<!-- AdminLTE Skins. Choose a skin from the css/skins
		folder instead of downloading all of them to reduce the load. -->
		<link rel="stylesheet" href="../dist/css/skins/_all-skins.min.css">
		<!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
		<!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
		<!--[if lt IE 9]>
		<script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
		<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
		<![endif]-->
		<!--link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,700,300italic,400italic,600italic"-->
		<link rel="stylesheet" href="../fonts/fonts.css">
		<!-- Custom Confirm -->
		<link rel="stylesheet" href="../bower_components/custom-confirm/jquery-confirm.min.css">
		<link href="https://api.mapbox.com/mapbox-gl-js/v2.9.2/mapbox-gl.css" rel="stylesheet">
		<!-- tokenize -->
		<link rel="stylesheet" href="../bower_components/tokenize2/tokenize2.css">
		
		<!-- StartUp Custom CSS (do not remove)  -->
		<link href="../plugins/bootoast/bootoast.css" rel="stylesheet" type="text/css">
		<link href="../program_assets/css/style.css" rel="stylesheet" type="text/css">
		<link
			rel="stylesheet"
			href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.7.0/mapbox-gl-geocoder.css"
			type="text/css"
		/>
		
		<style>
			.own-card {
				background: #f6f6f6;
				margin: 10px;
			}
			
			.pointer {
				cursor:pointer;
			}
			
			.full_modal-dialog {
				width: 100% !important;
				height: 100% !important;
				min-width: 100% !important;
				min-height: 100% !important;
				max-width: 100% !important;
				max-height: 100% !important;
				padding: 0 !important;
			}
			
			.full_modal-content {
				height: 100% !important;
				min-height: 100% !important;
				max-height: 100% !important;
			}
		</style>
	</head>
	
	<!-- ADD THE CLASS fixed TO GET A FIXED HEADER AND SIDEBAR LAYOUT -->
	<!-- the fixed layout is not compatible with sidebar-mini -->
	<body class="hold-transition skin-green-light fixed sidebar-mini">
		<!-- Site wrapper -->
		<div class="wrapper">
			<header class="main-header">
				<!-- Logo -->
				<a href="#" class="logo">
					<!-- mini logo for sidebar mini 50x50 pixels -->
					<span class="logo-mini"></span>
					<!-- logo for regular state and mobile devices -->
					<span class="logo-lg"></span>
				</a>
				<!-- Header Navbar: style can be found in header.less -->
				<nav class="navbar navbar-static-top">
					<!-- Sidebar toggle button-->
					<a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button">
						<span class="sr-only">Toggle navigation</span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
					</a>
					<div class="navbar-custom-menu">
						<ul class="nav navbar-nav">
							<!--<li class="dropdown notifications-menu">
	    						<a href="#" class="dropdown-toggle" data-toggle="dropdown">
									<i class="fa fa-bell-o"></i>
									<span id="sp-notif-counter" name= "sp-notif-counter" class="label label-warning"></span>
					            </a>
					            <ul class="dropdown-menu">
					            	<li id="li-noti" name="li-noti" class="header">You have 0 notification(s)</li>
					            	<li>
					            		<ul class="menu">
					            		</ul>
					            	</li>
					            	<li class="footer"><a href="javascript:void(0);" id="read_all" name="read_all">Mark all as read</a></li>
					            </ul>
	    					</li>-->
							
							<!-- User Account: style can be found in dropdown.less -->
							<li class="dropdown user user-menu">
								<a href="#" class="dropdown-toggle" data-toggle="dropdown">
									<img src="./../profile/<?php  echo $_SESSION['id'] ?>.png?random=<?php echo rand(10,100);?>" class="user-image" alt="User Image" onerror="this.onerror=null; this.src='./../profile/Default.png'">
									<span class="hidden-xs">
										<?php
											$to_display = "name";
											require dirname(__FILE__,2) . '/program_assets/php/naming/naming.php';
										?>
									</span>
								</a>
								<ul class="dropdown-menu">
									<!-- User image -->
									<li class="user-header">
										<img src="./../profile/<?php  echo $_SESSION['id'] ?>.png?random=<?php echo rand(10,100);?>" class="img-circle" alt="User Image" onerror="this.onerror=null; this.src='./../profile/Default.png'">
										<p>
											<?php
												$to_display = "name";
												require dirname(__FILE__,2) . '/program_assets/php/naming/naming.php';
											?>
											&nbsp;-&nbsp;
											<?php
												$to_display = "branch";
												require dirname(__FILE__,2) . '/program_assets/php/naming/naming.php';
											?>

											<small>
												Member since : 
												<?php
													$to_display = "date_created";
													require dirname(__FILE__,2) . '/program_assets/php/naming/naming.php';
												?>
											</small>
										</p>
									</li>
									<!-- Menu Footer-->
									<li class="user-footer">
										<div class="pull-left">
											<a href="profile" class="btn btn-default btn-flat">Profile</a>
										</div>
										<div class="pull-right">
											<a href="logout" class="btn btn-default btn-flat">Sign out</a>
										</div>
									</li>
								</ul>
							</li>
						</ul>
					</div>
				</nav>
			</header>
			<!-- =============================================== -->
			<!-- Left side column. contains the sidebar -->
			<aside class="main-sidebar">
				<!-- sidebar: style can be found in sidebar.less -->
				<section class="sidebar">
					<!-- Sidebar user panel -->
					<div class="user-panel">
						<div class="pull-left image">
							<img src="./../profile/cs.png" class="img-circle" alt="User Image" onerror="this.onerror=null; this.src='./../profile/Default.png'" style="max-height: 50px;">
						</div>
						<div class="pull-left info">
							<p>
								<?php	
									$to_display = "name";
									require dirname(__FILE__,2) . '/program_assets/php/naming/naming.php';
								?>
							</p>
							<a href="#"><i id="c_status" name="c_status" class="fa fa-circle text-success"></i> Online</a>
						</div>
					</div>
					<!-- search form -->
					<div class="sidebar-form">
						<div class="input-group">
							<input type="text" name="q" class="form-control" placeholder="Search...">
							<span class="input-group-btn">
								<button type="submit" name="search" id="search-btn" class="btn btn-flat">
									<i class="fa fa-search"></i>
								</button>
							</span>
						</div>
					</div>
					<!-- /.search form -->
					<!-- sidebar menu: : style can be found in sidebar.less -->
					<ul class="sidebar-menu" data-widget="tree">
						<li class="header">MAIN NAVIGATION</li>
						<?php
							include dirname(__FILE__,2) . '/program_assets/php/sidebar/sidebar.php';
						?>
					</ul>
				</section>
				<!-- /.sidebar -->
			</aside>
			<!-- =============================================== -->
			<!-- Content Wrapper. Contains page content -->
			<div class="content-wrapper">
				<!-- Content Header (Page header) -->
				<section class="content-header">
					<h1>
						@side_header
						<small>@side_desc</small>
					</h1>
					<ol class="breadcrumb page-order"></ol>
				</section>
				<!-- Main content -->
				<section class="content col-md-10 col-sm-12">
					<div class="nav-tabs-custom">
						<ul class="nav nav-tabs">
							<li class="active"><a href="#admin" data-toggle="tab" aria-expanded="true" class="cust-label">List of Approvals</a></li>
							<!--<li class=""><a href="#gender" data-toggle="tab" aria-expanded="true" class="cust-label">Gender Issues</a></li>-->
						</ul>
						<div class="tab-content">
							<div class="tab-pane active" id="admin">
								<div class="row">
									<div class="col-md-2 col-sm-12">
										<label class="cust-label">Report</label>
										<select id="cmbFilterReport" name="cmbFilterReport" class="form-control select2 cust-label cust-textbox" style="width: 100%;">
											<option value="-" selected>Select All Report</option>
											<?php
												$to_filter = "report";
												require dirname(__FILE__,2) . '/program_assets/php/dropdown/filter.php';
											?>
										</select>
									</div>
									<div class="col-md-2 col-sm-12">
										<label class="cust-label">Year</label>
										<select id="cmbFilterYear" name="cmbFilterYear" class="form-control select2 cust-label cust-textbox" style="width: 100%;">
											<option value="-" selected>Select All Year</option>
											<?php
												$to_filter = "year";
												require dirname(__FILE__,2) . '/program_assets/php/dropdown/filter.php';
											?>
										</select>
									</div>
									<div class="col-md-2 col-sm-12">
										<label class="cust-label">Colleges</label>
										<select id="cmbFilterCollege" name="cmbFilterCollege" class="form-control select2 cust-label cust-textbox" style="width: 100%;">
											<option value="-" selected>Select All Colleges</option>
											<?php
												$to_filter = "college";
												require dirname(__FILE__,2) . '/program_assets/php/dropdown/filter.php';
											?>
										</select>
									</div>
									<div class="col-md-2 col-sm-12">
										<label class="cust-label">Status</label>
										<select id="cmbFilterStatus" name="cmbFilterStatus" class="form-control select2 cust-label cust-textbox" style="width: 100%;">
											<option value="-" selected>Select All Status</option>
											<?php
												$to_filter = "status";
												require dirname(__FILE__,2) . '/program_assets/php/dropdown/filter.php';
											?>
										</select>
									</div>
									<div class="col-md-2 col-xs-6">
										<div class="form-group">
											<button id="btnGenerateReport" type="button" class="btn btn-block btn-default btn-sm cust-textbox" style="margin-top: 22px;">
												<i class="fa fa-file"></i>
												&nbsp;
												Generate Report
											</button>
										</div>
									</div>
									<div class="col-md-2 col-xs-6">
										<div class="form-group">
											<button id="btnExport" type="button" class="btn btn-block btn-default btn-sm cust-textbox" style="margin-top: 22px;">
												<i class="fa fa-file-excel-o"></i>
												&nbsp;
												Export to Excel
											</button>
										</div>
									</div>
								</div>
								<div class="row">
									<div class="col-md-12 col-sm-12">
										<div class="table-container">
											<table id="tblGBPTable" name="tblGBPTable" class="table table-bordered table-hover cust-label" style="width: 100% !important;">
												<thead>
													<tr>
														<th>Report Type</th>
														<th>College</th>
														<th>Year</th>
														<th>Status</th>
														<th>Amount</th>
														<th>Created By</th>
														<th></th>
													</tr>
												</thead>
												<tbody></tbody>
											</table>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
				<!-- /.content -->
			</div>
			<!-- /.content-wrapper -->
			<footer class="main-footer">
				<div class="pull-right hidden-xs">
					<!-- Version or anything -->
				</div>
				<strong class="cust-label">Program created by: <a id="footer-cname" name="footer-cname" href="#">CompanyName</a> </strong> 
				<span class="cust-label">IT Department.</span>
			</footer>
			<!-- Add the sidebar's background. This div must be placed
			immediately after the control sidebar -->
			<div class="control-sidebar-bg"></div>
		</div>
		<!-- ./wrapper -->
		
		<!-- Modal Name  -->
		<div class="modal fade" id="mdViewGBP" name="mdViewGBP">
			<div class="modal-dialog full_modal-dialog">
				<div class="box box-default">
					<div class="box-header with-border">
						<label class="cust-label">View GPB</label>
						<button type="submit" class="btn btn-default btn-xs pull-right" data-dismiss="modal"><i class="fa fa-close"></i>
						</button>
					</div>
					<div class="box-body">
						<!--<div class="row">
							<div class="col-md-12 col-xs-12">
								<div class="btn-group">
									<button type="button" class="btn btn-default"><i class="fa fa-file-excel-o"></i></button>
									<button type="button" class="btn btn-default"><i class="fa fa-file-pdf-o"></i></button>
									<button type="button" class="btn btn-default"><i class="fa fa-file-word-o"></i></button>
								</div>
							</div>
						</div>
						<br>-->
						<div class="row">
							<div class="col-md-12">
								<center>
									<label class="cust-label">ANNUAL GENDER AND DEVELOPMENT (GAD) PLAN AND BUDGET</label>
									<br>
									<label class="cust-label">FY</label>
									<label id="lblFY" class="cust-label" style="margin-left:10px;">0000</label>
									<br>
									<a id="aGeneralComments" href="#" class="cust-label">General Comments</a>
								</center>
							</div>
						</div>
						<br>
						<div class="row">
							<div class="col-md-12 col-sm-12">
								<div class="table-container">
									<table id="table_name" name="table_name" class="table table-bordered table-hover cust-label" style="width: 100% !important;">
										<thead>
											<tr>
												<td colspan="4">
													<span class="cust-label">
														<b>Organization:</b> 
													</span>
													<span id="spOrg" class="cust-label">
														
													</span>
												</td>
												<td colspan="4">
													<span class="cust-label">
														<b>Organization Category: </b> 
													</span>
													<span class="cust-label">
														State Universities and Colleges, State University or College (Main Campus)
													</span>
												</td>
											</tr>
											<tr>
												<td colspan="5">
													<span class="cust-label">
														<b>Organization Hierarchy:</b> 
													</span>
													<span id="spOrgHi" class="cust-label">
														
													</span>
												</td>
											</tr>
											<tr>
												<td style="width: 250px;">
													<span class="cust-label">
														<b>Total Budget/GAA of Organization</b> 
													</span>
												</td>
												<td>
													<span id="lblGAABudget" class="cust-label">
														0
													</span>
												</td>
												<td>
													<span class="cust-label">
														<b>Primary Source</b> 
													</span>
												</td>
												<td colspan="2">
													<span id="lblPrimarySource" class="cust-label">
														0
													</span>
												</td>
											</tr>
											<tr>
												<td colspan="2"></td>
												<td>
													<span class="cust-label">
														<b>Other Source</b> 
													</span>
												</td>
												<td colspan="2">
													<span id="lblOtherSource" class="cust-label">
														0
													</span>
												</td>
											</tr>
											<tr>
												<td>
													<span class="cust-label">
														<b>% of GAD Allocation</b> 
													</span>
												</td>
												<td colspan="2">
													<span id="lblGADPercent" class="cust-label">
														0.00%
													</span>
												</td>
											</tr>
										</thead>
										<tbody></tbody>
									</table>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-12 col-sm-12">
								<div class="table-container">
									<div style="height: 300px">
										<table id="tblViewClientFocus" name="tblViewClientFocus" class="table table-bordered table-hover cust-label" style="width: 100% !important;">
											<thead>
												<tr>
													<th style="vertical-align: middle; width:104px;"></th>
													<th style="vertical-align: middle; width:317px;">
														<center>
															Gender Issue / <br> GAD Mandate
														</center>
													</th>
													<th style="vertical-align: middle; width:317px;">
														<center>
															Cause of Gender Issue
														</center>
													</th>
													<th style="vertical-align: middle; width:317px;">
														<center>
															GAD Result Statement / <br> GAD Objective
														</center>
													</th>
													<th style="vertical-align: middle; width:317px;">
														<center>
															Relevant Organization <br> MFO/PAP or PPA
														</center>
													</th>
													<th style="vertical-align: middle; width:317px;">
														<center>
															GAD Activity
														</center>
													</th>
													<th style="vertical-align: middle; width:317px;">
														<center>
															Performance Indicator / <br> Targets
														</center>
													</th>
													<th style="vertical-align: middle; width:151px;">
														<center>
															GAD Budget
														</center>
													</th>
													<th style="vertical-align: middle; width:317px;">
														<center>
															Source of Budget
														</center>
													</th>
													<th style="vertical-align: middle; width:200px;">
														<center>
															Responsible Unit / <br> Offices
														</center>
													</th>
													<th style="vertical-align: middle; width:150px;">
														<center>
															Actual Result (Outcome)
														</center>
													</th>
													<th style="vertical-align: middle; width:150px;">
														<center>
															Actual Cost / Expenditure
														</center>
													</th>
													<th style="vertical-align: middle; width:150px;">
														<center>
															Variance / Remarks
														</center>
													</th>
													<th style="vertical-align: middle; width:150px;">
														<center>
															Attachments
														</center>
													</th>
													<th style="vertical-align: middle; width:150px;">
														<center>
															Action
														</center>
													</th>
												</tr>
												<tr>
													<th></th>
													<th style="vertical-align: middle;">
														<center>
															1
														</center>
													</th>
													<th style="vertical-align: middle;">
														<center>
															2
														</center>
													</th>
													<th style="vertical-align: middle;">
														<center>
															3
														</center>
													</th>
													<th style="vertical-align: middle;">
														<center>
															4
														</center>
													</th>
													<th style="vertical-align: middle;">
														<center>
															5
														</center>
													</th>
													<th style="vertical-align: middle;">
														<center>
															6
														</center>
													</th>
													<th style="vertical-align: middle;">
														<center>
															7
														</center>
													</th>
													<th style="vertical-align: middle;">
														<center>
															8
														</center>
													</th>
													<th style="vertical-align: middle;">
														<center>
															9
														</center>
													</th>
													<th style="vertical-align: middle;">
														<center>
															10
														</center>
													</th>
													
													
													<th style="vertical-align: middle;">
														<center>
															11
														</center>
													</th>
													<th style="vertical-align: middle;">
														<center>
															12
														</center>
													</th>
													<th style="vertical-align: middle;">
														<center>
															13
														</center>
													</th>
													<th style="vertical-align: middle;">
														<center>
															
														</center>
													</th>
												</tr>
												<!--<tr>
													<th colspan="12" style="background-color:#FFFDCC">
														<center>
															CLIENT FOCUSED
														</center>
													</th>
												</tr>-->
											</thead>
											<tbody></tbody>
											<tfoot>
												<tr>
													<td></td>
													<td></td>
													<td></td>
													<td></td>
													<td></td>
													<td></td>
													<td colspan="2">
														<b>SUB TOTAL</b>
													</td>
													<td>
														<span id="lblPrimarySource2" class="cust-label"></span>
													</td>
													<td>GAA</td>
													<td></td>
													<td></td>
												</tr>
												<tr>
													<td></td>
													<td></td>
													<td></td>
													<td></td>
													<td></td>
													<td></td>
													<td></td>
													<td></td>
													<td>
														<span id="lblOtherSource2" class="cust-label"></span>
													</td>
													<td>ODA</td>
													<td></td>
													<td></td>
												</tr>
												<tr>
													<td></td>
													<td></td>
													<td></td>
													<td></td>
													<td></td>
													<td></td>
													<td colspan="2">
														<b>TOTAL GAD BUDGET</b>
													</td>
													<td>
														<span id="lblGAABudget2" class="cust-label"></span>
													</td>
													<td></td>
													<td></td>
													<td></td>
												</tr>
											</tfoot>
										</table>
									</div>
								</div>
							</div>
						</div>
						<br>
						<div class="row" hidden>
							<div class="col-md-12 col-sm-12">
								<div class="table-container">
									<div style="width:2806px">
										<table id="tblViewOrgFocus" name="tblViewOrgFocus" class="table table-bordered table-hover cust-label" style="width: 100% !important;">
											<thead>
												<tr>
													<th style="vertical-align: middle; width:104px;"></th>
													<th style="vertical-align: middle; width:317px;">
														<center>
															Gender Issue / <br> GAD Mandate
														</center>
													</th>
													<th style="vertical-align: middle; width:317px;">
														<center>
															Cause of Gender Issue
														</center>
													</th>
													<th style="vertical-align: middle; width:317px;">
														<center>
															GAD Result Statement / <br> GAD Objective
														</center>
													</th>
													<th style="vertical-align: middle; width:317px;">
														<center>
															Relevant Organization <br> MFO/PAP or PPA
														</center>
													</th>
													<th style="vertical-align: middle; width:317px;">
														<center>
															GAD Activity
														</center>
													</th>
													<th style="vertical-align: middle; width:317px;">
														<center>
															Performance Indicator / <br> Targets
														</center>
													</th>
													<th style="vertical-align: middle; width:151px;">
														<center>
															GAD Budget
														</center>
													</th>
													<th style="vertical-align: middle; width:317px;">
														<center>
															Source of Budget
														</center>
													</th>
													<th style="vertical-align: middle; width:200px;">
														<center>
															Responsible Unit / <br> Offices
														</center>
													</th>
													<th style="vertical-align: middle; width:150px;">
														<center>
															Attachments
														</center>
													</th>
													<th style="vertical-align: middle; width:150px;">
														<center>
															Action
														</center>
													</th>
												</tr>
												<tr>
													<th></th>
													<th style="vertical-align: middle;">
														<center>
															1
														</center>
													</th>
													<th style="vertical-align: middle;">
														<center>
															2
														</center>
													</th>
													<th style="vertical-align: middle;">
														<center>
															3
														</center>
													</th>
													<th style="vertical-align: middle;">
														<center>
															4
														</center>
													</th>
													<th style="vertical-align: middle;">
														<center>
															5
														</center>
													</th>
													<th style="vertical-align: middle;">
														<center>
															6
														</center>
													</th>
													<th style="vertical-align: middle;">
														<center>
															7
														</center>
													</th>
													<th style="vertical-align: middle;">
														<center>
															8
														</center>
													</th>
													<th style="vertical-align: middle;">
														<center>
															9
														</center>
													</th>
													<th style="vertical-align: middle;">
														<center>
															10
														</center>
													</th>
													<th style="vertical-align: middle;">
														<center>
															
														</center>
													</th>
												</tr>
												<tr>
													<th colspan="12" style="background-color:#FFFDCC">
														<center>
															ORGANIZATIONAL FOCUSED
														</center>
													</th>
												</tr>
											</thead>
											<tbody></tbody>
											<tfoot>
												
											</tfoot>
										</table>
									</div>
								</div>
							</div>
						</div>
						<br>
						<br>
						<div class="row">
							<div class="col-md-4 col-xs-12">
								<div class="row">
									<div class="col-md-6 col-xs-12">
										<label class="cust-label">Prepared By : </label>
									</div>
									<div class="col-md-6 col-xs-12">
										<label class="cust-label">Approved By : </label>
									</div>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-4 col-xs-12">
								<div class="row">
									<div class="col-md-6 col-xs-12">
										<label id="lblPreparedByName" class="cust-label"></label>
									</div>
									<div class="col-md-6 col-xs-12">
										<label id="lblApprovedByName" class="cust-label"></label>
									</div>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-4 col-xs-12">
								<div class="row">
									<div class="col-md-6 col-xs-12">
										<label id="lblPreparedByPosition" class="cust-label"></label>
									</div>
									<div class="col-md-6 col-xs-12">
										<label id="lblApprovedByPosition" class="cust-label"></label>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="box-footer">
						<div class="row">
							<div class="col-md-8 col-xs-12">
							</div>
							<div class="col-md-1 col-xs-12">
								<select id="cmbFinalStatus" name="cmbFinalStatus" class="form-control select2 cust-label cust-textbox" style="width: 100%;">
									<option value="Draft">Draft</option>
									<option value="For Review">For Review</option>
									<option value="Endorse">Endorse</option>
									<option value="Endorse">Re-Endorse</option>
								</select>
							</div>
							<div class="col-md-1 col-xs-12">
								<button id="btnFinalize" type="button" class="btn btn-block btn-default btn-sm cust-textbox">
									<i class="fa fa-send"></i>
									&nbsp;
									Finalize
								</button>
							</div>
							<div class="col-md-2 col-xs-12">
								<div class="pull-right">
									<label class="cust-label">
										Document Status : 
									</label>
									<span id="lblDocReq" class="cust-label"></span>
								</div>
							</div>
						</div>
					</div>
				</div>
			<!-- /.modal-content -->
			</div>
		<!-- /.modal-dialog -->
		</div>
		
		<!-- Modal Name  -->
		<div class="modal fade" id="mdComments" name="mdComments">
			<div class="modal-dialog modal-md">
				<div class="box box-default">
					<div class="box-header with-border">
						<label class="cust-label">Comments</label>
						<button type="submit" class="btn btn-default btn-xs pull-right" data-dismiss="modal"><i class="fa fa-close"></i>
						</button>
					</div>
					<div class="box-body">
						<div id="dvComments" class="box-body" style="height: 334px; overflow-y: auto; overflow-x: hidden;">
						
						</div>
					</div>
					<div class="box-footer">
						<div class="row">
							<div class="col-md-12 col-sm-12">
								<textarea id="txtComment" name="txtComment" rows="4" class="form-control cust-label cust-textbox" placeholder="Enter Comment Details"></textarea>
							</div>
						</div>
						<br>
						<div class="row">
							<div class="col-md-8 col-sm-12">
								
							</div>
							<div class="col-md-4 col-sm-12">
								<div class="form-group">
									<input
										type="file"
										class="form-control cust-label cust-textbox cust-label"
										id="txtCommentFile"
										name="txtCommentFile"
										accept=
										"application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,
										text/plain, application/pdf,.doc,.docx"
									>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-8 col-xs-12"></div>
							<div class="col-md-4 col-xs-12">
								<button id="btnSaveComment" name="btnSaveComment" type="button" class="btn btn-block btn-default btn-sm cust-textbox">
									<i class="fa fa-save"></i>
									&nbsp;
									Save Changes
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
		<!-- Bootstrap 3.3.7 -->
		<script src="../bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
		<!-- Select2 -->
		<script src="../bower_components/select2/dist/js/select2.full.min.js"></script>
		<!-- DataTables -->
		<script src="../bower_components/datatables.net/js/jquery.dataTables.min.js"></script>
		<script src="../bower_components/datatables.net-bs/js/dataTables.bootstrap.min.js"></script>
		<script src="../bower_components/datatables.select/dataTables.select.min.js"></script>
		<script src="../bower_components/datatables.button/dataTables.buttons.min.js"></script>
		<script src="../bower_components/datatables.button/jszip.min.js"></script>
		<script src="../bower_components/datatables.button/buttons.html5.min.js"></script>
		<!-- SlimScroll -->
		<script src="../bower_components/jquery-slimscroll/jquery.slimscroll.min.js"></script>
		<!-- FastClick -->
		<script src="../bower_components/fastclick/lib/fastclick.js"></script>
		<!-- AdminLTE App -->
		<script src="../dist/js/adminlte.min.js"></script>
		<script src="../plugins/bootoast/bootoast.js"></script>
		<!-- Custom Confirm -->
		<script src="../bower_components/custom-confirm/jquery-confirm.min.js"></script>
		<script src="https://api.mapbox.com/mapbox-gl-js/v2.9.2/mapbox-gl.js"></script>
		<script src="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.7.0/mapbox-gl-geocoder.min.js"></script>
		<!-- tokenize  -->
		<script src="../bower_components/tokenize2/tokenize2.js"></script>
		
		<!-- StartUp Custom JS (do not remove)  -->
		<script src="../program_assets/js/site_essentials/sidebar.js?random=<?php echo uniqid(); ?>"></script>
		<script src="../program_assets/js/site_essentials/others.js?random=<?php echo uniqid(); ?>"></script>
		<script src="../program_assets/js/web_functions/gbp_report.js?random=<?php echo uniqid(); ?>"></script>
		
	</body>
</html>