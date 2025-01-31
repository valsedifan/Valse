$(document).ready(function() {
    if (window.location.href.includes("/memberlist")) {
        var membersPerPage = 15,
            debug = true; // Set to 'true' to enable debug messages, 'false' to disable

        function debugLog(message) {
            if (debug) {
                console.log(message);
            }
        }

        function loadAllMembers(page) {
            var pageUrl = '/memberlist?start=' + ((page - 1) * membersPerPage);
            debugLog("Loading page: " + pageUrl);

            $.ajax({
                url: pageUrl,
                success: function(data) {
                    debugLog("AJAX request succeeded for page: " + page);
                    var newMembers = $(data).find('.userlist_profil');
                    debugLog("Found " + newMembers.length + " new members on page " + page);

                    if (newMembers.length === 0) {
                        return;
                    }

                    newMembers.each(function() {
                        $('.userlist').append(this);
                    });

                    loadAllMembers(page + 1);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    debugLog("Failed to load page " + page + ": " + textStatus + " - " + errorThrown);
                }
            });
        }

        debugLog("Starting to load all members from page 1");
        loadAllMembers(1);
    }
});
