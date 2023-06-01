"use strict";

// Class definition
var KTDashboard = function () {
    var customerRegistrationShare = function () {
        if (!KTUtil.getByID('kt_chart_user_reg_share')) {
            return;
        }

        var randomScalingFactor = function () {
            return Math.round(Math.random() * 100);
        };

        $.ajax({
            type: 'GET',
            url: `https://${window.location.host}/dashboard/getallusercount`,
            data: {},
            beforeSend: function () {

            },
            success: function (result) {
                var total = 0;
                var strLegand = '';
                var dataArray = Array();
                var colorArray = Array();
                var labelArray = Array();
                result.data.forEach(function (item) {
                    dataArray.push(item.count);
                    if (item.name == 'user') {
                        colorArray.push(KTApp.getStateColor('success'));
                    }
                    labelArray.push(item.name);
                    total = parseInt(total) + parseInt(item.count);
                });

                // for (var i = 0; i < dataArray.length; i++) {
                //     var percent = parseFloat((parseInt(dataArray[i]) / parseInt(total)) * 100);
                //     var strLegand = strLegand + '<div class="kt-widget14__legend"><span class="kt-widget14__bullet kt-bg-success"></span><span class="kt-widget14__stats">' + percent + '% ' + labelArray[i] + '</span></div>';
                // }
                $('#total_user_count').html(total);
                $('#user_share_legend').html(strLegand);
                var config = {
                    type: 'doughnut',
                    data: {
                        datasets: [{
                            data: dataArray,
                            backgroundColor: colorArray
                        }],
                        labels: labelArray
                    },
                    options: {
                        cutoutPercentage: 75,
                        responsive: true,
                        maintainAspectRatio: false,
                        legend: {
                            display: false,
                            position: 'top',
                        },
                        title: {
                            display: false,
                            text: 'Technology'
                        },
                        animation: {
                            animateScale: true,
                            animateRotate: true
                        },
                        tooltips: {
                            enabled: true,
                            intersect: false,
                            mode: 'nearest',
                            bodySpacing: 5,
                            yPadding: 10,
                            xPadding: 10,
                            caretPadding: 0,
                            displayColors: false,
                            backgroundColor: KTApp.getStateColor('brand'),
                            titleFontColor: '#ffffff',
                            cornerRadius: 4,
                            footerSpacing: 0,
                            titleSpacing: 0
                        }
                    }
                };

                var ctx = KTUtil.getByID('kt_chart_user_reg_share').getContext('2d');
                var myDoughnut = new Chart(ctx, config);
            }
        });


    }
    
    //genre count section start
    var genreRegistrationShare = function () {
        if (!KTUtil.getByID('kt_chart_recipies_reg_share')) {
            return;
        }

        var randomScalingFactor = function () {
            return Math.round(Math.random() * 100);
        };

        $.ajax({
            type: 'GET',
            url: `https://${window.location.host}/dashboard/getallMealCount`,
            data: {},
            beforeSend: function () {

            },
            success: function (result) {
                var total = 0;
                var strLegand = '';
                var dataArray = Array();
                var colorArray = Array();
                var labelArray = Array();
                result.data.forEach(function (item) {
                    dataArray.push(result.data.length);
                    if (item.status == 'Inactive') {
                        colorArray.push(KTApp.getStateColor('danger'));
                    }
                    colorArray.push(KTApp.getStateColor('success'));
                    labelArray.push(item.title);
                    total = parseInt(result.data.length);
                });
                // for (var i = 0; i < dataArray.length; i++) {
                //     var percent = parseFloat((parseInt(dataArray[i]) / parseInt(total)) * 100);
                //     var strLegand = strLegand + '<div class="kt-widget14__legend"><span class="kt-widget14__bullet kt-bg-success"></span><span class="kt-widget14__stats"> ' + labelArray[i] + '</span></div>';
                // }
                $('#total_genre_count').html(total);
                $('#user_genre_legend').html('');
                var config = {
                    type: 'doughnut',
                    data: {
                        datasets: [{
                            data: dataArray,
                            backgroundColor: colorArray
                        }],
                        labels: labelArray
                    },
                    options: {
                        cutoutPercentage: 75,
                        responsive: true,
                        maintainAspectRatio: false,
                        legend: {
                            display: false,
                            position: 'top',
                        },
                        title: {
                            display: false,
                            text: 'Technology'
                        },
                        animation: {
                            animateScale: true,
                            animateRotate: true
                        },
                        tooltips: {
                            enabled: false,
                            intersect: true,
                            mode: 'nearest',
                            bodySpacing: 5,
                            yPadding: 10,
                            xPadding: 10,
                            caretPadding: 0,
                            displayColors: false,
                            backgroundColor: KTApp.getStateColor('brand'),
                            titleFontColor: '#ffffff',
                            cornerRadius: 4,
                            footerSpacing: 0,
                            titleSpacing: 0
                        }
                    }
                };

                var ctx = KTUtil.getByID('kt_chart_recipies_reg_share').getContext('2d');
                var myDoughnut = new Chart(ctx, config);
            }
        });


    }



    return {
        // Init demos
        init: function () {
            //customerRegistrationShare();
            //genreRegistrationShare();

            // demo loading
            var loading = new KTDialog({
                'type': 'loader',
                'placement': 'top center',
                'message': 'Loading ...'
            });
            loading.show();

            setTimeout(function () {
                loading.hide();
            }, 1000);
        }
    };
}();

// Class initialization on page load
jQuery(document).ready(function () {
    KTDashboard.init();
});