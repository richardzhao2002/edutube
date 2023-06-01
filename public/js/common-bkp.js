


var years = [];
$(document).ready(function () {
    var currentTime = new Date();
    var year = currentTime.getFullYear();
    years.push(year.toString());
    for (var i = 0; i < 15; i++) {
        year = year - 1;
        years.push(year.toString());
    }
    $(".modelsYear").select2({
        tags: years
    });

    $("#PeakTime").trigger("change");
    $("#NightTime").trigger("change");


    /************ #rootwizard-custom-circle ***********/
    $('#rootwizard-custom-circle').bootstrapWizard({
        onTabShow: function (tab, navigation, index) {
            var $total = navigation.find('li').length;
            var $current = index + 1;
            var $percent = ($current / $total) * 100;
            $('#rootwizard-custom-circle').find('.bar').css({ width: $percent + '%' });
        },
        'onNext': function (tab, navigation, index) {

            // select id of current tab content
            var $id = tab.find("a").attr("href");
            var $approved = 1;
            // Check all input validation
            $($id + " input").each(function () {
                if (!$(this).val()) {
                    $(this).css('border-color', 'red');
                    $(this).parent().parent().find("i.alert").removeClass("alert-hide");
                    $approved = 0;
                } else {
                    $(this).parent().parent().find("i.alert").addClass("alert-hide");
                }
            });
            if ($approved !== 1) return true;
        },
        'onTabClick': function (tab, navigation, index) {
            // select id of current tab content
            var $id = tab.find("a").attr("href");
            var $approved = 1;
            // Check all input validation
            $($id + " input").each(function () {
                if (!$(this).val()) {
                    $(this).css('border-color', 'red');
                    $(this).parent().parent().find("i.alert").removeClass("alert-hide");
                    $approved = 0;
                } else {
                    $(this).parent().parent().find("i.alert").addClass("alert-hide");
                }
            });
            if ($approved !== 1) return false;
            // Add class visited to style css
            if (tab.attr("class") == "visited") {
                tab.removeClass("visited");
            } else {
                tab.addClass("visited");
            }
        },
        'tabClass': 'bwizard-steps-o', 'nextSelector': '.button-next', 'previousSelector': '.button-previous'
    });
});


$('.select2-size').select2({
    placeholder: "Select an option",
    allowClear: true
});


// ====================================== Peak Time checkbox changed event for location ==================================


$("#PeakTime").change(function () {

    //alert($(this).is(':checked'));

    if ($(this).is(':checked')) {
        $('.dvpeaktimeSurchargeFrom').show();
        $('.dvpeaktimeSurchargeTo').show();
    }
    else {
        $('.dvpeaktimeSurchargeFrom').hide();
        $('.dvpeaktimeSurchargeTo').hide();
    }

});


$("#NightTime").change(function () {

    if ($(this).is(':checked')) {
        $('.dvnightChargeFrom').show();
        $('.dvnightChargeTo').show();
    }
    else {
        $('.dvnightChargeFrom').hide();
        $('.dvnightChargeTo').hide();
    }

});


// ====================================== Peak Time checkbox changed event for location==================================

function deleteFunction() {
    event.preventDefault(); // prevent form submit
    var form = event.target.form; // storing the form
    swal({
        title: "Are you sure?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel please!",
        closeOnConfirm: false,
        closeOnCancel: false
    },
        function (isConfirm) {
            if (isConfirm) {
                form.submit();          // submitting the form when user press yes
            } else {
                swal("Cancelled", "Your data is safe :)", "error");
            }
        });
}


function statusChangeFunction(type, element) {
    event.preventDefault(); // prevent form submit
    var form = event.target.form; // storing the form
    swal({
        title: "Are you sure?",
        text: "But you will still be able to retrieve this data.",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, status change it!",
        cancelButtonText: "No, cancel please!",
        closeOnConfirm: false,
        closeOnCancel: false
    },
        function (isConfirm) {
            if (isConfirm) {
                statusModifier(type, element);
            } else {
                swal("Cancelled", "Your data is safe :)", "error");
            }
        });
}


function statusModifier(type, element) {
    var id = $(element).attr('data-team');
    var url = '';
    var redirect_url = '';
    switch (type) {
        case "customer_status":
            url = apiBaseURL + "/user/status-change";
            redirect_url = apiBaseURL + "/user";
            break;
        case "page_status":
            url = apiBaseURL + "/cms/status-change";
            redirect_url = apiBaseURL + "/cms";
            break;

        case "faq_status":
            url = apiBaseURL + "/FAQ/status-change";
            redirect_url = apiBaseURL + "/FAQ";
            break;
    }
    $.ajax({
        url: url,
        type: "POST",
        data: { "id": id },
        success: function (msg) {
            if (msg) {
                location.href = redirect_url;
            }
        }
    });
}




$(document).on("click", ".customer_detail", function () {
    var id = $(this).attr('id');
    $.ajax({
        type: "GET",
        url: apiBaseURL + "/user/details/" + id,
        success: function (data) {
            $('.modal-dialog').html(data);
            $("#largeModal").modal('show');
        }
    });
});


$(document).on("click", ".arsenal_detail", function () {
    var id = $(this).attr('id');
    $.ajax({
        type: "GET",
        url: apiBaseURL + "/user/arsenalListByUserId/" + id,
        success: function (response) {
            $('.modal-dialog').html(response);
            $("#largeModal").modal('show');
        },
        failure: function (response) {
            console.log(response.data);
        }

    });
});


