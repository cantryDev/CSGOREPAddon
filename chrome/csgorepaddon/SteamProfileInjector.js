// Confirm that we are on a steam profile
if (document.querySelector('body').classList.contains('profile_page')) {
    //get SteamId of the partner
    var ex = new RegExp('steamid":"([0-9]{17})"');
    var profileOwnerSteamid = ex.exec(document.body.innerHTML)[1];

    //get data from csgo-rep.com
    fetch('https://api.csgo-rep.com', {
        method: 'post',
        headers: {
            'Accept': 'application/json,',
            'Content-Type': 'application/json'
        },
        body: '{"id":"203","query":{"steam_id":"' + profileOwnerSteamid + '"}}'
    }).then(response => response.json())
        .then(data => {
            console.log(data);

            if (data.profile == null) {
                data.profile = {"steam_id": profileOwnerSteamid, "feedback": {"neutral": 0, "positive": 0}};
            }

            let statusInfo = document.getElementsByClassName("responsive_status_info")[0];
            let element = document.createElement("div");

            if (data.ban != null) {
                element.innerHTML = getBanWarning();
            } else {
                element.innerHTML = getHtmlElementFromData(data);
            }
            statusInfo.appendChild(element);
        });

    //get Html to display in the profile
    function getHtmlElementFromData(data) {
        let arrowUrl = chrome.extension.getURL("icons/arrow.svg");
        let dashUrl = chrome.extension.getURL("icons/dash.svg");
        html = `<div style="text-align: center">
                    <a style="color: #fff" href='https://csgo-rep.com/profile/${data.profile.steam_id}'>CSGO-REP.COM Reputation</a>
                </div>`;
        html += `<div class="rating" style="display: flex">
                    <div class="circle green">
                        <div class="icon">
                            <img src="${arrowUrl}">
                        </div>
                        <span>${data.profile.feedback.positive}</span>
                        </div>
                    <div class="circle yellow">
                        <div class="icon">
                            <img src="${dashUrl}">
                        </div>
                        <span>${data.profile.feedback.neutral}</span>
                    </div>
                </div>`;

        return html;
    }

    // get Html to display a warning
    function getBanWarning() {
        return `<h1 style="color: red">This user is banned on CSGO-REP.COM take caution</h1>`;
    }

}