// ==UserScript==
// @name         YouTube More Speeds Modfied
// @name:zh YouTube上的更多速度
// @version      1.0.1
// @namespace    https://github.com/julong111/script-youtube-more-speeds
// @author       julong@111.com
// @homepage https://github.com/julong111/script-youtube-more-speeds
// @supportURL https://github.com/julong111/script-youtube-more-speeds/issues
// @match        *://*.youtube.com/*
// @icon https://www.youtube.com/s/desktop/3748dff5/img/favicon_48.png
// @description  Adds buttons under a YouTube video with more playback speeds.  project forked from: https://github.com/ssssssander/youtube-more-speeds  1.5.1
// @description:zh 添加下一个YouTube视频与更多的播放速度按钮。  forked from: https://github.com/ssssssander/youtube-more-speeds  1.5.1
// @charset		 UTF-8
// @license MIT
// ==/UserScript==

(function() {
    'use strict';

    function addSpeeds() {
        if (funcDone) return;

        let bgColor = colors[0];
        let moreSpeedsDiv = document.createElement('div');
        moreSpeedsDiv.id = 'more-speeds';

        let speeds = [0.5, 0.75, 1.0, 1.5, 2.0, 3.0];

        for (let i = 0; i < speeds.length; i++) {

            if (speeds[i] >= 1) { bgColor = colors[1]; }
            if (speeds[i] >= 3) { bgColor = colors[2]; }

            let btn = document.createElement('button');
            btn.style.backgroundColor = bgColor;
            btn.style.marginRight = '4px';
            btn.style.border = '1px solid #D3D3D3';
            btn.style.borderRadius = '2px';
            btn.style.color = '#ffffff';
            btn.style.cursor = 'pointer';
            btn.style.fontFamily = 'monospace';
            btn.textContent = speeds[i].toString()+'×';

            btn.addEventListener('click', () => { document.getElementsByTagName('video')[0].playbackRate = speeds[i] } );
            moreSpeedsDiv.appendChild(btn);
        }

        let titleElem = document.querySelector(titleElemSelector);
        titleElem.before(moreSpeedsDiv);

        funcDone = true;
    }

    function waitForKeyElements(selectorOrFunction, callback, waitOnce, interval, maxIntervals) {
        if (typeof waitOnce === "undefined") {
            waitOnce = true;
        }
        if (typeof interval === "undefined") {
            interval = 300;
        }
        if (typeof maxIntervals === "undefined") {
            maxIntervals = -1;
        }
        var targetNodes = (typeof selectorOrFunction === "function")
        ? selectorOrFunction()
        : document.querySelectorAll(selectorOrFunction);

        var targetsFound = targetNodes && targetNodes.length > 0;
        if (targetsFound) {
            targetNodes.forEach(function(targetNode) {
                var attrAlreadyFound = "data-userscript-alreadyFound";
                var alreadyFound = targetNode.getAttribute(attrAlreadyFound) || false;
                if (!alreadyFound) {
                    var cancelFound = callback(targetNode);
                    if (cancelFound) {
                        targetsFound = false;
                    }
                    else {
                        targetNode.setAttribute(attrAlreadyFound, true);
                    }
                }
            });
        }

        if (maxIntervals !== 0 && !(targetsFound && waitOnce)) {
            maxIntervals -= 1;
            setTimeout(function() {
                waitForKeyElements(selectorOrFunction, callback, waitOnce, interval, maxIntervals);
            }, interval);
        }
    }

    function checkClassPresence(selector, className) {
      setInterval(() => {
        const element = document.querySelector(selector);
        if (element ) {
            if( element.classList.contains(className)){
                document.getElementsByTagName('video')[0].playbackRate = 1.0;
            }
        }
      }, 1000);
    }

    checkClassPresence('#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > div.ytp-time-display.notranslate.ytp-live > button', 'ytp-live-badge-is-livehead');
    
    let funcDone = false;
    const titleElemSelector = '#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-right-controls';

    const colors = ['#072525', '#287F54', '#C22544'];
    if (!funcDone) window.addEventListener('yt-navigate-start', addSpeeds);

    if (document.body && !funcDone) {
        waitForKeyElements(titleElemSelector, addSpeeds);
    }
})();
