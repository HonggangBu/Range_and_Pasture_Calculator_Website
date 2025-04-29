// index.js

document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    // #region Homepage global functions
    // main navigation buttons click/switch
    SwitchActiveLink();

    // auto collapse the main collapsible nav button
    AutoCollapseCollapsibleNavBtn();
    // #endregion

    // #region Forage Production Calculator global functions
    ///////////////////////////FORAGE PRODUCTION CALCULATOR///////////////////////////////////////////////////
    const forageProductionForm = document.getElementById('forageProductionForm');
    const rangelandResultDiv = document.getElementById('rangelandResultDiv');
    const nonRangelandResultDiv = document.getElementById('nonRangelandResultDiv');
    const forageProductionCalculateBtnDiv = document.getElementById('forageProductionCalculateBtnDiv');

    //// Dynamically generate input boxes
    //DynamicWeightInputBoxesGeneratorForAllPastureTypes();

    // events on pasture type change
    OnPastureTypeChange();

    // events on dry/wet type change
    OnDryWetTypeChange();

    // events on any forage production division input change
    OnAnyInputChangeForageProduction();

    // events on non rangeland sample weights clear button click
    OnNRSampleWeightsInputClear();

    // events on rangeland sample weights clear button click
    OnRangelandSampleWeightsInputClear();

    // forage production calculation
    ForageProductionCalculation();
    // #endregion

    // #region Stocking Rate Calculator global functions
    ///////////////////////////STOCKING RATE CALCULATOR///////////////////////////////////////////////////
    const stockingRateCalculateBtnDiv = document.getElementById('stockingRateCalculateBtnDiv');
    const stockingRateCalculateBtn = document.getElementById('stockingRateCalculateBtn');
    const stockingRateResultDiv = document.getElementById('stockingRateResultDiv');
    const globalValidationMessageSR = document.getElementById('globalValidationMessageSR');


    // based on number of animal classes, dynamically add html content for animal class selection, number of head input, and number of month input
    DynamicallyGenerateAnimalClassHeadMonthFieldsets();

    // calculate stocking rate when clicking on calculate button
    StockingRateCalculation();

    // hide results division and show calculate button when any input/dropdown change
    //OnAnyInputChangeStockingRate();
    OnAnyInputOrSelectionChange(stockingRateDiv, stockingRateCalculateBtnDiv, stockingRateResultDiv);

    // events on any stocking rate division input (head number and month number) change
    // check if there is error in user input of the static input (head number and month number)
    // this only applies to the first and static animal class section
    OnAnyStockingRateInputChange();


    // #endregion

    // #region Carrying Capacity Calculator global functions
    ///////////////////////////CARRYING CAPACITY CALCULATOR///////////////////////////////////////////////////
    const carryingCapacityCalculateBtnDiv = document.getElementById('carryingCapacityCalculateBtnDiv');
    const carryingCapacityResultDiv = document.getElementById('carryingCapacityResultDiv');
    const carryingCapacityDiv = document.getElementById('carryingCapacityDiv');
    const globalValidationMessageCC = document.getElementById('globalValidationMessageCC');

    const tamegrassSingleForageProductionInput = document.getElementById('tamegrassSingleForageProductionInput');
    const annualForagesSingleForageProductionInput = document.getElementById('annualForagesSingleForageProductionInput');
    const singleGrossAcresInput = document.getElementById('singleGrossAcresInput');
    const singleHarvestEfficiencyInput = document.getElementById('singleHarvestEfficiencyInput');

    const totalProductionDisplay = document.getElementById('totalProductionDisplay');
    //const totalAvailableForageDisplay = document.getElementById('totalAvailableForageDisplay');
    const stockingRateTotalAumsDisplay = document.getElementById('stockingRateTotalAumsDisplay');
    const carryingCapacityTotalAumsDisplay = document.getElementById('carryingCapacityTotalAumsDisplay');
    const aumAcDisplay = document.getElementById('aumAcDisplay');
    const acAumDisplay = document.getElementById('acAumDisplay');

    const landResourceAreaSelect = document.getElementById('landResourceAreaSelect');
    const animalClassSelectCC = document.getElementById('animalClassSelectCC');

    // show definition popup
    DefinitionPopup();


    // zoom and pan the map
    MapZooming();

    // event listener for any selection change in carrying capacity calculator
    OnAnySelectionChange();

    // calculate carrying capacity when clicking on calculate button
    CarryingCapacityCalculation();

    // event listener for any input or selection change in carrying capacity calculator
    // show or hide calculate button and result division
    OnAnyInputOrSelectionChange(carryingCapacityDiv, carryingCapacityCalculateBtnDiv, carryingCapacityResultDiv);

    OnAnyCarryingCapacityInputChangeCC();

    // #endregion
});
// end of document ready


// #region SUB FUNCTIONS
//////////////////////////////SUB FUNCTIONS////////////////////////////////////////////////////////////

// #region Common Sub Functions
//////////////////////////////////////////COMMON SUB FUNCTIONS////////////////////////////////////////
// get the average value from a list
function CalculateAverage(numbers) {
    //if (numbers.length === 0) return 0;
    const total = numbers.reduce((sum, value) => sum + value, 0);
    return total / numbers.length;
}

// get the total value from a list
function CalculateSum(numbers) {
    //if (numbers.length === 0) return 0;
    return numbers.reduce((sum, value) => sum + value, 0);
}

// main navigation buttons click/switch
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

// sub function for main navigation buttons click/switch
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


function OnAnyInputOrSelectionChange(calculatorDivID, calculateBtnDivID, resultDivID) {
    calculatorDivID.addEventListener('input', function (event) {
        if (event.target.matches('input[type="number"], input[type="radio"], select')) {
            calculateBtnDivID.style.display = 'block';
            resultDivID.style.display = 'none';
        }
    });
}
// #endregion

// #region Sub Functions Forage Production Calculator
//////////////////////////////////SUB FUNCTIONS FOR FORAGE PRODUCTION CALCULATOR///////////////////////////////////////

// collect input values from sample net weight input boxes and return as a list
function GetValuesAsList(inputElement) {
    // Get the value from the input element
    const inputValue = inputElement.value;

    // Split the input value by commas, trim whitespace, and convert to numbers
    const valuesArray = inputValue.split(',').map(item => parseFloat(item.trim()));

    // Filter out NaN values and non-positive values (<= 0)
    const filteredValues = valuesArray.filter(item => !isNaN(item) && item > 0);

    // Return the filtered list of numbers
    return filteredValues;
}


