document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    const forageProductionForm = document.getElementById('forageProductionForm');
    const rangelandResultDiv = document.getElementById('rangelandResultDiv');
    const nonRangelandResultDiv = document.getElementById('nonRangelandResultDiv');
    const calculateBtnDiv = document.getElementById('calculateBtnDiv');



    // main navigation buttons click/switch
    SwitchActiveLink();

    // auto collapse the main collapsible nav button
    AutoCollapseCollapsibleNavBtn();


    // Dynamically generate input boxes
    DynamicWeightInputBoxesGeneratorForAllPastureTypes();

    // events on pasture type change
    OnPastureTypeChange();

    // events on dry/wet type change
    OnDryWetTypeChange();

    // events on any forage production division input change
    OnAnyInputChangeForageProduction();

    // forage production calculation
    ForageProductionCalculation();
});

// 
function CalculateAverage(numbers) {
    const total = numbers.reduce((sum, value) => sum + value, 0);
    return total / numbers.length;
}

// 
function CalculateSum(numbers) {
    return numbers.reduce((sum, value) => sum + value, 0);
}

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




// dynamically generate sample net weight input boxes based on the number of samples
function DynamicWeightInputBoxesGenerator(sampleQuantityID, inputContainerID, inputLabelContainerID) {
    document.getElementById(sampleQuantityID).addEventListener('change', function () {
        var quantity = this.value;
        var inputContainer = document.getElementById(inputContainerID);
        var inputLabelContainer = document.getElementById(inputLabelContainerID);
        inputContainer.innerHTML = ''; // Clear any existing input boxes

        if (quantity >= 1) {
            inputLabelContainer.innerHTML = 'Please enter your sample net weight (<b>unit: gram </b>):';
        } else {
            inputLabelContainer.innerHTML = '';
        }

        // Dynamically generate input boxes
        for (var i = 1; i <= quantity; i++) {
            var inputBox = document.createElement('input');
            inputBox.type = 'number';
            inputBox.placeholder = '#' + i;
            inputBox.name = 'sampleNetWeight' + i;
            inputBox.id = sampleQuantityID + '_' + i;
            inputBox.classList.add('form-control');
            inputBox.min = 1; // Minimum value of 1 to ensure positive numbers
            inputBox.required = true; // Ensure the input cannot be left blank
            inputContainer.appendChild(inputBox);
        }
    });
}


function DynamicWeightInputBoxesGeneratorForAllPastureTypes() {
    const pastureTypes = [
        { quantityID: 'nonRangelandSampleQuantity', containerID: 'nonRangelandInputContainer', labelContainerID: 'nonRangelandInputLabelContainer' },
        { quantityID: 'uplandLoamySampleQuantity', containerID: 'uplandLoamyInputContainer', labelContainerID: 'uplandLoamyInputLabelContainer' },
        { quantityID: 'uplandSandySampleQuantity', containerID: 'uplandSandyInputContainer', labelContainerID: 'uplandSandyInputLabelContainer' },
        { quantityID: 'uplandClayeySampleQuantity', containerID: 'uplandClayeyInputContainer', labelContainerID: 'uplandClayeyInputLabelContainer' },
        { quantityID: 'uplandShallowSampleQuantity', containerID: 'uplandShallowInputContainer', labelContainerID: 'uplandShallowInputLabelContainer' },
        { quantityID: 'uplandVeryShallowSampleQuantity', containerID: 'uplandVeryShallowInputContainer', labelContainerID: 'uplandVeryShallowInputLabelContainer' },
        { quantityID: 'lowlandOverflowSampleQuantity', containerID: 'lowlandOverflowInputContainer', labelContainerID: 'lowlandOverflowInputLabelContainer' },
        { quantityID: 'lowlandWetMeadowSampleQuantity', containerID: 'lowlandWetMeadowInputContainer', labelContainerID: 'lowlandWetMeadowInputLabelContainer' }
    ];

    pastureTypes.forEach(({ quantityID, containerID, labelContainerID }) => {
        DynamicWeightInputBoxesGenerator(quantityID, containerID, labelContainerID);
    });
}

function CollectInputValues(sampleQuantityID) {
    var quantity = document.getElementById(sampleQuantityID).value;
    var values = [];
    for (var i = 1; i <= quantity; i++) {
        var inputBox = document.getElementById(sampleQuantityID + '_' + i);
        if (inputBox && inputBox.value) {
            values.push(parseFloat(inputBox.value));
        }
    }
    return values;
}

