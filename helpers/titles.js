function createTitle(string) {
  const middleRow = `********** ${string} **********`;
  const otherRows = [];
  for (let i = 0; i < middleRow.length; i++) {
    otherRows.push('*');
  }
  return `\n${otherRows.join('')}\n${middleRow}\n${otherRows.join('')}\n`;
}

module.exports = createTitle;
