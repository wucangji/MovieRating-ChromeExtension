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

    $('#Search').click(function () {

        var movieName = $('#MovieName').val();
        console.log(movieName);

        var xhr = new XMLHttpRequest();
        xhr.open("GET", "https://api.douban.com/v2/movie/search?q= " + movieName + "&count=1", true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                // JSON.parse does not evaluate the attacker's scripts.
                var resp = JSON.parse(xhr.responseText);
                console.log( resp );
                console.log( resp.subjects[0].rating.average);
                var rating = resp.subjects[0].rating.average;
                $('#doubanRating').text(rating);
            }
        };
        xhr.send();

    });



});