// event listener for pasture type selection change
function OnPastureTypeChange() {
    const nonRangelandWeightDiv = document.getElementById('nonRangelandWeightDiv');
    const rangelandWeightDiv = document.getElementById('rangelandWeightDiv');
    const PlantAndStageSelectDiv = document.getElementById('PlantAndStageSelectDiv');
    document.querySelectorAll("input[name='pastureTypeRadio']").forEach(function (radio) {
        radio.addEventListener("change", function () {
            if (document.querySelector("input[name='pastureTypeRadio']:checked").value === 'rangelandRadio') {
                nonRangelandWeightDiv.style.display = 'none';
                rangelandWeightDiv.style.display = 'block';
                drywetFieldset.style.display = 'block';
                if (document.querySelector("input[name='drywetRadio']:checked").value === 'wetRadio') {
                    PlantAndStageSelectDiv.style.display = 'block';
                } else {
                    PlantAndStageSelectDiv.style.display = 'none';
                }
            }
            else if (document.querySelector("input[name='pastureTypeRadio']:checked").value === 'tamegrassRadio') {
                nonRangelandWeightDiv.style.display = 'block';
                rangelandWeightDiv.style.display = 'none';
                drywetFieldset.style.display = 'block';
                if (document.querySelector("input[name='drywetRadio']:checked").value === 'wetRadio') {
                    PlantAndStageSelectDiv.style.display = 'block';
                } else {
                    PlantAndStageSelectDiv.style.display = 'none';
                }
            }
            else {
                nonRangelandWeightDiv.style.display = 'block';
                rangelandWeightDiv.style.display = 'none';
                drywetFieldset.style.display = 'none';
                PlantAndStageSelectDiv.style.display = 'none';
            }
        });
    });
}

// event listener for dry/wet type selection change
function OnDryWetTypeChange() {
    const PlantAndStageSelectDiv = document.getElementById('PlantAndStageSelectDiv');
    document.querySelectorAll("input[name='drywetRadio']").forEach(function (radio) {
        radio.addEventListener("change", function () {
            if (document.querySelector("input[name='drywetRadio']:checked").value === 'wetRadio') {
                PlantAndStageSelectDiv.style.display = 'block';
            } else {
                PlantAndStageSelectDiv.style.display = 'none';
            }
        });
    });
}


// event listener for any input change
function OnAnyInputChangeForageProduction() {
    const forageProductionDiv = document.getElementById('forageProductionDiv');
    forageProductionDiv.addEventListener('input', function (event) {
        if (event.target.matches('input[type="number"], input[type="radio"], input[type="text"], select')) {
            rangelandResultDiv.style.display = 'none';
            nonRangelandResultDiv.style.display = 'none';
            forageProductionCalculateBtnDiv.style.display = 'block';
        }
    });
}


function OnClearButtonClickForageProduction(inputID, clearButtonId) {
    clearButtonId.addEventListener('click', () => {
        inputID.value = '';
        inputID.focus();
        rangelandResultDiv.style.display = 'none';
        nonRangelandResultDiv.style.display = 'none';
        forageProductionCalculateBtnDiv.style.display = 'block';
    });
}


function OnNRSampleWeightsInputClear() {
    const inputID = document.getElementById('nonRangelandSampleWeightInput');
    const clearButtonId = document.getElementById('clearNRSampleWeightInputButton');
    OnClearButtonClickForageProduction(inputID, clearButtonId);
}


function OnRangelandSampleWeightsInputClear() {
    const types1 = GetLandTypes();
    const types2 = GetLandTypes2();
    for (let i = 0; i < types1.length; i++) {
        const inputID = document.getElementById(types1[i] + 'SampleWeightInput');
        const clearButtonId = document.getElementById('clear' + types2[i] + 'SampleWeightButton');
        OnClearButtonClickForageProduction(inputID, clearButtonId);
    }
}


// get percent air dry matter
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

// calculate forage production when the form is submitted
function ForageProductionCalculation() {
    //const conversionRates = [50, 8.92];
    const conversionRate = 50;

    const nonRangelandSampleWeightInput = document.getElementById('nonRangelandSampleWeightInput');
    const nonRangelandResultDisplay = document.getElementById('nonRangelandResultDisplay');
    const forageProductionCalculateBtn = document.getElementById('forageProductionCalculateBtn');

    const landTypes = GetLandTypes();
    var rangelandResultList = [];

    forageProductionCalculateBtn.addEventListener('click', function (event) {
        event.preventDefault();

        var result = 0; //non-rangeland result

        rangelandResultList = [];

        forageProductionCalculateBtnDiv.style.display = 'none';

        if (document.querySelector("input[name='pastureTypeRadio']:checked").value === 'rangelandRadio') {// rangeland
            //conversionRate = conversionRates[0];
            if (document.querySelector("input[name='drywetRadio']:checked").value === 'wetRadio') {
                let r = 0;
                for (let i = 0; i < landTypes.length; i++) {
                    r = GetWetSampleFinalForageProduction(GetValuesAsList(document.getElementById(landTypes[i] + 'SampleWeightInput')), conversionRate, GetPercentAirDryMatter());
                    if (r === NaN) r = 0;
                    rangelandResultList.push(r);
                }
            }
            else {
                let r = 0;
                for (let i = 0; i < landTypes.length; i++) {
                    r = GetDrySampleFinalForageProduction(GetValuesAsList(document.getElementById(landTypes[i] + 'SampleWeightInput')), conversionRate);
                    if (r === NaN) r = 0;
                    rangelandResultList.push(r);
                }
            }

            rangelandResultDiv.style.display = 'block';
            nonRangelandResultDiv.style.display = 'none';

            let total = 0;
            for (let i = 0; i < landTypes.length; i++) {
                let r = rangelandResultList[i];
                if (r === NaN) r = 0;
                total += r;

                document.getElementById(landTypes[i] + 'ResultDisplayFP').innerHTML = r.toFixed(0);

                document.getElementById(landTypes[i] + "ForageProductionInput").value = r.toFixed(0);
            }
            document.getElementById('totalResultDisplayFP').innerHTML = total.toFixed(0);
        }
        else if (document.querySelector("input[name='pastureTypeRadio']:checked").value === 'tamegrassRadio') {// tame grass
            if (document.querySelector("input[name='drywetRadio']:checked").value === 'wetRadio') {// tame grass with wet sample weight
                result = GetWetSampleFinalForageProduction(GetValuesAsList(nonRangelandSampleWeightInput), conversionRate, GetPercentAirDryMatter());
            }
            else {// tame grass with dry sample weight
                result = GetDrySampleFinalForageProduction(GetValuesAsList(nonRangelandSampleWeightInput), conversionRate);
            }
            rangelandResultDiv.style.display = 'none';
            nonRangelandResultDiv.style.display = 'block';
            nonRangelandResultDisplay.value = result.toFixed(0);
            document.getElementById('tamegrassSingleForageProductionInput').value = result.toFixed(0);
        }
        else {// annual forages
            result = GetDrySampleFinalForageProduction(GetValuesAsList(nonRangelandSampleWeightInput), conversionRate);
            nonRangelandResultDisplay.value = result.toFixed(0);
            document.getElementById('annualForagesSingleForageProductionInput').value = result.toFixed(0);
            rangelandResultDiv.style.display = 'none';
            nonRangelandResultDiv.style.display = 'block';
        }
    });
}
// #endregion

