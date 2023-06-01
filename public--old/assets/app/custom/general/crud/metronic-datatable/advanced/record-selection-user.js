"use strict";
// Class definition
var KTDatatableUser = function () {
    // Private functions
    var options = {
        // datasource definition
        data: {
            type: 'remote',
            source: {
                read: {
                    url: `${location.protocol}//${window.location.host}/user/getall`,
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
                field: 'profile_pic',
                title: 'Image',
                width: 90,
                sortable: false,
                class: 'profile_image',
                template: function (row) {
                    
                    if (row.profile_pic) {
                        return `<img style="max-height: 45px" src = "${window.location.protocol}//${window.location.host}/uploads/user/profile_pic/${row.profile_pic}">`;
                    } else {
                        return `<img style="max-height: 45px" src = "${window.location.protocol}//${window.location.host}/uploads/no-image.png">`;
                    }
                        
                    
                }
            },
            {
                field: 'full_name',
                title: 'Name',
                width:100,
                sortable: true,
                template: function (row) {
                    return row.full_name;
                },
            },
            {
                field: 'email',
                title: 'Email',
                width:100,
                sortable: true,
                // callback function support for column rendering
                template: function (row) {
                    return row.email;
                },
            },
            {
                field: 'user_role.role',
                title: 'Role',
                width:100,
                sortable: true,
                // callback function support for column rendering
                template: function (row) {
                    return row.user_role.roleDisplayName;
                },
            },
            {
                field: 'isActive',
                title: 'Status',
                sortable: false,
                width: 100,
                textAlign: 'center',
                // callback function support for column rendering
                template: function (row) {
                    
                    var class_name = 'kt-badge--danger';
                    var title = 'Inactive';
                    if(row.isActive==true){
                        class_name = 'kt-badge--brand';
                        title = 'Active';
                    }
                    
                    return '<span style="cursor: pointer;" class="kt-badge ' + class_name +
                        ' kt-badge--inline kt-badge--pill KTStatusUpdate onHover curserpointer" data-id="' + row._id + '" >' + title +
                        '</span>';
                },
            },        
            {
                field: 'Actions',
                title: 'Actions',
                sortable: false,
                width: 110,
                overflow: 'visible',
                textAlign: 'left',
                autoHide: false,
                template: function (row) {
                    return '\
                        \<a href="' + location.protocol + "//" + window.location.host + '/users-ip/list/' + row._id + '" class="btn btn-sm btn-clean btn-icon btn-icon-sm" title="View Ip">\
                            <i class="flaticon-eye"></i>\
                        </a>\
                    ';
                },
            }
        ],
    };

    // basic demo
    var userSelector = function () {

        options.search = {
            input: $('#generalSearch'),
        };

        var datatable = $('#userRecordSelection').KTDatatable(options);

        $('#kt_form_status').on('change', function () {
            datatable.search($(this).val(), 'Status');
        });

        $('#kt_form_role_filter').on('change', function () {
            datatable.search($(this).val(), 'UserRole');
        });

        $('#kt_form_type').on('change', function () {
            datatable.search($(this).val().toLowerCase(), 'Type');
        });

        $('#kt_form_status,#kt_form_role_filter,#kt_form_type').selectpicker();

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
                    window.location.href = `${window.location.protocol}//${window.location.host}/user/status-change/${elemID}`;
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
                    window.location.href = `${location.protocol}//${window.location.host}/user/delete/${elemID}`;
                }
            });
        });
    };

    return {
        // public functions
        init: function () {
            userSelector();
        },
    };
}();

jQuery(document).ready(function () {
    KTDatatableUser.init();
});