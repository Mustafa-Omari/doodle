var timer;

$(document).ready(function() {

    $(".result").on("click", function() {
        
        var url = $(this).attr("href");
        var id = $(this).attr("data-linkId");

        if(!id){
            alert("data-linkId attribute not found");
        }

        increaseLinkClicks(id, url);

        return false;
    });

    

    // Masonry Layout
    var grid = $(".imageResults");

    grid.on("layoutComplete", function() {
        $(".gridItem img").css("visibility", "visible");
    });

    // masonry
    grid.masonry({
        itemSelector: ".gridItem",
        columnWidth: 200,
        gutter: 5,
        transitionDuration: '0.5s',
        isInitLayout: false
    });

    // fancybox 
    $("[data-fancybox]").fancybox({

        caption : function( instance, item ) {
            var caption = $(this).data('caption') || '';
            var siteUrl = $(this).data('siteurl') || '';
    
            if( item.type === 'image') {
                return ( caption.length ? caption + '<br />' : '' ) 
                + '<a href="' + item.src + '">View image</a><br>'
                + '<a href="' + siteUrl + '">Visit page</a>';
            }

            return caption;
        },

        afterShow : function( instance, item ) {
        
            increasImageClicks(item.src);
        }

    });

});

function loadImage(src, className) { 
    // console.log(src);

    var image = $("<img>");

    image.on("load", function() {
        $("." + className + " a").append(image);

        // When reload the page stop timer and timer will do same you put in 
        clearTimeout(timer);

        timer = setTimeout(function() {
            $(".imageResults").masonry();
        }, 900)

    });

    image.on("error", function() {
        // console.log("Broken");
        $("." + className).remove();

        $.post("ajax/setBroken.php", {src: src});

    });

    image.attr("src", src);
}


function increaseLinkClicks(linkId, url) {
    $.post("ajax/updateLinkCount.php", {linkId: linkId})
    .done(function(result) {
        if(result != "") { 
            alert(result);
            return;
        }

        window.location.href = url;
    });
}

function increasImageClicks(imageUrl) {
    $.post("ajax/updateImageCount.php", {imageUrl: imageUrl})
    .done(function(result) {
        if(result != "") { 
            alert(result);
            return;
        }
    });
}