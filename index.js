document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    ///////////////////////////////COMMON FUNCTIONS////////////////////////////////////////////////////////////
    // main navigation buttons click/switch
    SwitchActiveLink();

    // auto collapse the main collapsible nav button
    AutoCollapseCollapsibleNavBtn();




    ///////////////////////////FORAGE PRODUCTION CALCULATOR///////////////////////////////////////////////////
    const forageProductionForm = document.getElementById('forageProductionForm');
    const rangelandResultDiv = document.getElementById('rangelandResultDiv');
    const nonRangelandResultDiv = document.getElementById('nonRangelandResultDiv');
    const forageProductionCalculateBtnDiv = document.getElementById('forageProductionCalculateBtnDiv');

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


    ///////////////////////////STOCKING RATE CALCULATOR///////////////////////////////////////////////////
    const stockingRateCalculateBtnDiv = document.getElementById('stockingRateCalculateBtnDiv');
    const stockingRateCalculateBtn = document.getElementById('stockingRateCalculateBtn');
    const stockingRateResultDiv = document.getElementById('stockingRateResultDiv');


    // based on number of animal classes, dynamically add html content for animal class selection, number of head input, and number of month input
    DynamicallyGenerateAnimalClassHeadMonthFieldsets();

    // calculate stocking rate when clicking on calculate button
    StockingRateCalculation();

    // hide results division and show calculate button when any input/dropdown change
    //OnAnyInputChangeStockingRate();
    OnAnyInputOrSelectionChange(stockingRateDiv, stockingRateCalculateBtnDiv, stockingRateResultDiv)


    ///////////////////////////CARRYING CAPACITY CALCULATOR///////////////////////////////////////////////////
    const carryingCapacityCalculateBtnDiv = document.getElementById('carryingCapacityCalculateBtnDiv');
    const carryingCapacityResultDiv = document.getElementById('carryingCapacityResultDiv');
    const carryingCapacityDiv = document.getElementById('carryingCapacityDiv');

    // zoom and pan the map
    MapZooming();

    // event listener for any selection change in carrying capacity calculator
    OnAnySelectionChange();

    // calculate carrying capacity when clicking on calculate button
    CarryingCapacityCalculation();

    // event listener for any input or selection change in carrying capacity calculator
    // show or hide calculate button and result division
    OnAnyInputOrSelectionChange(carryingCapacityDiv, carryingCapacityCalculateBtnDiv, carryingCapacityResultDiv);
});


//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////SUB FUNCTIONS////////////////////////////////////////////////////////////

//////////////////////////////////////////COMMON SUB FUNCTIONS////////////////////////////////////////
// get the average value from a list
function CalculateAverage(numbers) {
    const total = numbers.reduce((sum, value) => sum + value, 0);
    return total / numbers.length;
}