function OnPastureTypeChange() {
    const nonRangelandWeightDiv = document.getElementById('nonRangelandWeightDiv');
    const rangelandWeightDiv = document.getElementById('rangelandWeightDiv');
    document.querySelectorAll("input[name='pastureTypeRadio']").forEach(function (radio) {
        radio.addEventListener("change", function () {
            if (document.querySelector("input[name='pastureTypeRadio']:checked").value === 'rangelandRadio') {
                nonRangelandWeightDiv.style.display = 'none';
                rangelandWeightDiv.style.display = 'block';
            } else {
                nonRangelandWeightDiv.style.display = 'block';
                rangelandWeightDiv.style.display = 'none';
            }
        });
    });
}


function OnDryWetTypeChange() {
    document.querySelectorAll("input[name='drywetRadio']").forEach(function (radio) {
        radio.addEventListener("change", function () {
            if (document.querySelector("input[name='drywetRadio']:checked").value === 'wetRadio') {
                document.getElementById('PlantAndStageSelectDiv').style.display = 'block';
            } else {
                document.getElementById('PlantAndStageSelectDiv').style.display = 'none';
            }
        });
    });
}


/* function OnAnyInputChange() {
    document.querySelectorAll('input[type="number"], input[type="radio"], select').forEach(function (input) {
        input.addEventListener('input', function () {
            rangelandResultDiv.style.display = 'none';
            nonRangelandResultDiv.style.display = 'none';
            calculateBtnDiv.style.display = 'block';
        });
    });
}
 */

function OnAnyInputChangeForageProduction() {
    const forageProductionDiv = document.getElementById('forageProductionDiv');
    forageProductionDiv.addEventListener('input', function (event) {
        if (event.target.matches('input[type="number"], input[type="radio"], select')) {
            rangelandResultDiv.style.display = 'none';
            nonRangelandResultDiv.style.display = 'none';
            calculateBtnDiv.style.display = 'block';
        }
    });
}


function GetPercentAirDryMatter() {
    const PercentAirDryMatter = [
        // before heading, headed, seed ripe, leaves dry, dormancy
        [0.35, 0.45, 0.60, 0.85, 0.95], // wheatgrasses, needlegrasses, perennial bromes, bluegrasses, fescues
        [0.30, 0.45, 0.60, 0.85, 0.95], // Tall: bluesems, switchgrass
        [0.40, 0.55, 0.65, 0.90, 0.95], // Mid: side-oats grama
        [0.45, 0.60, 0.80, 0.90, 0.95], // Short: blue grama, buffalograss
        [0.20, 0.40, 0.60, 0.90, 1.0], // Forbs
        [0.35, 0.50, 0.30, 0.85, 1.0] // Shrubs
    ];

    var grassTypeIndex = parseInt(document.getElementById("PlantTypeSelect").selectedIndex);
    var growthStageIndex = parseInt(document.getElementById("GrowthStageSelect").selectedIndex);
    var dm = PercentAirDryMatter[grassTypeIndex][growthStageIndex];

    return dm;
}


// calculate final forage production from wet samples
// cr = conversion rate
// pct = percent air dry matter
// arr = array of sample weights
function GetWetSampleFinalForageProduction(arr, cr, pct) {
    if (arr.length === 0) {
        return 0;
    }
    return CalculateAverage(arr) * cr * pct;
}

// calculate final forage production from dry samples
// cr = conversion rate
// arr = array of sample weights
function GetDrySampleFinalForageProduction(arr, cr) {
    if (arr.length === 0) {
        return 0;
    }
    return CalculateAverage(arr) * cr;
}


