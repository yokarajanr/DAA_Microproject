class QuickSortVisualizer {
    constructor() {
        this.array = [];
        this.arrayBars = [];
        this.isSorting = false;
        this.speed = 5;
        this.steps = [];
        this.currentStep = 0;
        this.comparisons = 0;
        this.swaps = 0;
        
        // DOM elements
        this.arrayInput = document.getElementById('array-input');
        this.arrayContainer = document.getElementById('array-container');
        this.stepDescription = document.getElementById('step-description');
        this.speedInput = document.getElementById('speed');
        this.comparisonCount = document.getElementById('comparison-count');
        this.swapCount = document.getElementById('swap-count');
        this.complexityAnalysis = document.getElementById('complexity-analysis');
        
        // Event listeners
        document.getElementById('generate-random').addEventListener('click', () => { this.generateRandomArray(); this.analyzeComplexity(); });
        document.getElementById('start-sort').addEventListener('click', () => this.startSorting());
        document.getElementById('reset').addEventListener('click', () => this.reset());
        this.speedInput.addEventListener('input', (e) => this.speed = e.target.value);
        
        // Best/Worst case buttons
        const bestBtn = document.getElementById('best-case');
        if (bestBtn) bestBtn.addEventListener('click', () => { this.setBestCaseInput(); this.analyzeComplexity(); });
        const worstBtn = document.getElementById('worst-case');
        if (worstBtn) worstBtn.addEventListener('click', () => { this.setWorstCaseInput(); this.analyzeComplexity(); });
        
        // Analyze on input change
        this.arrayInput.addEventListener('input', () => this.analyzeComplexity());
        
        // Initial analysis
        this.analyzeComplexity();
    }
    
    generateRandomArray() {
        const size = 10; // Reduced size for better visualization
        // 20% chance to generate all-equal array (worst case)
        if (Math.random() < 0.2) {
            const val = Math.floor(Math.random() * 10); // small digit 0-9
            this.array = Array(size).fill(val);
        } else {
            // Mix of small digits and larger numbers
            this.array = Array.from({ length: size }, () => Math.random() < 0.5 ? Math.floor(Math.random() * 10) : Math.floor(Math.random() * 100) + 1);
        }
        this.arrayInput.value = this.array.join(', ');
        this.visualizeArray();
    }
    
    setBestCaseInput() {
        // Best case: random array (median pivot is ideal, but random is close for visualization)
        this.array = [34, 7, 23, 32, 5, 62, 78, 12, 45, 19];
        this.arrayInput.value = this.array.join(', ');
        this.visualizeArray();
    }
    
    setWorstCaseInput() {
        // Worst case: already sorted array
        this.array = [5, 7, 12, 19, 23, 32, 34, 45, 62, 78];
        this.arrayInput.value = this.array.join(', ');
        this.visualizeArray();
    }
    
    visualizeArray() {
        this.arrayContainer.innerHTML = '';
        this.arrayBars = [];
        
        if (this.array.length === 0) return;
        
        const maxValue = Math.max(...this.array);
        
        this.array.forEach((value, index) => {
            const bar = document.createElement('div');
            bar.className = 'array-bar normal';
            bar.style.height = `${(value / maxValue) * 200}px`;
            
            // Add value label
            const valueLabel = document.createElement('div');
            valueLabel.className = 'value';
            valueLabel.textContent = value;
            bar.appendChild(valueLabel);
            
            // Add index label
            const indexLabel = document.createElement('div');
            indexLabel.className = 'index';
            indexLabel.textContent = index;
            bar.appendChild(indexLabel);
            
            this.arrayContainer.appendChild(bar);
            this.arrayBars.push(bar);
        });
    }
    
    analyzeComplexity() {
        let input = this.arrayInput.value.trim();
        if (!input) {
            this.complexityAnalysis.textContent = 'Expected Time Complexity: ';
            return;
        }
        let arr = input.split(',').map(num => parseInt(num.trim())).filter(x => !isNaN(x));
        if (arr.length === 0) {
            this.complexityAnalysis.textContent = 'Expected Time Complexity: ';
            return;
        }
        let isAllEqual = arr.every((v, i, a) => v === a[0]);
        let isSorted = arr.every((v, i, a) => i === 0 || a[i - 1] <= v);
        let isReverseSorted = arr.every((v, i, a) => i === 0 || a[i - 1] >= v);
        if (isAllEqual) {
            this.complexityAnalysis.textContent = 'Expected Time Complexity: Worst Case (O(n²)) (All elements equal)';
        } else if (isSorted || isReverseSorted) {
            this.complexityAnalysis.textContent = 'Expected Time Complexity: Worst Case (O(n²))';
        } else {
            this.complexityAnalysis.textContent = 'Expected Time Complexity: Average Case (O(n log n))';
        }
    }
    
    async startSorting() {
        if (this.isSorting) return;
        
        // Parse input array
        const input = this.arrayInput.value.trim();
        if (input) {
            this.array = input.split(',').map(num => parseInt(num.trim()));
        }
        
        if (this.array.length === 0) {
            alert('Please enter an array or generate a random one');
            return;
        }
        
        this.isSorting = true;
        this.steps = [];
        this.currentStep = 0;
        this.comparisons = 0;
        this.swaps = 0;
        this.updateMetrics();
        
        // Generate steps
        await this.quickSort([...this.array], 0, this.array.length - 1);
        
        // Play animation
        this.playAnimation();
    }
    
    async quickSort(arr, low, high) {
        if (low < high) {
            const pivotIndex = await this.partition(arr, low, high);
            await this.quickSort(arr, low, pivotIndex - 1);
            await this.quickSort(arr, pivotIndex + 1, high);
        }
    }
    
    async partition(arr, low, high) {
        // Use the first element as the pivot
        const pivot = arr[low];
        let i = low + 1;
        let j = high;
        // Record initial state
        this.steps.push({
            type: 'partition_start',
            array: [...arr],
            pivot: low,
            i: i,
            j: j,
            low: low,
            high: high
        });
        while (true) {
            // Move i to the right as long as arr[i] <= pivot
            while (i <= j && arr[i] <= pivot) {
                this.comparisons++;
                this.steps.push({
                    type: 'compare',
                    array: [...arr],
                    i: i,
                    j: j,
                    pivot: low
                });
                i++;
            }
            // Move j to the left as long as arr[j] > pivot
            while (j >= i && arr[j] > pivot) {
                this.comparisons++;
                this.steps.push({
                    type: 'compare',
                    array: [...arr],
                    i: i,
                    j: j,
                    pivot: low
                });
                j--;
            }
            if (i < j) {
                [arr[i], arr[j]] = [arr[j], arr[i]];
                this.swaps++;
                this.steps.push({
                    type: 'swap',
                    array: [...arr],
                    i: i,
                    j: j,
                    pivot: low
                });
                i++;
                j--;
            } else {
                break;
            }
        }
        // Place pivot in its correct position
        [arr[low], arr[j]] = [arr[j], arr[low]];
        this.swaps++;
        this.steps.push({
            type: 'partition_end',
            array: [...arr],
            pivot: j,
            low: low,
            high: high
        });
        return j;
    }
    
    async playAnimation() {
        for (let i = 0; i < this.steps.length; i++) {
            if (!this.isSorting) break;
            const step = this.steps[i];
            this.array = [...step.array];
            this.visualizeArray();
            // Reset all bars to normal state
            this.arrayBars.forEach(bar => {
                bar.className = 'array-bar normal';
            });
            // Book-style step descriptions
            switch (step.type) {
                case 'partition_start':
                    this.stepDescription.textContent = `Partitioning subarray from index ${step.low} to ${step.high} with pivot value ${this.array[step.pivot]}.`;
                    this.arrayBars[step.pivot].classList.add('pivot');
                    break;
                case 'compare':
                    if (step.i <= step.j) {
                        if (this.array[step.i] <= this.array[step.pivot]) {
                            this.stepDescription.textContent = `Incrementing i: arr[${step.i}] = ${this.array[step.i]} ≤ pivot (${this.array[step.pivot]}).`;
                        } else if (this.array[step.j] > this.array[step.pivot]) {
                            this.stepDescription.textContent = `Decrementing j: arr[${step.j}] = ${this.array[step.j]} > pivot (${this.array[step.pivot]}).`;
                        } else {
                            this.stepDescription.textContent = `Comparing arr[${step.i}] and arr[${step.j}] with pivot (${this.array[step.pivot]}).`;
                        }
                    } else {
                        this.stepDescription.textContent = `Comparing indices i and j.`;
                    }
                    this.arrayBars[step.pivot].classList.add('pivot');
                    if (step.i < this.arrayBars.length) this.arrayBars[step.i].classList.add('i-pointer');
                    if (step.j < this.arrayBars.length) this.arrayBars[step.j].classList.add('j-pointer');
                    break;
                case 'swap':
                    this.stepDescription.textContent = `Swapping arr[${step.i}] = ${this.array[step.i]} and arr[${step.j}] = ${this.array[step.j]}.`;
                    this.arrayBars[step.pivot].classList.add('pivot');
                    if (step.i < this.arrayBars.length) this.arrayBars[step.i].classList.add('i-pointer');
                    if (step.j < this.arrayBars.length) this.arrayBars[step.j].classList.add('j-pointer');
                    break;
                case 'partition_end':
                    this.stepDescription.textContent = `Placing pivot (${this.array[step.pivot]}) in its correct position at index ${step.pivot}.`;
                    this.arrayBars[step.pivot].classList.add('sorted');
                    break;
            }
            this.updateMetrics();
            // Make slowest speed much slower (slider 1 = 2000ms, 10 = 100ms)
            const minDelay = 2000, maxDelay = 100;
            const delay = minDelay - ((this.speed - 1) * (minDelay - maxDelay) / 9);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        // Mark all elements as sorted
        this.arrayBars.forEach(bar => bar.classList.add('sorted'));
        this.stepDescription.textContent = 'Sorting complete!';
        this.isSorting = false;
        this.updateMetrics();
    }
    
    updateMetrics() {
        if (this.comparisonCount) this.comparisonCount.textContent = this.comparisons;
        if (this.swapCount) this.swapCount.textContent = this.swaps;
    }
    
    reset() {
        this.isSorting = false;
        this.array = [];
        this.arrayBars = [];
        this.steps = [];
        this.currentStep = 0;
        this.comparisons = 0;
        this.swaps = 0;
        this.arrayInput.value = '';
        this.arrayContainer.innerHTML = '';
        this.stepDescription.textContent = 'Waiting to start...';
        this.updateMetrics();
        this.analyzeComplexity();
    }
}

// Initialize the visualizer when the page loads
window.addEventListener('load', () => {
    new QuickSortVisualizer();
}); 