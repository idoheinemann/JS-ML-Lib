function toMatrixArray(img){
	var arr = [Matrix.zeros(img.height,img.width),Matrix.zeros(img.height,img.width),Matrix.zeros(img.height,img.width),Matrix.zeros(img.height,img.width)];
	for(var i = 0; i < img.data.length ; i+=4){
		for(var j = 0; j != 4; j++){
			arr[j]._set_linear_item(Math.floor(i/4),img.data[i+j]);
		}
	}
	return arr;
}

function toGrayScale(matarr){
	var tmp = Matrix.zeros(matarr[0].rows,matarr[0].columns);
	for(var i in matarr){
		for(var j = 0; j < matarr[i].rows*matarr[i].columns; j++){
			tmp._set_linear_item(j,tmp._get_linear_item(j)+matarr[i]._get_linear_item(j));
		}
	}
	return tmp.mul(1/matarr.length);
}

function resize(grimg,width,height){
	var w = grimg.columns/width;
	var h = grimg.rows/height;
	var tmp = [];
	for(var y = 0; y < height; y++){
		tmp[y] = [];
		for(var x = 0; x < width; x++){
			var mt = grimg.submatrix(Math.floor(y*h),Math.floor(x*w),Math.min(Math.ceil(y*h+h),grimg.rows),Math.min(Math.ceil(x*w+w),grimg.columns));
			tmp[y][x] = mt.avg();
		}
	}
	return new Matrix(tmp);
}