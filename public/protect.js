(() => {
    const token = document.currentScript.getAttribute("data-token");
    const url = window.location.href;
    const referrer = document.referrer;
    const userAgent = navigator.userAgent;
    const timestamp = new Date().toISOString();

    fetch("https://dossbeckend-c8b3f5f403da.herokuapp.com/api/logs/track", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ token, url, referrer, userAgent, timestamp })
    })
        .then(res => res.json())
        .then(data => {
            console.log("Tracking success:", data);

            if (data.error === "Access denied. IP blocked.") {
                alert("Вас заблоковано адміністратором сайту!");
                setTimeout(() => {
                    window.location.href = "https://www.google.com";
                }, 2000);
            }
        })
        .catch(err => {
            console.error("Tracking error:", err);
        });
})();