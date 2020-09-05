'use strict';

$(function () {

    // Countdown

    /* Usage example

    TODO:
    - timer entry modus
    - cookie (or localStorage)
    - pluralización?
    - time zone
    - semanas?
    
    */

    // CONFIG

    let mainClass = '.countdown';
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

            //replace parts
            text = text.replace('(days)', dif[0]);
            text = text.replace('(hours)', dif[1]);
            text = text.replace('(minutes)', dif[2]);
            text = text.replace('(seconds)', dif[3]);

            //replace text with or without extra class
            if ($('.' + extraClass + ' ' + runningClass + ' timer').length) {
                $('.' + extraClass + ' ' + runningClass + ' timer').text(text);
            } else {
                $('.' + extraClass).text(text);
            }
        }
    }



    function timeDistance(extraClass, date) {
        var date1 = new Date(date);
        var date2 = Date.now();
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
})