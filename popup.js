$(function () {
    chrome.storage.sync.get(['total','goal'], function (items) {
        $('#total').text(items.total);
        $('#goal').text(items.goal);
    });


    $('#addAmount').click(function () {
        chrome.storage.sync.get(['total','goal'], function (items) {
            var newTotal = 0;
            if (items.total) {
                newTotal += parseInt(items.total);
            }

            var amount = $('#amount').val();
            if (amount) {
                newTotal += parseInt(amount);
            }

            chrome.storage.sync.set({ 'total': newTotal });
            $('#total').text(newTotal);
            $('#amount').val('');

            if (newTotal >= items.goal) {
                var opt = {
                    type: "basic",
                    title: "Goal reached!",
                    message: "You reached your goal of " + items.goal + "!",
                    iconUrl: "icon.png"
                }

                chrome.notifications.create('goalReached', opt, function () { });
            }
        });
    });

    function getScoreFromIMDB () {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "http://www.omdbapi.com/?t=" + arguments[0], true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                // JSON.parse does not evaluate the attacker's scripts.
                var resp = JSON.parse(xhr.responseText);
                console.log( resp );
                console.log( resp.imdbRating);
                var rating = resp.imdbRating;
                $('#imdbRating').text(rating);
            }
        };
        xhr.send();
    }


    $('#Search').click(function () {

        var movieName = $('#MovieName').val();


        var xhr = new XMLHttpRequest();
        xhr.open("GET", "https://api.douban.com/v2/movie/search?q= " + movieName + "&count=1", true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                // JSON.parse does not evaluate the attacker's scripts.
                var resp = JSON.parse(xhr.responseText);
                console.log( resp );
                console.log( resp.subjects[0].rating.average);
                var rating = resp.subjects[0].rating.average;
                var DoubanName1 = resp.subjects[0].title;
                console.log(resp.subjects[0].original_title);
                $('#Name1').text(DoubanName1);
                movieName = resp.subjects[0].original_title;
                $('#Name2').text(resp.subjects[0].original_title +" : " + resp.subjects[0].year);
                // ToDO: if there is image, remove them first
                // add fly image.
                $( "<img>" ).attr( "src", resp.subjects[0].images.medium ).appendTo( "#images" );
                $('#doubanRating').text(rating);

                // must put inside this http get, otherwise moviename is not change
                getScoreFromIMDB(movieName);
            }
        };
        xhr.send();



    });



});