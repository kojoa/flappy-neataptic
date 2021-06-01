const Neat = neataptic.Neat

const neat = new Neat(2, 1, null, {
    popsize: GAMES,
    elitism: ELITISM,
    mutationRate: MUTATION_RATE,
    mutationAmount: MUTATION_AMOUNT
  }
)

const runner = new Runner({
  neat,
  games: GAMES,
  onEndGeneration: ({generation, max, avg, min}) => {}
})

runner.startGeneration()