// #region Sub Functions of Stocking Rate Calculator
////////////////////////////////////////SUB FUNCTIONS FOR STOCKING RATE CALCULATOR//////////////////////////////////////////////////////////////

// get the number of animal classes user selected
function GetAnimalClassQuantity() {
    // Get the select element by its ID
    const selectElement = document.getElementById("animalClassNumberSelect");

    // Get the selected index
    const selectedIndex = selectElement.selectedIndex;

    // Return the selected index + 1
    return selectedIndex + 1;
}

// dynamically add html content for animal class selection, number of head input, and number of month input based on specified number of animal classes
function DynamicallyGenerateAnimalClassHeadMonthFieldsets() {
    document.getElementById("animalClassNumberSelect").addEventListener('change', function () {
        globalValidationMessageSR.innerHTML = '';
        var number = GetAnimalClassQuantity();
        var i = 0;
        // Select the container where the fieldsets will be inserted
        const container = document.getElementById('dynamicAnimalClassesContainer');

        // Clear any existing content
        container.innerHTML = '';

        // Define the HTML template for each fieldset
        const animalClassListHtml = `
        <fieldset>
            <legend>Select or Enter Animal (Class ##INDEX#) Info</legend>
            <label>Animal Class ##INDEX#</label>
            <select name="animalClassSelect_#INDEX#" id="animalClassSelect_#INDEX#">
                <option value="1">1,000-lb. cow, dry</option>
                <option value="2">1,000-lb. cow, with calf</option>
                <option value="3">1,100-lb. cow, with calf</option>
                <option value="4">1,200-lb. cow, with calf</option>
                <option value="5">1,300-lb. cow, with calf</option>
                <option value="6">1,400-lb. cow, with calf</option>
                <option value="7">1,500-lb. cow, with calf</option>
                <option value="8">Cattle bull, mature</option>
                <option value="9">Weaned calves to yearling</option>
                <option value="10">Yearling cattle (600-800 lb.)</option>
                <option value="11">Two-year-old cattle (800-1,000 lb.)</option>
                <option value="12">Bison cow, mature</option>
                <option value="13">Bison bull, mature</option>
                <option value="14">Horse, mature</option>
                <option value="15">Sheep, dry ewe</option>
                <option value="16">Sheep, mature with lamb</option>
                <option value="17">Sheep ram</option>
                <option value="18">Goat, mature</option>
                <option value="19">Deer, white-tailed, mature</option>
                <option value="20">Deer, mule, mature</option>
                <option value="21">Elk, mature</option>
                <option value="22">Antelope, mature</option>
                <option value="23">Sheep, bighorn, mature</option>
                <option value="24">Jackrabbit, white-tailed</option>
                <option value="25">Prairie dog</option>
            </select>
            <br><br>
            <div class="row">
              <div class="col-md-6">
            <label>Number of Head</label>
                <div class="center-div clearable">
            <input required type="number" name="headNumber#INDEX#" id="headNumber#INDEX#" value="1" min="1" 
            placeholder="enter a positive number" class="form-control"/>
            <button type="button" class="clear-button" id="clearHeadNumber#INDEX#Button">x</button>
                </div>
            <div id="headNumber#INDEX#InputError" class="validation-message"></div>
              </div>
            <div class="col-md-6">
            <label>Number of Month</label>
            <div class="center-div clearable">
            <input required type="number" name="monthNumber#INDEX#" id="monthNumber#INDEX#" value="1" min="1" 
            placeholder="enter a positive number" class="form-control"/>
            <button type="button" class="clear-button" id="clearMonthNumber#INDEX#Button">x</button>
            </div>
            <div id="monthNumber#INDEX#InputError" class="validation-message"></div>
            </div>
            </div>
        </fieldset>
        <br>
    `;

        // Generate and append fieldsets
        for (let i = 1; i <= number; i++) {
            let fieldset = animalClassListHtml
                .replace(/#INDEX#/g, i); // Replace placeholders with the current index
            container.innerHTML += fieldset;
        }

        // check if there is error in user input in the dynamically generated animal class section and display error message
        OnAnyStockingRateInputChange();
    })
}

// get the default array of animal unit equivalent
function GetAueArray() {
    // animal unit equivalent (AUE)
    return [
        0.92, // 1,000-lb. cow, dry
        1.00, // 1,000-lb. cow, with calf
        1.07, // 1,100-lb. cow, with calf
        1.15, // 1,200-lb. cow, with calf
        1.22, // 1,300-lb. cow, with calf
        1.29, // 1,400-lb. cow, with calf
        1.35, // 1,500-lb. cow, with calf
        1.40, // Cattle bull, mature
        0.60, // Weaned calves to yearling
        0.70, // Yearling cattle (600-800 lb.)
        0.90, // Two-year-old cattle (800-1,000 lb.)
        1.00, // Bison cow, mature
        1.50, // Bison bull, mature
        1.25, // Horse, mature
        0.15, // Sheep, dry
        0.20, // Sheep, mature with lamb
        0.25, // Sheep ram
        0.15, // Goat, mature
        0.15, // Deer, white-tailed, mature
        0.20, // Deer, mule, mature
        0.60, // Elk, mature
        0.20, // Antelope, mature
        0.20, // Sheep, bighorn, mature
        0.02, // Jackrabbit, white-tailed
        0.004 // Prairie dog
    ];
}

// when any numerical input of stocking rate is changed, check if there is any error
// show or hide each individual error message
function OnAnyStockingRateInputChange() {
    var number = GetAnimalClassQuantity();
    for (let i = 1; i <= number; i++) {
        const inputID = document.getElementById("headNumber" + i);
        const errorMessageId = document.getElementById("headNumber" + i + "InputError");
        const clearButtonId = document.getElementById("clearHeadNumber" + i + "Button");
        OnSingleInputChangeCC(inputID, errorMessageId, clearButtonId, false, 'SR');

        const inputID2 = document.getElementById("monthNumber" + i);
        const errorMessageId2 = document.getElementById("monthNumber" + i + "InputError");
        const clearButtonId2 = document.getElementById("clearMonthNumber" + i + "Button");
        OnSingleInputChangeCC(inputID2, errorMessageId2, clearButtonId2, false, 'SR');
    }
}


// check if there is any error in user input in order to show or hide the global error message 
// and to determine if the calculate proceeds
function ValidateStockingRateInput() {
    var number = GetAnimalClassQuantity();
    for (let i = 1; i <= number; i++) {
        const inputID = document.getElementById("headNumber" + i);
        const errorMessageId = document.getElementById("headNumber" + i + "InputError");
        const clearButtonId = document.getElementById("clearHeadNumber" + i + "Button");
        if (CheckSingleInputErrorZero(inputID, false)) {
            return false;
        }
        const inputID2 = document.getElementById("monthNumber" + i);
        const errorMessageId2 = document.getElementById("monthNumber" + i + "InputError");
        const clearButtonId2 = document.getElementById("clearMonthNumber" + i + "Button");
        if (CheckSingleInputErrorZero(inputID2, false)) {
            return false;
        }
    }
    return true;
}

// calculate stocking rate when clicking on calculate button
function StockingRateCalculation() {
    const globalValidationMessageSR = document.getElementById("globalValidationMessageSR");
    const msg = "Please fix the highlighted errors above before proceeding.";

    document.getElementById("stockingRateCalculateBtn").addEventListener('click', function () {
        if (ValidateStockingRateInput()) {
            stockingRateCalculateBtnDiv.style.display = 'none';
            stockingRateResultDiv.style.display = 'block';
            let animalClassQuantiy = GetAnimalClassQuantity();
            let headNumberID = '';
            let monthNumberID = '';
            let headNumber = 0;
            let monthNumber = 0;
            let animalClassIndex = 0;
            let aue = 1;
            let aum = 0;
            let totalAum = 0;
            let aueaum = 0;
            let averageAue = 1;
            for (let i = 1; i <= animalClassQuantiy; i++) {
                headNumberID = 'headNumber' + i;
                monthNumberID = 'monthNumber' + i;
                headNumber = document.getElementById(headNumberID).value;
                monthNumber = document.getElementById(monthNumberID).value;
                animalClassIndex = document.getElementById('animalClassSelect_' + i).value;
                aue = GetAueArray()[animalClassIndex - 1];
                aum = aue * headNumber * monthNumber;
                totalAum += aum;
                aueaum += aue * aum;
            }
            averageAue = aueaum / totalAum;

            const totalAumInput = document.getElementById('totalAumInput');// total AUMs from stocking rate calculation
            totalAumInput.value = totalAum.toFixed(2);
            document.getElementById('averageAueInput').value = averageAue.toFixed(2);

            //send total AUMs from stocking rate calculator to carrying capacity calculator results display
            stockingRateTotalAumsDisplay.value = totalAum.toFixed(2);

        }
        else { globalValidationMessageSR.innerHTML = msg; }
    })
}
// #endregion

// #region Sub Functions Carrying Capacity Calculator
////////////////////////////////////////SUB FUNCTIONS FOR CARRYING CAPACITY CALCULATOR///////////////////////////////

// event listeners for displaying full-screen map and zooming map
function MapZooming() {
    // Open full-screen map
    document.getElementById("landResourceAreasImg").addEventListener("click", function () {
        document.getElementById("fullScreenMap").style.display = "flex";
    });

    // Close full-screen map
    document.getElementById("closeMapButton").addEventListener("click", function () {
        document.getElementById("fullScreenMap").style.display = "none";
    });


    // Full-screen map and zooming and panning
    const mapImage = document.getElementById("fullScreenMapImg");
    let scale = 1;
    let posX = 0;
    let posY = 0;
    let isDragging = false;
    let startX, startY;

    // Zoom using mouse wheel
    mapImage.addEventListener("wheel", (e) => {
        e.preventDefault();
        scale += e.deltaY * -0.001;
        scale = Math.min(Math.max(1, scale), 3); // Limits zoom between 1x and 3x
        mapImage.style.transform = `scale(${scale}) translate(${posX}px, ${posY}px)`;
    });

    // Touch gestures for zooming (pinch) and panning
    let lastDistance = null;
    mapImage.addEventListener("touchmove", (e) => {
        if (e.touches.length === 2) {
            // Pinch to zoom
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const currentDistance = Math.hypot(touch2.pageX - touch1.pageX, touch2.pageY - touch1.pageY);

            if (lastDistance) {
                const zoomFactor = currentDistance / lastDistance;
                scale = Math.min(Math.max(1, scale * zoomFactor), 3); // Keep within zoom limits
                mapImage.style.transform = `scale(${scale}) translate(${posX}px, ${posY}px)`;
            }
            lastDistance = currentDistance;
        }
    });

    mapImage.addEventListener("touchend", () => {
        lastDistance = null;
    });


    // Pan map image by dragging (for both mouse and touch)
    mapImage.addEventListener("mousedown", (e) => {
        isDragging = true;
        startX = e.clientX - posX;
        startY = e.clientY - posY;
        mapImage.style.cursor = "grabbing";
    });

    mapImage.addEventListener("mousemove", (e) => {
        if (isDragging) {
            posX = e.clientX - startX;
            posY = e.clientY - startY;
            mapImage.style.transform = `scale(${scale}) translate(${posX}px, ${posY}px)`;
        }
    });

    mapImage.addEventListener("mouseup", () => {
        isDragging = false;
        mapImage.style.cursor = "grab";
    });

    mapImage.addEventListener("mouseleave", () => {
        isDragging = false;
        mapImage.style.cursor = "grab";
    });

    // Pan map image on touch devices
    mapImage.addEventListener("touchstart", (e) => {
        if (e.touches.length === 1) {
            isDragging = true;
            startX = e.touches[0].pageX - posX;
            startY = e.touches[0].pageY - posY;
        }
    });

    mapImage.addEventListener("touchmove", (e) => {
        if (isDragging && e.touches.length === 1) {
            posX = e.touches[0].pageX - startX;
            posY = e.touches[0].pageY - startY;
            mapImage.style.transform = `scale(${scale}) translate(${posX}px, ${posY}px)`;
        }
    });

    mapImage.addEventListener("touchend", () => {
        isDragging = false;
    });
}

// event listener for any selection change
function OnAnySelectionChange() {
    const tamegrassSingleForageProductionDiv = document.getElementById('tamegrassSingleForageProductionDiv');
    const annualForagesSingleForageProductionDiv = document.getElementById('annualForagesSingleForageProductionDiv');

    const grossAcresDiv = document.getElementById('grossAcresDiv');
    const singleHarvestEfficiencyDiv = document.getElementById('singleHarvestEfficiencyDiv');
    const carryingCapacityCalculateMethodDiv = document.getElementById('carryingCapacityCalculateMethodDiv');
    const actualRelativeProductionValuesDiv = document.getElementById('actualRelativeProductionValuesDiv');
    const multiAcresDiv = document.getElementById('multiAcresDiv');
    const landResourceAreaSelectDiv = document.getElementById('landResourceAreaSelectDiv');

    document.querySelectorAll("input[name='carryingCapacityCalculateMethodRadio']").forEach(function (radio) {
        radio.addEventListener("change", function () {

            const landTypes = GetLandTypes();
            const n = landTypes.length;
            for (let i = 0; i < n; i++) {
                const harvestEfficiencyInput = document.getElementById(landTypes[i] + "HarvestEfficiencyInput");
                const harvestEfficiencyInputError = document.getElementById(landTypes[i] + "HarvestEfficiencyInputError");

                CheckAndResetSingleHarvestEfficiencyInputError(harvestEfficiencyInput, harvestEfficiencyInputError, true, 40);
            }

            let cccm = document.querySelector("input[name='carryingCapacityCalculateMethodRadio']:checked").value;
            // using estimated stocking rates
            if (cccm === 'estimatedStockingRatesRadio') {
                actualRelativeProductionValuesDiv.style.display = 'none';
                landResourceAreaSelectDiv.style.display = 'block';

                FreezeHarvestEfficiencyInputs();
            }
            // uisng estimated relative production values
            else if (cccm === 'estimatedRelativeProductionValuesRadio') {
                landResourceAreaSelectDiv.style.display = 'block';
                actualRelativeProductionValuesDiv.style.display = 'none';

                UnfreezeHarvestEfficiencyInputs();
            }
            else {// using actual or custom forage production values
                landResourceAreaSelectDiv.style.display = 'none';
                actualRelativeProductionValuesDiv.style.display = 'block';

                UnfreezeHarvestEfficiencyInputs();
            }
        });
    });

    document.querySelectorAll("input[name='pastureTypeRadioCC']").forEach(function (radio) {
        radio.addEventListener("change", function () {
            let pt = document.querySelector("input[name='pastureTypeRadioCC']:checked").value;
            if (pt === 'rangeRadioCC') {
                carryingCapacityCalculateMethodDiv.style.display = 'block';
                multiAcresDiv.style.display = 'block';
                tamegrassSingleForageProductionDiv.style.display = 'none';
                annualForagesSingleForageProductionDiv.style.display = 'none';
                landResourceAreaSelectDiv.style.display = 'block';
                singleHarvestEfficiencyDiv.style.display = 'none';
                grossAcresDiv.style.display = 'none';
                actualRelativeProductionValuesDiv.style.display = 'none';

                let cccm = document.querySelector("input[name='carryingCapacityCalculateMethodRadio']:checked").value;
                if (cccm === 'actualProductionValuesRadio') {
                    landResourceAreaSelectDiv.style.display = 'none';
                    actualRelativeProductionValuesDiv.style.display = 'block';

                    UnfreezeHarvestEfficiencyInputs();
                }
                else {
                    landResourceAreaSelectDiv.style.display = 'block';
                    actualRelativeProductionValuesDiv.style.display = 'none';
                    if (cccm === 'estimatedStockingRatesRadio') {
                        FreezeHarvestEfficiencyInputs();
                    }
                    else {
                        UnfreezeHarvestEfficiencyInputs();
                    }
                }
            }
            else {
                if (pt === 'tamegrassRadioCC') {
                    tamegrassSingleForageProductionDiv.style.display = 'block';
                    annualForagesSingleForageProductionDiv.style.display = 'none';
                }
                else {
                    tamegrassSingleForageProductionDiv.style.display = 'none';
                    annualForagesSingleForageProductionDiv.style.display = 'block';
                }
                grossAcresDiv.style.display = 'block';
                singleHarvestEfficiencyDiv.style.display = 'block';
                carryingCapacityCalculateMethodDiv.style.display = 'None';
                actualRelativeProductionValuesDiv.style.display = 'None';
                multiAcresDiv.style.display = 'None';
                landResourceAreaSelectDiv.style.display = 'None';
            }
        });
    });
}

function GetTamegrassTotalForageProduction() {
    return parseFloat(tamegrassSingleForageProductionInput.value);
}

function GetAnnualForagesTotalForageProduction() {
    return parseFloat(annualForagesSingleForageProductionInput.value);
}


function CheckSingleInputErrorZero(inputElement, includingZero) {
    let hasError = false;
    let v = parseFloat(inputElement.value);
    if (includingZero) {
        if (isNaN(v) || v < 0) {
            hasError = true;
        }
    }
    else {
        if (isNaN(v) || v <= 0) {
            hasError = true;
        }
    }
    return hasError;
}


// read single harvest efficiency value from text box
function GetSingleHarvestEfficiency() {
    return parseFloat(singleHarvestEfficiencyInput.value) / 100;
}


function CheckSingleHarvestEfficiencyInputError(inputElement, includingZero, topValue) {
    let hasError = false;
    let v = parseFloat(inputElement.value);
    if (includingZero) {
        if (isNaN(v) || (v < 0) || (v > topValue)) {
            hasError = true;
        }
    }
    else {
        if (isNaN(v) || (v <= 0) || (v > topValue)) {
            hasError = true;
        }
    }
    return hasError;
}


// read single gross acres value from text box
function GetSingleGrossAcres() {
    return singleGrossAcresInput.valueAsNumber;
}


// display definition popups
function DefinitionPopup() {
    const icons = document.querySelectorAll('.definition-icon');

    icons.forEach(icon => {
        icon.addEventListener('click', () => {
            const popup = icon.nextElementSibling;
            popup.style.display = popup.style.display === 'block' ? 'none' : 'block';

        });
    });

    // Optional: Close popups when tapping outside
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.definition-container')) {
            document.querySelectorAll('.definition-popup').forEach(popup => {
                popup.style.display = 'none';
            });
        }
    });
}