function ForageProductionCalculation() {
    const conversionRates = [50, 8.92];

    forageProductionForm.addEventListener('submit', function (event) {
        event.preventDefault();
        var result = 0; //non rangeland result
        var conversionRate = 0;
        var uplandLoamyResult = 0;
        var uplandSandyResult = 0;
        var uplandClayeyResult = 0;
        var uplandShallowResult = 0;
        var uplandVeryShallowResult = 0;
        var lowlandOverflowResult = 0;
        var lowlandWetMeadowResult = 0;


        calculateBtnDiv.style.display = 'none';

        if (document.querySelector("input[name='pastureTypeRadio']:checked").value === 'rangelandRadio') {
            conversionRate = conversionRates[0];
            if (document.querySelector("input[name='drywetRadio']:checked").value === 'wetRadio') {
                uplandLoamyResult = GetWetSampleFinalForageProduction(CollectInputValues('uplandLoamySampleQuantity'), conversionRate, GetPercentAirDryMatter());
                uplandSandyResult = GetWetSampleFinalForageProduction(CollectInputValues('uplandSandySampleQuantity'), conversionRate, GetPercentAirDryMatter());
                uplandClayeyResult = GetWetSampleFinalForageProduction(CollectInputValues('uplandClayeySampleQuantity'), conversionRate, GetPercentAirDryMatter());
                uplandShallowResult = GetWetSampleFinalForageProduction(CollectInputValues('uplandShallowSampleQuantity'), conversionRate, GetPercentAirDryMatter());
                uplandVeryShallowResult = GetWetSampleFinalForageProduction(CollectInputValues('uplandVeryShallowSampleQuantity'), conversionRate, GetPercentAirDryMatter());
                lowlandOverflowResult = GetWetSampleFinalForageProduction(CollectInputValues('lowlandOverflowSampleQuantity'), conversionRate, GetPercentAirDryMatter());
                lowlandWetMeadowResult = GetWetSampleFinalForageProduction(CollectInputValues('lowlandMeadowSampleQuantity'), conversionRate, GetPercentAirDryMatter());


            } else {
                uplandLoamyResult = GetDrySampleFinalForageProduction(CollectInputValues('uplandLoamySampleQuantity'), conversionRate);
                uplandSandyResult = GetDrySampleFinalForageProduction(CollectInputValues('uplandSandySampleQuantity'), conversionRate);
                uplandClayeyResult = GetDrySampleFinalForageProduction(CollectInputValues('uplandClayeySampleQuantity'), conversionRate);
                uplandShallowResult = GetDrySampleFinalForageProduction(CollectInputValues('uplandShallowSampleQuantity'), conversionRate);
                uplandVeryShallowResult = GetDrySampleFinalForageProduction(CollectInputValues('uplandVeryShallowSampleQuantity'), conversionRate);
                lowlandOverflowResult = GetDrySampleFinalForageProduction(CollectInputValues('lowlandOverflowSampleQuantity'), conversionRate);
                lowlandWetMeadowResult = GetDrySampleFinalForageProduction(CollectInputValues('lowlandWetMeadowSampleQuantity'), conversionRate);
            }

            rangelandResultDiv.style.display = 'block';
            nonRangelandResultDiv.style.display = 'none';

            document.getElementById('uplandLoamyResultDisplay').innerHTML = uplandLoamyResult.toFixed(2) + ' pounds/acre';
            document.getElementById('uplandSandyResultDisplay').innerHTML = uplandSandyResult.toFixed(2) + ' pounds/acre';
            document.getElementById('uplandClayeyResultDisplay').innerHTML = uplandClayeyResult.toFixed(2) + ' pounds/acre';
            document.getElementById('uplandShallowResultDisplay').innerHTML = uplandShallowResult.toFixed(2) + ' pounds/acre';
            document.getElementById('uplandVeryShallowResultDisplay').innerHTML = uplandVeryShallowResult.toFixed(2) + ' pounds/acre';
            document.getElementById('lowlandOverflowResultDisplay').innerHTML = lowlandOverflowResult.toFixed(2) + ' pounds/acre';
            document.getElementById('lowlandWetMeadowResultDisplay').innerHTML = lowlandWetMeadowResult.toFixed(2) + ' pounds/acre';

        } else {
            if (document.querySelector("input[name='pastureTypeRadio']:checked").value === 'pastureRadio') {
                conversionRate = conversionRates[0];
            }
            else {
                conversionRate = conversionRates[1];
            }

            if (document.querySelector("input[name='drywetRadio']:checked").value === 'wetRadio') {
                result = GetWetSampleFinalForageProduction(CollectInputValues('nonRangelandSampleQuantity'), conversionRate, GetPercentAirDryMatter());
            } else {
                result = GetDrySampleFinalForageProduction(CollectInputValues('nonRangelandSampleQuantity'), conversionRate);
            }

            rangelandResultDiv.style.display = 'none';
            nonRangelandResultDiv.style.display = 'block';

            document.getElementById('nonRangelandResultDisplay').value = result.toFixed(2) + ' pounds/acre';

        }
    });
}