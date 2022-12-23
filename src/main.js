import './style.css';
import {fft, ifft, addWaterMask, printSpectrum, printNoticeably} from './fft';

document.querySelector('#app').innerHTML = `
    <div class="inputoutput">
        <p>目的</p>
        <input type="radio" id="add" name="type" value="add">
        <label for="add">加水印</label><br>
        <input type="radio" id="find" name="type" value="find" checked>
        <label for="find">查水印</label><br>

        <input class="mask-input" placeholder="水印文本（仅英文）" style="display: none"><br>

        <img id="imageSrc" alt="输入图片" />
        <div class="caption">
            imageSrc <input type="file" id="fileInput" name="file" />
        </div>
    </div>
    <div class="inputoutput" style="display: none">
        <canvas id="canvasInput"></canvas>
        <div class="caption">canvasInput</div>
    </div>
    <div class="inputoutput">
        <canvas id="canvasOutput"></canvas>
        <div class="caption">canvasOutput</div>
    </div>
`;
let imgElement = document.getElementById('imageSrc');
let inputElement = document.getElementById('fileInput');
let textInput = document.getElementsByClassName('mask-input')?.[0] ?? null;
inputElement.addEventListener('change', e => {
    imgElement.src = URL.createObjectURL(e.target.files[0]);
}, false);
let type = 'find';
document.querySelectorAll('input[type="radio"]').forEach(item => {
    item.addEventListener('change', (e) => {
        type = e.target.value;
        if (textInput) {
            textInput.style.display = type === 'add' ? 'inline-block' : 'none';
        }
    })
});
let text = '';
textInput?.addEventListener('change', e => {
    text = e.target.value;
    console.log('lllll', text);
});

imgElement.onload = () => {
    let mat = cv.imread(imgElement);
    if (type === 'add') {
        let colors = new cv.MatVector();
        cv.split(mat, colors);
        const {result: fData} = fft(colors.get(0));
        console.log(text);
        addWaterMask(fData, text)
        const {result} = ifft(fData);

        let newColors = new cv.MatVector();
        const image = new cv.Mat();
        result.convertTo(image, cv.CV_8U, 255.0);

        let res = image.roi(new cv.Rect(0, 0, colors.get(1).cols, colors.get(1).rows));
        newColors.push_back(res);
        newColors.push_back(colors.get(1));
        newColors.push_back(colors.get(2));
        const newMat = new cv.Mat();
        cv.merge(newColors, newMat);
        cv.imshow('canvasOutput', newMat);
    }
    else {
        let colors = new cv.MatVector();
        cv.split(mat, colors);
        const {result: fData} = fft(colors.get(0));
        printSpectrum(fData, 'canvasInput', true);
        printNoticeably('canvasInput', 'canvasOutput');
    }
};

