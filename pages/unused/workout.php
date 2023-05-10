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
			#map { height: 290px; width: 100%; }
			
			.image-custom {
				height: 122px;
				max-height: 122px;
				object-fit: cover !important;
				width: 100%; border:
				5px solid #555;
			}
			
			.image-no-thumb {
				width: 100%;
				height: 180px;
				object-fit: scale-down;
				background: #cbcbcb;
				border-radius: 8px;
			}
			
			.image-w-thumb {
				width: 100%;
				height: 180px;
				object-fit: cover;
				background: #cbcbcb;
				border-radius: 8px;
			}
			
			.panel-me {
				border-radius: 15px;
			}
			
			.videoHolder {
				height: 650px;
				overflow-x: auto;
			}
			
			.videoHolder::-webkit-scrollbar {
				display: none;
			}
		</style>
	</head>
	
	<!-- ADD THE CLASS fixed TO GET A FIXED HEADER AND SIDEBAR LAYOUT -->
	<!-- the fixed layout is not compatible with sidebar-mini -->
	<body class="hold-transition skin-black-light fixed sidebar-mini">
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
				<section class="content col-md-12 col-xs-12">
					<div class="nav-tabs-custom">
						<ul class="nav nav-tabs">
							<li class="active"><a href="#fitness" data-toggle="tab" aria-expanded="true" class="cust-label">Planning Preparation</a></li>
							<li class=""><a href="#videos" data-toggle="tab" aria-expanded="false" class="cust-label">Videos</a></li>
						</ul>
						<div class="tab-content">
							<div class="tab-pane active" id="fitness">
								<div class="row">
									<div class="col-md-6 col-xs-12">
										<div class="form-group">
											<input id="txtSearchFitNess" class="form-control input-sm cust-label" type="text" placeholder="Search fitness plan here...">
										</div>
									</div>
									<div class="col-md-2 col-xs-6">
										<div class="form-group">
											<button id="btnNewFitnessPlan" type="button" class="btn btn-block btn-default btn-sm cust-textbox">
												<i class="fa fa-check"></i>
												&nbsp;
												New Fitness Plan
											</button>
										</div>
									</div>
									<div class="col-md-2 col-xs-6">
										<div class="form-group">
											<button id="btnTargetBody" type="button" class="btn btn-block btn-default btn-sm cust-textbox">
												<i class="fa fa-user-plus"></i>
												&nbsp;
												Target Body Masterfile
											</button>
										</div>
									</div>
									<div class="col-md-2 col-xs-6">
										<div class="form-group">
											<button id="btnExportFitness" type="button" class="btn btn-block btn-default btn-sm cust-textbox">
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
											<table id="tblFitnessPlan" name="tblFitnessPlan" class="table table-bordered table-hover cust-label" style="width: 100% !important;">
												<thead>
													<tr>
														<th>Workout Name</th>
														<th>Target Loose Weight (kg)</th>
														<th>Intensity</th>
														<th>Target Body Parts</th>
														<th>Description</th>
														<th>Procedure</th>
														<th>Status</th>
														<th>Date Created</th>
														<th></th>
													</tr>
												</thead>
												<tbody></tbody>
											</table>
											<div hidden>
												<table id="tblFitnessPlan2" name="tblFitnessPlan2" class="table table-bordered table-hover cust-label" style="width: 100% !important;">
													<thead>
														<tr>
															<th>Workout Name</th>
															<th>Target Loose Weight (kg)</th>
															<th>Intensity</th>
															<th>Target Body Parts</th>
															<th>Description</th>
															<th>Procedure</th>
															<th>Status</th>
															<th>Date Created</th>
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
							<div class="tab-pane" id="videos">
								<div class="row">
									<div class="col-md-3 col-xs-12">
									</div>
									<div class="col-md-6 col-xs-12">
										<div class="row">
											<div class="col-md-9 col-xs-7">
												<div class="form-group">
													<input id="txtSearchVideo" class="form-control input-sm cust-label" type="text" placeholder="Search videos by title or fitness plan here...">
												</div>
											</div>
											<div class="col-md-3 col-xs-5">
												<div class="form-group">
													<button id="btnUploadVideo" type="button" class="btn btn-block btn-default btn-sm cust-textbox">
														<i class="fa fa-file-video-o"></i>
														&nbsp;
														Upload Video
													</button>
												</div>
											</div>
										</div>
									</div>
									<div class="col-md-3 col-xs-12">
									</div>
								</div>
								<div id="divVidHolder" class="row videoHolder">
									
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
		<div class="modal fade" id="mdTargetBody" name="mdTargetBody">
			<div class="modal-dialog modal-custom">
				<div class="box box-default">
					<div class="box-header with-border">
						<label class="cust-label">Target Body Masterfile</label>
						<button type="submit" class="btn btn-default btn-xs pull-right" data-dismiss="modal"><i class="fa fa-close"></i>
						</button>
					</div>
					<div class="box-body">
						<div class="row">
							<div class="col-md-6 col-xs-12">
								<div class="form-group">
									<input id="txtSearchBodyPart" class="form-control input-sm cust-label" type="text" placeholder="Search body parts here...">
								</div>
							</div>
							<div class="col-md-3 col-xs-6">
								<div class="form-group">
									<button id="btnAddBodyPart" type="button" class="btn btn-block btn-default btn-sm cust-textbox">
										<i class="fa fa-plus"></i>
										&nbsp;
										New Target Body
									</button>
								</div>
							</div>
							<div class="col-md-3 col-xs-6">
								<div class="form-group">
									<button id="btnTargetBodyExport" type="button" class="btn btn-block btn-default btn-sm cust-textbox">
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
									<table id="tblTargetBody" name="tblTargetBody" class="table table-bordered table-hover cust-label" style="width: 100% !important;">
										<thead>
											<tr>
												<th>Body Part</th>
												<th>Description</th>
												<th>Status</th>
												<th>Date Created</th>
												<th></th>
											</tr>
										</thead>
										<tbody></tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
					<div class="box-footer"></div>
				</div>
			<!-- /.modal-content -->
			</div>
		<!-- /.modal-dialog -->
		</div>
		
		<!-- Modal Name  -->
		<div class="modal fade" id="mdTargetBodyForm" name="mdTargetBodyForm">
			<div class="modal-dialog modal-md">
				<div class="box box-default">
					<div class="box-header with-border">
						<label class="cust-label">Target Body Form</label>
						<button type="submit" class="btn btn-default btn-xs pull-right" data-dismiss="modal"><i class="fa fa-close"></i>
						</button>
					</div>
					<div class="box-body">
						<div class="row">
							<div class="col-md-6 col-sm-12">
								<div class="form-group">
									<label class="cust-label">Body Part</label>
									<label class="cust-label text-danger">*</label>
									<input type="text" class="form-control cust-label cust-textbox" id="txtBodyPart" name="txtBodyPart" placeholder="Enter Body Part">
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-12 col-sm-12">
								<div class="form-group">
									<label class="cust-label">Description</label>
									<label class="cust-label text-danger">*</label>
									<textarea class="form-control cust-label cust-textbox" id="txtBodyPartDescription" name="txtBodyPartDescription" rows="4" style="width:100%" placeholder="Enter Body Part Description"></textarea>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-4 col-sm-12">
								<label style="display: inline-block">
									<input id="chkBodyPartActive" style="vertical-align: middle; margin-top: -4px;" type="checkbox"/>
									<label for="chkBodyPartActive" style="vertical-align: middle" class="cust-label">&nbsp;&nbsp;Set as Active</label>
								</label>
							</div>
						</div>
					</div>
					<div class="box-footer">
						<div class="row">
							<div class="col-md-4 col-xs-6">
								
							</div>
							<div class="col-md-4 col-xs-6">
								<!--<button id="btnReset" type="button" class="btn btn-block btn-default btn-sm cust-textbox">
									<i class="fa fa-refresh"></i>
									&nbsp;
									Reset Password
								</button>-->
							</div>
							<div class="col-md-4 col-xs-6">
								<button id="btnSaveBodyPart" type="button" class="btn btn-block btn-default btn-sm cust-textbox">
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
		
		<!-- Modal Name  -->
		<div class="modal fade" id="mdFitnessPlan" name="mdFitnessPlan">
			<div class="modal-dialog modal-md">
				<div class="box box-default">
					<div class="box-header with-border">
						<label class="cust-label">Fitness Plan Form</label>
						<button type="submit" class="btn btn-default btn-xs pull-right" data-dismiss="modal"><i class="fa fa-close"></i>
						</button>
					</div>
					<div class="box-body">
						<div class="row">
							<div class="col-md-4 col-sm-12">
								<div class="form-group">
									<label class="cust-label">Workout Name</label>
									<label class="cust-label text-danger">*</label>
									<input type="text" class="form-control cust-label cust-textbox" id="txtWorkOutName" name="txtWorkOutName" placeholder="Enter Workout Name">
								</div>
							</div>
							<div class="col-md-4 col-sm-12">
								<div class="form-group">
									<label class="cust-label">Target Loose Weight (kg)</label>
									<label class="cust-label text-danger">*</label>
									<input type="text" class="form-control cust-label cust-textbox" id="txtTargetLooseWeight" name="txtTargetLooseWeight" placeholder="Enter Target Loose Weight" maxlength="3" onkeyup="numOnly(this)">
								</div>
							</div>
							<div class="col-md-4 col-sm-12">
								<div class="form-group">
									<label class="cust-label">Intensity Level</label>
									<label class="cust-label text-danger">*</label>
									<select id="cmbIntensity" name="cmbIntensity" class="form-control select2 cust-label cust-textbox" style="width: 100%;">
										<option value="">Select Intensity Level</option>
										<option value="Beginner">Beginner</option>
										<option value="Intermediate">Intermediate</option>
										<option value="Advanced">Advanced</option>
									</select>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-12 col-sm-12">
								<div class="form-group">
									<label class="cust-label">Description</label>
									<label class="cust-label text-danger">*</label>
									<textarea class="form-control cust-label cust-textbox" id="txtWorkOutDescription" name="txtWorkOutDescription" rows="4" style="width:100%" placeholder="Describe the workout. Briefly discuss what its purpose and benefits"></textarea>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-12 col-sm-12">
								<div class="form-group">
									<label class="cust-label">General Procedure</label>
									<label class="cust-label text-danger">*</label>
									<textarea class="form-control cust-label cust-textbox" id="txtWorkOutProcedure" name="txtWorkOutProcedure" rows="4" style="width:100%" placeholder="Provide a summary of steps or workout that will be followed by th user"></textarea>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-12 col-sm-12">
								<div class="form-group">
									<label class="cust-label">Target Body Parts</label>
									<label class="cust-label text-danger">*</label>
									<select id="cmbTargetBodyParts" name="cmbTargetBodyParts" class="tokenize" style="width: 100%;" multiple>
										<?php
											include dirname(__FILE__,2) . '/program_assets/php/dropdown/bodyparts.php';
										?>
									</select>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-4 col-sm-12">
								<label style="display: inline-block">
									<input id="chkWorkOutActive" style="vertical-align: middle; margin-top: -4px;" type="checkbox"/>
									<label for="chkWorkOutActive" style="vertical-align: middle" class="cust-label">&nbsp;&nbsp;Set as Active</label>
								</label>
							</div>
						</div>
						<div id="dvReminder" class="row">
							<div class="col-md-12">
								<code class="cust-label">Unchecking the <b>Set as Active</b> will also remove all related videos in this Fitness Plan</code>
							</div>
						</div>
					</div>
					<div class="box-footer">
						<div class="row">
							<div class="col-md-8 col-xs-12">
								
							</div>
							<div class="col-md-4 col-xs-12">
								<button id="btnSaveFitness" type="button" class="btn btn-block btn-default btn-sm cust-textbox">
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
		
		<!-- Modal Name  -->
		<div class="modal fade" id="mdAddVideo" name="mdAddVideo" data-backdrop="static" data-keyboard="false">
			<div class="modal-dialog modal-md">
				<div class="box box-default">
					<div class="box-header with-border">
						<label class="cust-label">Video Uploading Form</label>
						<button id="btnCloseVideoModal" type="submit" class="btn btn-default btn-xs pull-right" data-dismiss="modal"><i class="fa fa-close"></i>
						</button>
					</div>
					<form id="upload-form" class="upload-form" method="post">
						<div class="box-body">
							<div class="row">
								<div class="col-md-4 col-sm-12">
									<div class="form-group">
										<label class="cust-label">Fitness Name</label>
										<label class="cust-label text-danger">*</label>
										<select id="cmbFitnessName" name="cmbFitnessName" class="form-control select2 cust-label cust-textbox" style="width: 100%;">
											<option value="">Select Fitness Plan</option>
										</select>
									</div>
								</div>
								<div class="col-md-4 col-sm-12">
									<div class="form-group">
										<label class="cust-label">Video Name / Title</label>
										<label class="cust-label text-danger">*</label>
										<input type="text" class="form-control cust-label cust-textbox" id="txtVideoName" name="txtVideoName" placeholder="Enter Video Name...">
									</div>
								</div>
								<div class="col-md-4 col-sm-12">
									<div class="form-group">
										<label class="cust-label">Trainers Name</label>
										<label class="cust-label text-danger">*</label>
										<input type="text" class="form-control cust-label cust-textbox" id="txtTrainersName" name="txtTrainersName" placeholder="Enter Trainers Name...">
									</div>
								</div>
							</div>
							<div class="row">
								<div class="col-md-4 col-sm-12">
									<div class="form-group">
										<label class="cust-label">Intensity</label>
										<label class="cust-label text-danger">*</label>
										<input type="text" class="form-control cust-label cust-textbox" id="txtIntensity" name="txtIntensity" disabled>
									</div>
								</div>
								<div class="col-md-4 col-sm-12">
									<div class="form-group">
										<label class="cust-label">Target Body Parts</label>
										<label class="cust-label text-danger">*</label>
										<input type="text" class="form-control cust-label cust-textbox" id="txtTargetBodyParts" name="txtTargetBodyParts" disabled>
									</div>
								</div>
								<div class="col-md-4 col-sm-12">
								</div>
							</div>
							<div class="row">
								<div class="col-md-6">
									<div class="panel panel-default">
										<div class="panel-heading">
											<label class="cust-label">Upload Video</label>
										</div>
										<div class="panel-body" style="height: 98px;">
											<div class="form-group">
												<label class="cust-label">Select Video to Upload</label>
												<label class="cust-label text-danger">*</label>
												<code class="cust-label pull-right">Max 35mb</code>
												<input type="file" id="txtVideo" name="txtVideo" class="form-control cust-label cust-textbox" accept="video/mp4,video/x-m4v,video/*" onchange="uploadFile()" style="height: 30px !important;">
											</div>
										</div>
									</div>
								</div>
								<div class="col-md-6">
									<div class="panel panel-danger">
										<div class="panel-heading">
											<label class="cust-label">Youtube Videos</label>
										</div>
										<div class="panel-body">
											<div class="form-group">
												<label class="cust-label">Youtube Link</label>
												<label class="cust-label text-danger">*</label>
												<input type="text" id="txtYouTubeLink" name="txtYouTubeLink" class="form-control cust-label cust-textbox" placeholder="Paste youtube link here...">
											</div>
										</div>
									</div>
								</div>
							</div>
							<div class="row">
								<div class="col-md-12">
									<div class="progress progress-sm active">
										<div id="dvProgress" class="progress-bar progress-bar-success progress-bar-striped" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100">
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="box-footer">
							<div class="row">
								<div class="col-md-8 col-xs-12">
									
								</div>
								<div class="col-md-4 col-xs-12">
									<button id="btnSaveVideo" type="button" class="btn btn-block btn-default btn-sm cust-textbox">
										<i class="fa fa-upload"></i>
										&nbsp;
										Start Uploading
									</button>
								</div>
							</div>
						</div>
					</form>
				</div>
			</div>
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
		<script src="../program_assets/js/web_functions/workout.js?random=<?php echo uniqid(); ?>"></script>
		
	</body>
</html>