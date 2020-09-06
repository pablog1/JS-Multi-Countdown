'use strict';

$(function () {

    // Countdown

    /* Usage example
    There are two ways to use this script. On is better for simple needs such a topbar. 
    And the other one is good if you need to display more elements and have more control 
    over the CSS

    **** SIMPLE MODE ****: Just set a main Class and the content within the data attributes.
                 (days), (hours), etc.. will be replaced and you can use
                p_hours, p_minutes, etc.. for pluralization 

    <div class="countdown simple-bar" data-Date='2021/9/5 17:12:0' data-endText="Ofder ended">
            (days) p_days, (hours) p_hours, and (minutes) p_minutes left!
    </div>

    **** EXTENDED MODE: ****
            <div class="countdown show" data-Date='2020/12/10 17:37:53'>
            <h2>Live with  Madonna</h2>
            <div class="running">
                <timer>
                  <span class = "days"></span>:<span class = "hours"></span>:<span class = "minutes"></span>:<span class = "seconds"></span>
                </timer>
                <div class = "break"></div>
                <div class = "labels"><span>Days</span><span>Hours</span><span>Minutes</span><span>Seconds</span></div>
                <div class = "break"></div>
                <div class="text">until Concert begins</div>
                <div class = "break"></div>
                <button>Buy Ticket Now!</button>
            </div>

            <div class="ended">
                <div class="text">Show is ended</div>
                <div class = "break"></div>
                <button>Suscribe for next event!</button>
            </div>
        </div>

    On this way, you have to setup a main Class, and the end Date in the data attributes.
    Then, you need to use the classes "running" and "ended" (you can change the names) and the element <timer>
    On this way, the "ended" class will be visible when the countdown is ready and you have a lot of 
    control over the content and the layout.


    TODO:
    - timer entry modus
    - cookie (or localStorage)
    - pluralization: it works now but only in simple mode, and only in English
    - weeks support
    
    */
    /*

    CONFIG:
    - mainClass
    - Offset Location
    - runningClass (optional)
    - endedClass (optional)


    offset value base on which location time zone you would like to set 
    For India offset value +5.5,
    New York offset value -4,
    London offset value +1

    All locations offset: https://en.wikipedia.org/wiki/List_of_UTC_time_offsets
    */


    // CONFIG

    let mainClass = '.countdown';
    let OffsetLocation = -4;

    let runningClass = '.running'; //optinonal
    let endedClass = ".ended"; //optional

    // END CONFIG


    //init
    let date, index = 0, extraClass, initText;
    $(mainClass).each(function () { //for each countdown instance
        index++;
        date = $(this).attr('data-Date');
        extraClass = 'd_' + index;

        $(this).addClass(extraClass); //add a class to recognize each counter

        //get init text with or whitout an extra Class
        if ($('.' + extraClass + ' ' + runningClass + ' timer').length) {
            initText = $('.' + extraClass + ' ' + runningClass + ' timer').text();
        } else {
            initText = $(this).text();
        }
        //show and hide classes
        $('.' + extraClass + ' ' + runningClass).css('display', 'flex');
        $('.' + extraClass + ' ' + endedClass).css('display', 'none');

        //call main function
        dateReplace(extraClass, date, initText); //prevent delay for the first time
        setInterval(dateReplace, 1000, extraClass, date, initText);
    });

    function dateReplace(extraClass, date, initText) {
        let dif = timeDistance(extraClass, date);
        let text = initText;

        if (dif[0] < 0 || dif[1] < 0 || dif[2] < 0 || dif[3] < 0) {
            //countdown ended
            let endText = $('.' + extraClass).attr('data-endText');
            if (endText != undefined) { //case data-endText attr
                $('.' + extraClass).text(endText);
            } else { //case with two blocks
                $('.' + extraClass + ' ' + runningClass).css('display', 'none');
                $('.' + extraClass + ' ' + endedClass).css('display', 'flex');
            }

        } else {

            //Add a 0 if necesary
            dif.forEach(function (item, index) {
                dif[index] = String(dif[index]).padStart(2, '0');
            });


            //replace text with or without extra class

            //whith extras Class
            if ($('.' + extraClass + ' ' + runningClass + ' timer').length) {
                $('.' + extraClass + ' ' + runningClass + ' timer .days').text(dif[0]);
                $('.' + extraClass + ' ' + runningClass + ' timer .hours').text(dif[1]);
                $('.' + extraClass + ' ' + runningClass + ' timer .minutes').text(dif[2]);
                $('.' + extraClass + ' ' + runningClass + ' timer .seconds').text(dif[3]);

            } else {



                //replace parts without extra Class
                text = text.replace('(days)', dif[0]);
                text = text.replace('(hours)', dif[1]);
                text = text.replace('(minutes)', dif[2]);
                text = text.replace('(seconds)', dif[3]);
                $('.' + extraClass).text(text);
            }
            pluralization(extraClass, dif);
            
        }
    }



    function timeDistance(extraClass, date) {
        var date1 = new Date(date);
        let date2, d, utc;

        d = new Date();
        utc = d.getTime() + (d.getTimezoneOffset() * 60000);
        date2 = new Date(utc + (3600000 * OffsetLocation));

        var diff = date1.getTime() - date2;
        var msec = diff;
        var hh = Math.floor(msec / 1000 / 60 / 60);
        msec -= hh * 1000 * 60 * 60;
        var mm = Math.floor(msec / 1000 / 60);
        msec -= mm * 1000 * 60;
        var ss = Math.floor(msec / 1000);
        msec -= ss * 1000;
        var dd = Math.floor(hh / 24);
        if (dd > 0) {
            hh = hh - (dd * 24);
        }
        return [dd, hh, mm, ss];
    }
    // Note this *is* JQuery, see below for JS solution instead
    function replaceText(selector, text, newText, flags) {
        var matcher = new RegExp(text, flags);
        $(selector).each(function () {
            var $this = $(this);
            if (!$this.children().length)
                $this.text($this.text().replace(matcher, newText));
        });
    }

    function pluralization(extraClass, dif){
            //pluralization
            if (dif[0] == 1) replaceText('.' + extraClass, 'p_days', 'Day', 'g');
            else replaceText('.' + extraClass, 'p_days', 'Days', 'g');

            if (dif[1] == 1) replaceText('.' + extraClass, 'p_hours', 'Hour', 'g');
            else replaceText('.' + extraClass, 'p_hours', 'Hours', 'g');

            if (dif[2] == 1) replaceText('.' + extraClass, 'p_minutes', 'Minute', 'g');
            else replaceText('.' + extraClass, 'p_minutes', 'Minutes', 'g');

            if (dif[3] == 1) replaceText('.' + extraClass, 'p_seconds', 'Second', 'g');
            else replaceText('.' + extraClass, 'p_seconds', 'Seconds', 'g');
    }

})


