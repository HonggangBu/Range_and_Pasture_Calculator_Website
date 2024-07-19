document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    // main navigation buttons click/switch
    SwitchActiveLink();

    // auto collapse the main collapsible nav button
    AutoCollapseCollapsibleNavBtn();

});


function SwitchActiveLink() {
    var header = document.getElementById("navBtns");
    var btns = header.getElementsByClassName("nav-link");

    for (var i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", function () {
            var current = document.getElementsByClassName("active");
            if (current.length > 0) {
                current[0].className = current[0].className.replace(" active", "");
            }
            this.className += " active";
        });
    }

    var sections = {
        "navAbout": "aboutDiv",
        "navForageProduction": "forageProductionDiv",
        "navStockingRate": "stockingRateDiv",
        "navCarryingCapacity": "carryingCapacityDiv",
    };

    for (var key in sections) {
        if (sections.hasOwnProperty(key)) {
            document.getElementById(key).addEventListener("click", function () {
                HandleSectionDisplay(sections, this.id);
            });
        }
    }
}

function HandleSectionDisplay(sections, activeKey) {
    for (var key in sections) {
        if (sections.hasOwnProperty(key)) {
            var section = document.getElementById(sections[key]);
            if (key === activeKey) {
                section.style.display = "block";
            } else {
                section.style.display = "none";
            }
        }
    }
}


// auto collapse the main collapsible nav button
function AutoCollapseCollapsibleNavBtn() {
    var navLinks = document.querySelectorAll('.nav-link');
    var navCollapse = document.getElementById('collapsibleNavbar');

    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            var bsCollapse = new bootstrap.Collapse(navCollapse, {
                toggle: false
            });
            bsCollapse.hide();
        });
    });
}

