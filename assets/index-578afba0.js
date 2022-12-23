(function(){const c=document.createElement("link").relList;if(c&&c.supports&&c.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))a(l);new MutationObserver(l=>{for(const n of l)if(n.type==="childList")for(const e of n.addedNodes)e.tagName==="LINK"&&e.rel==="modulepreload"&&a(e)}).observe(document,{childList:!0,subtree:!0});function o(l){const n={};return l.integrity&&(n.integrity=l.integrity),l.referrerpolicy&&(n.referrerPolicy=l.referrerpolicy),l.crossorigin==="use-credentials"?n.credentials="include":l.crossorigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function a(l){if(l.ep)return;l.ep=!0;const n=o(l);fetch(l.href,n)}})();const h=t=>{let c=cv.getOptimalDFTSize(t.rows),o=cv.getOptimalDFTSize(t.cols),a=cv.Scalar.all(0),l=new cv.Mat;cv.copyMakeBorder(t,l,0,c-t.rows,0,o-t.cols,cv.BORDER_CONSTANT,a);let n=new cv.Mat;l.convertTo(n,cv.CV_32F);let e=new cv.MatVector,s=new cv.Mat,u=new cv.Mat.zeros(l.rows,l.cols,cv.CV_32F);return e.push_back(n),e.push_back(u),cv.merge(e,s),cv.dft(s,s),t.delete(),l.delete(),e.delete(),{result:s}},b=(t,c,o)=>{let a=new cv.Mat,l=new cv.Mat,n=new cv.MatVector;n.push_back(a),n.push_back(l),cv.split(t,n),cv.magnitude(n.get(0),n.get(1),n.get(0));let e=n.get(0),s=new cv.Mat.ones(e.rows,e.cols,e.type());cv.add(e,s,e),cv.log(e,e);let u=new cv.Rect(0,0,e.cols&-2,e.rows&-2);e=e.roi(u);let r=e.cols/2,i=e.rows/2,v=new cv.Mat;if(o){let m=new cv.Rect(0,0,e.cols,i);e=e.roi(m)}else{let m=new cv.Rect(0,0,r,i),_=new cv.Rect(r,0,r,i),O=new cv.Rect(0,i,r,i),T=new cv.Rect(r,i,r,i),w=e.roi(m),y=e.roi(_),M=e.roi(O),R=e.roi(T);w.copyTo(v),R.copyTo(w),v.copyTo(R),y.copyTo(v),M.copyTo(y),v.copyTo(M)}cv.normalize(e,e,0,1,cv.NORM_MINMAX),n.delete(),s.delete(),v.delete(),cv.imshow(c,e)},L=t=>{let c=new cv.Mat;return cv.dft(t,c,cv.DFT_REAL_OUTPUT|cv.DFT_INVERSE),cv.normalize(c,c,0,1,cv.NORM_MINMAX),{result:c}},I=(t,c)=>{let o=new cv.Scalar(100,100,100),a=new cv.Point(40,80);console.log(t),cv.putText(t,encodeURI(c),a,cv.FONT_HERSHEY_COMPLEX,1,o,2,cv.LINE_AA),cv.flip(t,t,-1),cv.putText(t,encodeURI(c),a,cv.FONT_HERSHEY_COMPLEX,1,o,2,cv.LINE_AA),cv.flip(t,t,-1)},N=(t,c)=>{let o=cv.imread(t);cv.cvtColor(o,o,cv.COLOR_RGBA2GRAY,0);let a=new cv.Mat;cv.bilateralFilter(o,a,20,15,15,cv.BORDER_DEFAULT),cv.threshold(a,a,98,255,cv.THRESH_BINARY),cv.imshow(c,a)};document.querySelector("#app").innerHTML=`
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
`;let f=document.getElementById("imageSrc"),S=document.getElementById("fileInput");var E;let d=((E=document.getElementsByClassName("mask-input"))==null?void 0:E[0])??null;S.addEventListener("change",t=>{f.src=URL.createObjectURL(t.target.files[0])},!1);let g="find";document.querySelectorAll('input[type="radio"]').forEach(t=>{t.addEventListener("change",c=>{g=c.target.value,d&&(d.style.display=g==="add"?"inline-block":"none")})});let p="";d==null||d.addEventListener("change",t=>{p=t.target.value,console.log("lllll",p)});f.onload=()=>{let t=cv.imread(f);if(g==="add"){let c=new cv.MatVector;cv.split(t,c);const{result:o}=h(c.get(0));console.log(p),I(o,p);const{result:a}=L(o);let l=new cv.MatVector;const n=new cv.Mat;a.convertTo(n,cv.CV_8U,255);let e=n.roi(new cv.Rect(0,0,c.get(1).cols,c.get(1).rows));l.push_back(e),l.push_back(c.get(1)),l.push_back(c.get(2));const s=new cv.Mat;cv.merge(l,s),cv.imshow("canvasOutput",s)}else{let c=new cv.MatVector;cv.split(t,c);const{result:o}=h(c.get(0));b(o,"canvasInput",!0),N("canvasInput","canvasOutput")}};
