var menuItem = {
    "id": "addProtein",
    "title": "Movie Rating",
    "contexts":["selection"]
}

chrome.contextMenus.create(menuItem);

chrome.contextMenus.onClicked.addListener(function (clickData) {
    if (clickData.menuItemId == "addProtein" && clickData.selectionText) {

        var movieName = clickData.selectionText;
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
                var DoubanName1 = resp.subjects[0].title;
                console.log(resp.subjects[0].original_title);
                $('#Name1').text(DoubanName1);
                movieName = resp.subjects[0].original_title;
                $('#Name2').text(resp.subjects[0].original_title +" : " + resp.subjects[0].year);
                // ToDO: if there is image, remove them first
                // add fly image.
                $( "<img>" ).attr( "src", resp.subjects[0].images.medium ).appendTo( "#images" );
                $('#doubanRating').text(rating);
                chrome.storage.sync.set({ 'doubanRating': rating });
                // must put inside this http get, otherwise moviename is not change
                getScoreFromIMDB(movieName);
            }
        };
        xhr.send();

        }
    }
);

chrome.storage.onChanged.addListener(function (changes) {
    chrome.browserAction.setBadgeText({ "text": changes.doubanRating.newValue.toString() });
});

