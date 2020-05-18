
function array_dup(o,n){
	arr = [];
	for(var i = 0; i!=n;i++){
		arr[i] = o;
	}
	return arr;
}

function last(a){
	return a[a.length-1];
}

class NeuralNetwork{
	constructor(layers,funcs){
		this.layers = []
        this.biases = []
        this.nonlin_funcs = typeof funcs == "function" ? array_dup(funcs,layers.length-1):funcs;
        for(var i = 0; i!=layers.length-1;i++){
            this.layers.push(Matrix.rand(layers[i],layers[i+1]).sub(0.5))
            this.biases.push(Matrix.rand(1,layers[i+1]).sub(0.5))
		}
	}
	hypot(input){
        for(var i in this.layers)
            input = this.nonlin_funcs[i](input.dot(this.layers[i]).add(this.biases[i]));
        return input;
	}

    cost(input,label){
		a = this.hypot(input).sub(label);
        return a.mul(a).sum();
	}

    iteration(input,label,alpha){
		if(!alpha)
			alpha = 0.01;
		
        var inputs = [];
        var deltas = [];

        for(var i in this.layers){
            inputs.push(input)
            input = this.nonlin_funcs[i](input.dot(this.layers[i]).add(this.biases[i]));
		}

        var error = label.minus(input)
        deltas.push(error.times(last(this.nonlin_funcs)(input,true)));

        for(var i = inputs.length-1; i != 0; i--){
            let tmpdelta = last(deltas).dot(this.layers[i].transpose()).times(this.nonlin_funcs[i](inputs[i],true));
            deltas.push(tmpdelta);
		}

        deltas.reverse()
        inputs.push(input)

        for(var i in this.layers){
            this.layers[i].add(inputs[i].times(alpha).transpose().dot(deltas[i]).times(1/inputs[0].rows));
            let t_del = deltas[i].transpose();
            for(var j in this.biases[i].raw_mat[0])
                this.biases[i].raw_mat[0][j] += alpha*(new Matrix([t_del.raw_mat[j]])).sum();
		}
	}
	
}

class ConvLayer{
	constructor(filter,nonlin){
		this.filter = filter;
		this.nonlin = nonlin?nonlin:(x)=>x;
	}
	conv(grayimg){
		var arr = [];
		for(var i = 0; i != grayimg.columns-this.filter.columns; i++){
			arr[i] = [];
			for(var j = 0; j != grayimg.rows-this.filter.rows; j++){
				arr[i][j] = grayimg.submatrix(j,i,j+this.filter.rows,i+this.filter.columns).mul(this.filter).sum();
			}
		}
		return this.nonlin(new Matrix(arr));
	}
}

class PullingLayer{
	constructor(op){
		this.op = op;
	}
	conv(grayimg){
		return this.op(grayimg);
	}
}

class ConvNet extends NeuralNetwork{
	constructor(convlayers,layers,funcs){
		super(layers,funcs);
		this.convLayers = convlayers;
	}
	conv(inputs){
		debugger;
		var arr = [];
		for(var q in inputs)
			arr[q] = inputs[q];
			for(var i of this.convLayers){
				arr[q] = i.conv(arr[q]);
			}
		return new Matrix(arr);
	}
}

function sigmoid(x,d){
	if(d){
		return x.times(x.times(-1).add(1))
	}
	return x.func((v)=>1/(1+Math.exp(-v)));
}

function linear(x,d){
	return d?1:x;
}

function relu(x,d){
	if(d){
		x = x.func(Math.exp);
		return x.sub(1).div(x);
	}
	return x.func(Math.exp).add(1).each(Math.log);
}

function tanh(x,d){
	if(d){
		return x.times(-1).mul(x).add(1)
	}
	return x.func(Math.tanh);
}

function relu2(x){
	return x.func((v)=>Math.max(0,v));
}

function log_nonlin(x,d){
	if(d){
		return x.func((v)=>1/Math.exp(Math.abs(v)));
	}
	return x.func((v)=>Math.sign(v)*(Math.log(1+Math.abs(v))))
}