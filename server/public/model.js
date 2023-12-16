let cpuModel;
let gpuModel;
let cpuCanvas = document.getElementById('cpu');
let gpuCanvas = document.getElementById('gpu');
let satelliteImageElement = document.getElementById('satelliteImage')
const offset = tf.scalar(127.5);
const one = tf.scalar(1.0);


let loadModels = async () => {
	console.log('loadModels');
	
	cpuModel = await tf.loadLayersModel('./trained on cpu/model.json');
	gpuModel = await tf.loadLayersModel('./trained on gpu/model.json');
	
	console.log('backend: ' + tf.getBackend());
}

let preProcess = () => {
	console.log('preProcess');
	
	// turn it into a tensor
	let imageTensor = tf.browser.fromPixels(satelliteImageElement);
	
	// normalize the data
	imageTensor = imageTensor.div(offset).sub(one);
	
	// turn it into a batch
	imageTensor = imageTensor.expandDims(0);
	
	return imageTensor;
}

let predict = async imageTensor => {
	console.log('predict');
	
	// make the prediction
	let cpuOutput = cpuModel.predict(imageTensor)
	cpuOutput.data()
		.then(d => console.log('cpu output: ' + d));
	let gpuOutput = gpuModel.predict(imageTensor)
	gpuOutput.data()
		.then(d => console.log('gpu output: ' + d));
	
	cpuOutput = tf.squeeze(cpuOutput);
	gpuOutput = tf.squeeze(gpuOutput);
	
	// convert it back to integers
	cpuOutput = cpuOutput.add(one).mul(offset).cast('int32');
	gpuOutput = gpuOutput.add(one).mul(offset).cast('int32');
	
	// paste it onto the canvas
	tf.browser.toPixels(cpuOutput, cpuCanvas);
	tf.browser.toPixels(gpuOutput, gpuCanvas);
}

loadModels()
	.then(() => preProcess())
	.then(imageTensor => predict(imageTensor));


