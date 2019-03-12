/*
 * JavaScript tracker for Snowplow: detectors.js
 * 
 * Significant portions copyright 2010 Anthon Pang. Remainder copyright 
 * 2012-2014 Snowplow Analytics Ltd. All rights reserved. 
 * 
 * Redistribution and use in source and binary forms, with or without 
 * modification, are permitted provided that the following conditions are 
 * met: 
 *
 * * Redistributions of source code must retain the above copyright 
 *   notice, this list of conditions and the following disclaimer. 
 *
 * * Redistributions in binary form must reproduce the above copyright 
 *   notice, this list of conditions and the following disclaimer in the 
 *   documentation and/or other materials provided with the distribution. 
 *
 * * Neither the name of Anthon Pang nor Snowplow Analytics Ltd nor the
 *   names of their contributors may be used to endorse or promote products
 *   derived from this software without specific prior written permission. 
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS 
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT 
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR 
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT 
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, 
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT 
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, 
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY 
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT 
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE 
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

;
(function () {

    var object = typeof exports !== 'undefined' ? exports : this; // For eventual node.js environment support

    var navigatorAlias = navigator;

    var collectorUrl;

    // It also looks like, every time we switch away from the tab and come back
    // We need to "unlock" the connection again when we return and the tab is visible
    document.addEventListener('visibilitychange', function () {
        if (!document.hidden) {
            unlockBeacon();
        }
    });

    function unlockBeacon(_collectorUrl) {
        // We get passed collectorUrl as soon as we have the URL
        if (_collectorUrl) {
            collectorUrl = _collectorUrl;
        }

        // TODO: only if webview? (is that possible without deep user agent parsing?)
        var iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);

        if (!iOS || !collectorUrl) {
            return;
        }

        // Send a dummy HTTPS request to get around the iOS WebView beacon first-https-connection bug
        // https://robertsahlin.com/analytics-beacon-transport-mechanism-gotchas/
        // https://bugs.webkit.org/show_bug.cgi?id=193508
        var xhr = new XMLHttpRequest();
        xhr.open('POST', collectorUrl, true);
        xhr.setRequestHeader('Content-Type', 'text/plain');
        xhr.withCredentials = true;
        xhr.send('unlockBeacon');
    }

    object.unlockBeacon = unlockBeacon;

}());
