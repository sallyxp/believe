$(document).ready(function(){

    // Modal load
    $('.bg-modal').css('display', 'flex');

    // Navbar mobile collapse
    $('.sidenav').sidenav();

    // Modal .onclick close
    $('.continue').on('click', function() {
        $('.bg-modal').css('display', 'none');
    })


  });