function CheckAndResetSingleHarvestEfficiencyInputError(inputID, errorMessageId, includingZero, topValue) {
    const includingZeroErrorMsgCC = "Please enter a nonnegative number less than " + topValue + ".";
    const excludingZeroErrorMsgCC = "Please enter a positive number no more than " + topValue + ".";

    // Reset the validation message
    errorMessageId.textContent = '';
    globalValidationMessageCC.textContent = '';

    // Validate the input value
    hasError = CheckSingleHarvestEfficiencyInputError(inputID, includingZero, topValue);
    if (hasError) {
        if (includingZero) {
            errorMessageId.textContent = includingZeroErrorMsgCC;
        }
        else {
            errorMessageId.textContent = excludingZeroErrorMsgCC;
        }
    }
}


function OnSingleHarvestEfficiencyInputChangeCC(inputID, errorMessageId, clearButtonId, includingZero, topValue) {
    const includingZeroErrorMsgCC = "Please enter a nonnegative number less than " + topValue + ".";
    const excludingZeroErrorMsgCC = "Please enter a positive number no more than " + topValue + ".";

    inputID.addEventListener('input', () => {
        // Reset the validation message
        errorMessageId.textContent = '';
        globalValidationMessageCC.textContent = '';

        // Validate the input value
        hasError = CheckSingleHarvestEfficiencyInputError(inputID, includingZero, topValue);
        if (hasError) {
            if (includingZero) {
                errorMessageId.textContent = includingZeroErrorMsgCC;
            }
            else {
                errorMessageId.textContent = excludingZeroErrorMsgCC;
            }
        }
    });

    clearButtonId.addEventListener('click', () => {
        inputID.value = '';
        inputID.focus();
        carryingCapacityResultDiv.style.display = 'none';
        carryingCapacityCalculateBtnDiv.style.display = 'block';
        globalValidationMessageCC.textContent = '';
        if (includingZero) {
            errorMessageId.textContent = includingZeroErrorMsgCC;
        }
        else {
            errorMessageId.textContent = excludingZeroErrorMsgCC;
        }
    });
}

