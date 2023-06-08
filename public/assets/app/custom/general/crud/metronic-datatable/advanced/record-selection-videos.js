"use strict";
// Class definition
var KTDatatableMealTypes = function () {
    // Private functions
    var options = {
        // datasource definition
        data: {
            type: 'remote',
            source: {
                read: {
                    url: `${location.protocol}//${window.location.host}/adminVideo/getall`,
                },
            },
            pageSize: 10,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true,
        },
        // layout definition
        layout: {
            scroll: true, // enable/disable datatable scroll both horizontal and
            // vertical when needed.
            height: 500, // datatable's body's fixed height
            footer: false // display/hide footer
        },

        // column sorting
        sortable: true,

        pagination: true,

        // columns definition

        columns: [
            {
                field: 'thumbnail',
                title: 'Thumbnail',
                width: 90,
                sortable: false,
                class: 'thumbnail',
                template: function (row) {
                    if (row.thumbnail_image) {
                        return `<img style="max-height: 45px" src = "${window.location.protocol}//${window.location.host}/uploads/video/${row.thumbnail_image}">`;
                    } else {
                        return `<img style="max-height: 45px" src = "${window.location.protocol}//${window.location.host}/uploads/no-image.png">`;
                    }
                }
            },
            {
                field: 'title',
                title: 'Title',
                sortable: true,
                template: '{{title}}',
                width: 100
            },
            {
                field: 'video',
                title: 'Video',
                sortable: true,
                width: 200,
                template: function (row) {
                    if (row.video) {
                        return `<video style="max-height: 45px" class="player"
                            id="${window.location.protocol}//${window.location.host}/uploads/video/${row.video}">
                            <source src = "${window.location.protocol}//${window.location.host}/uploads/video/${row.video}">`;
                    } else {
                        return `<img style="max-height: 45px" src = "${window.location.protocol}//${window.location.host}/uploads/no-image.png">`;
                    }
                }
            },
            {
                field: 'isActive',
                title: 'Status',
                sortable: true,
                width: 100,
                textAlign: 'center',
                // callback function support for column rendering
                template: function (row) {
                    
                    var class_name = 'kt-badge--danger';
                    var title = 'Inactive';
                    if(row.status=='Active'){
                        class_name = 'kt-badge--brand';
                        title = 'Active';
                    }
                    return '<span style="cursor: pointer;" class="kt-badge ' + class_name +
                        ' kt-badge--inline kt-badge--pill KTStatusUpdate onHover curserpointer" data-id="' + row._id + '" >' + title +
                        '</span>';
                },
            }, {
                field: 'Actions',
                title: 'Actions',
                sortable: false,
                width: 120,
                overflow: 'visible',
                textAlign: 'center',
                autoHide: false,
                template: function (row) {
                    return '\
                    \<a id="del-' + row._id + '" href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-sm ktDelete" title="Delete">\
                        <i class="flaticon-delete"></i>\
                    </a>\
                ';
                },
            }],
    };

    // basic demo
    var mealTypesSelector = function () {

        options.search = {
            input: $('#generalSearch'),
        };

        var datatable = $('#mealTypesRecordSelection').KTDatatable(options);

        $('#kt_form_status').on('change', function () {
            datatable.search($(this).val(), 'Status');
        });

        $('#kt_form_type').on('change', function () {
            datatable.search($(this).val().toLowerCase(), 'Type');
        });

        $('#kt_form_status,#kt_form_type').selectpicker();

        datatable.on(
            'kt-datatable--on-check kt-datatable--on-uncheck kt-datatable--on-layout-updated',
            function (e) {
                var checkedNodes = datatable.rows('.kt-datatable__row--active').nodes();
                var count = checkedNodes.length;
                $('#kt_datatable_selected_number').html(count);
                if (count > 0) {
                    $('#kt_datatable_group_action_form').collapse('show');
                } else {
                    $('#kt_datatable_group_action_form').collapse('hide');
                }
            });

        $('#kt_modal_fetch_id').on('show.bs.modal', function (e) {
            var ids = datatable.rows('.kt-datatable__row--active').
                nodes().
                find('.kt-checkbox--single > [type="checkbox"]').
                map(function (i, chk) {
                    return $(chk).val();
                });
            var c = document.createDocumentFragment();
            for (var i = 0; i < ids.length; i++) {
                var li = document.createElement('li');
                li.setAttribute('data-id', ids[i]);
                li.innerHTML = 'Selected record ID: ' + ids[i];
                c.appendChild(li);
            }
            $(e.target).find('.kt-datatable_selected_ids').append(c);
        }).on('hide.bs.modal', function (e) {
            $(e.target).find('.kt-datatable_selected_ids').empty();
        });
        $(document).on('click', '.KTStatusUpdate', function () {
            var elemID = $(this).data('id');
            swal.fire({
                title: 'Are you sure?',
                // text: "You won't be able to revert this!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, change it!',
                cancelButtonText: 'No, cancel!',
                reverseButtons: true
            }).then(function (result) {
                if (result.value) {
                    window.location.href = `${window.location.protocol}//${window.location.host}/adminVideo/status-change/${elemID}`;
                }
            });
        })
        $(document).on('click', '.ktDelete', function () {
            var elemID = $(this).attr('id').replace('del-', '');
            swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, cancel!',
                reverseButtons: true
            }).then(function (result) {
                if (result.value) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
                    window.location.href = `${location.protocol}//${window.location.host}/admin/delete/${elemID}`;
                }
            });
        });
        $(document).on('click', '.player', function () {
            var location = $(this).attr('id')
            swal.fire({
                title: "View Video",
                icon: 'info',
                html:
                '<video width="300" height="168" src=' + location + ' frameborder="0" allowfullscreen controls></video>',
            })
        })
    };



    return {
        // public functions
        init: function () {
            mealTypesSelector();
        },
    };
}();

jQuery(document).ready(function () {
    KTDatatableMealTypes.init();
});