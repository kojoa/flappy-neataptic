class Runner {

  constructor ({neat, games, onEndGeneration}) {
    this.neat = neat
    this.games = []
    this.gamesFinished = 0
    this.onEndGeneration = onEndGeneration

    for (let i = 1; i <= games; i++) {
      this.games.push(new flappy(
        "game" + i,
        () => {this.endGeneration()}
      ))
    }
  }

  startGeneration () {
    this.gamesFinished = 0

    for (let i = 0; i < this.games.length; i++) {

      this.games[i].setBrain(this.neat.population[i]);
      this.neat.population[i].score = 0;
      this.games[i].start();
    }
  }

  endGeneration () {
    if (this.gamesFinished + 1 < this.games.length) {
      this.gamesFinished++
      return
    }

    this.neat.sort()

    const newGeneration = []

    for (let i = 0; i < this.neat.elitism; i++) {
      newGeneration.push(this.neat.population[i])
    }

    for (let i = 0; i < this.neat.popsize - this.neat.elitism; i++) {
      newGeneration.push(this.neat.getOffspring())
    }

    this.neat.population = newGeneration
    this.neat.mutate()
    this.neat.generation++
    this.startGeneration()
  }

}
