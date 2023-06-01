// Class definition

var KTFormControls = function () {
    // Private functions

    var myProfileValidation = function () {
        $("#frmMyProfile").validate({
            // define validation rules
            rules: {
                first_name: {
                    required: true,
                    letterswithbasicpunc: true
                },
                last_name: {
                    required: true,
                    letterswithbasicpunc: true
                }
            },
            messages: {
                first_name: {
                    required: "Please enter your first name",
                    letterswithbasicpunc: "Please enter alphabets only"
                },
                last_name: {
                    required: "Please enter your last name",
                    letterswithbasicpunc: "Please enter alphabets only"
                }
            },
            //display error alert on form submit  
            invalidHandler: function (event, validator) {
                KTUtil.scrollTop();
            },

            submitHandler: function (form) {
                form[0].submit();
            }
        });
    }
    var myfrmAdminAddValidation = function () {
        jQuery.validator.addMethod("noSpace", function(value, element) { 
            return  value.trim() != ""; 
          }, "No space please and don't leave it empty");
        $("#frmAdminAdd").validate({

            // define validation rules
            rules: {
                first_name: {
                    required: true,
                    letterswithbasicpunc: true,
                    noSpace:true
                },
                last_name: {
                    required: true,
                    letterswithbasicpunc: true,
                    noSpace:true
                },
                email:{
                    required:true,
                    email:true,
                    noSpace:true
                },
                password:{
                    required:true,
                    noSpace:true
                }
            },
            messages: {
                first_name: {
                    required: "Please enter your first name",
                    letterswithbasicpunc: "Please enter alphabets only"
                },
                last_name: {
                    required: "Please enter your last name",
                    letterswithbasicpunc: "Please enter alphabets only"
                },
                email:{
                    required:"Email is required",
                    email:"Please enter a valid email"
                },
                password:{
                    required:"Please enter password"
                }
            },
            //display error alert on form submit  
            invalidHandler: function (event, validator) {
                KTUtil.scrollTop();
            },

            submitHandler: function (form) {
                form[0].submit();
            }
        });
    }
    var myfrmAdminEditValidation = function () {
        jQuery.validator.addMethod("noSpace", function(value, element) { 
            return  value.trim() != ""; 
          }, "No space please and don't leave it empty");
        $("#frmAdminEdit").validate({

            // define validation rules
            rules: {
                first_name: {
                    required: true,
                    letterswithbasicpunc: true,
                    noSpace:true
                },
                last_name: {
                    required: true,
                    letterswithbasicpunc: true,
                    noSpace:true
                },
                email:{
                    required:true,
                    email:true,
                    noSpace:true
                },
                // password:{
                //     required:true,
                //     noSpace:true
                // }
            },
            messages: {
                first_name: {
                    required: "Please enter your first name",
                    letterswithbasicpunc: "Please enter alphabets only"
                },
                last_name: {
                    required: "Please enter your last name",
                    letterswithbasicpunc: "Please enter alphabets only"
                },
                email:{
                    required:"Email is required",
                    email:"Please enter a valid email"
                },
                // password:{
                //     required:"Please enter password"
                // }
            },
            //display error alert on form submit  
            invalidHandler: function (event, validator) {
                KTUtil.scrollTop();
            },

            submitHandler: function (form) {
                form[0].submit();
            }
        });
    }

    var changePasswordValidation = function () {
        $("#changePasswordForm").validate({
            // define validation rules
            rules: {
                old_password: {
                    required: true,
                },
                password: {
                    required: true,
                    minlength: 6
                },
                password_confirm: {
                    required: true,
                    minlength: 6
                }
            },
            messages: {
                old_password: {
                    required: "Please enter your old password",
                },
                password: {
                    required: "Please enter your new password",
                },
                password_confirm: {
                    required: "Make sure that you have entered the same password here.",
                }
            },
            //display error alert on form submit  
            invalidHandler: function (event, validator) {
                KTUtil.scrollTop();
            },

            submitHandler: function (form) {
                form[0].submit();
            }
        });
    }
    var FAQFrmValidation = function () {
        $("#frmFAQ").validate({
            rules: {
                question: {
                    required: true,
                },
                answer: {
                    required: true,
                }
            },
            messages: {
                question: {
                    required: "Please enter Question"
                },
                answer: {
                    required: "Please enter Answer"
                }
            },
            invalidHandler: function (event, validator) {
                //KTUtil.scrollTop();
            },

            submitHandler: function (form) {
                form[0].submit();
            }
        });
    }

    

    return {
        // public functions
        init: function () {
            myProfileValidation();
            changePasswordValidation();
            FAQFrmValidation();
            myfrmAdminAddValidation();
            myfrmAdminEditValidation();
        }
    };
}();

jQuery(document).ready(function () {
    KTFormControls.init();
});