
var mutationRate;
var totalPopulation = 100;
var population;
var matingPool;
var target;
var best;

function setup() {
  createCanvas(640, 360);

  target = 'to be or not to be';
  mutationRate = 0.01;

  population = [];
  for (var i = 0; i < totalPopulation; i++) {
    population.push(new DNA());
  }
}

function draw() {
  for (var i = 0; i < population.length; i++) {
    population[i].fitness();
  }

  matingPool = [];

  best = population[0];
  for (var i = 0; i < population.length; i++) {
    if (best.Fitness < population[i].Fitness) { best = population[i]; }
    var n = Math.floor(population[i].Fitness * 100);
    for (var j = 0; j < n; j++) {
      matingPool.push(population[i]);
    }
  }
  console.log('best phrase "' + best.Genes + '", fitness ' + str(best.Fitness));

  for (var i = 0; i < population.length; i++) {
    var a = Math.floor(Math.random() * matingPool.length);
    var b = Math.floor(Math.random() * matingPool.length);
    var partnerA = matingPool[a];
    var partnerB = matingPool[b];
    var child = partnerA.crossover(partnerB);
    child.mutate(mutationRate);

    population[i] = child;
  }
}

function DNA() {
  this.Genes = '';
  this.Fitness = 0.0;

  for (var i = 0; i < 18; i++) {
    this.Genes += String.fromCharCode(Math.floor(Math.random() * 95) + 0x20);
  }
  // console.log(this.Genes);

  this.fitness = function() {
    var score = 0.0;
    for (var i = 0; i < this.Genes.length; i++) {
      if (this.Genes[i] === target[i]) {
        score++;
      }
    }
    this.Fitness = score/target.length;
    // console.log('phrase "' + this.Genes + '", fitness ' + str(this.Fitness));
    return this.Fitness;
  }

  this.crossover = function(other) {
    var child = new DNA();
    var midpoint = Math.floor(Math.random() * this.Genes.length);
    for (var i = 0; i < this.Genes.length; i++) {
      if (i > midpoint) { child.Genes[i] = this.Genes[i]; }
      else { child.Genes[i] = other.Genes[i]; }
    }
    return child;
  }

  this.mutate = function(rate) {
    for (var i = 0; i < this.Genes.length; i++) {
      if (Math.random() < rate) {
        this.Genes[i] = String.fromCharCode(Math.floor(Math.random() * 95) + 0x20)[0];
      }
    }
  }
}