// get the total value from a list
function CalculateSum(numbers) {
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


//////////////////////////////////SUB FUNCTIONS FOR FORAGE PRODUCTION CALCULATOR///////////////////////////////////////

// dynamically generate sample net weight input boxes based on the number of samples for one type of pasture
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

// dynamically generate sample net weight input boxes based on the number of samples for all pasture types
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

// collect input values from sample net weight input boxes
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

// event listener for pasture type selection change
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

// event listener for dry/wet type selection change
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


// event listener for any input change
function OnAnyInputChangeForageProduction() {
    const forageProductionDiv = document.getElementById('forageProductionDiv');
    forageProductionDiv.addEventListener('input', function (event) {
        if (event.target.matches('input[type="number"], input[type="radio"], select')) {
            rangelandResultDiv.style.display = 'none';
            nonRangelandResultDiv.style.display = 'none';
            forageProductionCalculateBtnDiv.style.display = 'block';
        }
    });
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


        forageProductionCalculateBtnDiv.style.display = 'none';

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

            document.getElementById('uplandLoamyResultDisplayFP').innerHTML = uplandLoamyResult.toFixed(2);
            document.getElementById('uplandSandyResultDisplayFP').innerHTML = uplandSandyResult.toFixed(2);
            document.getElementById('uplandClayeyResultDisplayFP').innerHTML = uplandClayeyResult.toFixed(2);
            document.getElementById('uplandShallowResultDisplayFP').innerHTML = uplandShallowResult.toFixed(2);
            document.getElementById('uplandVeryShallowResultDisplayFP').innerHTML = uplandVeryShallowResult.toFixed(2);
            document.getElementById('lowlandOverflowResultDisplayFP').innerHTML = lowlandOverflowResult.toFixed(2);
            document.getElementById('lowlandWetMeadowResultDisplayFP').innerHTML = lowlandWetMeadowResult.toFixed(2);

        } else {
            if (document.querySelector("input[name='pastureTypeRadio']:checked").value === 'smallgrainsRadio') {
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
            <label>Number of Head</label>
            <input required type="number" name="headNumber#INDEX#" id="headNumber#INDEX#" value="1" min="1" placeholder="enter a positive integer value" />
            <br><br>
            <label>Number of Month</label>
            <input required type="number" name="monthNumber#INDEX#" id="monthNumber#INDEX#" value="1" min="1" placeholder="enter a positive integer value" />
        </fieldset>
        <br>
    `;

        // Generate and append fieldsets
        for (let i = 1; i <= number; i++) {
            let fieldset = animalClassListHtml
                .replace(/#INDEX#/g, i); // Replace placeholders with the current index
            container.innerHTML += fieldset;
        }
    })
}


// calculate stocking rate when clicking on calculate button
function StockingRateCalculation() {
    // animal unit equivalent (AUE)
    const AUE = [
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


    document.getElementById("stockingRateCalculateBtn").addEventListener('click', function () {
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
            aue = AUE[animalClassIndex - 1];
            aum = aue * headNumber * monthNumber;
            totalAum += aum;
            aueaum += aue * aum;
        }
        averageAue = aueaum / totalAum;

        document.getElementById('totalAumInput').value = totalAum.toFixed(2);
        document.getElementById('averageAueInput').value = averageAue.toFixed(2);
    })
}


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
    const singleForageProductionDiv = document.getElementById('singleForageProductionDiv');
    const grossAcresDiv = document.getElementById('grossAcresDiv');
    const singleHarvestEfficiencyDiv = document.getElementById('singleHarvestEfficiencyDiv');
    const carryingCapacityCalculateMethodDiv = document.getElementById('carryingCapacityCalculateMethodDiv');
    const relativeProductionValueTypeDiv = document.getElementById('relativeProductionValueTypeDiv');
    const actualRelativeProductionValuesDiv = document.getElementById('actualRelativeProductionValuesDiv');
    const multiHarvestEfficiencyDiv = document.getElementById('multiHarvestEfficiencyDiv');
    const multiAcresDiv = document.getElementById('multiAcresDiv');
    const landResourceAreaSelectDiv = document.getElementById('landResourceAreaSelectDiv');

    document.querySelectorAll("input[name='carryingCapacityCalculateMethodRadio']").forEach(function (radio) {
        radio.addEventListener("change", function () {
            if (document.querySelector("input[name='carryingCapacityCalculateMethodRadio']:checked").value === 'estimatedStockingRatesRadio') {
                relativeProductionValueTypeDiv.style.display = 'none';
                actualRelativeProductionValuesDiv.style.display = 'none';
                landResourceAreaSelectDiv.style.display = 'block';
            }
            else {
                relativeProductionValueTypeDiv.style.display = 'block';

                if (document.querySelector("input[name='relativeProductionValueTypeRadio']:checked").value === 'defaultValueRadio') {
                    landResourceAreaSelectDiv.style.display = 'block';
                    actualRelativeProductionValuesDiv.style.display = 'none';
                }
                else {
                    landResourceAreaSelectDiv.style.display = 'none';
                    actualRelativeProductionValuesDiv.style.display = 'block';
                }

            }
        });
    });


    document.querySelectorAll("input[name='relativeProductionValueTypeRadio']").forEach(function (radio) {
        radio.addEventListener("change", function () {
            if (document.querySelector("input[name='relativeProductionValueTypeRadio']:checked").value === 'defaultValueRadio') {
                landResourceAreaSelectDiv.style.display = 'block';
                actualRelativeProductionValuesDiv.style.display = 'none';
            }
            else {
                landResourceAreaSelectDiv.style.display = 'none';
                actualRelativeProductionValuesDiv.style.display = 'block';
            }
        });
    });


    document.querySelectorAll("input[name='pastureTypeRadioCC']").forEach(function (radio) {
        radio.addEventListener("change", function () {
            if (document.querySelector("input[name='pastureTypeRadioCC']:checked").value === 'rangeRadioCC') {
                carryingCapacityCalculateMethodDiv.style.display = 'block';
                multiAcresDiv.style.display = 'block';
                singleForageProductionDiv.style.display = 'none';
                landResourceAreaSelectDiv.style.display = 'block';
                singleHarvestEfficiencyDiv.style.display = 'none';
                multiHarvestEfficiencyDiv.style.display = 'block';

                if (document.querySelector("input[name='carryingCapacityCalculateMethodRadio']:checked").value === 'estimatedStockingRatesRadio') {
                    relativeProductionValueTypeDiv.style.display = 'none';
                    actualRelativeProductionValuesDiv.style.display = 'none';
                }
                else {
                    relativeProductionValueTypeDiv.style.display = 'block';

                    if (document.querySelector("input[name='relativeProductionValueTypeRadio']:checked").value === 'defaultValueRadio') {
                        landResourceAreaSelectDiv.style.display = 'block';
                        actualRelativeProductionValuesDiv.style.display = 'none';
                    }
                    else {
                        landResourceAreaSelectDiv.style.display = 'none';
                        actualRelativeProductionValuesDiv.style.display = 'block';
                    }
                }

            }
            else if (document.querySelector("input[name='pastureTypeRadioCC']:checked").value === 'tamegrassRadioCC') {
                carryingCapacityCalculateMethodDiv.style.display = 'none';
                relativeProductionValueTypeDiv.style.display = 'block';
                multiHarvestEfficiencyDiv.style.display = 'block';
                multiAcresDiv.style.display = 'block';
                singleForageProductionDiv.style.display = 'none';
                singleHarvestEfficiencyDiv.style.display = 'none';
                grossAcresDiv.style.display = 'none';

                if (document.querySelector("input[name='relativeProductionValueTypeRadio']:checked").value === 'defaultValueRadio') {
                    landResourceAreaSelectDiv.style.display = 'block';
                    actualRelativeProductionValuesDiv.style.display = 'none';
                }
                else {
                    landResourceAreaSelectDiv.style.display = 'none';
                    actualRelativeProductionValuesDiv.style.display = 'block';
                }
            }
            else {
                singleForageProductionDiv.style.display = 'block';
                grossAcresDiv.style.display = 'block';
                singleHarvestEfficiencyDiv.style.display = 'block';
                carryingCapacityCalculateMethodDiv.style.display = 'None';
                relativeProductionValueTypeDiv.style.display = 'None';
                actualRelativeProductionValuesDiv.style.display = 'None';
                multiHarvestEfficiencyDiv.style.display = 'None';
                multiAcresDiv.style.display = 'None';
                landResourceAreaSelectDiv.style.display = 'None';
            }
        });
    });
}

// 
function CarryingCapacityCalculation() {
    const carryingCapacityCalculateBtn = document.getElementById('carryingCapacityCalculateBtn');
    const carryingCapacityCalculateBtnDiv = document.getElementById('carryingCapacityCalculateBtnDiv');
    const carryingCapacityResultDiv = document.getElementById('carryingCapacityResultDiv');

    carryingCapacityCalculateBtn.addEventListener('click', function () {
        carryingCapacityResultDiv.style.display = 'block';
        carryingCapacityCalculateBtnDiv.style.display = 'none';
    });
}