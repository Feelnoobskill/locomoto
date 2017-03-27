'use strict';

function initSearchForm() {
    const data = {
        from: null,
        to: null,
        date: null
    };
    $('#search').submit(function(e) {
        e.preventDefault();
        hideErrors();

        data.from = $('#from').val();
        data.to = $('#to').val();
        data.date = $('#date').val();

        if (! moment(data.date).isValid()) {
            showError('Date is invalid');
        } else {
            createTabs(data.date);
            search();
        }

    });

    function showError(error) {
        $("#error").html(error);
    }

    function hideErrors() {
        $("#error").html('');
    }

    function createTabs(date) {
        $('#tabs').html('');
        for (let i = -2; i < 3; i++) {
            const tab = moment(date).add(i, 'days').format('YYYY-MM-DD');
            const tabClass = i === 0 ? 'active' : '';
            $('#tabs').append(`<li class="${tabClass} tab-parent"><a class="tab-item" href="#" data-date="${tab}">${tab}</a></li>`);
        }
        switchDate();
    }

    function switchDate() {
        $('.tab-item').click(function(e) {
            e.preventDefault();

            $('.tab-parent').removeClass('active');
            $(this).parent().addClass('active');

            data.date = $(this).data('date');
            search();

        })
    }

    function search() {
        showLoader();
        hide404();
        $.get('http://localhost:3000/api/search', data)
        .done((result) => {
            showResultTable();
            // show last 20 results
            $('#rows').html('');
            for (let i = 0; i < 20; i++) {
                createTableRow(result[i]);
            }
        })
        .fail((error) => {
            if (error.status === 404 ) {
                show404();
            } else {
                showError('Bad request');
            }
        })
        .always(() => {
            hideLoader();
        })
    }

    function show404() {
        $('#result').addClass('hide');
        $('#404').removeClass('hide');
    }

    function hide404() {
        $('#404').addClass('hide');
    }

    function showResultTable() {
        $('#result').removeClass('hide');
    }

    function showLoader() {
        $('#loader').removeClass('hide');
    }

    function hideLoader() {
        $('#loader').addClass('hide');
    }

    function createTableRow(data) {
        $('#rows').append(`
            <tr>
                <td>${data.airline.code} ${data.airline.name}</td>
                <td>${data.start.airportCode} ${data.start.airportName} ${data.start.cityName} ${data.start.dateTime}</td>
                <td>${data.finish.airportCode} ${data.finish.airportName} ${data.finish.cityName} ${data.finish.dateTime}</td>
                <td>${data.plane.code} ${data.plane.model} ${data.plane.shortName}</td>
                <td>${data.price}</td>
            </tr>
        `);
    }

}