function OnSingleInputChangeCC(inputID, errorMessageId, clearButtonId, includingZero, ccsr) {
    const includingZeroErrorMsgCC = "Please enter a number greater than or equal to 0.";
    const excludingZeroErrorMsgCC = "Please enter a positive number.";

    inputID.addEventListener('input', () => {
        // Reset the validation message
        errorMessageId.textContent = '';

        if (ccsr === 'CC') {
            globalValidationMessageCC.textContent = '';
        }
        else {
            globalValidationMessageSR.textContent = '';
        }

        // Validate the input value
        hasError = CheckSingleInputErrorZero(inputID, includingZero);
        if (hasError) {
            if (includingZero) {
                errorMessageId.textContent = includingZeroErrorMsgCC;
            }
            else {
                errorMessageId.textContent = excludingZeroErrorMsgCC;
            }
        }
    });

    clearButtonId.addEventListener('click', () => {
        inputID.value = '';
        inputID.focus();
        carryingCapacityResultDiv.style.display = 'none';
        carryingCapacityCalculateBtnDiv.style.display = 'block';
        globalValidationMessageCC.textContent = '';
        if (includingZero) {
            errorMessageId.textContent = includingZeroErrorMsgCC;
        }
        else {
            errorMessageId.textContent = excludingZeroErrorMsgCC;
        }
    });
}


