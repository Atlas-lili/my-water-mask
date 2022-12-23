export const canvas2BGR = (canvasId) => {
    let src = cv.imread(canvasId);
    let colors = new cv.MatVector();
    cv.split(src,colors);
    return colors;
};

export const fft = (src) => {
    // let src = cv.imread(canvasId);
    // // 原地转灰度图
    // cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);

    // 获得最佳DFT尺寸
    let optimalRows = cv.getOptimalDFTSize(src.rows);
    let optimalCols = cv.getOptimalDFTSize(src.cols);
    let s0 = cv.Scalar.all(0);
    let padded = new cv.Mat();
    cv.copyMakeBorder(src, padded, 0, optimalRows - src.rows, 0,
                    optimalCols - src.cols, cv.BORDER_CONSTANT, s0);

    // cv.MatVector分配复数实部虚部空间
    let plane0 = new cv.Mat();
    padded.convertTo(plane0, cv.CV_32F);
    let planes = new cv.MatVector();
    let complexI = new cv.Mat();
    let plane1 = new cv.Mat.zeros(padded.rows, padded.cols, cv.CV_32F);
    planes.push_back(plane0);
    planes.push_back(plane1);
    cv.merge(planes, complexI);

    // 原地DFT
    cv.dft(complexI, complexI);

    src.delete();
    padded.delete();
    planes.delete();
    // complexI.delete();

    return {
        result: complexI,
    };
};

export const printSpectrum = (fData, canvasId, half) => {
    let plane0 = new cv.Mat();
    let plane1 = new cv.Mat();
    let planes = new cv.MatVector();
    planes.push_back(plane0);
    planes.push_back(plane1);

    cv.split(fData, planes);

    cv.magnitude(planes.get(0), planes.get(1), planes.get(0));
    let mag = planes.get(0);
    let m1 = new cv.Mat.ones(mag.rows, mag.cols, mag.type());
    cv.add(mag, m1, mag);
    cv.log(mag, mag);

    // 如果包含奇数行列裁剪频谱图
    let rect = new cv.Rect(0, 0, mag.cols & -2, mag.rows & -2);
    mag = mag.roi(rect);

    // rearrange the quadrants of Fourier image
    // so that the origin is at the image center
    let cx = mag.cols / 2;
    let cy = mag.rows / 2;
    let tmp = new cv.Mat();

    if (half) {
        let rect = new cv.Rect(0, 0, mag.cols, cy);
        mag = mag.roi(rect);
    }
    else {
        let rect0 = new cv.Rect(0, 0, cx, cy);
        let rect1 = new cv.Rect(cx, 0, cx, cy);
        let rect2 = new cv.Rect(0, cy, cx, cy);
        let rect3 = new cv.Rect(cx, cy, cx, cy);

        let q0 = mag.roi(rect0);
        let q1 = mag.roi(rect1);
        let q2 = mag.roi(rect2);
        let q3 = mag.roi(rect3);

        // exchange 1 and 4 quadrants
        q0.copyTo(tmp);
        q3.copyTo(q0);
        tmp.copyTo(q3);

        // exchange 2 and 3 quadrants
        q1.copyTo(tmp);
        q2.copyTo(q1);
        tmp.copyTo(q2);
    }

    // The pixel value of cv.CV_32S type image ranges from 0 to 1.
    cv.normalize(mag, mag, 0, 1, cv.NORM_MINMAX);
    if (half) {
        // cv.threshold(mag, mag, 0, 1, cv.THRESH_BINARY_INV + cv.THRESH_OTSU);
    }
    planes.delete();
    // complexI.delete();
    m1.delete();
    tmp.delete();
    cv.imshow(canvasId, mag);
}

export const ifft = (fData) => {
    let ifft = new cv.Mat();
    cv.dft(fData, ifft, (cv.DFT_REAL_OUTPUT | cv.DFT_INVERSE));
    cv.normalize(ifft, ifft, 0, 1, cv.NORM_MINMAX);
    return {
        result: ifft,
    };
};

export const addWaterMask = (fData, text) => {
    let scalar = new cv.Scalar(100,100,100);
    let point = new cv.Point(40,80);
    console.log(fData);
    // 在图中插入文字
    cv.putText(fData,encodeURI(text),point,cv.FONT_HERSHEY_COMPLEX ,1,scalar, 2, cv.LINE_AA);// 1.0是插入的字体的大小
    cv.flip(fData,fData,-1);// 翻转操作，然后再加一次文字
    cv.putText(fData,encodeURI(text),point,cv.FONT_HERSHEY_COMPLEX ,1,scalar, 2, cv.LINE_AA);
    cv.flip(fData,fData,-1);
};

export const printNoticeably = (canvasId, outputCanvasId) => {
    let src = cv.imread(canvasId);
    // 原地转灰度图
    cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
    let dst = new cv.Mat();
    cv.bilateralFilter(src, dst, 20, 15, 15, cv.BORDER_DEFAULT);
    cv.threshold(dst, dst, 98, 255, cv.THRESH_BINARY)
    cv.imshow(outputCanvasId, dst);
};
