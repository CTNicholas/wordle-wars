<template>
  <h1>
    Wordle <span>Wars</span>
  </h1>
</template>

<style scoped>
h1 {
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin: 4px 0;
  font-size: 36px;
  font-weight: 700;
}

@media (max-width: 500px) {
  h1 {
    font-size: 22px;
    padding-top: 2.5px;
  }
}

@media (max-width: 370px) {
  span {
    display: none;
  }
}
</style>