function OnAnyCarryingCapacityInputChangeCC() {
    //const [landTypesArrayOne, landTypesArrayTwo] = GetLandTypeArrays();
    landTypesArrayOne = GetLandTypes();
    landTypesArrayTwo = GetLandTypes2();
    const n = landTypesArrayOne.length;
    let topValue = 40;
    let tf = true;
    for (let i = 0; i < n; i++) {
        //tf = i === 0 ? false : true;

        const harvestEfficiencyInput = document.getElementById(landTypesArrayOne[i] + "HarvestEfficiencyInput");
        const harvestEfficiencyInputError = document.getElementById(landTypesArrayOne[i] + "HarvestEfficiencyInputError");
        const clearHarvestEfficiencyButton = document.getElementById('clear' + landTypesArrayTwo[i] + 'HarvestEfficiencyButton');
        OnSingleHarvestEfficiencyInputChangeCC(harvestEfficiencyInput, harvestEfficiencyInputError, clearHarvestEfficiencyButton, tf, topValue);

        const forageProductionInput = document.getElementById(landTypesArrayOne[i] + "ForageProductionInput");
        const forageProductionInputError = document.getElementById(landTypesArrayOne[i] + "ForageProductionInputError");
        const clearForageProductionButton = document.getElementById('clear' + landTypesArrayTwo[i] + 'ForageProductionButton');
        OnSingleInputChangeCC(forageProductionInput, forageProductionInputError, clearForageProductionButton, tf, 'CC');

        const grossAcresInput = document.getElementById(landTypesArrayOne[i] + "GrossAcresInput");
        const grossAcresInputError = document.getElementById(landTypesArrayOne[i] + "GrossAcresInputError");
        const clearGrossAcresButton = document.getElementById('clear' + landTypesArrayTwo[i] + 'GrossAcresButton');
        OnSingleInputChangeCC(grossAcresInput, grossAcresInputError, clearGrossAcresButton, tf, 'CC');
    }

    let topValue2 = 50;
    let tf2 = false;
    const singleHarvestEfficiencyInput = document.getElementById("singleHarvestEfficiencyInput");
    const singleHarvestEfficiencyInputError = document.getElementById("singleHarvestEfficiencyInputError");
    const clearSingleHarvestEfficiencyButton = document.getElementById('clearSingleHarvestEfficiencyButton');
    OnSingleHarvestEfficiencyInputChangeCC(singleHarvestEfficiencyInput, singleHarvestEfficiencyInputError, clearSingleHarvestEfficiencyButton, tf2, topValue2);

    const tamegrassSingleForageProductionInput = document.getElementById("tamegrassSingleForageProductionInput");
    const tamegrassSingleForageProductionInputError = document.getElementById("tamegrassSingleForageProductionInputError");
    const clearTamegrassSingleForageProductionButton = document.getElementById('clearTamegrassSingleForageProductionButton');
    OnSingleInputChangeCC(tamegrassSingleForageProductionInput, tamegrassSingleForageProductionInputError, clearTamegrassSingleForageProductionButton, tf2, 'CC');

    const annualForagesSingleForageProductionInput = document.getElementById("annualForagesSingleForageProductionInput");
    const annualForagesSingleForageProductionInputError = document.getElementById("annualForagesSingleForageProductionInputError");
    const clearAnnualForagesSingleForageProductionButton = document.getElementById('clearAnnualForagesSingleForageProductionButton');
    OnSingleInputChangeCC(annualForagesSingleForageProductionInput, annualForagesSingleForageProductionInputError, clearAnnualForagesSingleForageProductionButton, tf2, 'CC');

    const singleGrossAcresInput = document.getElementById("singleGrossAcresInput");
    const singleGrossAcresInputError = document.getElementById("singleGrossAcresInputError");
    const clearSingleGrossAcresButton = document.getElementById('clearSingleGrossAcresButton');
    OnSingleInputChangeCC(singleGrossAcresInput, singleGrossAcresInputError, clearSingleGrossAcresButton, tf2, 'CC');
}


