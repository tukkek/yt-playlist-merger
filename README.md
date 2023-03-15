# YouTube playlist merger

This app comes in two parts:

1. An userscript which you can use to export YouTube playlists as JSON files (requires an userscript add-on such as [Tampermonkey](tampermonkey.net/))
2. A merger that takes one or more JSON files and creates a HTML page (requires [Python 3](https://www.python.org/)).

The usage for the merger is something like `./merge.py playlist1.json playlist2.json merged-file-name.html`. Any amount of playlists is supported, other than zero.

While in some ways it would be preferrable for this to be a single user-script, this external approach enables bookmarking, sharing, versioning... and is also somewhat simpler in its current form.

I would vastly prefer for YouTube, after 18 years, to support dynamic playlists in its website, than to have to do this myself. Sadly they do not properly support even basic playlist merging and shuffled play. Their API is also becoming steadily more hostile over the past decade for free users, even for simple tasks like this which just require fetching basic playlist data.
