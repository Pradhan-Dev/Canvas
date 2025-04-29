const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const toolSelect = document.getElementById('tool');
const colorPicker = document.getElementById('colorPicker');
const bgColorPicker = document.getElementById('bgColorPicker');
const sizePicker = document.getElementById('sizePicker');
const undoBtn = document.getElementById('undo');
const redoBtn = document.getElementById('redo');

let painting = false;
let tool = 'pencil';
let strokeColor = '#000';
let bgColor = '#fff';
let lineWidth = 5;
let undoStack = [];
let redoStack = [];

canvas.style.backgroundColor = bgColor;

function startPosition(e) {
    painting = true;
    draw(e);
}

function finishedPosition() {
    painting = false;
    ctx.beginPath();
    saveState();
}

function draw(e) {
    if (!painting) return;

    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';

    if (tool === 'eraser') {
        ctx.strokeStyle = bgColor;
    } else {
        ctx.strokeStyle = strokeColor;
    }

    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
}

function saveState() {
    undoStack.push(canvas.toDataURL());
    redoStack = []; // Clear redo stack
}

function undo() {
    if (undoStack.length > 0) {
        redoStack.push(canvas.toDataURL());
        let imgData = undoStack.pop();
        let img = new Image();
        img.src = imgData;
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        }
    }
}

function redo() {
    if (redoStack.length > 0) {
        undoStack.push(canvas.toDataURL());
        let imgData = redoStack.pop();
        let img = new Image();
        img.src = imgData;
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        }
    }
}

toolSelect.addEventListener('change', (e) => {
    tool = e.target.value;
});

colorPicker.addEventListener('input', (e) => {
    strokeColor = e.target.value;
});

bgColorPicker.addEventListener('input', (e) => {
    bgColor = e.target.value;
    canvas.style.backgroundColor = bgColor;
});

sizePicker.addEventListener('input', (e) => {
    lineWidth = e.target.value;
});

undoBtn.addEventListener('click', undo);
redoBtn.addEventListener('click', redo);

canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', finishedPosition);
canvas.addEventListener('mousemove', draw);

// Initialize canvas background
ctx.fillStyle = bgColor;
ctx.fillRect(0, 0, canvas.width, canvas.height);