function CheckHarvestEfficiencyInputCollectionError() {
    const landTypes = GetLandTypes();
    for (let i = 0; i < landTypes.length; i++) {
        const inputID = document.getElementById(landTypes[i] + "HarvestEfficiencyInput");
        if (CheckSingleHarvestEfficiencyInputError(inputID, true, 40)) {
            return true;
        }
    }
    return false;
}


function CheckForageProductionInputCollectionError() {
    const landTypes = GetLandTypes();
    for (let i = 0; i < landTypes.length; i++) {
        const inputID = document.getElementById(landTypes[i] + "ForageProductionInput");
        if (CheckSingleInputErrorZero(inputID, true)) {
            return true;
        }
    }
    return false;
}



function CheckGrossAcresInputCollectionError() {
    const landTypes = GetLandTypes();
    for (let i = 0; i < landTypes.length; i++) {
        const inputID = document.getElementById(landTypes[i] + "GrossAcresInput");
        if (CheckSingleInputErrorZero(inputID, true)) {
            return true;
        }
    }
    return false;
}

// get the array of estimated rpv for each land type based on selected land resource area
function GetEstimatedRPVArray(n) {
    // Use for rangeland and tame grass pastures
    // Estimated stocking rate guide using relative production values (RPV; lb/ac) and multiple land resource areas (MLRA) for reference plant communities
    // associated with each vegetation type/ecological site (modified from USDA 2014 relative forage production values by ecological sites).
    const estimatedRPVArray = [
        // upland loamy, upland sandy, upland clayey, upland shallow, upland very shallow, lowland overflow, lowland wet meadow
        [2400, 2500, 2300, 2200, 1100, 3500, 4500], // 53A&53B
        [2400, 2400, 2100, 1330, 800, 3200, 4250], // 54
        [2800, 2800, 2600, 2100, 1350, 3800, 4600], // 55A&55B
        [2850, 2850, 2700, 2150, 1050, 3800, 4500], // 56
        [2100, 2000, 1900, 1300, 800, 2650, 4000], // 58C&58D
    ];
    return estimatedRPVArray[n];
}


function GetEstimatedAumAcArray(n) {
    // Use for rangeland only
    const estimatedAumAcArray = [
        // upland loamy, upland sandy, upland clayey, upland shallow, upland very shallow, lowland overflow, lowland wet meadow
        [0.66, 0.68, 0.63, 0.60, 0.30, 0.96, 0.60], // 53A&53B
        [0.66, 0.66, 0.57, 0.38, 0.24, 0.87, 0.60], // 54
        [0.71, 0.77, 0.66, 0.52, 0.37, 1.01, 0.60], // 55A&55B
        [0.85, 0.85, 0.82, 0.60, 0.43, 1.15, 0.70], // 56
        [0.57, 0.55, 0.52, 0.36, 0.22, 0.57, 0.60], // 58C&58D
    ];
    return estimatedAumAcArray[n];
}


function GetGrossAcresInputArrayValues() {
    const landTypes = GetLandTypes();
    let grossAcres = [];
    for (let i = 0; i < landTypes.length; i++) {
        const grossAcresInput = document.getElementById(landTypes[i] + "GrossAcresInput");
        grossAcres.push(parseFloat(grossAcresInput.value));
    }
    return grossAcres;
}

function GetTotalAcres() {
    let totalAcres = 0;
    const landTypes = GetLandTypes();
    for (let i = 0; i < landTypes.length; i++) {
        const grossAcresInput = document.getElementById(landTypes[i] + "GrossAcresInput");
        totalAcres += parseFloat(grossAcresInput.value);
    }
    return totalAcres;
}


function GetLandTypes() {
    return ["uplandLoamy", "uplandSandy", "uplandClayey", "uplandShallow", "uplandVeryShallow", "lowlandOverflow", "lowlandWetMeadow"];
}


function GetLandTypes2() {
    return ["UplandLoamy", "UplandSandy", "UplandClayey", "UplandShallow", "UplandVeryShallow", "LowlandOverflow", "LowlandWetMeadow"];
}

function FreezeHarvestEfficiencyInputs() {
    const landTypes = GetLandTypes();
    const landTypes2 = GetLandTypes2();
    const n = landTypes.length;
    for (let i = 0; i < n; i++) {
        let harvestEfficiencyInput = document.getElementById(landTypes[i] + "HarvestEfficiencyInput");
        harvestEfficiencyInput.value = i === n - 1 ? 12.5 : 25;
        harvestEfficiencyInput.readOnly = true;
        let clearHarvestEfficiencyButton = document.getElementById('clear' + landTypes2[i] + 'HarvestEfficiencyButton');
        clearHarvestEfficiencyButton.style.display = 'none';
        let harvestEfficiencyInputError = document.getElementById(landTypes[i] + "HarvestEfficiencyInputError");
        harvestEfficiencyInputError.style.display = 'none';
    }
}


function UnfreezeHarvestEfficiencyInputs() {
    const landTypes = GetLandTypes();
    const landTypes2 = GetLandTypes2();
    for (let i = 0; i < landTypes.length; i++) {
        let harvestEfficiencyInput = document.getElementById(landTypes[i] + "HarvestEfficiencyInput");
        harvestEfficiencyInput.readOnly = false;
        let clearHarvestEfficiencyButton = document.getElementById('clear' + landTypes2[i] + 'HarvestEfficiencyButton');
        clearHarvestEfficiencyButton.style.display = 'inline-block';
        let harvestEfficiencyInputError = document.getElementById(landTypes[i] + "HarvestEfficiencyInputError");
        harvestEfficiencyInputError.style.display = 'inline-block';
    }
}


function GetForageProductionInputArrayValues() {
    let forageProduction = [];
    const landTypes = GetLandTypes();
    for (let i = 0; i < landTypes.length; i++) {
        const forageProductionInput = document.getElementById(landTypes[i] + "ForageProductionInput");
        forageProduction.push(parseFloat(forageProductionInput.value));
    }
    return forageProduction;
}


