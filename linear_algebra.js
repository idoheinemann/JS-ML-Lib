class Matrix{
	constructor(array){
		this.raw_mat = Matrix.clone(array);
		this.rows = array.length
		this.columns = array[0].length
	}
	plus(mat){
		var tmp = new Matrix(this.raw_mat);
		tmp.add(mat);
		return tmp;
	}
	get(r,c){
		return this.raw_mat[r][c];
	}
	set(r,c,v){
		return this.raw_mat[r][c] = v;
	}
	_get_index(r,c){
		return this.raw_mat[r%this.rows][c%this.columns];
	}
	add(mat){
		if(typeof mat == "number")
			this.add(new Matrix([[mat]]));
		else
			for(var i in this.raw_mat){
				for(var j in this.raw_mat[i]){
					this.raw_mat[i][j] += mat._get_index(i,j);
				}
			}
		return this;
	}
	minus(mat){
		var tmp = new Matrix(this.raw_mat);
		tmp.sub(mat);
		return tmp;
	}
	sub(mat){
		if(typeof mat == "number")
			this.sub(new Matrix([[mat]]));
		else
			for(var i in this.raw_mat){
				for(var j in this.raw_mat[i]){
					this.raw_mat[i][j] -= mat._get_index(i,j);
				}
			}
		return this;
	}
	times(mat){
		var tmp = new Matrix(this.raw_mat);
		tmp.mul(mat);
		return tmp;
	}
	mul(mat){
		if(typeof mat == "number")
			this.mul(new Matrix([[mat]]));
		else
			for(var i in this.raw_mat){
				for(var j in this.raw_mat[i]){
					this.raw_mat[i][j] *= mat._get_index(i,j);
				}
			}
		return this;
	}
	slash(mat){
		var tmp = new Matrix(this.raw_mat);
		tmp.div(mat);
		return tmp;
	}
	div(mat){
		if(typeof mat == "number")
			this.mul(new Matrix([[mat]]));
		else
			for(var i in this.raw_mat){
				for(var j in this.raw_mat[i]){
					this.raw_mat[i][j] /= mat._get_index(i,j);
				}
			}
		return this;
	}
	max(){
		var m = -Infinity;
		for(var i = 0; i != this.rows*this.columns; i++){
			if(this._get_linear_item(i)>m){
				m = this._get_linear_item(i)
			}
		}
		return m;
	}
	transpose(){
		var arr = [];
		for(var i = 0; i != this.columns; i++){
			arr[i] = [];
			for(var j = 0; j != this.rows; j++){
				arr[i][j] = this.raw_mat[j][i];
			}
		}
		return new Matrix(arr);
	}
	func(f){
		var tmp = new Matrix(this.raw_mat);
		tmp.each(f);
		return tmp;
	}
	each(f){
		for(var i in this.raw_mat){
			for(var j in this.raw_mat[i]){
				this.raw_mat[i][j] = f(this.raw_mat[i][j]);
			}
		}
		return this;
	}
	dot(mat){
		var tmp = Matrix.zeros(this.rows,mat.columns);
		for(var i = 0; i!=tmp.rows; i++){
			for(var j = 0; j != tmp.columns; j++){
				var sum = 0;
				for(var k = 0; k != this.columns ; k++){
					sum += this.raw_mat[i][k]*mat.raw_mat[k][j];
				}
				tmp.set(i,j,sum);
			}
		}
		return tmp;
	}
	_get_linear_item(i){
		return this.get(Math.floor(i/this.columns),i%this.columns);
	}
	_set_linear_item(i,v){
		return this.set(Math.floor(i/this.columns),i%this.columns,v);
	}
	concat_rows(mat){
		return new Matrix(this.raw_mat.concat(mat.raw_mat));
	}
	concat_columns(mat){
		return this.transpose().concat_rows(mat.transpose()).transpose()
	}
	reshape(r,c){
		var tmp = Matrix.zeros(r,c)
		for(var i = 0; i != r*c; i++){
			tmp._set_linear_item(i,this._get_linear_item(i));
		}
		return tmp;
	}
	get T(){
		return this.transpose();
	}
	sum(){
		var sum = 0;
		for(var i = 0; i != this.rows*this.columns; i++){
			sum += this._get_linear_item(i);
		}
		return sum;
	}
	submatrix(start1,start2,end1,end2){
		var tmp = [];
		for(var i = start1; i!= end1; i++){
			tmp[i-start1] = [];
			for(var j = start2; j!= end2; j++){
				tmp[i-start1][j-start2] = this.get(i,j);
			}
		}
		return new Matrix(tmp);
	}
	avg(){
		return this.sum()/(this.rows*this.columns);
	}
}

Matrix.clone = function(a){
	var arr = [];
	for(var i = 0; i!=a.length;i++){
		arr[i] = [];
		if(a[i] instanceof Matrix){
			for(var j = 0; j != a[i].columns; j++){
				arr[i][j] = a[i].raw_mat[0][j];
			}
		}
		else
			for(var j = 0; j != a[i].length; j++){
				arr[i][j] = a[i][j];
			}
	}
	return arr;
}

Matrix.zeros = function(r,c){
	var arr = [];
	for(var i = 0; i!=r;i++){
		arr[i] = [];
		for(var j = 0; j != c; j++){
			arr[i][j] = 0;
		}
	}
	return new Matrix(arr);
}

Matrix.ones = function(r,c){
	var arr = [];
	for(var i = 0; i!=r;i++){
		arr[i] = [];
		for(var j = 0; j != c; j++){
			arr[i][j] = 1;
		}
	}
	return new Matrix(arr);
}

Matrix.eye = function(r,c){
	var arr = [];
	for(var i = 0; i!=r;i++){
		arr[i] = [];
		for(var j = 0; j != c; j++){
			arr[i][j] = Number(i == j);
		}
	}
	return new Matrix(arr);
}

Matrix.rand = function(r,c){
	var arr = [];
	for(var i = 0; i!=r;i++){
		arr[i] = [];
		for(var j = 0; j != c; j++){
			arr[i][j] = Math.random();
		}
	}
	return new Matrix(arr);
}


