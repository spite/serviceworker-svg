"use strict";

this.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open('v1').then(function(cache) {
            return cache.addAll([
                'index.html',
                'assets/svg/svg-built.svg'
                ]);
        })
    );
});

this.addEventListener('fetch', function(event) {

    // the request URL is to a file with SVG extension

    if (/\.svg$/.test( event.request.url ) ) {

        console.log( 'Trying to fetch an SVG: ', event.request.url )

        // we'll respond the fetch request with the fullfilment of the SVGPromise

        event.respondWith(

            SVGPromise( event ).then( function( r ) {

                // successfully retrieved the SVG file from master file in cache

                return r;

            } ).catch( function( e ) {

                // couldn't find the file in the master file

                console.log( 'ERROR: ', e );

                // fetch from server normally

                return fetch( event.request.url );

            } )

        );

    }

} );

function matchInString( regExp, string ) {

    var m;

    while ((m = regExp.exec(string)) !== null) {
        if (m.index === regExp.lastIndex) regExp.lastIndex++;
        return m;
    }

    return null;

}

function SVGPromise( event  ) {

    // we create the Promise object that will get returned

    var promise = new Promise( function(resolve, reject) {

        // retrieve from cache the master svg file

        var r = new Request( 'assets/svg/svg-built.svg' );

        caches.match( r ).then( function( response ) {

            return response.text();

        } ).then( function( svgMaster ) {

            // master file was successfully retrieved from cache
            // svgMaster is the text content of the file

            // extract the name of the file from the request 
            // i.e. http://www.domain.com/folder/assets/file.svg to file.svg

            var id = matchInString( /.*\/(.*)/gmi, event.request.url )[ 1 ];

            // try to extract the svg tag with the id attribute with the name

            var regExp = new RegExp( '(<svg id="' + id + '".*<\/svg>)', 'gi' );
            var res = matchInString( regExp, svgMaster );

            if( res ) {

                // we found it, we can return the node as am SVG file
                // check what happens in SVGPromise.then
                var code = res[ 0 ];
                code = code.replace( /<\/svg>/gmi, '<circle cx="3" cy="3" r="3" fill="#00ff00"/></svg>' );

                var svgResponse = new Response( code, { headers: { 'Content-Type': 'image/svg+xml' } } );
                resolve( svgResponse );

            } else {

                // we didn't find it, the promise is rejected
                // check what happens in the SVGPromise.catch

                reject( id + ' is not on master' );

            }

        } );

    } );

    return promise;

}