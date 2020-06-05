
export function loadFilestyle(){
    $(document).ready(function() {
        $("input[id^='upload_file']").each(function() {
            var id = parseInt(this.id.replace("upload_file", ""));
            $("#upload_file" + id).change(function() {
                if ($("#upload_file" + id).val() != "") {
                    $("#moreImageUploadLink").show();
                }
            });
        });
    });
    
    $(document).ready(function() {
        var upload_number = 2;
        $('#attachMore').click(function() {
            //add more file
            var moreUploadTag = '';
            //moreUploadTag += '<div class="element"><label for="upload_file"' + upload_number + '>Upload File ' + upload_number + '</label>';
            moreUploadTag += '<input type="file"  class="filestyle" (change)="selectFile($event)" data-icon="false" id="upload_file' + upload_number + '" name="upload_file' + upload_number + '"/>';
            moreUploadTag += ' <a href="javascript:del_file(' + upload_number + ')" style="cursor: pointer;position: absolute;right: 0px;top: 9px;color: #ff6464;font-size: 14px;" class="attachMore" onclick="return confirm("Are you really want to delete ?")"><i class="fas fa-trash-alt"></i></a></div>';
            $('<dl class="deletefile" id="delete_file' + upload_number + '">' + moreUploadTag + '</dl>').fadeIn('slow').appendTo('#moreImageUpload');
            upload_number++;
    
    
            $('#upload_file2, #upload_file3, #upload_file4, #upload_file5, #upload_file6').filestyle();
    
        });

    //to show aactive page    
   const currentLocation = location.href;
   const menuItem = document.querySelectorAll('a');
   const menuLength = menuItem.length
   for (let i = 0; i<menuLength; i++){
       if(menuItem[i].href === currentLocation){
           menuItem[i].className = "active"
       }
   }
    
      
    
    });
    
    function del_file(eleId) {
        var ele = document.getElementById("delete_file" + eleId);
        ele.parentNode.removeChild(ele);
    }
}
export function selectpickercall() {
    //    Activate bootstrap-select
    console.log('select  picker')
   
    console.log($(".selectpicker").length);
    if ($(".selectpicker").length != 0) {
        
        $(".selectpicker").selectpicker();
    }
}
export function loads() {
    const inputs = $('.inputDiv').find('input');
    for (let input of inputs) {
        var text_val = $(input).val();
        if (text_val === "") {
            $(input).removeClass('has-value');
        } else {
            $(input).addClass('has-value');
        }
    };

    const selects = $('.inputDiv').find('select')
    for (let select of selects) {
        var text_val = $(select).val();
        if (text_val === "") {
            $(select).css('color', '#000');
            $(select).removeClass('has-value');
        } else {
            $(select).css('color', '#000');
            $(select).addClass('has-value');
        }
    };


    $(function () {
        $('.inputDiv input').focusout(function () {
            var text_val = $(this).val();
            if (text_val === "") {
                $(this).removeClass('has-value');
            } else {
                $(this).addClass('has-value');
            }
        });
    });


    //check input box val
   $(function (){
       $('inputDiv input').val("");
       $('inputDiv input').focusout(function (){
           if($(this).val() != ""){
               $(this).addClass('has-content');
           }else{
               $(this).removeClass('has-content');
           }
           
       })
   });


    $('select').css('color', 'transparent');
    $('select option').css('color', 'black');
    $('select').change(function () {
        if ($(this).val() !== "") {
            $(this).css('color', '#000');
            $(this).addClass('has-value');
        } else {
            $(this).css('color', 'transparent');
            $(this).removeClass('has-value');
        }
    });

    $('.inputDiv input, .inputDiv select, .inputDiv textarea').focusin(function () {
        $(this).parent().addClass('is-focused');
    });

    $('.inputDiv input, .inputDiv select, .inputDiv textarea').focusout(function () {
        $(this).parent().removeClass('is-focused');
    });

}

export function errorPage404() {
    function randomNum() {
        "use strict";
        return Math.floor(Math.random() * 9) + 1;
    }
    var loop1, loop2, loop3, time = 30, i = 0, number, selector3 = document.querySelector('.thirdDigit'), selector2 = document.querySelector('.secondDigit'),
        selector1 = document.querySelector('.firstDigit');
    loop3 = setInterval(function () {
        "use strict";
        if (i > 40) {
            clearInterval(loop3);
            selector3.textContent = 4;
        } else {
            selector3.textContent = randomNum();
            i++;
        }
    }, time);
    loop2 = setInterval(function () {
        "use strict";
        if (i > 80) {
            clearInterval(loop2);
            selector2.textContent = 0;
        } else {
            selector2.textContent = randomNum();
            i++;
        }
    }, time);
    loop1 = setInterval(function () {
        "use strict";
        if (i > 100) {
            clearInterval(loop1);
            selector1.textContent = 4;
        } else {
            selector1.textContent = randomNum();
            i++;
        }
    }, time);
}