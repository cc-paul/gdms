if (typeof jQuery !== "undefined" && typeof saveAs !== "undefined") {
    (function($) {
        $.fn.wordExport = function(fileName) {
            fileName = typeof fileName !== 'undefined' ? fileName : "jQuery-Word-Export";
            var static = {
                mhtml: {
                    top: "Mime-Version: 1.0\nContent-Base: " + location.href + "\nContent-Type: Multipart/related; boundary=\"NEXT.ITEM-BOUNDARY\";type=\"text/html\"\n\n--NEXT.ITEM-BOUNDARY\nContent-Type: text/html; charset=\"utf-8\"\nContent-Location: " + location.href + "\n\n<!DOCTYPE html>\n<html xmlns:v='urn:schemas-microsoft-com:vml' style='font-family:tahoma; font-size:10.0pt;'>\n_html_</html>",
                    head: "<head style='font-family:tahoma; font-size:10.0pt;'>\n<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">\n<style>\\n</style>\n</head>\n",
                    body: "<body style='font-family:tahoma; font-size:10.0pt;'>_body_</body>"
                }
            };
            
            var options = {
                maxWidth: 624
            };
            // Clone selected element before manipulating it
            var markup = $(this).clone();

            // Remove hidden elements from the output
            markup.each(function() {
                var self = $(this);
                if (self.is(':hidden'))
                    self.remove();
            });

            // Embed all images using Data URLs
            var images = Array();
            var img = markup.find('img');
            for (var i = 0; i < img.length; i++) {
                // Calculate dimensions of output image
                var w = Math.min(img[i].width, options.maxWidth);
                var h = img[i].height * (w / img[i].width);
                // Create canvas for converting image to data URL
                var canvas = document.createElement("CANVAS");
                canvas.width = w;
                canvas.height = h;
                // Draw image to canvas
                var context = canvas.getContext('2d');
                context.drawImage(img[i], 0, 0, w, h);
                // Get data URL encoding of image
                var uri = canvas.toDataURL("image/png");
                $(img[i]).attr("src", img[i].src);
                img[i].width = w;
                img[i].height = h;
                // Save encoded image to array
                images[i] = {
                    type: uri.substring(uri.indexOf(":") + 1, uri.indexOf(";")),
                    encoding: uri.substring(uri.indexOf(";") + 1, uri.indexOf(",")),
                    location: $(img[i]).attr("src"),
                    data: uri.substring(uri.indexOf(",") + 1)
                };
            }

            // Prepare bottom of mhtml file with image data
            var mhtmlBottom = "\n";
            for (var i = 0; i < images.length; i++) {
                mhtmlBottom += "--NEXT.ITEM-BOUNDARY\n";
                mhtmlBottom += "Content-Location: " + images[i].location + "\n";
                mhtmlBottom += "Content-Type: " + images[i].type + "\n";
                mhtmlBottom += "Content-Transfer-Encoding: " + images[i].encoding + "\n\n";
                mhtmlBottom += images[i].data + "\n\n";
            }
            mhtmlBottom += "--NEXT.ITEM-BOUNDARY--";

            //TODO: load css from included stylesheet
            var styles = "";

            // Aggregate parts of the file together
            var fileContent = static.mhtml.top.replace("_html_", static.mhtml.head.replace("_styles_", styles) + static.mhtml.body.replace("_body_", markup.html())) + mhtmlBottom;

            // Create a Blob with the file contents
            var blob = new Blob([fileContent], {
                type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=utf-8"
            });
            saveAs(blob, fileName + ".doc");
        };
    })(jQuery);
} else {
    if (typeof jQuery === "undefined") {
        console.error("jQuery Word Export: missing dependency (jQuery)");
    }
    if (typeof saveAs === "undefined") {
        console.error("jQuery Word Export: missing dependency (FileSaver.js)");
    }
}




 /* HTML to Microsoft Word Export Demo 
  * This code demonstrates how to export an html element to Microsoft Word
  * with CSS styles to set page orientation and paper size.
  * Tested with Word 2010, 2013 and FireFox, Chrome, Opera, IE10-11
  * Fails in legacy browsers (IE<10) that lack window.Blob object
  */
 //window.export.onclick = function() {
 //
 //  if (!window.Blob) {
 //     alert('Your legacy browser does not support this action.');
 //     return;
 //  }
 //
 //  var html, link, blob, url, css;
 //  
 //   EU A4 use: size: 841.95pt 595.35pt;
 //   US Letter use: size:11.0in 8.5in;
 //  
 //  css = (
 //    '<style>' +
 //    '@page WordSection1{size: 7in 9.25in;margin: 27mm 16mm 27mm 16mm;mso-page-orientation: portrait;}' +
 //    'div.WordSection1 {page: WordSection1;}' +
 //    'table{border-collapse:collapse; font-size:12pt;}td{border:1px gray solid;width:5em;padding:2px;}'+
 //    '</style>'
 //  );
 //  
 //  html = window.docx.innerHTML;
 //  blob = new Blob(['\ufeff', css + html], {
 //    type: 'application/msword'
 //  });
 //  url = URL.createObjectURL(blob);
 //  link = document.createElement('A');
 //  link.href = url;
 //   Set default file name. 
 //   Word will append file extension - do not add an extension here.
 //  link.download = 'Document';   
 //  document.body.appendChild(link);
 //  if (navigator.msSaveOrOpenBlob ) navigator.msSaveOrOpenBlob( blob, 'Document.doc'); // IE10-11
 //  		else link.click();  // other browsers
 //  document.body.removeChild(link);
 //};
