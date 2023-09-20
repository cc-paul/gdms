<?php
if(!isset($_SESSION)) { session_start(); }

class PDF_MC_Table extends FPDF
{
	protected $widths;
	protected $aligns;

	function SetWidths($w)
	{
		// Set the array of column widths
		$this->widths = $w;
	}

	function SetAligns($a)
	{
		// Set the array of column alignments
		$this->aligns = $a;
	}

	function Row($data,$align = 'L')
	{
		// Calculate the height of the row
		$nb = 0;
		for($i=0;$i<count($data);$i++)
			$nb = max($nb,$this->NbLines($this->widths[$i],$data[$i]));
		$h = 5*$nb;
		// Issue a page break first if needed
		$this->CheckPageBreak($h);
		// Draw the cells of the row
		for($i=0;$i<count($data);$i++)
		{
			$w = $this->widths[$i];
			$a = isset($this->aligns[$i]) ? $this->aligns[$i] : $align;
			// Save the current position
			$x = $this->GetX();
			$y = $this->GetY();
			// Draw the border
			$this->Rect($x,$y,$w,$h);
			// Print the text
			$this->MultiCell($w, 5, $data[$i], 0, $a);
			// Put the position to the right of the cell
			$this->SetXY($x+$w,$y);
		}
		// Go to the next line
		$this->Ln($h);
	}

	function CheckPageBreak($h)
	{
		// If the height h would cause an overflow, add a new page immediately
		if($this->GetY()+$h>$this->PageBreakTrigger)
			$this->AddPage($this->CurOrientation);
	}

	function NbLines($w, $txt)
	{
		// Compute the number of lines a MultiCell of width w will take
		if(!isset($this->CurrentFont))
			$this->Error('No font has been set');
		$cw = $this->CurrentFont['cw'];
		if($w==0)
			$w = $this->w-$this->rMargin-$this->x;
		$wmax = ($w-2*$this->cMargin)*1000/$this->FontSize;
		$s = str_replace("\r",'',(string)$txt);
		$nb = strlen($s);
		if($nb>0 && $s[$nb-1]=="\n")
			$nb--;
		$sep = -1;
		$i = 0;
		$j = 0;
		$l = 0;
		$nl = 1;
		while($i<$nb)
		{
			$c = $s[$i];
			if($c=="\n")
			{
				$i++;
				$sep = -1;
				$j = $i;
				$l = 0;
				$nl++;
				continue;
			}
			if($c==' ')
				$sep = $i;
			$l += $cw[$c];
			if($l>$wmax)
			{
				if($sep==-1)
				{
					if($i==$j)
						$i++;
				}
				else
					$i = $sep+1;
				$sep = -1;
				$j = $i;
				$l = 0;
				$nl++;
			}
			else
				$i++;
		}
		return $nl;
	}


	function SetTableHeader($header, $rowHeight) {
        $this->SetFont('Arial', '', 9);
        foreach ($header as $col) {
            $this->Cell($col['width'], $rowHeight, $col['title'], 1);
        }
        $this->Ln();
    }

    function AddTableRow($data, $rowHeight) {
        $this->SetFont('Arial', '', 9);
        foreach ($data as $col) {
            $this->Cell($col['width'], $rowHeight, $col['content'], 1);
        }
        $this->Ln();
    }

    function addWord($word, $fontSize, $position) {
        $this->SetFont('Arial', 'B', $fontSize);
        $this->Cell(0, 10, $word, 0, 1, $position);
    }

    function Footer() {
        // Position at 1.5 cm from bottom
        $this->SetY(-25);

        // Add image in the first column
        //$this->Image('logo.png', 10, $this->GetY(), 25);

        // Set font for the footer
        $this->SetFont('Arial', '', 8);

        // Column 2
        $col2X = 40; // Adjust the X position
        $col2Y = $this->GetY();
        $this->SetXY($col2X, -16);
        $this->MultiCell(100, 5, "", 0, 'L');

        // Determine the height of the column 2 content
        $col2Height = $this->GetY() - $col2Y;

        // Reset Y-coordinate for other columns
        $this->SetXY($col2X + 70, $col2Y);

        // Column 3
        $col3Content = "";
        $this->SetXY(120, -16); // Adjust the X position
        $this->MultiCell(70, 5, $col3Content, 0, 'L'); // Use MultiCell to allow line breaks

        // Column 4
		$this->SetFont('Arial', '', 15);
        $col4Content = $_SESSION["docu_status"];
        $this->SetXY(200, -16); // Adjust the X position
        $this->MultiCell(70, 5, $col4Content, 0, 'L'); // Use MultiCell to allow line breaks

        // Column 5
        //$this->Image('qr.PNG', 200, $col2Y + 4, 20);
        
        // Column 6 with image
		$this->SetFont('Arial', '', 8);
        $page_number = $this->PageNo();
        $footer_text = "PAGE $page_number OF {nb}";
        $col5Content = "REPORT GENERATED:" . date('m/d/Y') . "\n" . $footer_text;
        $this->SetXY(230, $col2Y + 9); // Adjust the X position
        $this->MultiCell(70, 5, $col5Content, 0, 'L'); // Use MultiCell to allow line breaks
    }
}
?>
