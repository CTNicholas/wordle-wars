<template>
  <h1>
    Wordle Wars
  </h1>
</template>

<style scoped>
h1 {
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin: 4px 0;
  font-size: 36px;
  font-weight: 700;
  white-space: nowrap;
  overflow-x: hidden;
  text-overflow: ellipsis;
  flex-shrink: 1;
}

@media (max-width: 500px) {
  h1 {
    font-size: 22px;
    padding-top: 2.5px;
    letter-spacing: 0.5px;
  }
}

@media (max-width: 310px) {
  h1 {
    font-size: 16px;
  }
}
</style>
