// Contact Form Scripts

$(function() {

    $("#mistakeForm input,#mistakeForm textarea").jqBootstrapValidation({
        preventSubmit: true,
        submitError: function($form, event, errors) {
            // additional error messages or events
        },
        submitSuccess: function($form, event) {
            event.preventDefault(); // prevent default submit behaviour
            // get values from FORM
            var name = $("input#mistake_name").val();
            var email = $("input#mistake_email").val();
            var message = $("textarea#message").val();
            var firstName = name; // For Success/Failure Message
            // Check for white space in name for Success/Fail message
            if (firstName.indexOf(' ') >= 0) {
                firstName = name.split(' ').slice(0, -1).join(' ');
            }
            $.ajax({
                url: "./mail/mistake_found.php",
                type: "POST",
                data: {
                    name: name,
                    email: email,
                    message: message
                },
                cache: false,
                success: function() {
                    // Success message
                    $('#mistake_success').html("<div class='alert alert-success'>");
                    $('#mistake_success > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                        .append("</button>");
                    $('#mistake_success > .alert-success')
                        .append("<strong>Your message has been sent. </strong>");
                    $('#mistake_success > .alert-success')
                        .append('</div>');

                    //clear all fields
                    $('#mistakeForm').trigger("reset");
                		$('#mistake_modal').modal('hide');
                },
                error: function() {
                    // Fail message
                    $('#mistake_success').html("<div class='alert alert-danger'>");
                    $('#mistake_success > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                        .append("</button>");
                    $('#mistake_success > .alert-danger').append("<strong>Sorry " + firstName + ", it seems that the mail server is not responding. Please try again later!");
                    $('#mistake_success > .alert-danger').append('</div>');
                },
            });
        },
        filter: function() {
            return $(this).is(":visible");
        },
    });

    $("a[data-toggle=\"tab\"]").click(function(e) {
        e.preventDefault();
        $(this).tab("show");
    });
});


/*When clicking on Full hide fail/success boxes */
$('#name').focus(function() {
    $('#mistake_success').html('');
});