// get the values of harvest efficiency for each land type
function GetHarvestEfficiencyInputArrayValues() {
    let harvestEfficiency = [];
    const landTypes = GetLandTypes();
    for (let i = 0; i < landTypes.length; i++) {
        const harvestEfficiencyInput = document.getElementById(landTypes[i] + "HarvestEfficiencyInput");
        harvestEfficiency.push(parseFloat(harvestEfficiencyInput.value) / 100);
    }
    return harvestEfficiency;
}


function GetTotalAUMsUsingRPV(rpv) {
    let grossAcresValues = GetGrossAcresInputArrayValues();
    let harvestEfficiencyValues = GetHarvestEfficiencyInputArrayValues();

    let totalAvailableForage = 0;
    for (let i = 0; i < grossAcresValues.length; i++) {
        totalAvailableForage += grossAcresValues[i] * rpv[i] * harvestEfficiencyValues[i];
    }

    return totalAvailableForage / 913.0;
}


function GetTotalAUMsUsingEstimatedAumAc() {
    let grossAcresValues = GetGrossAcresInputArrayValues();
    let harvestEfficiencyValues = GetHarvestEfficiencyInputArrayValues();
    let estimatedAumAcArray = GetEstimatedAumAcArray(landResourceAreaSelect.selectedIndex);

    let totalAUMs = 0;
    for (let i = 0; i < grossAcresValues.length; i++) {
        totalAUMs += grossAcresValues[i] * estimatedAumAcArray[i] * harvestEfficiencyValues[i] / 0.25;
    }
    return totalAUMs;
}


// hide or don't display carrying capacity calculator results and remind the user to fix any errors when any errors occur
function HideResultsDivs() {
    globalValidationMessageCC.textContent = 'Please fix the errors in the highlighted fields before proceeding.';
    carryingCapacityResultDiv.style.display = 'none';
    carryingCapacityCalculateBtnDiv.style.display = 'block';
}

function ShowResultsDivs() {
    globalValidationMessageCC.textContent = '';
    carryingCapacityResultDiv.style.display = 'block';
    carryingCapacityCalculateBtnDiv.style.display = 'none';
}


function CarryingCapacityCalculation() {
    const carryingCapacityCalculateBtn = document.getElementById('carryingCapacityCalculateBtn');
    carryingCapacityCalculateBtn.addEventListener('click', function () {

        let totalForageProductionCC = 0;
        let err = false;
        let rpvArray = [];
        let totalAvailableForageProductionCC = 0;
        let totalAumsCC = 0;
        let aumAcCC = 0;
        let acAumCC = 0;
        let totalAcresCC = 1;

        let tamegrassSingleForageProductionError = CheckSingleInputErrorZero(tamegrassSingleForageProductionInput, false);
        let annualForagesSingleForageProductionError = CheckSingleInputErrorZero(annualForagesSingleForageProductionInput, false);
        let singleGrossAcresError = CheckSingleInputErrorZero(singleGrossAcresInput, false);
        let singleHarvestEfficiencyError = CheckSingleHarvestEfficiencyInputError(singleHarvestEfficiencyInput, false, 50);
        let harvestEfficiencyCollectionError = CheckHarvestEfficiencyInputCollectionError();
        let forageProductionCollectionError = CheckForageProductionInputCollectionError();
        let grossAcresCollectionError = CheckGrossAcresInputCollectionError();

        let pt = document.querySelector("input[name='pastureTypeRadioCC']:checked").value;
        if (pt === 'rangeRadioCC') {// calculate carrying capacity for rangeland pasture
            let cccm = document.querySelector("input[name='carryingCapacityCalculateMethodRadio']:checked").value;
            if (cccm === 'estimatedStockingRatesRadio') {// using estimated stocking rates AUMs per acres
                err = harvestEfficiencyCollectionError || grossAcresCollectionError;
                if (!err) {// if no errors, calculate
                    totalAumsCC = GetTotalAUMsUsingEstimatedAumAc();
                    totalAcresCC = GetTotalAcres();
                }
            }
            else {// using production values
                if (cccm === 'estimatedRelativeProductionValuesRadio') {
                    // calculate carrying capacity for rangeland using estimated/default relative production value
                    err = harvestEfficiencyCollectionError || grossAcresCollectionError;
                    rpvArray = GetEstimatedRPVArray(landResourceAreaSelect.selectedIndex);
                }
                else {
                    // calculate carrying capacity for rangeland using custom or actual production values
                    err = harvestEfficiencyCollectionError || grossAcresCollectionError || forageProductionCollectionError;
                    rpvArray = GetForageProductionInputArrayValues();
                }
                if (!err) {// if no errors, calculate
                    totalAumsCC = GetTotalAUMsUsingRPV(rpvArray);
                    totalAcresCC = GetTotalAcres();
                }
            }
        }
        else if (pt === 'tamegrassRadioCC') {
            err = tamegrassSingleForageProductionError || singleGrossAcresError || singleHarvestEfficiencyError;
            if (!err) {
                totalAcresCC = GetSingleGrossAcres();
                totalForageProductionCC = totalAcresCC * GetTamegrassTotalForageProduction();
                totalAvailableForageProductionCC = totalForageProductionCC * GetSingleHarvestEfficiency();
                totalAumsCC = totalAvailableForageProductionCC / 913.0;
            }

        }
        else {// calculate carrying capacity for Annual Forages
            err = annualForagesSingleForageProductionError || singleGrossAcresError || singleHarvestEfficiencyError;
            //if no errors, calculate
            if (!err) {
                totalAcresCC = GetSingleGrossAcres();
                totalForageProductionCC = totalAcresCC * GetAnnualForagesTotalForageProduction();
                totalAvailableForageProductionCC = totalForageProductionCC * GetSingleHarvestEfficiency();
                totalAumsCC = totalAvailableForageProductionCC / 913.0;
            }
        }

        if (!err) {
            ShowResultsDivs();
            aumAcCC = totalAumsCC / totalAcresCC;
            acAumCC = 1 / aumAcCC;

            carryingCapacityTotalAumsDisplay.value = totalAumsCC.toFixed(2);
            aumAcDisplay.value = aumAcCC.toFixed(2);
            acAumDisplay.value = acAumCC.toFixed(2);

            const totalAumInput = document.getElementById('totalAumInput');
            if (!totalAumInput.value) {
                stockingRateTotalAumsDisplay.value = 'No value calculated';
            }
        }
        else {
            HideResultsDivs();
        }
    });
}

// #endregion
// #endregion