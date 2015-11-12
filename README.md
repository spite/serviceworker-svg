# Optimising SVG load with Service Workers

This demo goes with the article "[Optimising SVG load with Service Worker](https://clicktorelease.com/blog/optimise-svg-load-service-worker)".

If it works, you should see green dots on all images but the heart one.

Supported browser: latest Chrome, Firefox and Opera.

The first time the site runs, it will install the Service Worker, so it won't be ready right away: none of the images will have a green dot.

The next reload, the SW should be installed and running, and the images should have the green dot.


#### License ####

MIT licensed

Copyright (C) 2015 Jaume Sanchez Elias, http://www.clicktorelease.com
