const dragArea = document.querySelector('.drag-area'),
    dragText = document.querySelector('.drag-area .text'),
    previewImg = document.querySelector('.preview-img img'),
    input = document.querySelector('.file-input'),
    browse = document.querySelector('.browse'),
    chooseImgBtn = document.querySelector('.choose-img'),
    filterOptions = document.querySelectorAll('.filter button'),
    filterName = document.querySelector('.filter-info .name'),
    filterSlider = document.querySelector('.slider input'),
    filterValue = document.querySelector('.filter-info .value'),
    resetBtn = document.querySelector('.reset-filter'),
    rotateOptions = document.querySelectorAll('.rotate button'),
    saveImgBtn = document.querySelector('.save-img');


chooseImgBtn.onclick = () => {
    input.click(); // triggering input event
};

browse.onclick = () => {
    input.click(); // triggering input event
};
    
// Input Event
input.addEventListener('change', function(){
    file = this.files[0]; // gettiing user selected file
    loadImage();
});

// When user drags a file inside the drag area
dragArea.addEventListener('dragover', (event) => {
    event.preventDefault() // preventing default behaviour
    dragText.textContent = 'Release to Upload';
});

// When user drags a file outside the drag area
dragArea.addEventListener('dragleave', () => {
    dragText.textContent = 'Drag & Drop';
});

// When user drops a file inside the drag area
dragArea.addEventListener('drop', (event) => {
    event.preventDefault() // preventing default behaviour
    file = event.dataTransfer.files[0]; // getting file dropped by user
    loadImage();
});

// previewing image
const loadImage = () => {
    let fileType = file.type; // Fetching the type of selected file
    let validExtensions = ['image/jpeg', 'image/jpg', 'image/png']; // valid file types

    // Verifying file type of selected file
    if (validExtensions.includes(fileType)) {
        previewImg.src = URL.createObjectURL(file); // passing file url as preview img src
        previewImg.addEventListener("load", () => {
            document.querySelector('.drag-area .text-wrapper').classList.add('hide'); // hiding preview box text
            document.querySelector('.img-editor').classList.remove('disable'); // activating img edtor
            resetBtn.click(); // triggering reset on file load
        })
    }
    else{
        alert("This file is not an Image"); // displaying alert for invalid file type
        dragText.textContent = 'Drag & Drop'; // reseting drag text
    }
   
};

// Default Values
let brightness = "100", saturation = "100", inversion = "0", grayscale = "0";
let rotate = 0, flipHorizontal = 1, flipVertical = 1;

// Filter Options
filterOptions.forEach(option => {
    option.addEventListener("click", () => {
        document.querySelector(".active").classList.remove("active");
        option.classList.add("active");
        filterName.innerText = option.innerText; // displaying active filter name

        // assigning slider values for each filter option
        if(option.id === 'brightness') {
            filterSlider.max = "200";
            filterSlider.value = brightness;
            filterValue.innerText = `${brightness}%`;
        }else if(option.id === 'saturation'){
            filterSlider.max = "200";
            filterSlider.value = saturation;
            filterValue.innerText = `${saturation}%`;
        }else if(option.id === 'inversion'){
            filterSlider.max = "100";
            filterSlider.value = inversion;
            filterValue.innerText = `${inversion}%`;
        }else if(option.id === 'grayscale'){
            filterSlider.max = "100";
            filterSlider.value = grayscale;
            filterValue.innerText = `${grayscale}%`;
        }
    });
});

// Rotate & Flip
rotateOptions.forEach(option => {
    option.addEventListener("click", () => { // adding click event to all rotate/flip buttons
        if(option.id === "left") {
            rotate -= 90; // if clicked btn is left rotate, decrements rotate value by 90
        } else if(option.id === "right") {
            rotate += 90; // if clicked btn is right rotate, increment rotate value by 90
        } else if(option.id === "horizontal") {
            // if flip horizontal value is 1, set this value to -1 else set 1
            flipHorizontal = flipHorizontal === 1 ? -1 : 1;
        } else if(option.id === "vertical") {
            // if flip vertical value is 1, set this value to -1 else set 1
            flipVertical = flipVertical === 1 ? -1 : 1;
        }
        applyFilter();
    });
});

const updateFilter = () => {
    filterValue.innerText = `${filterSlider.value}%`; // displaying slider value on slide
    const selectedFilter = document.querySelector(".filter .active"); // getting active filter

    // making each filter to hold their values on option change
    if (selectedFilter.id === 'brightness') {
        brightness = filterSlider.value;
    } else if(selectedFilter.id === 'saturation') {
        saturation = filterSlider.value;
    } else if(selectedFilter.id === 'inversion') {
        inversion = filterSlider.value;
    } else if(selectedFilter.id === 'grayscale') {
        grayscale = filterSlider.value;
    }
    applyFilter();
};

// applying filter values to preview img
const applyFilter = () => {
    previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
};

// Reset Filter
const resetFilter = () => {
    brightness = "100", saturation = "100", inversion = "0", grayscale = "0"; // reseting to default values
    rotate = 0, flipHorizontal = 1, flipVertical = 1;  // reseting to default values
    filterOptions[0].click(); // reseting active filter
    applyFilter();
};

// Saving (Downloading) Preview Image
const saveImage = () => {
    const canvas = document.createElement("canvas"); // creating canvas element
    const ctx = canvas.getContext("2d"); // canvas.getContext return a drawing context on the canvas
    canvas.width = previewImg.naturalWidth; // setting canvas width to actual image width
    canvas.height = previewImg.naturalHeight; // setting canvas width to actual image height

    // applying user selected filters to canvas filter
    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    ctx.translate(canvas.width / 2, canvas.height / 2); // translating canvas from center
    if(rotate !== 0){ // If rotate value is not 0, rotate the canvas
        ctx.rotate(rotate * Math.PI / 100);
    }
    ctx.scale(flipHorizontal, flipVertical); // flip canvas, horizontally / vertically
    ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

    const link = document.createElement("a"); // creating <a> element
    link.download = "image.jpg"; // specifying file type of downloadable image
    link.href = canvas.toDataURL(); // passing canvas url to link href
    link.click(); // triggering download
};

filterSlider.addEventListener("input", updateFilter);
resetBtn.addEventListener("click", resetFilter);
saveImgBtn.addEventListener("click", saveImage);