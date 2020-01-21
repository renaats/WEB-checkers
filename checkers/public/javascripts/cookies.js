document.addEventListener("load", reload());
        function incrementCookie() {
            var playCount = getCookie("playCount");
            if(playCount==""){
                document.cookie = "playCount = 1; expires=Thu, 18 Dec 2020 12:00:00 UTC";
            }
            else
            {
                playCount = parseInt(getCookie("playCount"));
                playCount++;
                document.cookie = "playCount = "+ playCount +"; expires=Thu, 18 Dec 2020 12:00:00 UTC";
            }
        };
        function reload() {
            $.get("/updateStats/").done(function(res) {
                console.log(res);
                document.getElementById("gamesPlayed").innerHTML = res.gamesPlayed;
                document.getElementById("movesMade").innerHTML = res.movesMade;
                document.getElementById("playersOnline").innerHTML = res.playersOnline;
                if(getCookie("playCount")=="")
                    document.getElementById("yourGames").innerHTML = "0";
                else
                    document.getElementById("yourGames").innerHTML = getCookie("playCount");
            });
        };

        function getCookie(cname) {
            var name = cname + "=";
            var decodedCookie = decodeURIComponent(document.cookie);
            var ca = decodedCookie.split(';');
            for(var i = 0; i <ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
                }
            }
            return "";
        }