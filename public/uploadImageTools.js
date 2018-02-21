//multpile times on one form could be bad? thankfully it replaces itself
(function() {
    
var bar = $('.bar');
var percent = $('.percent');
var status = $('#status');
   
$('#imgForm').ajaxForm({
    beforeSend: function() {
        status.empty();
        var percentVal = '0%';
        bar.width(percentVal)
        percent.html(percentVal);
    },
    uploadProgress: function(event, position, total, percentComplete) {
        var percentVal = percentComplete + '%';
        bar.width(percentVal)
        percent.html(percentVal);
    },
    success: function() {
        var percentVal = '100%';
        bar.width(percentVal)
        percent.html(percentVal);
        let link = "/media/:user/:img"
        $(".menuInside").append("Link to #filename is www.address/" + link);
        //return url to use for image or media on server
    },
	complete: function(xhr) {
		status.html(xhr.responseText);
	}
}); 

})();       

